// src/hooks/useFetchUserData.js
import { useState, useEffect } from 'react';
import api from '../api';

const useFetchUserData = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/profile');
                console.log(response.data);
                
                setUser(response.data);
            } catch (err) {
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []); // Empty dependency array to run once when the component mounts

    return { user, loading, error };
};

export default useFetchUserData;
