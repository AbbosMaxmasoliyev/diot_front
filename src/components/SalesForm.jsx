import React, { useState, useEffect } from 'react';
import api from '../api';
import useCustomers from '../hooks/clients';
import useInventory from '../hooks/invetory';

const SalesForm = ({ order, onClose, refreshOrders }) => {
    console.log(order);

    const [customer, setCustomer] = useState('');
    const [productList, setProductList] = useState([{ productId: '', quantity: '', price: 0 }]);
    const [paymentMethod, setPaymentMethod] = useState(order?.paymentMethod || 'cash');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const { customers } = useCustomers();
    const { inventory: products } = useInventory();

    useEffect(() => {
        if (order) {
            setCustomer(order.customerId._id);
            setProductList(order.products.map(p => ({
                productId: p.productId._id,
                quantity: p.quantity,
                price: p.productId.price,
            })));
            setSelectedProducts(order.products.map(p => p.productId));
            setPaymentMethod(order.paymentMethod);
        }
    }, [order]);

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...productList];

        if (field === 'productId') {
            const selectedProduct = products.find(p => p.productId._id === value);

            if (!selectedProduct) return;

            // Remove previous product from selectedProducts
            if (updatedProducts[index].productId) {
                setSelectedProducts(selectedProducts.filter(id => id !== updatedProducts[index].productId));
            }

            updatedProducts[index] = {
                ...updatedProducts[index],
                productId: value,
                price: selectedProduct.productId.price,
            };

            setSelectedProducts([...selectedProducts, value]);
        } else {
            updatedProducts[index][field] = value;
        }

        setProductList(updatedProducts);
    };

    const handleAddProduct = () => {
        setProductList([...productList, { productId: '', quantity: '', price: 0 }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...productList];
        const removedProduct = updatedProducts[index].productId;

        // Remove product from selectedProducts
        setSelectedProducts(selectedProducts.filter(id => id !== removedProduct));

        updatedProducts.splice(index, 1);
        setProductList(updatedProducts);
    };

    const calculateTotalPrice = () => {
        return productList.reduce((total, product) => total + (product.quantity * product.price), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newOrder = {
            customerId: customer,
            products: productList,
            paymentMethod,
        };

        try {
            if (order) {
                await api.put(`/sales/${order._id}`, newOrder);
            } else {
                await api.post('/sales', newOrder);
            }
            refreshOrders();
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    if (products.length === 0) {
        return (
            <div className="w-full min-h-96 flex justify-center items-center">
                <h2 className="text-gray-700 dark:text-gray-300 text-center">
                    Iltimos, omborga mahsulot qo'shing
                </h2>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-4">Mijozni tanlang:</label>
                <select
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                    <option value="">Mijozni tanlang</option>
                    {customers.map(c => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {productList.map((product, index) => (
                <div key={index} className="mb-4 border p-4 rounded bg-gray-50 dark:bg-gray-700 mt-5">
                    <div className="flex gap-4 items-center flex-wrap">
                        <select
                            value={product.productId}
                            onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        >
                            <option value="">Mahsulot tanlang</option>
                            {products
                                .filter(p => !selectedProducts.includes(p.productId._id) || p.productId._id === product.productId)
                                .map(p => (
                                    <option key={p.productId._id} value={p.productId._id}>
                                        {p.productId.name}
                                    </option>
                                ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Soni"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value, 10) || '')}
                            required
                            min="1"
                            className="w-1/3 px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        />

                        <p className="w-32">
                            Narx: {product.price} <br />
                            Jami: {product.quantity * product.price}
                        </p>

                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveProduct(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                O'chirish
                            </button>
                        )}
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddProduct}
                className="text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600"
            >
                Yana mahsulot qo'shish
            </button>
            <p className="mt-4">Umumiy summa: {calculateTotalPrice()}</p>

            <div className="mb-4 mt-4">
                <label className='mb-4 inline-block'>To'lov turi:</label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                    <option value="cash">Naqd</option>
                    <option value="card">Karta</option>
                    <option value="transfer">Pul o'tkazish</option>
                    <option value="debit">Qarz</option>
                </select>
            </div>

            <div className="flex justify-end mt-4">
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    {order ? 'Yangilash' : 'Saqlash'}
                </button>
            </div>
        </form>
    );
};

export default SalesForm;
