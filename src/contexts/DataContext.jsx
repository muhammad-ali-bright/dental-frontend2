import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPatients, savePatients, getIncidents, saveIncidents } from '../utils/storage';
import {fetchPatientDropdownAPI} from "../api/patients";

const DataContext = createContext(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [dropdownPatients, setDropdownPatients] = useState([]);

  const loadDropdownPatients = async () => {
    try {
      const res = await fetchPatientDropdownAPI();
      setDropdownPatients(res.data);
    } catch (err) {
      console.error('Failed to load dropdown patients', err);
    }
  };

  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    setPatients(getPatients());
    setIncidents(getIncidents());
    loadDropdownPatients();
  }, []);

  const addIncident = (incidentData) => {
    const newIncident = {
      ...incidentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedIncidents = [...incidents, newIncident];
    setIncidents(updatedIncidents);
    saveIncidents(updatedIncidents);
  };

  const updateIncident = (id, incidentData) => {
    const updatedIncidents = incidents.map(incident =>
      incident.id === id
        ? { ...incident, ...incidentData, updatedAt: new Date().toISOString() }
        : incident
    );
    setIncidents(updatedIncidents);
    saveIncidents(updatedIncidents);
  };

  const deleteIncident = (id) => {
    const updatedIncidents = incidents.filter(incident => incident.id !== id);
    setIncidents(updatedIncidents);
    saveIncidents(updatedIncidents);
  };

  const getPatientIncidents = (patientId) => {
    return incidents.filter(incident => incident.patientId === patientId);
  };

  const getUpcomingAppointments = (limit = 10) => {
    const upcoming = incidents
      .filter(incident => new Date(incident.appointmentDate) > new Date())
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    return limit ? upcoming.slice(0, limit) : upcoming;
  };

  const getPatientById = (id) => {
    return patients.find(patient => patient.id === id);
  };

  const value = {
    dropdownPatients,
    incidents,
    addIncident,
    updateIncident,
    deleteIncident,
    getPatientIncidents,
    getUpcomingAppointments,
    getPatientById
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};