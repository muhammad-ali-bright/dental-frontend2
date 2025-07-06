import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPatients, savePatients, getIncidents, saveIncidents } from '../utils/storage';

const DataContext = createContext(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    setPatients(getPatients());
    setIncidents(getIncidents());
  }, []);

  const addPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    savePatients(updatedPatients);
  };

  const updatePatient = (id, patientData) => {
    const updatedPatients = patients.map(patient =>
      patient.id === id
        ? { ...patient, ...patientData, updatedAt: new Date().toISOString() }
        : patient
    );
    setPatients(updatedPatients);
    savePatients(updatedPatients);
  };

  const deletePatient = (id) => {
    const updatedPatients = patients.filter(patient => patient.id !== id);
    const updatedIncidents = incidents.filter(incident => incident.patientId !== id);
    setPatients(updatedPatients);
    setIncidents(updatedIncidents);
    savePatients(updatedPatients);
    saveIncidents(updatedIncidents);
  };

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
    patients,
    incidents,
    addPatient,
    updatePatient,
    deletePatient,
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