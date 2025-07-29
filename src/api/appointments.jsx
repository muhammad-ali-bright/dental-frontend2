import { API } from './axios';

/**
 * Create a new incident
 * @param {Object} data - Incident details
 */
export const createIncidentAPI = (data) => API.post('/incidents', data);

/**
 * Update an existing incident
 * @param {string} id - Incident ID
 * @param {Object} data - Updated fields
 */
export const updateIncidentAPI = (id, data) => API.put(`/incidents/${id}`, data);

/**
 * Update the status of an incident
 * @param {string} id - Incident ID
 * @param {Object} payload - New status data
 */
export const updateIncidentStatusAPI = (id, payload) =>
    API.put(`/incidents/status/${id}`, payload);

/**
 * Get a paginated list of incidents with optional filters
 * @param {number} currentPage
 * @param {number} pageSize
 * @param {string} status - e.g. 'all', 'completed'
 * @param {string} dateFilter - e.g. 'today', 'week'
 * @param {string} search - search keyword
 */
export const getIncidentsAPI = (currentPage, pageSize, status, dateFilter, search) =>
    API.get('/incidents', {
        params: {
            page: currentPage,
            pageSize,
            status,
            date: dateFilter,
            search,
        },
    });

/**
 * Get incidents within a date range (for calendar)
 * @param {string} startDate - Format: YYYY-MM-DD
 * @param {string} endDate - Format: YYYY-MM-DD
 */
export const getIncidentsByRangeAPI = (startDate, endDate) =>
    API.get('/incidents/range', {
        params: {
            startDate,
            endDate,
        },
    });

/**
 * Get all incidents for a specific patient
 * @param {string} patientId
 */
export const fetchPatientIncidentsAPI = (patientId) =>
    API.get(`/incidents/patient/${patientId}`);

/**
 * Delete an incident
 * @param {string} id - Incident ID
 */
export const deleteIncidentAPI = (id) => API.delete(`/incidents/${id}`);
