// api/axios.ts
import axios from 'axios';

const API_URL = process.env.SERVER_PORT || "http://localhost:5000/api";

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
