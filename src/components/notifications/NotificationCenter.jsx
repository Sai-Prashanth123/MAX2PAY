import { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2, Package, AlertTriangle, FileText, Mail } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { notificationAPI } from '../../utils/api';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({ pendingOrders: 0, lowStock: 0, overdueInvoices: 0 });

  useEffect(() => {
    fetchNotifications();
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
    }, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data.data || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      // Silently fail - notifications are not critical
      console.error('Failed to fetch notifications:', error.message);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await notificationAPI.getStats();
      setStats(response.data.data || { pendingOrders: 0, lowStock: 0, overdueInvoices: 0 });
    } catch (error) {
      // Silently fail - stats are not critical
      console.error('Failed to fetch stats:', error.message);
      setStats({ pendingOrders: 0, lowStock: 0, overdueInvoices: 0 });
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationAPI.delete(id);
      fetchNotifications();
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <Package className="h-5 w-5 text-blue-600" />;
      case 'inventory': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'invoice': return <FileText className="h-5 w-5 text-green-600" />;
      case 'contact': return <Mail className="h-5 w-5 text-purple-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const totalAlerts = stats.pendingOrders + stats.lowStock + stats.overdueInvoices;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {totalAlerts > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {totalAlerts}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.pendingOrders}</div>
                <div className="text-xs text-gray-600">Pending Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
                <div className="text-xs text-gray-600">Low Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</div>
                <div className="text-xs text-gray-600">Overdue</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id || notification._id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(notification.createdAt || notification.created_at)}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex gap-1">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id || notification._id)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id || notification._id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
