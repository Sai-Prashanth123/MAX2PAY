import { useState, useEffect } from 'react';
import { inventoryAPI } from '../utils/api';
import useAuth from '../context/useAuth';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import StatCard from '../components/common/StatCard';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import { Package, TrendingUp, TrendingDown, Warehouse, Trash2, RefreshCw } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import toast from 'react-hot-toast';

const Inventory = () => {
  const { user, isClient } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Force clear any cached data on initial load
    setInventory([]);
    setStats({ totalProducts: 0, availableStock: 0, reservedStock: 0 });
    fetchInventory();
    fetchStats();
  }, [user]);

  // Refresh data when page becomes visible (user switches tabs back)
  // This ensures clients see updated stock when admin makes changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Small delay to avoid rate limiting
        setTimeout(() => {
          fetchInventory();
          fetchStats();
        }, 500);
      }
    };

    // For clients, also add periodic refresh every 30 seconds to catch admin updates
    let refreshInterval = null;
    if (isClient) {
      refreshInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchInventory();
          fetchStats();
        }
      }, 30000); // Refresh every 30 seconds
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // Add timestamp to prevent caching and ensure fresh data
      const response = await inventoryAPI.getAll({ limit: 100, _t: Date.now() });
      
      // Axios wraps the response, so response.data is the actual API response
      // API returns: { success: true, count: X, data: [...] }
      const apiResponse = response?.data;
      
      if (apiResponse && apiResponse.success !== false) {
        const inventoryData = apiResponse.data || [];
        if (Array.isArray(inventoryData)) {
          // Ensure all stock values are properly formatted as numbers
          const formattedData = inventoryData.map(item => ({
            ...item,
            totalStock: Number(item.totalStock) || 0,
            availableStock: Number(item.availableStock) || 0,
            reservedStock: Number(item.reservedStock) || 0,
            dispatchedStock: Number(item.dispatchedStock) || 0
          }));
          console.log(`✅ Fetched ${formattedData.length} inventory items`);
          setInventory(formattedData);
        } else {
          console.error('❌ Inventory data is not an array:', inventoryData);
          toast.error('Invalid inventory data format');
          setInventory([]);
        }
      } else {
        const errorMsg = apiResponse?.message || 'Failed to fetch inventory';
        console.error('❌ Inventory fetch failed:', errorMsg);
        toast.error(errorMsg);
        setInventory([]);
      }
    } catch (error) {
      console.error('❌ Error fetching inventory:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to fetch inventory';
      console.error('Error details:', error.response?.data);
      toast.error(errorMsg);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await inventoryAPI.getStats({ _t: Date.now() });
      
      // Axios wraps the response, so response.data is the actual API response
      // API returns: { success: true, data: {...} }
      const apiResponse = response?.data;
      
      if (apiResponse && apiResponse.success !== false) {
        const statsData = apiResponse.data || { totalProducts: 0, availableStock: 0, reservedStock: 0 };
        // Ensure all stats are properly formatted as numbers
        const formattedStats = {
          totalProducts: Number(statsData.totalProducts) || 0,
          availableStock: Number(statsData.availableStock) || 0,
          reservedStock: Number(statsData.reservedStock) || 0,
          dispatchedStock: Number(statsData.dispatchedStock) || 0,
          totalStock: Number(statsData.totalStock) || 0
        };
        console.log('✅ Fetched stats:', formattedStats);
        setStats(formattedStats);
      } else {
        const errorMsg = apiResponse?.message || 'Failed to fetch stats';
        console.error('❌ Stats fetch failed:', errorMsg);
        setStats({ totalProducts: 0, availableStock: 0, reservedStock: 0, dispatchedStock: 0, totalStock: 0 });
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      console.error('Error details:', error.response?.data);
      setStats({ totalProducts: 0, availableStock: 0, reservedStock: 0, dispatchedStock: 0, totalStock: 0 });
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;

    setDeleting(true);
    try {
      await inventoryAPI.delete(deleteDialog.item.id || deleteDialog.item._id);
      toast.success('Inventory item deleted successfully!', {
        duration: 3000,
        icon: '✅',
      });
      setDeleteDialog({ open: false, item: null });
      fetchInventory();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete inventory item', { duration: 5000 });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, item: null });
  };

  const columns = [
    {
      header: 'Product',
      render: (row) => (
        <div>
          <div className="font-medium">{row.productId?.name || 'Unknown Product'}</div>
          <div className="text-sm text-gray-500">{row.productId?.sku || '-'}</div>
        </div>
      ),
    },
    ...(isClient ? [] : [{
      header: 'Client',
      render: (row) => row.clientId?.companyName || '-',
    }]),
    {
      header: 'Total Stock',
      render: (row) => formatNumber(row.totalStock),
    },
    {
      header: 'Available',
      render: (row) => (
        <span className="text-green-600 font-medium">{formatNumber(row.availableStock)}</span>
      ),
    },
    {
      header: 'Reserved',
      render: (row) => (
        <span className="text-yellow-600 font-medium">{formatNumber(row.reservedStock)}</span>
      ),
    },
    {
      header: 'Dispatched',
      render: (row) => (
        <span className="text-blue-600 font-medium">{formatNumber(row.dispatchedStock)}</span>
      ),
    },
    {
      header: 'Location',
      accessor: 'storageLocation',
    },
    // Only show Actions column for admin users (not clients)
    ...(isClient ? [] : [{
      header: 'Actions',
      render: (row) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDeleteClick(row)}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      ),
    }]),
  ];

  if (loading && !inventory.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <Button variant="secondary" onClick={() => { fetchInventory(); fetchStats(); }}>
          <RefreshCw size={20} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Products"
          value={formatNumber(stats?.totalProducts || 0)}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Available Stock"
          value={formatNumber(stats?.availableStock || 0)}
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Reserved Stock"
          value={formatNumber(stats?.reservedStock || 0)}
          icon={TrendingDown}
          color="yellow"
        />
      </div>

      <Card title="Inventory Details">
        <Table 
          columns={columns} 
          data={inventory} 
          loading={loading}
          emptyMessage="No inventory items found. Inventory will appear here once products are added and stock is received."
        />
      </Card>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Inventory Item"
        message={
          deleteDialog.item
            ? `Are you sure you want to delete inventory for "${deleteDialog.item.productId?.name}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default Inventory;
