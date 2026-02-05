import { clientAPI } from '../utils/api';

// Service layer for client-related operations.

export const clientsService = {
  async list(params = {}) {
    try {
      const response = await clientAPI.getAll(params);
      return { ok: true, clients: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load clients';
      return { ok: false, error: message };
    }
  },

  async getById(id) {
    try {
      const response = await clientAPI.getById(id);
      return { ok: true, client: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load client';
      return { ok: false, error: message };
    }
  },

  async create(payload) {
    try {
      const response = await clientAPI.create(payload);
      return { ok: true, client: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create client';
      return { ok: false, error: message };
    }
  },

  async update(id, payload) {
    try {
      const response = await clientAPI.update(id, payload);
      return { ok: true, client: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update client';
      return { ok: false, error: message };
    }
  },

  async remove(id) {
    try {
      await clientAPI.delete(id);
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete client';
      return { ok: false, error: message };
    }
  },
};

