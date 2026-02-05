import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Warehouse,
  TrendingUp,
  ShoppingCart,
  FileText,
  PackageOpen,
  X,
  MessageSquare,
  ArrowDownCircle,
  HelpCircle,
} from 'lucide-react';
import useAuth from '../../context/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const adminLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clients', icon: Users, label: 'Clients' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/inventory', icon: Warehouse, label: 'Inventory' },
    { to: '/inbound', icon: TrendingUp, label: 'Inbound Entry' },
    { to: '/inbound-shipments', icon: ArrowDownCircle, label: 'Inbound Shipments' },
    { to: '/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/invoices', icon: FileText, label: 'Invoices' },
    { to: '/contact-submissions', icon: MessageSquare, label: 'Contact Inquiries' },
  ];

  const clientLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/inventory', icon: Warehouse, label: 'My Inventory' },
    { to: '/inbound-shipments', icon: ArrowDownCircle, label: 'Inbound Shipments' },
    { to: '/orders', icon: ShoppingCart, label: 'My Orders' },
    { to: '/orders/create', icon: PackageOpen, label: 'Create Order' },
    { to: '/invoices', icon: FileText, label: 'Invoices' },
    { to: '/support', icon: HelpCircle, label: 'Help & Support' },
  ];

  const links = isAdmin ? adminLinks : clientLinks;

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Responsive width and improved mobile UX */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 sm:w-64 bg-white border-r border-slate-200 min-h-screen shadow-xl md:shadow-none
          transform transition-transform duration-350 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile Close Button - Larger touch target */}
        <div className="md:hidden flex justify-end p-4 border-b border-slate-200">
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-all duration-200 touch-target focus-visible-ring"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-full">
          {/* Scrollable navigation area */}
          <div className="flex-1 overflow-y-auto py-4 md:py-6">
            <nav className="space-y-1 px-4">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => onClose && onClose()}
                    className={`sidebar-link ${active ? 'sidebar-link-active' : ''}`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                    <span className="truncate">{link.label}</span>
                    {active && (
                      <div className="ml-auto w-1 h-6 bg-primary-600 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
