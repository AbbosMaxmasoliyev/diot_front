// src/hooks/useCustomers.js
import { useState, useEffect } from 'react';
import api from '../api';

const useCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mijozlar ro'yxatini olish
    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/customers');
            setCustomers(response.data);
        } catch (err) {
            setError('Mijozlarni olishda xatolik yuz berdi');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Custom hook ishlatilganda mijozlarni olish uchun
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Mijozlarni yangilash funksiyasi (buni CRUD uchun ishlatishingiz mumkin)
    const refreshCustomers = async () => {
        await fetchCustomers();
    };

    return { customers, loading, error, refreshCustomers };
};

export default useCustomers;
