import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import CalendarPage from './pages/CalendarPage';
import PatientDashboardPage from './pages/PatientDashboardPage';
import PatientAppointmentsPage from './pages/PatientAppointmentsPage';

const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'Admin') {
    return <DashboardPage />;
  } else if (user?.role === 'Patient') {
    return <PatientDashboardPage />;
  }
  
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Admin Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <ProtectedRoute requiredRole="Admin">
                  <PatientsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments" 
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AppointmentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute requiredRole="Admin">
                  <CalendarPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Patient Routes */}
            <Route 
              path="/patient-dashboard" 
              element={
                <ProtectedRoute requiredRole="Patient">
                  <PatientDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-appointments" 
              element={
                <ProtectedRoute requiredRole="Patient">
                  <PatientAppointmentsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;