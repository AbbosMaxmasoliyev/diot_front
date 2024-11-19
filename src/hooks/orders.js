// src/hooks/useOrders.js
import { useState, useEffect } from 'react';
import api from '../api';

const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch orders from the API
    const fetchOrders = () => {
        setLoading(true);
        setError(null);
        api.get('/orders')
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Buyurtmalarni olishda xatolik yuz berdi');
                setLoading(false);
            });
    };

    // Refresh orders after adding or deleting an order
    const refreshOrders = () => {
        fetchOrders();
    };

    // Fetch orders when the component mounts
    useEffect(() => {
        fetchOrders();
    }, []);

    return { orders, loading, error, refreshOrders };
};

export default useOrders;
