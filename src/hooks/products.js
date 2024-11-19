// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import api from '../api';

const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mahsulotlar ro'yxatini olish
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (err) {
            setError('Mahsulotlarni olishda xatolik yuz berdi');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Custom hook ishlatilganda mahsulotlarni olish uchun
    useEffect(() => {
        fetchProducts();
    }, []);

    // Mahsulotlarni yangilash funksiyasi (buni CRUD uchun ishlatishingiz mumkin)
    const refreshProducts = async () => {
        await fetchProducts();
    };

    return { products, loading, error, refreshProducts };
};

export default useProducts;
