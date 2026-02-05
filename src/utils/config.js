/**
 * Application Configuration
 * Production URLs only - no localhost.
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://max2pay-backend-chd6g3cccuejgabs.eastasia-01.azurewebsites.net/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'https://max2pay-backend-chd6g3cccuejgabs.eastasia-01.azurewebsites.net');

export { API_URL, BACKEND_URL };
