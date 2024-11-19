import { useState, useEffect } from 'react';
import api from '../api'; // API bilan ishlash uchun maxsus konfiguratsiya

const useSales = () => {
    const [sales, setSales] = useState([]); // Sotuvlar ro'yxati
    const [report, setReport] = useState(null); // Hisobot ma'lumotlari
    const [loading, setLoading] = useState(false); // Yuklanish holati
    const [error, setError] = useState(null); // Xatolik holati

    // Sotuvlar ro'yxatini olish
    const fetchSales = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/sales'); // `/sales` API so'rovi
            setSales(response.data); // Sotuvlar ma'lumotlarini saqlash
        } catch (err) {
            setError(err.response?.data?.message || 'Sotuvlar ma\'lumotini olishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    // Hisobot olish
    const fetchReport = async (query = {}) => {
        setLoading(true);
        setError(null);

        try {
            // Query parametrlari bilan API so'rov
            const queryString = new URLSearchParams(query).toString();
            const response = await api.get(`/sales/report?${queryString}`);
            console.log(response);
            
            setReport(response.data); // Hisobot ma'lumotlarini saqlash
        } catch (err) {
            console.log(err);

            setError(err.response?.data?.message || 'Hisobotni olishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    // Hook yuklanishda sotuvlarni avtomatik chaqiradi
    useEffect(() => {
        fetchSales();
        fetchReport()
    }, []);

    // Sotuvlarni yangilash uchun funksiya
    const refreshSales = () => {
        fetchSales();
    };

    // Qaytarilayotgan qiymatlar
    return {
        sales,        // Sotuvlar ro'yxati
        report,       // Hisobot ma'lumotlari
        loading,      // Yuklanish holati
        error,        // Xatolik holati
        refreshSales, // Ro'yxatni yangilash funksiyasi
        fetchReport,  // Hisobotni olish funksiyasi
    };
};

export default useSales;
