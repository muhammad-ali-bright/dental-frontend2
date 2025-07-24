// api/auth.ts
import { API } from './axios';

export const registerAPI = (data) => {
    return API.post('/auth/register', data);
}

export const fetchMeAPI = async () => {
    try {
        const response = await API.get('/users/me');
        return response;
    } catch (error) {
        console.error('Login API error:', error);
        throw error;
    }
};

export const loginAPI = async (email, password) => {
    try {
        const response = await API.post('/auth/login', { email, password });
        return response;
    } catch (error) {
        console.error('Login API error:', error);
        throw error;
    }
};
