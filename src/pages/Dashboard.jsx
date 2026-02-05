import { useEffect, useState, useCallback } from 'react';
import { Package, Users, Warehouse, ShoppingCart, TrendingUp, AlertCircle, Calendar, Download } from 'lucide-react';
import { reportAPI } from '../utils/api';
import useAuth from '../context/useAuth';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import OrderStatusChart from '../components/charts/OrderStatusChart';
import OrderTrendChart from '../components/charts/OrderTrendChart';
import InventoryChart from '../components/charts/InventoryChart';
import StockAlert from '../components/inventory/StockAlert';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { formatDate, formatNumber } from '../utils/helpers';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [chartData, setChartData] = useState({
    orderTrend: [],
    inventory: []
  });
  const [lowStockInventory, setLowStockInventory] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getDashboard({ dateRange });
      
      if (response.data && response.data.success !== false) {
        const data = response.data.data;
        setStats(data);
        
        // Use real data from API - format dates for charts
        let orderTrendData = data.orderTrend || [];
        if (orderTrendData.length > 0) {
          // Format dates for display
          orderTrendData = orderTrendData.map(item => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }));
        }
        
        const inventoryByCategory = data.inventoryByCategory || [];
        
        setChartData({
          orderTrend: orderTrendData,
          inventory: inventoryByCategory
        });

        // Set low stock inventory if available
        if (data.lowStockItems) {
          setLowStockInventory(data.lowStockItems);
        }
      } else {
        toast.error(response.data?.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleExportDashboard = (format) => {
    const exportData = [
      { metric: 'Total Clients', value: stats?.totalClients || 0 },
      { metric: 'Total Products', value: stats?.totalProducts || 0 },
      { metric: 'Total Stock', value: stats?.inventory?.totalStock || 0 },
      { metric: 'Available Stock', value: stats?.inventory?.availableStock || 0 }
    ];
    const columns = [
      { header: 'Metric', accessor: 'metric' },
      { header: 'Value', accessor: 'value' }
    ];
    if (format === 'pdf') {
      exportToPDF(exportData, columns, `Dashboard_${dateRange}`);
    } else {
      exportToExcel(exportData, columns, `Dashboard_${dateRange}`);
    }
    toast.success('Dashboard exported successfully');
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="animate-fadeIn flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SkeletonLoader type="card" lines={2} className="w-full md:w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} type="stat" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <SkeletonLoader type="chart" />
          <SkeletonLoader type="chart" />
        </div>
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="table" />
      </div>
    );
  }

  const orderColumns = [
    {
      header: 'Order Number',
      accessor: 'orderNumber',
    },
    {
      header: 'Client',
      render: (row) => row.clientId?.companyName || '-',
    },
    {
      header: 'Status',
      render: (row) => <Badge type="status">{row.status}</Badge>,
    },
    {
      header: 'Date',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="animate-fadeIn flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Here's what's happening with your warehouse today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setDateRange('7d')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                dateRange === '7d' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                dateRange === '30d' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateRange('90d')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                dateRange === '90d' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              90 Days
            </button>
          </div>
          <Button variant="outline" onClick={() => handleExportDashboard('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportDashboard('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stock Alerts */}
      {lowStockInventory.length > 0 && <StockAlert inventory={lowStockInventory} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isAdmin && (
          <StatCard
            title="Total Clients"
            value={formatNumber(stats?.totalClients || 0)}
            icon={Users}
            color="blue"
          />
        )}
        
        <StatCard
          title="Total Products"
          value={formatNumber(stats?.totalProducts || 0)}
          icon={Package}
          color="green"
        />
        
        <StatCard
          title="Total Stock"
          value={formatNumber(stats?.inventory?.totalStock || 0)}
          icon={Warehouse}
          color="purple"
        />
        
        <StatCard
          title="Available Stock"
          value={formatNumber(stats?.inventory?.availableStock || 0)}
          icon={TrendingUp}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card title="Inventory Overview by Category">
          <InventoryChart data={chartData.inventory} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card title="Recent Orders">
          <Table
            columns={orderColumns}
            data={stats?.recentOrders || []}
            emptyMessage="No recent orders"
          />
        </Card>
      </div>

      {stats?.inventory?.availableStock < 100 && (
        <Card>
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Low Stock Alert</h3>
              <p className="text-sm text-gray-600 mt-1">
                Some products are running low on stock. Please review your inventory.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
