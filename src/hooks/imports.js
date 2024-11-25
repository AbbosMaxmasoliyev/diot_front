import { useState, useEffect, useCallback } from 'react';
import api from '../api';

const useImports = (initialPage = 1, initialPageSize = 10) => {
    const [imports, setImports] = useState([]); // Importlar ro'yxati
    const [loading, setLoading] = useState(false); // Yuklash jarayoni holati
    const [error, setError] = useState(null); // Xatolarni saqlash
    const [totalPages, setTotalPages] = useState(0); // Jami sahifalar soni
    const [currentPage, setCurrentPage] = useState(initialPage); // Hozirgi sahifa
    const [pageSize, setPageSize] = useState(initialPageSize); // Sahifa hajmi

    // Importlarni olish funksiyasi
    const fetchImports = useCallback(async (page = currentPage, size = pageSize) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/import', {
                params: { page, pageSize: size },
            });
            setImports(response.data.imports); // API dan kelgan importlar
            setTotalPages(response.data.totalPages); // Jami sahifalar soni
        } catch (err) {
            setError('Importlarni yuklashda xatolik yuz berdi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    // Sahifani o'zgartirish funksiyasi
    const changePage = useCallback(
        (newPage) => {
            if (newPage > 0 && newPage <= totalPages) {
                setCurrentPage(newPage);
            }
        },
        [totalPages]
    );

    // Importlarni qayta yuklash funksiyasi
    const refreshImports = useCallback(() => {
        fetchImports(1, pageSize); // Birinchi sahifani qayta yuklash
    }, [fetchImports, pageSize]);

    // Sahifa va hajm o'zgarganda ma'lumotlarni qayta yuklash
    useEffect(() => {
        fetchImports(currentPage, pageSize);
    }, [fetchImports, currentPage, pageSize]);

    return {
        imports, // Importlar ro'yxati
        loading, // Yuklash holati
        error, // Xato xabarlari
        currentPage, // Hozirgi sahifa
        totalPages, // Jami sahifalar soni
        pageSize, // Sahifa hajmi
        changePage, // Sahifani o'zgartirish funksiyasi
        setPageSize, // Sahifa hajmini o'zgartirish
        refreshImports, // Importlarni qayta yuklash funksiyasi
    };
};

export default useImports;
