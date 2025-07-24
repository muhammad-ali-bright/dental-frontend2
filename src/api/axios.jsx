// api/axios.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
console.log(API_URL);

export const API = axios.create({
    baseURL: API_URL,
});

// 🔐 Request Interceptor: attach latest token from localStorage (fallback)
API.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
