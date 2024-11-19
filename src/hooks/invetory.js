// src/hooks/inventory.js
import { useState, useEffect } from 'react';
import api from '../api';

const useInventory = () => {
    const [inventory, setInventory] = useState([]); // Barcha inventar ma'lumotlari
    const [report, setReport] = useState([]); // Hisobot ma'lumotlari
    const [loading, setLoading] = useState(false); // Yuklanish holati
    const [error, setError] = useState(null); // Xatolik holati
    const [reportLoading, setReportLoading] = useState(false); // Hisobot yuklanish holati
    const [reportError, setReportError] = useState(null); // Hisobot xatolik holati

    // Barcha inventar ma'lumotlarini olish
    const fetchInventory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/inventory');
            setInventory(response.data);
        } catch (err) {
            setError('Inventarlarni olishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    // Hisobot ma'lumotlarini olish
    const fetchReport = async (params = {}) => {
        setReportLoading(true);
        setReportError(null);
        try {
            // Query parametrlarini URL formatiga o'tkazish
            const queryString = new URLSearchParams(params).toString();
            const response = await api.get(`/inventory/income/report?${queryString}`);
            console.log(response, "=>>> Report inventor");

            setReport(response.data);
        } catch (err) {
            setReportError('Hisobotni olishda xatolik yuz berdi');
        } finally {
            setReportLoading(false);
        }
    };

    // Hook yuklanishda inventarni avtomatik chaqiradi
    useEffect(() => {
        fetchInventory();
        fetchReport()
    }, []);

    // Inventarni yangilash uchun funksiya
    const refreshInventory = () => {
        fetchInventory();
    };

    // Hisobotni yangilash uchun funksiya
    const refreshReport = (params) => {
        fetchReport(params);
    };

    // Qaytarilayotgan qiymatlar
    return {
        inventory,        // Barcha inventar ma'lumotlari
        report,           // Hisobot ma'lumotlari
        loading,          // Inventar yuklanish holati
        error,            // Inventar xatolik holati
        reportLoading,    // Hisobot yuklanish holati
        reportError,      // Hisobot xatolik holati
        refreshInventory, // Inventarni yangilash funksiyasi
        refreshReport,    // Hisobotni yangilash funksiyasi
    };
};

export default useInventory;
