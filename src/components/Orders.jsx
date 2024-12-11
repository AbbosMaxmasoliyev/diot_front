import React, { useState } from 'react';
import OrderForm from './OrderForm';
import { TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import useOrders from '../hooks/orders'; // Import the custom hook
import { formatPhoneNumber } from '../utils/converter';
import Payments from './payments';
import moment from 'moment';
import api from '../api';

const Orders = () => {
    const [editingOrder, setEditingOrder] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    // Use the custom hook to manage orders, loading, and error state
    const { orders, loading, error, refreshOrders } = useOrders();

    // Delete an order
    const deleteOrder = (id) => {
        api.delete(`/orders/${id}`)
            .then(() => {
                refreshOrders(); // Refresh the orders list after deletion
            })
            .catch(err => console.error('Xatolik:', err));
    };

    // Dialogni yopish funksiyasi (modal tashqarisiga bosish bilan)
    const handleCloseDialog = (e) => {
        if (e.target.id === "dialog-background") setShowDialog(false);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Buyurtmalar</h2>
                    {/* New order button */}
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={() => setShowDialog(true)}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            Yangi Buyurtma
                        </button>
                    </div>
                </div>

                {/* Loading and error handling */}
                {loading ? (
                    <div className="flex justify-center">
                        <p className="text-center text-gray-500 dark:text-gray-400">Yuklanmoqda...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center">
                        <p className="text-center text-red-500">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <h3 className="text-xl font-semibold mb-2">{order.customer}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>Mahsulot:</strong> {order.customerId.name}-{order._id}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>Telefon raqam:</strong> {formatPhoneNumber(order.customerId.phoneNumber)}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>Soni:</strong> {order.products.length}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>Umumiy summa:</strong> {order.totalPrice}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>Berilgan chegirma:</strong> {order.discountApplied}%
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mb-2 flex gap-2">
                                    <strong>To'lov usuli:</strong> <Payments paymentMethod={order.paymentMethod} />
                                </p>
                               
                                <div className="flex justify-start gap-4">
                                    <button
                                        className="bg-yellow-500 dark:bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-600 dark:hover:bg-yellow-500 flex items-center"
                                        onClick={() => {
                                            setEditingOrder(order);
                                            setShowDialog(true);
                                        }} // For editing
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                        Tahrirlash
                                    </button>
                                    <button
                                        className="bg-red-500 dark:bg-red-600 text-white py-1 px-3 rounded hover:bg-red-600 dark:hover:bg-red-500 flex items-center"
                                        onClick={() => deleteOrder(order._id)} // For deleting
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                        O'chirish
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Dialog for order form */}
            {showDialog && (
                <div
                    id="dialog-background"
                    className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 dark:bg-opacity-70 z-50"
                    onClick={handleCloseDialog}
                >
                    <div className="overflow-auto max-h-screen bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-md w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] max-w-xl">
                        <div className="flex flex-col justify-center items-center relative">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                                onClick={() => setShowDialog(false)}
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                            <h3 className="text-xl mb-4">{editingOrder ? 'Buyurtmani Tahrirlash' : 'Yangi Buyurtma Qo\'shish'}</h3>
                            <OrderForm
                                order={editingOrder}
                                onClose={() => setShowDialog(false)}
                                refreshOrders={refreshOrders}  // Use the custom hook's refresh function
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Orders;
