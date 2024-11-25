import axios from 'axios';

// Atrof-muhitga qarab URL-ni tanlash
const baseURL =
    process.env.NODE_ENV === 'production'
        ? 'https://diotbakend-production.up.railway.app/apiocam' // Production URL
        : 'http://localhost:5000/api'; // Local development URL

const api = axios.create({
    baseURL, // Dinamik base URL
});

export default api;
