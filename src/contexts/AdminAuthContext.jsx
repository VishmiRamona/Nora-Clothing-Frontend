import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!adminToken);

  // If token exists on initial load, set the default Authorization header
  useEffect(() => {
    if (adminToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    }
  }, [adminToken]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/admin/login', { email, password });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('adminToken', token);
        setAdminToken(token);
        setIsAuthenticated(true);
        // Set the default Authorization header for all future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true };
      } else {
        return { success: false, message: 'No token received' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['Authorization'];
    setAdminToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, adminToken }}>
      {children}
    </AdminAuthContext.Provider>
  );
};