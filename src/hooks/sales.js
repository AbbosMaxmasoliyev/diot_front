import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api'; // API bilan ishlash uchun konfiguratsiya

const useSales = (initialPage = 1, initialLimit = 10) => {
    const [sales, setSales] = useState([]); // Sotuvlar ro'yxati
    const [totalPages, setTotalPages] = useState(1); // Umumiy sahifalar soni
    const [currentPage, setCurrentPage] = useState(initialPage); // Hozirgi sahifa
    const [limit, setLimit] = useState(initialLimit); // Har sahifada nechta sotuv
    const [loading, setLoading] = useState(false); // Yuklanish holati
    const [error, setError] = useState(null); // Xatolik holati

    // Sotuvlarni olish funksiyasi
    const fetchSales = useCallback(async (page = currentPage, limitValue = limit) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/sales?page=${page}&limit=${limitValue}`);
            setSales(response.data.sales);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (err) {
            setError(err.response?.data?.message || 'Sotuvlarni olishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit]);

    // Sahifalarni yangilashni memorlashtirish
    const updatePage = useCallback((page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);

    // Hook ilk yuklanishda sotuvlarni olish
    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    return useMemo(() => ({
        sales,          // Sotuvlar ro'yxati
        totalPages,     // Umumiy sahifalar soni
        currentPage,    // Hozirgi sahifa
        loading,        // Yuklanish holati
        error,          // Xatolik holati
        updatePage,     // Sahifani yangilash funksiyasi
        fetchSales,     // Sotuvlarni qayta yuklash funksiyasi
        setLimit,       // Limitni o'rnatish
    }), [sales, totalPages, currentPage, loading, error, updatePage, fetchSales]);
};

export default useSales;
