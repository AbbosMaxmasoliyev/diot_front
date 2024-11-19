// src/components/OrderForm.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import useCustomers from '../hooks/clients';
import useProducts from '../hooks/products';

const OrderForm = ({ order, onClose, refreshOrders }) => {
    const [customer, setCustomer] = useState('');
    const [productList, setProductList] = useState([{ productId: '', quantity: '', price: 0 }]);
    const [selectedProducts, setSelectedProducts] = useState([]); // Tanlangan mahsulotlarni saqlash
    const { customers } = useCustomers();
    const { products } = useProducts();
    const [paymentMethod, setPaymentMethod] = useState(order?.paymentMethod || 'cash');

    useEffect(() => {
        if (order) {
            setCustomer(order.customerId);
            setProductList(order.products.map(p => ({ productId: p.productId, quantity: p.quantity, price: p.price })));
            setSelectedProducts(order.products.map(p => p.productId));
            setPaymentMethod(order.paymentMethod);

        }
    }, [order]);

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...productList];

        if (field === 'productId') {
            const selectedProduct = products.find(p => p._id === value);

            // Avvalgi tanlangan mahsulotni o‘chirish
            if (updatedProducts[index].productId) {
                setSelectedProducts(selectedProducts.filter(id => id !== updatedProducts[index].productId));
            }

            updatedProducts[index] = {
                ...updatedProducts[index],
                productId: value,
                price: selectedProduct ? selectedProduct.price : 0,
            };

            // Yangi tanlangan mahsulotni qo‘shish
            setSelectedProducts([...selectedProducts, value]);
        } else {
            updatedProducts[index][field] = value;
        }

        setProductList(updatedProducts);
    };

    const handleAddProduct = (e) => {
        e.preventDefault()
        setProductList([...productList, { productId: '', quantity: '', price: 0 }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = productList.filter((_, i) => i !== index);

        // O'chirilgan mahsulotni `selectedProducts` dan o‘chirish
        setSelectedProducts(selectedProducts.filter((_, i) => i !== index));

        setProductList(updatedProducts);
    };

    const calculateTotalPrice = (quantity, price) => {
        return quantity && price ? quantity * price : 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newOrder = { customerId: customer, products: productList, paymentMethod };
        console.log(newOrder);

        if (order) {
            api.put(`/orders/${order._id}`, newOrder)
                .then(() => {
                    refreshOrders();
                    onClose();
                })
                .catch(err => console.error(err));
        } else {
            api.post('/orders', newOrder)
                .then((data) => {
                    console.log(data);

                    refreshOrders();
                    onClose();
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <>
           
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-4 mt-8">Mijoz tanlang:</label>
                    <select
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    >
                        <option value="" className="text-gray-700 dark:text-gray-300">Mijozni tanlang</option>
                        {customers.map(c => (
                            <option key={c._id} value={c._id} className="text-gray-700 dark:text-gray-300">{c.name}</option>
                        ))}
                    </select>
                </div>

                <label className="block text-gray-700 dark:text-gray-300 mb-4 mt-8">Mahsulotlar:</label>
                {productList.map((product, index) => (
                    <div key={index} className="mb-4 border p-4 rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                        <div className="flex gap-4 items-center md:flex-row flex-wrap">
                            <select
                                value={product.productId}
                                onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            >
                                <option value="" className="text-gray-700 dark:text-gray-300">Mahsulot tanlang</option>
                                {products
                                    .filter(p => !selectedProducts.includes(p._id) || p._id === product.productId)
                                    .map(p => (
                                        <option key={p._id} value={p._id} className="text-gray-700 dark:text-gray-300">{p.name}</option>
                                    ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Soni"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || '')}
                                required
                                min="1"
                                className="w-1/3 px-4 py-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            />

                            <p className="w-32 text-gray-700 dark:text-gray-300">
                                Narx: {product.price} <br /> Jami: {calculateTotalPrice(product.quantity, product.price)}
                            </p>

                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProduct(index)}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    O'chirish
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                    Umumiy: {productList?.map((value) => (value.price * value.quantity)).reduce((total, value) => total += value)}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-4 mb-5">
                    Chegirma bilan: {
                        (() => {
                            let total = productList?.map((value) => (value.price * value.quantity)).reduce((total, value) => total += value)

                            let discount = customers.find(client => customer === client._id)?.discountRate
                            console.log(total, discount);
                            total = total - (total * discount)
                            console.log(total);

                            return total ? total : 0
                        })()
                    }
                </p>

                <div className="mb-4">
                    <label>To'lov turi:</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    >
                        <option value="cash">Naqd</option>
                        <option value="card">Karta</option>
                        <option value="transfer">Pul o'tkazish</option>
                    </select>
                </div>
                <span className="text-white py-2 px-4 rounded hover:bg-green-600 bg-green-500 dark:hover:bg-green-600">

                    <button
                        type="button"
                        onClick={handleAddProduct}

                    >
                        Yana mahsulot qo'shish
                    </button>
                </span>

                <div className="flex justify-end">
                    <span
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                        <button
                            type="submit"

                        >
                            {order ? 'Yangilash' : "Qo'shish"}
                        </button>
                    </span>
                </div>
            </form>

            <div className="flex justify-end mt-4">
                <span
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                    <button
                        onClick={onClose}

                    >
                        Yopish
                    </button>
                </span>
            </div>
        </>
    );

};

export default OrderForm;
