// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import { API } from '../api/axios';
import { registerAPI, loginAPI, fetchMeAPI } from '../api/auth';

const AuthContext = createContext(null);

// Helpers
const setAuthHeader = (token) => {
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const clearAuthState = () => {
  localStorage.removeItem('token');
  delete API.defaults.headers.common['Authorization'];
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auto-login on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          setAuthHeader(token);
          const response = await fetchMeAPI();
          const { success, result } = response.data;
          if (success) {
            setUser(result);
            setIsAuthenticated(true);
          } else {
            clearAuthState();
          }
        } catch (err) {
          console.error('Failed to fetch user from token:', err);
          clearAuthState();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Registration
  const register = async (name, email, password, role) => {
    try {
      return await registerAPI({ name, email, password, role });
    } catch (err) {
      console.error('Registration failed:', err);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  // Email/Password Login
  const login = async (email, password) => {
    try {
      const response = await loginAPI(email, password);
      const { success, result } = response.data;

      if (success) {
        const { token, user } = result;
        localStorage.setItem('token', token);
        setAuthHeader(token);
        setUser(user);
        setIsAuthenticated(true);
      }

      return { success, result };
    } catch (err) {
      console.error('Login failed:', err);
      throw new Error('Invalid login credentials');
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const { data } = await API.post('/auth/google-login', { idToken });
      const { success, alreadyExists, result: payload, message } = data;

      if (!success || !alreadyExists || !payload?.token || !payload?.user) {
        return { success: false, message: message || 'Account does not exist. Please register.' };
      }

      const { token, user } = payload;
      localStorage.setItem('token', token);
      setAuthHeader(token);
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const registerWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const { data } = await API.post('/auth/google-login', { idToken });
      const { success, alreadyExists, result: payload, message } = data;

      if (!success) {
        return { success: false, message: message || 'Google sign-up failed' };
      }

      if (alreadyExists && payload?.user) {
        // User already in DB — shouldn't be registering
        return { success: true, alreadyExists: true };
      }

      // New Firebase user — proceed to profile completion
      localStorage.setItem('google-id-token', idToken);
      return { success: true, alreadyExists: false };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Logout
  const logout = () => {
    try {
      clearAuthState();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Refresh token manually
  const refreshToken = () => {
    const token = localStorage.getItem('token');
    if (token) setAuthHeader(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        register,
        login,
        loginWithGoogle,
        registerWithGoogle,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
