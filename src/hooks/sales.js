import { useState, useCallback, useEffect, useMemo } from "react";
import api from "../api";

const useSales = (initialPage = 1, initialLimit = 10, initialStartDate = null, initialEndDate = null,) => {
    const [sales, setSales] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const fetchSales = useCallback(
        async (page = currentPage, limitValue = limit, start = startDate || null, end = endDate || null) => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({ page, limit: limitValue != "all" ? limitValue : null });
                if (start) params.append('startDate', start);
                if (end) params.append('endDate', end);

                const response = await api.get(`/sales?${params.toString()}`);
                console.log(response.data);

                setSales(response.data.sales);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
            } catch (err) {
                console.log(err);

                setError(err.response?.data?.message || 'Sotuvlarni olishda xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        },
        [currentPage, limit, startDate, endDate]
    );


    const getSaleWithId = useCallback(async (id) => {
        try {
            const response = await api.get(`/sales/${id}`);
            return response.data
        } catch (error) {
            return false
        }
    }, [""])

    const updatePage = useCallback((page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    return useMemo(() => ({
        sales,
        totalPages,
        currentPage,
        loading,
        error,
        limit,
        updatePage,
        fetchSales,
        setLimit,
        setStartDate,
        setEndDate,
        getSaleWithId
    }), [sales, totalPages, currentPage, loading, error, updatePage, fetchSales, startDate, endDate]);
};

export default useSales;
