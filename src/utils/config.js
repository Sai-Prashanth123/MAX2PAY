/**
 * Application Configuration
 * Centralized configuration for API URLs and backend endpoints
 */

// Backend API URL - defaults to port 5001 to match ENV_SETUP.md
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Backend base URL (without /api) for static file serving
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
  (import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'http://localhost:5001');

export { API_URL, BACKEND_URL };
