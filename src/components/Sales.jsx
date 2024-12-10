import React, { useEffect, useState } from 'react';
import SaleForm from './SalesForm';
import { TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import useSales from '../hooks/sales';
import { formatCurrency } from '../utils/converter';
import Payments from './payments';
import api from '../api';
import SaleDetailsPdf from './SalePdfDetail';

const Sales = () => {
    const [editingSale, setEditingSale] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [inputValue, setInputValue] = useState(1);

    // Hook for handling sales data
    const {
        sales,
        totalPages,
        currentPage,
        loading,
        error,
        updatePage,
        fetchSales
    } = useSales();

    // Function to delete a sale
    const deleteSale = async (id) => {
        try {
            await api.delete(`/sales/${id}`);
            fetchSales(currentPage); // Refresh sales list
        } catch (err) {
            console.error('Error:', err);
        }
    };

    // Function to close the dialog
    const handleCloseDialog = (e) => {
        if (e.target.id === 'dialog-background') {
            setShowDialog(false);
            setEditingSale(null);
        }
    };


    const printCheck = (sale) => {
        console.log(sale);

    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6">
                <div className="mb-4 flex justify-between gap-5 flex-wrap">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                        Sotuvlar
                    </h2>

                    <button
                        onClick={() => setShowDialog(true)}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Yangi Sotuv
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Yuklanmoqda...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {sales.map((sale) => (
                                <div
                                    key={sale._id}
                                    className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <h3 className="text-xl font-semibold mb-2">
                                        Mijoz: {sale.customerId?.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>Mahsulotlar:</strong>{' '}
                                        {sale.outgoings
                                            .map((p) => p.productId?.name)
                                            .join(', ')}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>Umumiy Narx:</strong>{' '}
                                        <p>{formatCurrency(sale?.totalPrice[0]?.cost, sale.totalPrice[0].currency)}</p>
                                        <p>{formatCurrency(sale?.totalPrice[1]?.cost, sale.totalPrice[1].currency)}</p>
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>To'lov Holati:</strong>{' '}
                                        <Payments paymentMethod={sale.paymentMethod} />
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>Sotuv Sanasi:</strong>{' '}
                                        {new Date(sale.date).toLocaleDateString()}
                                    </p>

                                    <div className="flex justify-start gap-4 ">
                                        <button
                                            className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 flex items-center"
                                            onClick={() => {
                                                setEditingSale(sale);
                                                setShowDialog(true);
                                            }}
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                            <span className='hidden md:block'>
                                                Tahrirlash
                                            </span>
                                        </button>
                                        <SaleDetailsPdf sale={sale} />
                                        <button
                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 flex items-center"
                                            onClick={() => deleteSale(sale._id)}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                            <span className='hidden md:block'>
                                                O'chirish
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-4">
                            <button
                                className="bg-gray-500 py-2 px-4 rounded-l disabled:opacity-70 dark:text-white"
                                onClick={() => {
                                    setInputValue(currentPage - 1)
                                    updatePage(currentPage - 1)
                                }}
                                disabled={currentPage === 1}
                            >
                                Oldingi
                            </button>
                            <span className="px-4 py-2 dark:bg-gray-700 bg-gray-200">
                                <input
                                    type="number"
                                    className="w-6 dark:bg-gray-700 text-center"
                                    onChange={(e) => setInputValue(Number(e.target.value))}
                                    onBlur={() => {
                                        if (inputValue >= 1 && inputValue <= totalPages) {
                                            updatePage(inputValue);
                                        } else {
                                            setInputValue(currentPage); // Reset if invalid
                                        }
                                    }}
                                    min={1}
                                    max={totalPages}
                                    value={inputValue}
                                />
                                / {totalPages}
                            </span>
                            <button
                                className="bg-gray-500 py-2 px-4 rounded-r disabled:opacity-70 dark:text-white"
                                onClick={() => {
                                    setInputValue(currentPage + 1)
                                    updatePage(currentPage + 1)
                                }}
                                disabled={currentPage === totalPages}
                            >
                                Keyingi
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Dialog */}
            {showDialog && (
                <div
                    id="dialog-background"
                    className="fixed  w-full min-h-screen  bg-gray-900 bg-opacity-50 top-0 right-0 flex flex-row justify-end"
                    onClick={handleCloseDialog}
                >
                    <SaleForm
                        order={editingSale}
                        onClose={() => {
                            setShowDialog(false);
                            setEditingSale(null);
                        }}
                        refreshOrders={() => fetchSales(currentPage)}
                    />
                </div>
            )}
        </>
    );
};

export default Sales;
