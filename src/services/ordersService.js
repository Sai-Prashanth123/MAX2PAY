import { orderAPI } from '../utils/api';

// Service layer for order-related operations.

export const ordersService = {
  async list(params = {}) {
    try {
      const response = await orderAPI.getAll(params);
      return { ok: true, orders: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load orders';
      return { ok: false, error: message };
    }
  },

  async getById(id) {
    try {
      const response = await orderAPI.getById(id);
      return { ok: true, order: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load order';
      return { ok: false, error: message };
    }
  },

  async create(payload) {
    try {
      const response = await orderAPI.create(payload);
      return { ok: true, order: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create order';
      return { ok: false, error: message };
    }
  },

  async updateStatus(id, data) {
    try {
      const response = await orderAPI.updateStatus(id, data);
      return { ok: true, order: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order status';
      return { ok: false, error: message };
    }
  },

  async stats() {
    try {
      const response = await orderAPI.getStats();
      return { ok: true, stats: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load order stats';
      return { ok: false, error: message };
    }
  },
};

