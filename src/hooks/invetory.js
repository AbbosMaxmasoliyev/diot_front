// src/hooks/inventory.js
import { useState, useEffect } from 'react';
import api from '../api';

const useInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [totalCount, setTotalCount] = useState(0); // Umumiy elementlar soni
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Inventar ma'lumotlarini olish
    const fetchInventory = async (params) => {
        const queryString = new URLSearchParams(params).toString();

        setError(null);
        setLoading(true);
        try {
            const response = await api.get(`/inventory?${queryString}`);
            console.log(response.data, "=====>>>>>>> Inventories");

            setInventory(response.data.data || []);
            setTotalCount(response.data.totalCount || 0); // Backend'dan umumiy sonni oling
        } catch (err) {
            setError('Inventarlarni olishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    // Hook yuklanishda inventarni avtomatik chaqiradi
    useEffect(() => {
        fetchInventory({ page: 1, limit: 10 }); // Standart sahifa va limit
    }, []);

    // Qaytarilayotgan qiymatlar
    return {
        inventory,
        totalCount, // Umumiy elementlar soni
        loading,
        error,
        fetchInventory,
    };
};

export default useInventory;
