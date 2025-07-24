import { API } from './axios';

// Fetch all patients
export const fetchPatientsAPI = () => {
    return API.get('/patients');
};

// Get a single patient by ID
export const fetchPatientByIdAPI = (id) => {
    return API.get(`/patients/${id}`);
};

// Create a new patient
export const createPatientAPI = (data) => {
    return API.post('/patients', data);
};

// Update an existing patient
export const updatePatientAPI = (id, data) => {
    return API.put(`/patients/${id}`, data);
};

// Delete a patient by ID
export const deletePatientAPI = (id) => {
    return API.delete(`/patients/${id}`);
};

// Get all 'Student's (appointments) for a patient
export const fetchIncidentsByPatientAPI = (patientId) => {
    return API.get(`/patients/${patientId}/incidents`);
};
