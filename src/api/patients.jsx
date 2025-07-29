import { API } from './axios';

/* ----------------------------------------
 ✅ READ OPERATIONS
---------------------------------------- */

/**
 * Fetch paginated or filtered list of patients
 * @param {Object} params - Filters like page, search, etc.
 */
export const fetchPatientsAPI = (params) =>
    API.get('/patients', { params });

/**
 * Fetch patient dropdown list (id + name)
 */
export const fetchPatientDropdownAPI = () =>
    API.get('/patients/dropdown');

/**
 * Get a single patient by ID
 * @param {string} id
 */
export const fetchPatientByIdAPI = (id) =>
    API.get(`/patients/${id}`);

/**
 * Fetch all incidents/appointments for a given patient
 * @param {string} patientId
 */
export const fetchIncidentsByPatientAPI = (patientId) =>
    API.get(`/patients/${patientId}/incidents`);

/* ----------------------------------------
 ✅ CREATE / UPDATE / DELETE
---------------------------------------- */

/**
 * Create a new patient record
 * @param {Object} data - Patient form data
 */
export const createPatientAPI = (data) =>
    API.post('/patients', data);

/**
 * Update an existing patient by ID
 * @param {string} id
 * @param {Object} data - Updated patient fields
 */
export const updatePatientAPI = (id, data) =>
    API.put(`/patients/${id}`, data);

/**
 * Delete a patient by ID
 * @param {string} id
 */
export const deletePatientAPI = (id) =>
    API.delete(`/patients/${id}`);
