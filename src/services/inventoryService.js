import { inventoryAPI } from '../utils/api';

// Service layer for inventory-related operations.

export const inventoryService = {
  async list(params = {}) {
    try {
      const response = await inventoryAPI.getAll(params);
      return {
        ok: true,
        items: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load inventory';
      return { ok: false, error: message };
    }
  },

  async stats() {
    try {
      const response = await inventoryAPI.getStats();
      return { ok: true, stats: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load inventory stats';
      return { ok: false, error: message };
    }
  },

  async adjust(data) {
    try {
      const response = await inventoryAPI.adjust(data);
      return { ok: true, inventory: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to adjust inventory';
      return { ok: false, error: message };
    }
  },
};

