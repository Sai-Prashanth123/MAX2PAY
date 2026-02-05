/**
 * Application Configuration
 * Production URLs only - no localhost.
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://max-2-pay-backend.vercel.app/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'https://max-2-pay-backend.vercel.app');

export { API_URL, BACKEND_URL };
