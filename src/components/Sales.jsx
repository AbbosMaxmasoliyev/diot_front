import React, { useState } from 'react';
import SaleForm from './SalesForm'; // Yangi yoki tahrir qilish uchun forma
import { TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import useSales from '../hooks/sales'; // Sales uchun maxsus hook
import { formatCurrency } from '../utils/converter'; // Valyutani formatlash uchun yordamchi funksiya
import Payments from './payments';
import api from '../api';

const Sales = () => {
    const [editingSale, setEditingSale] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    // Sotuvlar, yuklash holati va xatoliklar uchun hook
    const { sales, loading, error, refreshSales } = useSales();
    console.log(sales);
    
    // Sotuvni o'chirish funksiyasi
    const deleteSale = (id) => {
        api.delete(`/sales/${id}`)
            .then(() => {
                refreshSales(); // O'chirishdan keyin ro'yxatni yangilash
            })
            .catch(err => console.error('Xatolik:', err));
    };

    // Dialogni yopish funksiyasi
    const handleCloseDialog = (e) => {
        if (e.target.id === "dialog-background") setShowDialog(false);
    };
    
    return (
        <>
            <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6">
                <div className="mb-4 flex justify-between gap-5 flex-wrap">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Sotuvlar</h2>

                {/* Yangi sotuv qo'shish tugmasi */}
                    <button
                        onClick={() => setShowDialog(true)}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Yangi Sotuv
                    </button>
                </div>

                {/* Yuklash va xatoliklarni ko'rsatish */}
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
                        {sales.map(sale => (
                            <div key={sale._id} className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <h3 className="text-xl font-semibold mb-2">Mijoz: {sale.customerId.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>Mahsulotlar:</strong> {sale.products.map(p => p.productId.name).join(', ')}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>Umumiy Narx:</strong> {formatCurrency(sale.totalPrice)}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>To'lov Holati:</strong> <Payments paymentMethod={sale.paymentMethod} />
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>Sotuv Sanasi:</strong> {new Date(sale.date).toLocaleDateString()}
                                </p>

                                <div className="flex justify-start gap-4">
                                    <button
                                        className="bg-yellow-500 dark:bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-600 dark:hover:bg-yellow-500 flex items-center"
                                        onClick={() => {
                                            setEditingSale(sale);
                                            setShowDialog(true);
                                        }} // Tahrirlash uchun
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                        Tahrirlash
                                    </button>
                                    <button
                                        className="bg-red-500 dark:bg-red-600 text-white py-1 px-3 rounded hover:bg-red-600 dark:hover:bg-red-500 flex items-center"
                                        onClick={() => deleteSale(sale._id)} // O'chirish uchun
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

            {/* Dialog oynasi */}
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
                            <h3 className="text-xl mb-4">{editingSale ? 'Sotuvni Tahrirlash' : 'Yangi Sotuv Qo\'shish'}</h3>
                            <SaleForm
                                order={editingSale}
                                onClose={() => setShowDialog(false)}
                                refreshOrders={refreshSales}  // Sotuvlarni yangilash
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sales;
