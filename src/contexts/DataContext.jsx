import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPatientDropdownAPI } from "../api/patients";

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
  const [todayIncidentsCount, setTodayIncidentsCount] = useState(0);
  const [todayIncidents, setTodayIncidents] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

  const loadDropdownPatients = async () => {
    try {
      const res = await fetchPatientDropdownAPI();
      setDropdownPatients(res.data);
    } catch (err) {
      console.error('Failed to load dropdown patients', err);
    }
  };

  useEffect(() => {
    loadDropdownPatients();
  }, []);

  const value = {
    incidents, 
    setIncidents,
    todayIncidents,
    setTodayIncidents,
    todayIncidentsCount,  // incidents
    setTodayIncidentsCount, // incidents
    todayCount,
    setTodayCount,
    totalCount,  // incidents
    setTotalCount,  // incidents
    completedCount,  // incidents
    setCompletedCount,  // incidents
    overdueCount,  // incidents
    setOverdueCount,  // incidents
    dropdownPatients,
    setDropdownPatients,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};