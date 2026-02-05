import { useState, useEffect } from 'react';
import { Activity, Clock, FileText, Package, ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuth from '../context/useAuth';

const UserActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    activityType: '',
    entityType: '',
    startDate: '',
    endDate: '',
    days: 30
  });

  useEffect(() => {
    fetchActivity();
    fetchStats();
  }, [filters]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.activityType) params.append('activityType', filters.activityType);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('limit', '100');

      const response = await axios.get(`/api/security/activity/me?${params}`, {
        withCredentials: true
      });

      setActivities(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch activity');
      console.error('Activity fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`/api/security/activity/${user.id}/stats?days=${filters.days}`, {
        withCredentials: true
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      'login': <Activity className="h-5 w-5" />,
      'logout': <Activity className="h-5 w-5" />,
      'create': <FileText className="h-5 w-5" />,
      'update': <FileText className="h-5 w-5" />,
      'delete': <FileText className="h-5 w-5" />,
      'view': <FileText className="h-5 w-5" />,
      'export': <FileText className="h-5 w-5" />,
      'order': <ShoppingCart className="h-5 w-5" />,
      'invoice': <DollarSign className="h-5 w-5" />,
      'product': <Package className="h-5 w-5" />,
      'client': <Users className="h-5 w-5" />
    };
    return iconMap[type.toLowerCase()] || <Activity className="h-5 w-5" />;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      'login': 'text-green-600 bg-green-100',
      'logout': 'text-gray-600 bg-gray-100',
      'create': 'text-blue-600 bg-blue-100',
      'update': 'text-yellow-600 bg-yellow-100',
      'delete': 'text-red-600 bg-red-100',
      'view': 'text-purple-600 bg-purple-100',
      'export': 'text-indigo-600 bg-indigo-100'
    };
    return colorMap[type.toLowerCase()] || 'text-gray-600 bg-gray-100';
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Activity Timeline</h1>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalActivities}</p>
                <p className="text-xs text-gray-500 mt-1">Last {filters.days} days</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {Object.entries(stats.activityByType || {}).slice(0, 3).map(([type, count], index) => (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`p-3 rounded-lg ${getActivityColor(type)}`}>
                  {getActivityIcon(type)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Activity Type"
            value={filters.activityType}
            onChange={(e) => setFilters({ ...filters, activityType: e.target.value })}
            options={[
              { value: '', label: 'All Types' },
              { value: 'login', label: 'Login' },
              { value: 'logout', label: 'Logout' },
              { value: 'create', label: 'Create' },
              { value: 'update', label: 'Update' },
              { value: 'delete', label: 'Delete' },
              { value: 'view', label: 'View' },
              { value: 'export', label: 'Export' }
            ]}
          />
          <Select
            label="Entity Type"
            value={filters.entityType}
            onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
            options={[
              { value: '', label: 'All Entities' },
              { value: 'order', label: 'Orders' },
              { value: 'invoice', label: 'Invoices' },
              { value: 'product', label: 'Products' },
              { value: 'client', label: 'Clients' },
              { value: 'inventory', label: 'Inventory' },
              { value: 'inbound', label: 'Inbound' }
            ]}
          />
          <Input
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
      </Card>

      {/* Activity Timeline */}
      <Card title="Recent Activity">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No activities found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.activity_type)}`}>
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      {activity.entity_type && (
                        <p className="text-sm text-gray-600 mt-1">
                          <Badge type="default" className="mr-2">{activity.entity_type}</Badge>
                          {activity.entity_id && (
                            <span className="text-xs text-gray-500">ID: {activity.entity_id.substring(0, 8)}...</span>
                          )}
                        </p>
                      )}
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            View details
                          </summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(activity.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600">{formatTimeAgo(activity.created_at)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                      {activity.ip_address && (
                        <p className="text-xs text-gray-500 font-mono mt-1">{activity.ip_address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserActivity;
