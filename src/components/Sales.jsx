import React, { useEffect, useState } from 'react';
import SaleForm from './SalesForm';
import { TrashIcon, PencilIcon, XMarkIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/solid';
import useSales from '../hooks/sales';
import { formatCurrency } from '../utils/converter';
import Payments from './payments';
import api from '../api';
import SaleDetailsPdf from './SalePdfDetail';
import { ArrowLeftIcon, ArrowRightIcon, ExitFullScreenIcon, ResetIcon, UpdateIcon } from '@radix-ui/react-icons';

const Sales = () => {
    const [editingSale, setEditingSale] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [inputValue, setInputValue] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showFilters, setShowFilters] = useState(false); // Filtrlarni ko'rsatish yoki yashirish holati

    const {
        sales,
        totalPages,
        currentPage,
        loading,
        error,
        setLimit,
        limit,
        updatePage,
        fetchSales,
        setStartDate: updateStartDate,
        setEndDate: updateEndDate,
    } = useSales();

    const handleFilter = () => {
        updateStartDate(startDate);
        updateEndDate(endDate);
        fetchSales(1, undefined, startDate, endDate);
        setShowFilters(false)
    };
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

    const resetFilter = () => {
        setStartDate("")
        setEndDate("")
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6 relative ">
                <div className="mb-4 flex justify-between flex-row gap-5 flex-wrap">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                        Sotuvlar
                    </h2>


                    <div className="flex flex-col gap-4">
                        {/* Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700 text-sm lg:text-xl"
                        >
                            {showFilters ? "Yopish" : "Filtr va Amal"}
                        </button>

                        {/* Conditional Rendered Filters and Actions */}
                        {showFilters && (
                            <div className="flex flex-col z-10    items-end gap-4 absolute dark:bg-gray-800 bg-white  min-w-[290px] md:w-[450px] right-[-20px] md:right-0 top-0 p-6  rounded-lg">
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700 text-sm lg:text-xl"
                                >
                                    <ExitFullScreenIcon />
                                </button>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border p-2 rounded dark:bg-gray-700 dark:text-white  w-full"
                                />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border p-2 rounded dark:bg-gray-700 dark:text-white w-full "
                                />
                                <button
                                    onClick={handleFilter}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700 w-full  text-sm lg:text-xl"
                                >
                                    Filtrlash
                                </button>
                                <div className="flex gap-5 w-full">
                                    <button className='bg-green-500 text-white py-2 px-4 flex justify-center items-center rounded hover:bg-blue-600 dark:hover:bg-blue-700 w-full  text-sm lg:text-xl' onClick={resetFilter}>
                                        <UpdateIcon />
                                    </button>
                                    <button
                                        onClick={() => console.log("Yangi Sotuv bosildi")}
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700 w-full  text-sm lg:text-xl "
                                    >
                                        Yangi Sotuv
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Yuklanmoqda...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <>
                        {sales.length ? <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {sales.map((sale) => (
                                <div
                                    key={sale._id}
                                    className="bg-white dark:bg-gray-800 dark:text-gray-200 border-t border-b py-4 md:shadow-lg md:rounded-lg md:p-6 hover:bg-gray-100 md:dark:hover:bg-gray-700"
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
                                            <span className='hidden lg:inline'>
                                                Tahrirlash
                                            </span>
                                        </button>
                                        <SaleDetailsPdf sale={sale} />
                                        <button
                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 flex items-center"
                                            onClick={() => deleteSale(sale._id)}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                            <span className='hidden lg:inline'>
                                                O'chirish
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                            : <div className='flex justify-center'>
                                <p>Ushbu filtrga to'g'ri keladigan savdolar mavjud emas</p>
                            </div>}

                        {/* Pagination */}
                        <div className="flex flex-row justify-between gap-4 items-center mt-4">
                            <div className="flex justify-center ">
                                <button
                                    className="bg-gray-500 py-2 md:px-4 px-2 rounded-l disabled:opacity-70 text-white flex flex-row items-center gap-3"
                                    onClick={() => {
                                        setInputValue(currentPage - 1)
                                        updatePage(currentPage - 1)
                                    }}
                                    disabled={currentPage === 1}
                                >
                                    <ArrowLeftIcon />
                                    <span className='hidden md:inline'>Oldingi</span>
                                </button>
                                <span className="px-4 py-2 dark:bg-gray-700 bg-gray-200 flex flex-row ">
                                    <input
                                        type="number"
                                        className="w-6 dark:bg-gray-700 text-center "
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
                                    /{totalPages}
                                </span>
                                <button
                                    className="bg-gray-500 py-2 md:px-4 px-2 rounded-r disabled:opacity-70 text-white flex flex-row items-center gap-3"
                                    onClick={() => {
                                        setInputValue(currentPage + 1)
                                        updatePage(currentPage + 1)
                                    }}
                                    disabled={currentPage === totalPages}
                                >
                                    <span className='hidden md:inline'>
                                        Keyingi
                                    </span>
                                    <ArrowRightIcon />
                                </button>
                            </div>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setInputValue(1)
                                    updatePage(1)
                                    setLimit(e.target.value)
                                }}
                                required
                                className="w-24 text-center rounded-lg  px-1 md:py-2 py-0 h-10 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 text-sm"
                            >
                                <option value="1">1</option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="all">all</option>
                            </select>
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
