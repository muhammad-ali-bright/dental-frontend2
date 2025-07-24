import axios from 'axios';
const API_BASE = 'http://localhost:5000/api'; // Or your deployed backend URL

export const fetchPatients = async () => {
    const res = await axios.get(`${API_BASE}/patients`);
    return res.data;
};

export const createPatient = async (data) => {
    const res = await axios.post(`${API_BASE}/patients`, data);
    return res.data;
};