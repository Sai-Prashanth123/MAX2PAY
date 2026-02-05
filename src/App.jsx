import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Eager load public pages (above-fold, critical)
import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Lazy load other pages (code-splitting)
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ClientManagement = lazy(() => import('./pages/ClientManagement'));
const Products = lazy(() => import('./pages/Products'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Inbound = lazy(() => import('./pages/Inbound'));
const Orders = lazy(() => import('./pages/Orders'));
const CreateOrder = lazy(() => import('./pages/CreateOrder'));
const Invoices = lazy(() => import('./pages/Invoices'));
const PricingManagement = lazy(() => import('./pages/PricingManagement'));
const Profile = lazy(() => import('./pages/Profile'));
const TwoFactorSetup = lazy(() => import('./pages/TwoFactorSetup'));
const Logout = lazy(() => import('./pages/Logout'));
const ContactSubmissions = lazy(() => import('./pages/ContactSubmissions'));
const Support = lazy(() => import('./pages/Support'));
const InboundShipments = lazy(() => import('./pages/InboundShipments'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Component to prevent back navigation on refresh
const PreventBackNavigation = () => {
  useEffect(() => {
    // Prevent back navigation on page refresh
    window.history.pushState(null, '', window.location.href);
    
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PreventBackNavigation />
          <Toaster position="top-right" />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/logout" element={<Logout />} />

              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="clients" element={<ProtectedRoute allowedRoles={['admin']}><ClientManagement /></ProtectedRoute>} />
                <Route path="products" element={<ProtectedRoute allowedRoles={['admin']}><Products /></ProtectedRoute>} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="inbound" element={<ProtectedRoute allowedRoles={['admin', 'employee']}><Inbound /></ProtectedRoute>} />
                <Route path="inbound-shipments" element={<InboundShipments />} />
                {/* Orders routes - accessible to both admin and client with different views */}
                <Route path="orders" element={<Orders />} />
                <Route path="orders/create" element={<ProtectedRoute allowedRoles={['client']}><CreateOrder /></ProtectedRoute>} />
                <Route path="invoices" element={<Invoices />} />
                                <Route path="pricing" element={<ProtectedRoute allowedRoles={['admin']}><PricingManagement /></ProtectedRoute>} />
                                <Route path="contact-submissions" element={<ProtectedRoute allowedRoles={['admin']}><ContactSubmissions /></ProtectedRoute>} />
                                <Route path="profile" element={<Profile />} />
                <Route path="support" element={<Support />} />
                <Route path="2fa-setup" element={<TwoFactorSetup />} />
              </Route>
              {/* 404 fallback for any other route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
