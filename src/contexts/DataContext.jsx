import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPatientDropdownAPI } from "../api/patients";
import { useAuth } from './AuthContext';
import { getIncidentsAPI } from '../api/appointments';

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
  const [upcomingIncidents, setUpcomingIncidents] = useState([]);
  const [todayIncidents, setTodayIncidents] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadDropdownPatients();
      fetchIncidents();
    }
  }, [isAuthenticated]);

  const loadDropdownPatients = async () => {
    try {
      const res = await fetchPatientDropdownAPI();
      setDropdownPatients(res.data);
    } catch (err) {
      console.error('Failed to load dropdown patients', err);
    }
  };

  const fetchIncidents = async (page = 1, size = 10, status = 'all', date = 'all', search = '') => {
    try {
      const { data } = await getIncidentsAPI(page, size, status, date, search);
      setIncidents(data.incidents);
      setTotalCount(data.totalCount);
      setCompletedCount(data.completedCount);
      setOverdueCount(data.overdueCount);
      setTodayIncidents(data.todayIncidents);
      setUpcomingIncidents(data.upcomingIncidents);
    } catch (error) {
      console.error('Failed to fetch incidents globally:', error);
    }
  };

  const value = {
    incidents,
    setIncidents,
    todayIncidents,
    upcomingIncidents,
    setTodayIncidents,
    totalCount,  // incidents
    setTotalCount,  // incidents
    completedCount,  // incidents
    setCompletedCount,  // incidents
    overdueCount,  // incidents
    setOverdueCount,  // incidents
    dropdownPatients,
    setDropdownPatients,
    fetchIncidents
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};