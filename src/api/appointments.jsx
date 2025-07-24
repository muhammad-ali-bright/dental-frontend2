// api/incidents.js
import { API } from './axios';

export const createIncidentAPI = (data) => {
    return API.post('/incidents', data);
};

export const updateIncidentAPI = (id, data) => {
    return API.put(`/incidents/${id}`, data);
};