import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import './styles/mobile-enhancements.css' // Temporarily disabled - needs refactoring
// import './styles/theme.css'
import App from './App.jsx'

// Clear any corrupted or stale Supabase session tokens on startup
try {
  const supabaseKeys = Object.keys(localStorage).filter(k => k.startsWith('sb-'));
  supabaseKeys.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // Validate token structure — remove if access_token is missing or undecodable
      if (parsed?.access_token) {
        const parts = parsed.access_token.split('.');
        if (parts.length !== 3) throw new Error('invalid jwt');
        JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      }
    } catch {
      localStorage.removeItem(key);
    }
  });
} catch {
  // If anything goes wrong, clear all supabase keys to recover
  Object.keys(localStorage).filter(k => k.startsWith('sb-')).forEach(k => localStorage.removeItem(k));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
