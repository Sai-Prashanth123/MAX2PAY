import { useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import AuthContext from './authContext';

const TOKEN_STORAGE_KEY = 'sb-access-token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a token before making API call
        const token = localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await authAPI.getMe();
        setUser(response.data.data);
      } catch (error) {
        // Only clear user if it's a 401 (unauthorized) error
        // Don't logout on network errors or server errors
        if (error.response?.status === 401) {
          setUser(null);
        }
        // For other errors, keep user logged in and let them continue
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (!response?.data?.data?.user) {
        const message = response?.data?.message || 'Login failed: Invalid response';
        toast.error(message);
        return { success: false, error: message };
      }
      
      const { user: userData } = response.data.data;
      setUser(userData);
      toast.success('Login successful!');
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user: newUser } = response.data.data;

      setUser(newUser);
      toast.success('Registration successful!');
      return { success: true, user: newUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout?.();
    } catch {
      // ignore network/logout errors, we'll still clear local state
    }
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    setUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isClient: user?.role === 'client',
    isEmployee: user?.role === 'employee',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
