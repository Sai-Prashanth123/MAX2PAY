import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import './styles/mobile-enhancements.css' // Temporarily disabled - needs refactoring
// import './styles/theme.css'
import App from './App.jsx'

// Clear old Supabase session tokens from previous project
const OLD_PROJECT_REF = 'taboklgtcpykicqufkha';
Object.keys(localStorage).forEach((key) => {
  if (key.includes(OLD_PROJECT_REF)) localStorage.removeItem(key);
});
Object.keys(sessionStorage).forEach((key) => {
  if (key.includes(OLD_PROJECT_REF)) sessionStorage.removeItem(key);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
