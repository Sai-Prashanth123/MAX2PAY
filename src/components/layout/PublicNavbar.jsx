import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const PublicNavbar = ({ onLoginClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20 items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="3PL FAST" 
              className="h-8 w-auto md:h-10 md:w-auto"
            />
          </Link>
          <div className="hidden md:flex space-x-10 items-center">
            <Link
              to="/"
              className={`font-medium transition-colors text-sm uppercase tracking-wide ${
                isActive('/') ? 'text-primary-600 border-b-2 border-primary-600 pb-1' : 'text-slate-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`font-medium transition-colors text-sm uppercase tracking-wide ${
                isActive('/about') ? 'text-primary-600 border-b-2 border-primary-600 pb-1' : 'text-slate-700 hover:text-primary-600'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`font-medium transition-colors text-sm uppercase tracking-wide ${
                isActive('/contact') ? 'text-primary-600 border-b-2 border-primary-600 pb-1' : 'text-slate-700 hover:text-primary-600'
              }`}
            >
              Contact
            </Link>
            {onLoginClick ? (
              <button
                onClick={onLoginClick}
                className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
              >
                Login
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
              >
                Login
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center space-x-3">
            {onLoginClick ? (
              <button
                onClick={onLoginClick}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 text-sm font-medium"
              >
                Login
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 text-sm font-medium"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-slate-900 p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-medium transition-colors text-sm uppercase tracking-wide px-2 py-2 ${
                  isActive('/') ? 'text-primary-600 border-l-4 border-primary-600 pl-3' : 'text-slate-700 hover:text-primary-600'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-medium transition-colors text-sm uppercase tracking-wide px-2 py-2 ${
                  isActive('/about') ? 'text-primary-600 border-l-4 border-primary-600 pl-3' : 'text-slate-700 hover:text-primary-600'
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-medium transition-colors text-sm uppercase tracking-wide px-2 py-2 ${
                  isActive('/contact') ? 'text-primary-600 border-l-4 border-primary-600 pl-3' : 'text-slate-700 hover:text-primary-600'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
