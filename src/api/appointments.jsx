// api/incidents.js
import { API } from './axios';

export const createIncidentAPI = (data) => {
    return API.post('/incidents', data);
};

export const updateIncidentAPI = (id, data) => {
    return API.put(`/incidents/${id}`, data);
};

export const updateIncidentStatusAPI = (id, payload) => {
    return API.put(`/incidents/status/${id}`, payload);
};

export const getIncidentsAPI = (currentPage, pageSize, status, dateFilter, search) => {
    return API.get('/incidents', {
        params: {
            page: currentPage,
            pageSize,
            status,
            date: dateFilter,
            search
        }
    });
};

export const deleteIncidentAPI = (id) => {
    alert(id);
    return API.delete(`/incidents/${id}`);
};