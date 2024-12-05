import axios from 'axios';

// Atrof-muhitga qarab URL-ni tanlash
const baseURL =
    process.env.NODE_ENV === 'production'
        ? 'https://diotbakend-production.up.railway.app/api' // Production URL
        : 'http://localhost:5000/api'; // Local development URL
        // : 'https://diotbakend-production.up.railway.app/api'
const api = axios.create({
    baseURL, // Dinamik base URL
    timeout: 6000
});

export default api;
