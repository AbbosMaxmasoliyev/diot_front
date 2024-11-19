// src/components/InventoryList.js
import React, { useState } from 'react';
import api from '../api';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import InventoryForm from './InventoryForm';
import { OrbitProgress } from 'react-loading-indicators';
import useInventory from '../hooks/invetory';

const InventoryList = () => {
    const [editingInventory, setEditingInventory] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const { inventory, loading, error, refreshInventory } = useInventory(); // Custom Hook ishlatilgan

    const deleteInventory = (id) => {
        api.delete(`/inventory/${id}`)
            .then(() => {
                refreshInventory(); // Yangi inventory ro'yxatini olish uchun refresh
            })
            .catch(err => console.error('Xatolik:', err));
    };
    console.log(inventory);
    
    return (
        <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6">
            <div className="mb-4 flex justify-between flex-wrap">
                <h2 className="text-2xl font-bold mb-4">Ombor</h2>
                <button
                    onClick={() => {
                        setEditingInventory(null);
                        setShowDialog(true);
                    }}
                    className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-600"
                >
                    Yangi Mahsulot Qo'shish
                </button>
            </div>

            {/* Mahsulotlar kartochkalari */}
            {loading ? (
                <div className="flex justify-center">
                    <OrbitProgress variant="track-disc" dense color="#004fff" size="large" text="Loading" />
                </div>
            ) : error ? (
                <div className="flex justify-center">
                    <p className="text-center text-red-500 col-span-full">{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {inventory.map(item => (
                        <div key={item._id} className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                            <h3 className="text-xl font-semibold mb-2">Mahsulot: {item?.productId?.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">Miqdori: {item.totalQuantity}</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">Narxi: {item.price} so'm</p>

                            <div className="flex justify-start gap-4">
                                <button
                                    className="bg-yellow-500 dark:bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-600 dark:hover:bg-yellow-500 flex items-center"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDialog(true);
                                        setEditingInventory(item);
                                    }} // Tahrirlash uchun
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                    className="bg-red-500 dark:bg-red-600 text-white py-1 px-3 rounded hover:bg-red-600 dark:hover:bg-red-500 flex items-center"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteInventory(item._id);
                                    }} // O'chirish uchun
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mahsulot qo'shish yoki tahrirlash uchun form */}
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl mb-4">{editingInventory ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo\'shish'}</h3>
                        <InventoryForm
                            inventory={editingInventory}
                            onClose={() => setShowDialog(false)}
                            refreshInventory={refreshInventory}  // refreshInventory Custom Hook-dan olindi
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryList;
