import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPatientDropdownAPI } from '../api/patients';
import { getIncidentsAPI, getIncidentsByRangeAPI } from '../api/appointments';
import { useAuth } from './AuthContext';

// Create context
const DataContext = createContext(undefined);

// Custom hook
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // 🔄 Shared global state
  const [dropdownPatients, setDropdownPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [todayIncidents, setTodayIncidents] = useState([]);
  const [upcomingIncidents, setUpcomingIncidents] = useState([]);

  // 📊 Stats
  const [totalCount, setTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

  // ⏬ Dropdown list
  const loadDropdownPatients = async () => {
    try {
      const res = await fetchPatientDropdownAPI();
      setDropdownPatients(res.data || []);
    } catch (err) {
      console.error('❌ Failed to load dropdown patients:', err);
    }
  };

  // 📅 Full incident fetch (used by dashboard or list)
  const fetchIncidents = async (
    page = 1,
    size = 10,
    status = 'all',
    date = 'all',
    search = ''
  ) => {
    try {
      const { data } = await getIncidentsAPI(page, size, status, date, search);

      setIncidents(data?.incidents || []);
      setTodayIncidents(data?.todayIncidents || []);
      setUpcomingIncidents(data?.upcomingIncidents || []);
      setTotalCount(data?.totalCount || 0);
      setCompletedCount(data?.completedCount || 0);
      setOverdueCount(data?.overdueCount || 0);
    } catch (error) {
      console.error('❌ Failed to fetch incidents globally:', error);
    }
  };

  // 📆 Fetch for calendar: get incidents only in a date range
  const fetchIncidentsByRange = async (startDate, endDate) => {
    try {
      const { data } = await getIncidentsByRangeAPI(startDate, endDate);

      if (Array.isArray(data)) {
        setIncidents(data);
      } else if (Array.isArray(data?.incidents)) {
        setIncidents(data.incidents);
      } else {
        console.warn('⚠️ Unexpected format from getIncidentsByRangeAPI:', data);
        setIncidents([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch incidents by range:', error);
      setIncidents([]); // Fallback for calendar view
    }
  };

  // 🔄 Initial load
  useEffect(() => {
    if (isAuthenticated) {
      loadDropdownPatients();
      fetchIncidents(); // for Dashboard
    }
  }, [isAuthenticated]);

  return (
    <DataContext.Provider
      value={{
        // Shared appointment data
        incidents,
        setIncidents,
        fetchIncidents,
        fetchIncidentsByRange,

        // Stats
        todayIncidents,
        setTodayIncidents,
        upcomingIncidents,
        setUpcomingIncidents,
        totalCount,
        setTotalCount,
        completedCount,
        setCompletedCount,
        overdueCount,
        setOverdueCount,

        // Dropdowns
        dropdownPatients,
        setDropdownPatients,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
