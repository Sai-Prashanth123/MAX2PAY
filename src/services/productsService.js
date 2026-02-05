import { productAPI } from '../utils/api';

// Service layer for product-related operations.

export const productsService = {
  async list(params = {}) {
    try {
      const response = await productAPI.getAll(params);
      return { ok: true, products: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load products';
      return { ok: false, error: message };
    }
  },

  async getById(id) {
    try {
      const response = await productAPI.getById(id);
      return { ok: true, product: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load product';
      return { ok: false, error: message };
    }
  },

  async getByClient(clientId, params = {}) {
    try {
      const response = await productAPI.getByClient(clientId, params);
      return { ok: true, products: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load client products';
      return { ok: false, error: message };
    }
  },

  async create(payload) {
    try {
      const response = await productAPI.create(payload);
      return { ok: true, product: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product';
      return { ok: false, error: message };
    }
  },

  async update(id, payload) {
    try {
      const response = await productAPI.update(id, payload);
      return { ok: true, product: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product';
      return { ok: false, error: message };
    }
  },

  async remove(id) {
    try {
      await productAPI.delete(id);
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete product';
      return { ok: false, error: message };
    }
  },
};

