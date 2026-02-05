import { authAPI } from '../utils/api';

// Thin service layer around auth-related API calls.
// Centralizes error handling and return shapes for the UI/hooks.

export const authService = {
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      return { ok: true, user: response.data.data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { ok: false, error: message };
    }
  },

  async register(payload) {
    try {
      const response = await authAPI.register(payload);
      return { ok: true, user: response.data.data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { ok: false, error: message };
    }
  },

  async fetchMe() {
    try {
      const response = await authAPI.getMe();
      return { ok: true, user: response.data.data };
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        return { ok: false, unauthorized: true };
      }
      const message = error.response?.data?.message || 'Failed to load user';
      return { ok: false, error: message };
    }
  },

  async updateProfile(data) {
    try {
      const response = await authAPI.updateProfile(data);
      return { ok: true, user: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      return { ok: false, error: message };
    }
  },

  async changePassword(data) {
    try {
      await authAPI.changePassword(data);
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      return { ok: false, error: message };
    }
  },

  async logout() {
    try {
      await authAPI.logout();
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to logout';
      return { ok: false, error: message };
    }
  },
};

