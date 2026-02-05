import axios from 'axios';
import { API_URL } from './config';

// Token storage key
const TOKEN_STORAGE_KEY = 'sb-access-token';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Remove Content-Type header for FormData to allow browser to set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Add Authorization header if token exists
    // First check localStorage for stored token
    const token = localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Store token from login/register responses and handle errors
api.interceptors.response.use(
  (response) => {
    // If response contains session data, store access token
    if (response.data?.data?.session?.access_token) {
      const token = response.data.data.session.access_token;
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else if (response.config?.withCredentials && response.headers['set-cookie']) {
      // Handle httpOnly cookie fallback
      const cookie = response.headers['set-cookie'][0];
      const token = cookie.match(/access_token=([^;]*)/);
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token[1]);
      }
    }
    return response;
  },
  (error) => {
    // Clear token on 401
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    // Let callers handle 401s (AuthContext can redirect if needed)
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/auth/avatar', formData);
  },
  logout: () => api.post('/auth/logout'),
};

export const clientAPI = {
  getAll: (params) => api.get('/clients', { params }),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  getStats: (id) => api.get(`/clients/${id}/stats`),
};

export const clientUserAPI = {
  getAll: (params) => api.get('/client-users', { params }),
  create: (data) => api.post('/client-users', data),
  update: (id, data) => api.put(`/client-users/${id}`, data),
  delete: (id) => api.delete(`/client-users/${id}`),
  resetPassword: (id, data) => api.put(`/client-users/${id}/reset-password`, data),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByClient: (clientId) => api.get(`/products/client/${clientId}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const inventoryAPI = {
  getAll: (params) => api.get('/inventory', { params }),
  getByProduct: (productId) => api.get(`/inventory/product/${productId}`),
  getByClient: (clientId) => api.get('/inventory', { params: { clientId } }),
  getStats: (params) => api.get('/inventory/stats', { params }),
  adjust: (data) => api.post('/inventory/adjust', data),
  delete: (id) => api.delete(`/inventory/${id}`),
};

export const inboundAPI = {
  getAll: (params) => api.get('/inbound', { params }),
  create: (data) => api.post('/inbound', data),
  update: (id, data) => api.put(`/inbound/${id}`, data),
  delete: (id) => api.delete(`/inbound/${id}`),
  getStats: () => api.get('/inbound/stats'),
};

export const orderAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  updateAttachment: (id, formData) => api.put(`/orders/${id}/attachment`, formData),
  delete: (id) => api.delete(`/orders/${id}`),
  getStats: () => api.get('/orders/stats'),
};

export const invoiceAPI = {
  getAll: (params) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  uploadFile: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/invoices/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  generateMonthly: (data) => api.post('/invoices/generate/monthly', data),
  generateBulk: (data) => api.post('/invoices/generate/bulk', data),
  generateFulfillment: (data) => api.post('/invoices/generate/fulfillment', data),
  // Payment methods
  recordPayment: (id, data) => api.post(`/invoices/${id}/payments`, data),
  getPayments: (id) => api.get(`/invoices/${id}/payments`),
  deletePayment: (invoiceId, paymentId) => api.delete(`/invoices/${invoiceId}/payments/${paymentId}`),
};

export const pricingAPI = {
  getAll: (params) => api.get('/pricing', { params }),
  getById: (id) => api.get(`/pricing/${id}`),
  getClientPricing: (clientId, params) => api.get(`/pricing/client/${clientId}`, { params }),
  create: (data) => api.post('/pricing', data),
  update: (id, data) => api.put(`/pricing/${id}`, data),
  delete: (id) => api.delete(`/pricing/${id}`),
};

export const contactAPI = {
  create: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  getById: (id) => api.get(`/contact/${id}`),
  update: (id, data) => api.put(`/contact/${id}`, data),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const paymentAPI = {
  getAll: (params) => api.get('/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  getInvoicePayments: (invoiceId) => api.get(`/payments/invoice/${invoiceId}`),
  record: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  delete: (id) => api.delete(`/payments/${id}`),
};

export const reportAPI = {
  getDashboard: (params) => api.get('/reports/dashboard', { params }),
  getInventory: (params) => api.get('/reports/inventory', { params }),
  getOrders: (params) => api.get('/reports/orders', { params }),
  getInbound: (params) => api.get('/reports/inbound', { params }),
  getClient: (clientId) => api.get(`/reports/client/${clientId}`),
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getStats: () => api.get('/notifications/stats'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export default api;
