import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { API } from '../api/axios';
import { registerAPI, loginAPI, fetchMeAPI } from '../api/auth';

const AuthContext = createContext(null);

const clearAuthState = () => {
  delete API.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set token as default header for future requests
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const response = await fetchMeAPI();
          const { success, result } = response.data;
          if (success) {
            const user = result;
            setUser(user);
            setIsAuthenticated(true);
          } else {
            // toast.error(result);
          }
        } catch (err) {
          console.error('Failed to fetch user from token:', err);
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (name, email, password, role) => {
    try {
      const response = await registerAPI({ name, email, password, role });
      return response;
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginAPI(email, password);
      const { success, result } = response.data;
      if (success) {
        const { token, user } = result;

        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success, result };
      } else {
        return { success, result }
      }

    } catch (err) {
      console.error('Login error:', err);
      throw new Error('Invalid login credentials');
    }
  };


  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const response = await API.post('/auth/google-login', { idToken });
      const { success, result: {token, user} } = response.data;

      if (success && user) {
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true, exists: true, result: user };
      } else {
        // user not in DB — redirect to profile completion
        localStorage.setItem('google-id-token', idToken);
        return { success: true, exists: false };
      }
    } catch (error) {
      console.error("Google Sign-in error:", error);
      return { success: false, result: error.message };
    }
  };

  const logout = async () => {
    try {
      // Optionally notify server
      // await logoutAPI();

      // Clear token from localStorage
      localStorage.removeItem('token');

      // Remove auth header from Axios instance
      delete API.defaults.headers.common['Authorization'];

      // Update UI state
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always reset auth state
      clearAuthState?.();
    }
  };


  const refreshToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    loginWithGoogle,
    register,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
