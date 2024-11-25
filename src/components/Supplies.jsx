import React, { useState } from 'react';
import api from '../api';
import SupplyForm from './SupplyForm';
import useSupplies from '../hooks/supplies';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { formatPhoneNumber } from '../utils/converter';

const Supplies = () => {
    const [editingSupply, setEditingSupply] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const { supplies, loading, error, refreshSupplies } = useSupplies();

    const deleteSupply = (id) => {
        api.delete(`/supplies/${id}`)
            .then(() => {
                refreshSupplies();
            })
            .catch(err => console.error('Xatolik:', err));
    };

    return (
        <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6">
            <div className="mb-4 flex justify-between flex-wrap">
                <h2 className="text-2xl font-bold mb-4">Ta'minlovchilar</h2>
                <button
                    onClick={() => {
                        setEditingSupply(null);
                        setShowDialog(true);
                    }}
                    className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-600"
                >
                    Yangi Ta'minlovchi
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-600 dark:text-gray-400">Yuklanmoqda...</div>
            ) : error ? (
                <div className="text-center text-red-500 dark:text-red-400">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {supplies.map((supply) => (
                        <div
                            key={supply._id}
                            className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 p-4 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            <h3 className="text-xl font-semibold mb-2">{supply.name}</h3>
                            <p className="text-sm mb-1">Hudud: {supply.region}</p>
                            <p className="text-sm mb-3">Telefon: {formatPhoneNumber(supply.phoneNumber)}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setEditingSupply(supply);
                                        setShowDialog(true);
                                    }}
                                    className="bg-yellow-500 dark:bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-600 dark:hover:bg-yellow-500 flex items-center"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => deleteSupply(supply._id)}
                                    className="bg-red-500 dark:bg-red-600 text-white py-1 px-3 rounded hover:bg-red-600 dark:hover:bg-red-500 flex items-center"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl mb-4">
                            {editingSupply ? 'Ta\'minlovchini Tahrirlash' : 'Yangi Ta\'minlovchi Qo\'shish'}
                        </h3>
                        <SupplyForm
                            supply={editingSupply}
                            onClose={() => setShowDialog(false)}
                            refreshSupplies={refreshSupplies}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Supplies;
