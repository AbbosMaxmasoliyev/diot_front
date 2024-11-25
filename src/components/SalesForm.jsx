import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import api from '../api';
import useCustomers from '../hooks/clients';
import useInventory from '../hooks/invetory';
import { InventorSearch } from './ProductSearch';
import { formatCurrency } from '../utils/converter';
import { XMarkIcon } from '@heroicons/react/24/solid';

const SalesForm = ({ order, onClose, refreshOrders }) => {
    const [customer, setCustomer] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discountApplied, setDiscountApplied] = useState(null);
    const { customers } = useCustomers();
    const { inventory: products } = useInventory();
    const totalRef = useRef(0); // Re-renderdan qochish uchun

    useEffect(() => {
        if (order) {
            setCustomer(order.customerId?._id || '');
            setSelectedProducts(
                order.products.map((p) => ({
                    productId: p.productId?._id,
                    name: p.productId?.name,
                    price: p.productId?.price,
                    quantity: p.quantity,
                }))
            );
            setPaymentMethod(order.paymentMethod);
            setDiscountApplied(order.discountApplied || null);
        } else {
            // Yangi savdo uchun holatni tozalash
            resetForm();
        }
    }, [order]);

    const resetForm = useCallback(() => {
        setCustomer('');
        setSelectedProducts([]);
        setPaymentMethod('cash');
        setDiscountApplied(null);

    }, []);

    const handleProductSelect = useCallback((product) => {
        setSelectedProducts((prev) => {
            const existingProduct = prev.find((p) => p.productId === product.productId?._id);
            if (existingProduct) {
                return prev.map((p) =>
                    p.productId === product.productId?._id
                        ? { ...p, quantity: Math.min(p.quantity + 1, product.totalQuantity) }
                        : p
                );
            }
            return [
                ...prev,
                {
                    productId: product.productId?._id,
                    name: product.productId?.name,
                    price: product.productId?.price,
                    quantity: 1,
                    totalQuantity: product?.totalQuantity,
                },
            ];
        });
    }, []);

    const handleQuantityChange = useCallback((productId, quantity) => {
        setSelectedProducts((prev) =>
            prev.map((p) =>
                p.productId === productId
                    ? { ...p, quantity: Math.max(1, Math.min(parseInt(quantity) || 1, p.totalQuantity)) }
                    : p
            )
        );
    }, []);

    const totalPrice = useMemo(() => {
        if (!selectedProducts.length) return 0;

        const total = selectedProducts.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0
        );

        const discountFactor = 1 - (discountApplied / 100 || 0);

        return total * discountFactor;
    }, [selectedProducts, discountApplied]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newOrder = {
            customerId: customer,
            products: selectedProducts,
            paymentMethod,
            discountApplied,
        };

        try {
            if (order) {
                await api.put(`/sales/${order._id}`, newOrder);
            } else {
                await api.post('/sales', newOrder);
            }
            refreshOrders();
            resetForm(); // Holatni tozalash
            onClose()
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <button className='w-5 h-5 fixed top-2' onClick={onClose}><XMarkIcon /></button>
            <form onSubmit={handleSubmit} className="w-10/12 min-h-screen flex flex-col justify-between  md:flex-row  bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-md gap-5">
                <div className="mb-4 md:w-7/12  ">
                    <InventorSearch onSelect={handleProductSelect} />
                    <p className="font-bold text-lg text-gray-900 dark:text-gray-200 mt-5 mb-3">
                        Savatcha
                    </p>
                    {selectedProducts.length ? (
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
                                <thead className="bg-gray-200 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-left text-gray-900 dark:text-gray-200">Nomi</th>
                                        <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-left text-gray-900 dark:text-gray-200">Soni</th>
                                        <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-left text-gray-900 dark:text-gray-200">Umumiy summasi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProducts.map((product) => {
                                        if (product.productId) {
                                            return (
                                                <tr
                                                    key={product.productId}
                                                    className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200">
                                                        {product.name}
                                                    </td>
                                                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                                                        <input
                                                            type="number"
                                                            value={product.quantity}
                                                            max={product.totalQuantity}
                                                            onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                                                            className="w-32 px-2 py-1 border rounded bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-200"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200">
                                                        {formatCurrency(product.price * Number(product.quantity))}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="font-semibold text-md text-gray-900 dark:text-gray-400">
                            Iltimos mahsulotlarni tanlang
                        </p>
                    )}

                </div>
                <div className="flex flex-col md:w-4/12">
                    <div className="mb-4">
                        <label className="block font-bold mb-2 text-gray-900 dark:text-gray-200">Mijozni tanlang:</label>
                        <select
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="">Mijozni tanlang</option>
                            {customers.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>



                    <div className="flex justify-between my-4 items-center">
                        <div className="flex flex-col">
                            <label htmlFor="discount">Chegirma</label>
                            <div className="flex flex-row w-full justify-between">
                                <span className='relative  w-3/12'>
                                    <input
                                        type="number"
                                        value={discountApplied}
                                        onChange={(e) => setDiscountApplied(Math.min(100, parseInt(e.target.value)))}
                                        id='discount'
                                        placeholder="Chegirma"
                                        className="w-full  px-2 py-2 pr-4 border rounded focus:outline-none focus:ring focus:ring-blue-300 text-gray-900 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 "
                                    />
                                    <span className="absolute inset-y-0 right-1 flex items-center text-gray-500 dark:text-gray-400 ">
                                        %
                                    </span>
                                </span>
                                <p className="font-bold md:text-lg text-sm text-gray-900 dark:text-gray-200">
                                    Umumiy: {formatCurrency(totalPrice)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-900 dark:text-gray-200">To'lov turi:</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="cash">Naqd</option>
                            <option value="card">Karta</option>
                            <option value="transfer">O'tkazma</option>
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded dark:bg-blue-400 dark:hover:bg-blue-500"
                        >
                            {order ? 'Yangilash' : 'Saqlash'}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default SalesForm;
