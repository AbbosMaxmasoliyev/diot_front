import React, { useState } from 'react';
import api from '../api';
import CustomerForm from './CustomerForm';
import { formatPhoneNumber } from '../utils/converter';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import useCustomers from '../hooks/clients';
import { OrbitProgress } from 'react-loading-indicators';

const Customers = () => {
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const { customers, loading, error, refreshCustomers } = useCustomers(); // Custom Hook ishlatilgan

    // Mijozni o'chirish
    const deleteCustomer = (id) => {
        api.delete(`/customers/${id}`)
            .then(() => {
                refreshCustomers(); // Yangi mijozlar ro'yxatini olish uchun refresh
            })
            .catch(err => console.error('Xatolik:', err));
    };

    return (
        <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6">
            <div className="mb-4 flex justify-between flex-wrap">
                <h2 className="text-2xl font-bold mb-4">Mijozlar</h2>
                {/* Yangi mijoz qo'shish uchun dialog */}
                <button
                    onClick={() => {
                        setEditingCustomer(null);
                        setShowDialog(true);
                    }}
                    className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-600"
                >
                    Yangi Mijoz
                </button>
            </div>

            {/* Mijozlar kartochkalari */}
            {loading ? (
                <div className="flex justify-center">
                    <OrbitProgress variant="track-disc" dense color="#004fff" size="large" text="Loading" textColor="" />
                </div>
            ) : error ? (
                <div className="flex justify-center">
                    <p className="text-center text-red-500 col-span-full">{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{
                    customers.map(customer => (
                        <div key={customer._id} className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg shadow-gray-700 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <h3 className="text-xl font-semibold mb-2">{customer.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">Telefon: {formatPhoneNumber(customer.phoneNumber)}</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">Manzil: {customer.region}</p>

                            <div className="flex justify-start gap-4">
                                <button
                                    className="bg-yellow-500 dark:bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-600 dark:hover:bg-yellow-500 flex items-center"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDialog(true);
                                        setEditingCustomer(customer);
                                    }} // Tahrirlash uchun
                                >
                                    <PencilIcon className="h-5 w-5" />
                                    {/* Tahrirlash */}
                                </button>
                                <button
                                    className="bg-red-500 dark:bg-red-600 text-white py-1 px-3 rounded hover:bg-red-600 dark:hover:bg-red-500 flex items-center"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteCustomer(customer._id);
                                    }} // O'chirish uchun
                                >
                                    <TrashIcon className="h-5 w-5" />
                                    {/* O'chirish */}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mijoz qo'shish yoki tahrirlash uchun form */}
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl mb-4">{editingCustomer ? 'Mijozni Tahrirlash' : 'Yangi Mijoz Qo\'shish'}</h3>
                        <CustomerForm
                            customer={editingCustomer}
                            onClose={() => setShowDialog(false)}
                            refreshCustomers={refreshCustomers}  // refreshCustomers Custom Hook-dan olindi
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
