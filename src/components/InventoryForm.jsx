// src/components/InventoryForm.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import useProducts from '../hooks/products';

const InventoryForm = ({ inventory, onClose, refreshInventory }) => {
    console.log(inventory)
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [pricePerUnit, setPricePerUnit] = useState('');
    const [currentStock, setCurrentStock] = useState('');
    const [income, setIncome] = useState([]);
    const [outgoings, setOutgoings] = useState([]);
    const { products } = useProducts();

    useEffect(() => {
        if (inventory) {
            setProductId(inventory.productId._id);
            setPricePerUnit(inventory.price);
            setQuantity(inventory.totalQuantity);
        }
    }, [inventory]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedInventory = {
            productId,
            currentStock,
            price: pricePerUnit,
            totalQuantity: quantity
        };

        if (inventory) {
            // Inventoryni yangilash
            api.put(`/inventory/${inventory._id}`, updatedInventory)
                .then(() => {
                    refreshInventory();
                    onClose();
                })
                .catch(err => console.error('Xatolik:', err));
        } else {
            // Yangi inventory qo'shish
            api.post('/inventory', updatedInventory)
                .then(() => {
                    refreshInventory();
                    onClose();
                })
                .catch(err => console.error('Xatolik:', err));
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="productId" className="block text-gray-700 dark:text-gray-200 mb-2">
                        Mahsulot tanlang
                    </label>
                    <select
                        id="productId"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" className="text-gray-700 dark:text-gray-300">Mahsulotni tanlang</option>
                        {products.map(p => (
                            <option key={p._id} value={p._id} className="text-gray-700 dark:text-gray-300">{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="currentStock" className="block text-gray-700 dark:text-gray-200 mb-2">
                        Joriy zaxira
                    </label>
                    <input
                        id="currentStock"
                        type="number"
                        placeholder="Joriy zaxira"
                        value={quantity}
                        disabled={inventory}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>





                <div className="mb-4">
                    <label htmlFor="pricePerUnit" className="block text-gray-700 dark:text-gray-200 mb-2">
                        Narx (bir dona uchun)
                    </label>
                    <input
                        id="pricePerUnit"
                        type="number"
                        placeholder="Narx (bir dona uchun)"
                        value={pricePerUnit}
                        onChange={(e) => setPricePerUnit(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-600 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {inventory ? 'Yangilash' : 'Qo\'shish'}
                    </button>
                </div>
            </form>

            <div className="flex justify-end mt-4">
                <button
                    onClick={onClose}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                >
                    Yopish
                </button>
            </div>
        </div>
    );
};

export default InventoryForm;
