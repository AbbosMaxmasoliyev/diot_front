// src/components/InventoryList.js
import React, { useState, useEffect } from 'react';
import useInventory from '../hooks/invetory';
import Pagination from './Pagination';
import { formatCurrency } from '../utils/converter';
import InventoryForm from './InventoryForm'; // Modal uchun form import qilamiz
import ImportForm from './ImportForm';
import ImportList from './ImportList';

const InventoryList = () => {
    const { inventory, totalCount, fetchInventory, loading, error } = useInventory();
    const [currentPage, setCurrentPage] = useState(1);
    const [importShow, setImportShow] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal holatini boshqarish
    const [selectedInventory, setSelectedInventory] = useState(null); // Tanlangan inventar

    const itemsPerPage = 10; // Har bir sahifadagi elementlar soni

    useEffect(() => {
        fetchInventory({ page: currentPage, limit: itemsPerPage });
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const openModal = (inventory = null) => {
        setSelectedInventory(inventory); // Tanlangan inventarni saqlaymiz
        setIsModalOpen(true); // Modalni ochamiz
    };

    const closeModal = () => {
        setIsModalOpen(false); // Modalni yopamiz
        setSelectedInventory(null); // Tanlangan inventarni tozalaymiz
    };

    const handleCreateInventory = () => {
        openModal(); // Yangi inventar qo‘shish uchun modalni ochish
    };

    const handleEditInventory = (inventory) => {
        openModal(inventory); // Tanlangan inventarni tahrirlash uchun modalni ochish
    };

    if (loading) return <p className="text-gray-700 dark:text-gray-300">Yuklanmoqda...</p>;
    if (error) return <p className="text-red-500 dark:text-red-400">Xatolik yuz berdi: {error}</p>;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex gap-5">
                <button
                    onClick={handleCreateInventory}
                    className="bg-blue-500 text-white py-2 px-6 rounded-md mb-4 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none"
                >
                    Yangi Inventar Qo‘shish
                </button>
                <button
                    onClick={() => setImportShow(prev => !prev)}
                    className="bg-green-500 text-white py-2 px-6 rounded-md mb-4 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 focus:outline-none"
                >
                    {importShow ? "Import" : "Ombor"}
                </button>
            </div>
            {
                !importShow ? <>
                    <h1 className="text-xl font-bold mb-5">Ombor</h1>

                    <table className="table-auto w-full border-collapse border border-gray-400 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700">
                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">Mahsulot</th>
                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">Narx</th>
                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">Zaxira</th>
                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item._id} className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">
                                        {item.productId.name}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">
                                        {formatCurrency(item.price.cost, item.price.currency)}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">
                                        {item.totalQuantity} ta
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">
                                        <button
                                            onClick={() => handleEditInventory(item)}
                                            className="bg-yellow-500 text-white py-1 px-4 rounded-md hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500"
                                        >
                                            Tahrirlash
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalCount}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />

                    {/* InventoryForm Modalini ochish */}

                </>
                    :
                    <ImportList />
            }

            {isModalOpen && (
                <ImportForm
                    inventory={selectedInventory}  // Agar inventar tahrirlanayotgan bo'lsa, unga moslashtiramiz
                    onClose={closeModal}  // Modalni yopish uchun funksiya
                    refreshImports={fetchInventory}  // Inventarni yangilash uchun funksiyani uzatish
                />
            )}

        </div>
    );
};

export default InventoryList;
