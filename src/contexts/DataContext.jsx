import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPatientDropdownAPI } from '../api/patients';
import { getIncidentsAPI, getIncidentsByRangeAPI } from '../api/appointments';
import { useAuth } from './AuthContext';

const DataContext = createContext(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // 🔽 Dropdown Patient List
  const [dropdownPatients, setDropdownPatients] = useState([]);

  // 📅 Appointment Data
  const [incidents, setIncidents] = useState([]);
  const [todayIncidents, setTodayIncidents] = useState([]);
  const [upcomingIncidents, setUpcomingIncidents] = useState([]);

  // 📊 Stats
  const [totalCount, setTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

  // 🔄 Fetch dropdown list of patients
  const fetchDropdownPatients = async () => {
    try {
      const res = await fetchPatientDropdownAPI();
      setDropdownPatients(res.data || []);
    } catch (err) {
      console.error('❌ Failed to load dropdown patients:', err);
    }
  };

  // 📋 Fetch full incident list (for dashboard or list views)
  const fetchIncidents = async (page = 1, size = 10, status = 'all', date = 'all', search = '') => {
    try {
      const { data } = await getIncidentsAPI(page, size, status, date, search);
      setIncidents(data?.incidents || []);
      setTodayIncidents(data?.todayIncidents || []);
      setUpcomingIncidents(data?.upcomingIncidents || []);
      setTotalCount(data?.totalCount || 0);
      setCompletedCount(data?.completedCount || 0);
      setOverdueCount(data?.overdueCount || 0);
    } catch (err) {
      console.error('❌ Failed to fetch incidents:', err);
    }
  };

  // 📆 Fetch incident data by date range (for calendar view)
  const fetchIncidentsByRange = async (startDate, endDate) => {
    try {
      const { data } = await getIncidentsByRangeAPI(startDate, endDate);
      if (Array.isArray(data)) {
        setIncidents(data);
      } else if (Array.isArray(data?.incidents)) {
        setIncidents(data.incidents);
      } else {
        console.warn('⚠️ Unexpected response from getIncidentsByRangeAPI:', data);
        setIncidents([]);
      }
    } catch (err) {
      console.error('❌ Failed to fetch incidents by range:', err);
      setIncidents([]);
    }
  };

  // 🔁 Initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchDropdownPatients();
      fetchIncidents();
    }
  }, [isAuthenticated]);

  return (
    <DataContext.Provider
      value={{
        // Incidents
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

        // Patients
        dropdownPatients,
        setDropdownPatients,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
