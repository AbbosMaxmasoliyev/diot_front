import { useState, useEffect } from 'react';
import api from '../api';

const useSupplies = () => {
    const [supplies, setSupplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSupplies = async () => {
        try {
            setLoading(true);
            const response = await api.get('/supplies');
            setSupplies(response.data);
        } catch (err) {
            setError('Ma\'lumotlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSupplies();
    }, []);

    return { supplies, loading, error, refreshSupplies: fetchSupplies };
};

export default useSupplies;
