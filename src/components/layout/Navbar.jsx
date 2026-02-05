import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import NotificationCenter from '../notifications/NotificationCenter';

const Navbar = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    console.log('handleLogout called');
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    console.log('confirmLogout called');
    setShowLogoutConfirm(false);
    setIsOpen(false);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center min-w-0">
            <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">
              <img 
                src="/logo.png" 
                alt="3PL FAST" 
                className="h-7 sm:h-8 w-auto"
              />
            </Link>
          </div>

          {isAuthenticated && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={20} />
                  <span className="font-medium">{user?.name}</span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {user?.role}
                  </span>
                </div>
                <NotificationCenter />
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1 transition-all"
                    aria-label="User menu"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    id="user-menu-button"
                  >
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {isOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
                        role="menuitem"
                        tabIndex={0}
                      >
                        <User size={16} className="mr-3" />
                        My Profile
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                        role="menuitem"
                        tabIndex={0}
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Navigation - MOBILE STANDARD: 44x44px touch targets */}
              <div className="md:hidden flex items-center space-x-2">
                <NotificationCenter />
                <button
                  onClick={onMenuClick}
                  className="text-gray-700 hover:text-gray-900 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation active:scale-[0.97]"
                  aria-label="Toggle menu"
                  aria-expanded={false}
                >
                  <Menu size={22} />
                </button>
                {/* MOBILE STANDARD: 44x44px container with 32x32px avatar */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation active:scale-[0.97] transition-transform"
                  aria-label="User menu"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <span className="text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile User Menu - Optimized for touch */}
      {isOpen && isAuthenticated && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50 relative z-40">
          <div className="px-4 py-4 space-y-3">
            {/* User Info Card */}
            <div className="flex items-center space-x-3 text-gray-700 bg-white p-3 rounded-lg shadow-sm">
              <User size={20} aria-hidden="true" className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex-shrink-0">
                {user?.role}
              </span>
            </div>
            
            {/* Profile Link - Touch-friendly */}
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-colors touch-manipulation active:scale-95"
            >
              <User className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              My Profile
            </Link>
            
            {/* Logout Button - Touch-friendly */}
            <button
              type="button"
              onTouchStart={() => console.log('Touch started on logout button')}
              onClick={async (e) => {
                console.log('Mobile logout button clicked');
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
                try {
                  await logout();
                  console.log('Logout successful, navigating...');
                  navigate('/login', { replace: true });
                } catch (error) {
                  console.error('Mobile logout error:', error);
                }
              }}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
              style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0.1)' }}
              aria-label="Logout"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto animate-fadeIn">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
              onClick={() => setShowLogoutConfirm(false)}
              aria-hidden="true"
            ></div>
            
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scaleIn">
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Confirm Logout
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Are you sure you want to logout? You'll need to login again to access your account.
                </p>
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="btn btn-outline w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmLogout}
                    className="btn btn-danger w-full sm:w-auto"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
