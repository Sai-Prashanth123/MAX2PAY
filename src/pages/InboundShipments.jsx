import { useState, useEffect, useCallback } from 'react';
import { inboundAPI, productAPI } from '../utils/api';
import useAuth from '../context/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Package, Search, Filter, Download, Eye, Calendar, MapPin, FileText, Upload, CheckCircle, Clock, AlertCircle, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const InboundShipments = () => {
  const { user } = useAuth();
  const [inboundLogs, setInboundLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusChangeLog, setStatusChangeLog] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [rejectedQuantity, setRejectedQuantity] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [acceptedQuantity, setAcceptedQuantity] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [products, setProducts] = useState({});

  const fetchProductDetails = useCallback(async (productIds) => {
    const productMap = {};
    const fetchPromises = productIds.map(async (productId) => {
      if (productId) {
        try {
          const response = await productAPI.getById(productId);
          if (response.data.success && response.data.data) {
            productMap[productId] = response.data.data;
          }
        } catch {
          // Silently handle product fetch errors
        }
      }
    });
    
    await Promise.all(fetchPromises);
    if (Object.keys(productMap).length > 0) {
      setProducts(prevProducts => ({ ...prevProducts, ...productMap }));
    }
  }, []);

  const fetchInboundLogs = async () => {
    try {
      setLoading(true);
      const response = await inboundAPI.getAll({ limit: 1000, _t: Date.now() });
      const logs = response.data.data || [];
      console.log('[InboundShipments] Fetched logs:', logs);
      setInboundLogs(logs);
      
      // Extract all unique product IDs from logs
      const productIds = new Set();
      logs.forEach(log => {
        // Handle both object and string productId formats
        const productId = log.productId?.id || log.productId?.id || log.productId;
        if (productId && typeof productId === 'string') {
          productIds.add(productId);
        }
      });
      
      // Fetch product details for all unique product IDs
      if (productIds.size > 0) {
        await fetchProductDetails(Array.from(productIds));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch inbound shipments');
      setInboundLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch inbound logs only on initial mount
    fetchInboundLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh disabled to prevent rate limiting
  // Use the manual Refresh button instead

  const filterLogs = useCallback(() => {
    let filtered = [...inboundLogs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => {
        const refNum = log.referenceNumber?.toLowerCase() || '';
        const productId = log.productId?.id || log.productId?.id || log.productId;
        const product = productId ? products[productId] : null;
        const productName = product?.name?.toLowerCase() || '';
        const productSku = product?.sku?.toLowerCase() || '';
        return refNum.includes(query) || productName.includes(query) || productSku.includes(query);
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      
      filtered = filtered.filter(log => {
        if (!log.receivedDate) return false;
        const logDate = new Date(log.receivedDate);
        logDate.setHours(0, 0, 0, 0);
        
        switch (dateFilter) {
          case 'today':
            return logDate.getTime() === today.getTime();
          case 'week':
            return logDate >= weekAgo;
          case 'month':
            return logDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredLogs(filtered);
  }, [inboundLogs, searchQuery, statusFilter, dateFilter, products]);

  useEffect(() => {
    filterLogs();
  }, [filterLogs]);

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleStatusChange = (log) => {
    setStatusChangeLog(log);
    
    // Pre-fill existing values if editing a processed shipment
    if (['partial', 'rejected', 'returned', 'damaged'].includes(log.status)) {
      setNewStatus(log.status);
      setAcceptedQuantity(log.acceptedQuantity !== undefined && log.acceptedQuantity !== null ? log.acceptedQuantity : 0);
      setRejectedQuantity(log.rejectedQuantity !== undefined && log.rejectedQuantity !== null ? log.rejectedQuantity : log.quantity);
      setRejectionReason(log.rejectionReason || '');
    } else {
      setNewStatus('');
      setRejectedQuantity(0);
      setRejectionReason('');
      setAcceptedQuantity(log.quantity);
    }
    
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    // Validate partial acceptance
    if (newStatus === 'partial') {
      if (acceptedQuantity <= 0 || acceptedQuantity >= statusChangeLog.quantity) {
        toast.error('For partial acceptance, accepted quantity must be between 0 and total quantity');
        return;
      }
      if (!rejectionReason) {
        toast.error('Please provide a reason for partial acceptance');
        return;
      }
    }

    // Validate rejection/return/damage
    if (['rejected', 'returned', 'damaged'].includes(newStatus) && !rejectionReason) {
      toast.error('Please provide a reason for this status');
      return;
    }

    try {
      const updateData = {
        status: newStatus,
        notes: statusChangeLog.notes || ''
      };

      if (newStatus === 'partial') {
        updateData.acceptedQuantity = acceptedQuantity;
        updateData.rejectedQuantity = statusChangeLog.quantity - acceptedQuantity;
        updateData.rejectionReason = rejectionReason;
      } else if (['rejected', 'returned', 'damaged'].includes(newStatus)) {
        updateData.rejectedQuantity = statusChangeLog.quantity;
        updateData.rejectionReason = rejectionReason;
        updateData.acceptedQuantity = 0;
      }

      await inboundAPI.update(statusChangeLog.id || statusChangeLog._id, updateData);
      
      toast.success(`Shipment status updated to ${newStatus}`, {
        duration: 3000,
        icon: '✅',
      });
      
      setIsStatusModalOpen(false);
      fetchInboundLogs();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { type: 'warning', label: 'Pending' },
      'received': { type: 'success', label: 'Received' },
      'processing': { type: 'info', label: 'Processing' },
      'completed': { type: 'success', label: 'Completed' },
      'cancelled': { type: 'danger', label: 'Cancelled' },
      'rejected': { type: 'danger', label: 'Rejected' },
      'returned': { type: 'warning', label: 'Returned to Client' },
      'damaged': { type: 'danger', label: 'Damaged' },
      'partial': { type: 'info', label: 'Partially Accepted' },
    };
    const statusInfo = statusMap[status] || { type: 'default', label: status || 'Unknown' };
    return <Badge type={statusInfo.type}>{statusInfo.label}</Badge>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'received':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'returned':
        return <RotateCcw className="h-5 w-5 text-orange-500" />;
      case 'damaged':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'partial':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const columns = [
    {
      header: 'Reference Number',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{row.referenceNumber || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: 'Product',
      render: (row) => {
        // Handle both object and string productId formats
        const productId = row.productId?.id || row.productId?.id || row.productId;
        const product = productId ? products[productId] : null;
        return (
          <div>
            <p className="font-medium">{product?.name || 'Loading...'}</p>
            {product?.sku && (
              <p className="text-xs text-gray-500">SKU: {product.sku}</p>
            )}
            {!product && productId && (
              <p className="text-xs text-gray-400">Product ID: {productId.substring(0, 8)}...</p>
            )}
          </div>
        );
      },
    },
    {
      header: 'Quantity',
      render: (row) => {
        const showBreakdown = ['partial', 'rejected', 'returned', 'damaged'].includes(row.status);
        const acceptedQty = row.acceptedQuantity !== undefined && row.acceptedQuantity !== null 
          ? row.acceptedQuantity 
          : (row.status === 'received' ? row.quantity : 0);
        const rejectedQty = row.rejectedQuantity !== undefined && row.rejectedQuantity !== null 
          ? row.rejectedQuantity 
          : (showBreakdown ? row.quantity : 0);
        
        return showBreakdown ? (
          <div className="text-xs">
            <div className="font-semibold text-gray-900 mb-1">Total: {row.quantity || 0}</div>
            <div className="flex flex-col gap-0.5">
              <div className="text-green-700">{acceptedQty} accepted</div>
              <div className="text-red-700">{rejectedQty} {row.status === 'returned' ? 'returned' : row.status === 'damaged' ? 'damaged' : 'rejected'}</div>
            </div>
          </div>
        ) : (
          <span className="font-semibold">{row.quantity || 0}</span>
        );
      },
    },
    {
      header: 'Status',
      render: (row) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          {getStatusBadge(row.status)}
        </div>
      ),
    },
    {
      header: 'Received Date',
      render: (row) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          {row.receivedDate ? formatDate(row.receivedDate) : 'Not received'}
        </div>
      ),
    },
    {
      header: 'Location',
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          {row.storageLocation || 'Not assigned'}
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          {(user?.role === 'admin' || user?.role === 'employee') && row.status === 'pending' && (
            <button
              onClick={() => handleStatusChange(row)}
              className="text-green-600 hover:text-green-800 flex items-center gap-1"
              title="Change Status"
            >
              <CheckCircle size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const stats = {
    total: filteredLogs.length,
    pending: filteredLogs.filter(log => log.status === 'pending').length,
    received: filteredLogs.filter(log => log.status === 'received' || log.status === 'completed').length,
    thisMonth: filteredLogs.filter(log => {
      if (!log.receivedDate) return false;
      const logDate = new Date(log.receivedDate);
      const now = new Date();
      return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {user?.role === 'admin' || user?.role === 'employee' ? 'Inbound Shipments Management' : 'My Inbound Shipments'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'admin' || user?.role === 'employee' 
              ? 'View and manage inbound shipment statuses' 
              : 'Track and view your incoming inventory shipments'}
          </p>
        </div>
        <Button onClick={fetchInboundLogs} variant="secondary">
          <Package className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Received</p>
                <p className="text-2xl font-bold text-green-600">{stats.received}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">{stats.thisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by reference number, product name, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'received', label: 'Received' },
              { value: 'partial', label: 'Partially Accepted' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'returned', label: 'Returned to Client' },
              { value: 'damaged', label: 'Damaged' },
            ]}
          />
          <Select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Dates' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' },
            ]}
          />
        </div>
      </Card>

      {/* Inbound Logs Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredLogs}
          loading={loading}
          emptyMessage="No inbound shipments found. Contact your warehouse administrator to schedule an inbound shipment."
        />
      </Card>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <div className="pr-6">
            <div className="text-base md:text-lg font-semibold text-gray-900">
              Inbound Shipment Details
            </div>
            <div className="text-xs md:text-sm text-gray-500 mt-1">
              {selectedLog?.referenceNumber}
            </div>
          </div>
        }
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-6">
            {/* Status Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedLog.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    {getStatusBadge(selectedLog.status)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Reference Number</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.referenceNumber}</p>
                </div>
              </div>
              {/* Status Change Button for Admins */}
              {(user?.role === 'admin' || user?.role === 'employee') && selectedLog.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-blue-300">
                  <Button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleStatusChange(selectedLog);
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Change Status
                  </Button>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Product</p>
                <p className="font-medium text-gray-900">
                  {products[selectedLog.productId?.id || selectedLog.productId]?.name || 'Unknown Product'}
                </p>
                {products[selectedLog.productId?.id || selectedLog.productId]?.sku && (
                  <p className="text-xs text-gray-500 mt-1">
                    SKU: {products[selectedLog.productId?.id || selectedLog.productId].sku}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Quantity</p>
                <p className="text-2xl font-bold text-gray-900">{selectedLog.quantity || 0}</p>
              </div>
            </div>

            {/* Quantity Breakdown - Show for partial/rejected/returned/damaged */}
            {['partial', 'rejected', 'returned', 'damaged'].includes(selectedLog.status) && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="h-5 w-5 text-yellow-600" />
                    Quantity Breakdown
                  </h4>
                  {(user?.role === 'admin' || user?.role === 'employee') && (
                    <Button
                      onClick={() => {
                        setIsModalOpen(false);
                        handleStatusChange(selectedLog);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Edit Breakdown
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Total Shipped</p>
                    <p className="text-xl font-bold text-gray-900">{selectedLog.quantity || 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-300">
                    <p className="text-xs text-green-700 mb-1">Accepted to Inventory</p>
                    <p className="text-xl font-bold text-green-700">
                      {selectedLog.acceptedQuantity !== undefined && selectedLog.acceptedQuantity !== null 
                        ? selectedLog.acceptedQuantity 
                        : (selectedLog.status === 'received' ? selectedLog.quantity : 0)}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 border border-red-300">
                    <p className="text-xs text-red-700 mb-1">
                      {selectedLog.status === 'returned' ? 'Returned to Client' : 
                       selectedLog.status === 'damaged' ? 'Damaged' : 
                       'Rejected'}
                    </p>
                    <p className="text-xl font-bold text-red-700">
                      {selectedLog.rejectedQuantity !== undefined && selectedLog.rejectedQuantity !== null 
                        ? selectedLog.rejectedQuantity 
                        : (selectedLog.status !== 'received' ? selectedLog.quantity : 0)}
                    </p>
                  </div>
                </div>
                {selectedLog.rejectionReason && (
                  <div className="mt-3 pt-3 border-t border-yellow-200">
                    <p className="text-xs font-medium text-gray-700 mb-1">Reason:</p>
                    <p className="text-sm text-gray-600">{selectedLog.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}

            {/* Dates and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Received Date
                </p>
                <p className="font-medium text-gray-900">
                  {selectedLog.receivedDate ? formatDate(selectedLog.receivedDate) : 'Not received'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Storage Location
                </p>
                <p className="font-medium text-gray-900">
                  {selectedLog.storageLocation || 'Not assigned'}
                </p>
              </div>
            </div>

            {/* Notes */}
            {selectedLog.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Notes
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{selectedLog.notes}</p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <p>Created: {selectedLog.createdAt ? formatDate(selectedLog.createdAt) : 'N/A'}</p>
                </div>
                <div>
                  <p>Last Updated: {selectedLog.updatedAt ? formatDate(selectedLog.updatedAt) : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Change Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Change Shipment Status"
        size="lg"
      >
        {statusChangeLog && (
          <div className="space-y-6">
            {/* Current Shipment Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reference Number</p>
                  <p className="font-semibold text-gray-900">{statusChangeLog.referenceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Quantity</p>
                  <p className="text-2xl font-bold text-blue-600">{statusChangeLog.quantity}</p>
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status <span className="text-red-500">*</span>
              </label>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[
                  { value: '', label: 'Select status...' },
                  { value: 'received', label: 'Received - Accept all stock' },
                  { value: 'partial', label: 'Partial - Accept some, reject some' },
                  { value: 'rejected', label: 'Rejected - Quality issues' },
                  { value: 'damaged', label: 'Damaged - Stock damaged in transit' },
                  { value: 'returned', label: 'Returned - Send back to client' },
                ]}
                required
              />
            </div>

            {/* Partial Acceptance Fields */}
            {newStatus === 'partial' && (
              <div className="space-y-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">Partial Acceptance Details</h4>
                <Input
                  label="Accepted Quantity"
                  type="number"
                  value={acceptedQuantity}
                  onChange={(e) => setAcceptedQuantity(parseInt(e.target.value) || 0)}
                  min="1"
                  max={statusChangeLog.quantity - 1}
                  required
                  helperText={`Rejected: ${statusChangeLog.quantity - acceptedQuantity} units`}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Partial Acceptance <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="e.g., 10 units damaged, rest accepted"
                    required
                  />
                </div>
              </div>
            )}

            {/* Rejection/Return/Damage Reason */}
            {['rejected', 'returned', 'damaged'].includes(newStatus) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows="4"
                  placeholder={
                    newStatus === 'rejected' ? 'e.g., Quality issues, wrong product, expired' :
                    newStatus === 'damaged' ? 'e.g., Packaging damaged, product broken' :
                    'e.g., Client requested return, wrong shipment'
                  }
                  required
                />
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ All {statusChangeLog.quantity} units will be marked as {newStatus}. No inventory will be added.
                </p>
              </div>
            )}

            {/* Success Info */}
            {newStatus === 'received' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✅ All {statusChangeLog.quantity} units will be added to inventory at location: <strong>{statusChangeLog.storageLocation}</strong>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsStatusModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleStatusSubmit}
                disabled={!newStatus}
                className={!newStatus ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Update Status
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InboundShipments;
