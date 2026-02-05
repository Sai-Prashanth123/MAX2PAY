import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, FileText, Plus, Download, Filter, X, ExternalLink, Package } from 'lucide-react';
import { orderAPI, clientAPI } from '../utils/api';
import { BACKEND_URL } from '../utils/config';
import useAuth from '../context/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import AdvancedFilter from '../components/common/AdvancedFilter';
import BatchActions from '../components/common/BatchActions';
import OrderTimeline from '../components/orders/OrderTimeline';
import { formatDate } from '../utils/helpers';
import { exportToCSV } from '../utils/csvExport';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import toast from 'react-hot-toast';

const Orders = () => {
  const navigate = useNavigate();
  const { isAdmin, isClient } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({
    status: [],
    startDate: null,
    endDate: null,
    clientId: ''
  });
  const [clients, setClients] = useState([]);
  const [replacingPdf, setReplacingPdf] = useState(false);
  const [newPdfFile, setNewPdfFile] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = { limit: 1000 };
      if (filters.status && filters.status.length > 0) {
        params.status = filters.status.join(',');
      }
      if (filters.clientId) params.clientId = filters.clientId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      
      const response = await orderAPI.getAll(params);
      // Ensure attachmentUrl is properly included in order data
      const ordersData = Array.isArray(response.data.data) 
        ? response.data.data.map(order => {
            const attachmentUrl = order.attachmentUrl || order.attachment_url || null;
            // Normalize attachmentUrl - ensure it doesn't have double slashes
            const normalizedUrl = attachmentUrl 
              ? attachmentUrl.replace(/^\/+/, '').replace(/\/+/g, '/')
              : null;
            return {
              ...order,
              attachmentUrl: normalizedUrl
            };
          })
        : [];
      console.log('[Orders] Fetched orders:', ordersData.length, 'Orders with PDFs:', ordersData.filter(o => o.attachmentUrl).length);
      setOrders(ordersData);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchClients = useCallback(async () => {
    try {
      const response = await clientAPI.getAll({ limit: 100 });
      setClients(response.data.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    if (isAdmin) {
      fetchClients();
    }
  }, [fetchOrders, fetchClients, isAdmin]);

  const handleViewOrder = async (order) => {
    // Ensure attachmentUrl is included and normalized
    const attachmentUrl = order.attachmentUrl || order.attachment_url || null;
    const normalizedUrl = attachmentUrl 
      ? attachmentUrl.replace(/^\/+/, '').replace(/\/+/g, '/')
      : null;
    
    const orderWithAttachment = {
      ...order,
      attachmentUrl: normalizedUrl
    };
    
    console.log('[Orders] Viewing order:', order.orderNumber, 'Has PDF:', !!normalizedUrl, 'URL:', normalizedUrl);
    setSelectedOrder(orderWithAttachment);
    setStatusUpdate(order.status);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await orderAPI.updateStatus(selectedOrder.id || selectedOrder._id, { status: statusUpdate });
      toast.success('Order status updated successfully!', {
        duration: 3000,
        icon: '✅',
      });
      setIsModalOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status', { duration: 5000 });
    }
  };

  const handleReplacePdf = async () => {
    if (!newPdfFile) {
      toast.error('Please select a PDF file to upload');
      return;
    }

    if (newPdfFile.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    try {
      setReplacingPdf(true);
      const formData = new FormData();
      formData.append('attachment', newPdfFile);

      await orderAPI.updateAttachment(selectedOrder.id || selectedOrder._id, formData);
      
      toast.success('PDF replaced successfully!', {
        duration: 3000,
        icon: '✅',
      });
      
      setNewPdfFile(null);
      setIsModalOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to replace PDF', { duration: 5000 });
    } finally {
      setReplacingPdf(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleSelectOrder = (orderId) => {
    setSelectedIds(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(orders.map(order => order.id || order._id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = async (ids) => {
    try {
      await Promise.all(ids.map(id => orderAPI.delete(id)));
      toast.success(`Deleted ${ids.length} orders successfully!`, {
        duration: 3000,
        icon: '✅',
      });
      setSelectedIds([]);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete orders', { duration: 5000 });
    }
  };

  const handleBulkStatusUpdate = async (ids, status) => {
    try {
      await Promise.all(ids.map(id => orderAPI.updateStatus(id, { status })));
      toast.success(`Updated ${ids.length} orders to ${status}!`, {
        duration: 3000,
        icon: '✅',
      });
      setSelectedIds([]);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update orders', { duration: 5000 });
    }
  };

  const handleBulkExport = (ids, format = 'csv') => {
    const selectedOrders = orders.filter(order => ids.includes(order.id || order._id));
    const exportData = selectedOrders.map(order => ({
      'Order Number': order.orderNumber,
      'Client': order.clientId?.companyName || '',
      'Status': order.status,
      'Priority': order.priority,
      'Items Count': order.items?.length || 0,
      'Total Amount': order.totalAmount || order.total_amount || 0,
      'Created Date': formatDate(order.createdAt),
      'Notes': order.notes || ''
    }));
    
    const columns = [
      { header: 'Order Number', accessor: 'Order Number' },
      { header: 'Client', accessor: 'Client' },
      { header: 'Status', accessor: 'Status' },
      { header: 'Priority', accessor: 'Priority' },
      { header: 'Items Count', accessor: 'Items Count' },
      { header: 'Total Amount', accessor: 'Total Amount' },
      { header: 'Created Date', accessor: 'Created Date' },
      { header: 'Notes', accessor: 'Notes' }
    ];

    if (format === 'csv') {
      exportToCSV(exportData, columns, `Selected_Orders_${new Date().toISOString().split('T')[0]}`);
    } else if (format === 'excel') {
      exportToExcel(exportData, columns, 'Selected Orders');
    } else if (format === 'pdf') {
      exportToPDF(exportData, columns, 'Selected Orders');
    }
    toast.success(`Exported ${selectedOrders.length} orders as ${format.toUpperCase()}`);
  };

  const handleExport = (format) => {
    const exportData = orders.map(order => ({
      'Order Number': order.orderNumber,
      'Client': order.clientId?.companyName || '',
      'Status': order.status,
      'Priority': order.priority,
      'Created Date': formatDate(order.createdAt),
      'Notes': order.notes || ''
    }));
    
    const columns = [
      { header: 'Order Number', accessor: 'Order Number' },
      { header: 'Client', accessor: 'Client' },
      { header: 'Status', accessor: 'Status' },
      { header: 'Priority', accessor: 'Priority' },
      { header: 'Created Date', accessor: 'Created Date' },
      { header: 'Notes', accessor: 'Notes' }
    ];

    if (format === 'csv') {
      exportToCSV(exportData, `orders_${new Date().toISOString().split('T')[0]}.csv`);
    } else if (format === 'excel') {
      exportToExcel(exportData, columns, 'Orders Report');
    } else if (format === 'pdf') {
      exportToPDF(exportData, columns, 'Orders Report');
    }
    toast.success('Orders exported successfully');
  };

  // Build columns based on user role
  const baseColumns = [
    {
      header: 'Order Number',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.orderNumber}</span>
          {row.attachmentUrl && (
            <FileText 
              className="h-4 w-4 text-red-500" 
              title="PDF document attached"
            />
          )}
        </div>
      ),
    },
  ];

  // Add checkbox column only for admins
  const adminColumns = isAdmin ? [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedIds.length === orders.length && orders.length > 0}
          onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
          className="rounded border-gray-300"
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id || row._id)}
          onChange={() => toggleSelectOrder(row.id || row._id)}
          className="rounded border-gray-300"
        />
      ),
    },
    ...baseColumns,
    {
      header: 'Client',
      render: (row) => row.clientId?.companyName || '-',
    },
  ] : baseColumns;

  const columns = [
    ...adminColumns,
    {
      header: 'Quantity',
      render: (row) => {
        const totalQuantity = row.items?.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0) || 0;
        return (
          <div className="flex items-center gap-2">
            <span>{totalQuantity}</span>
            {totalQuantity === 0 && (
              <Badge type="warning" className="text-xs">
                No Items
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: 'Status',
      render: (row) => <Badge type="status">{row.status}</Badge>,
    },
    {
      header: 'Priority',
      render: (row) => <Badge type="priority">{row.priority}</Badge>,
    },
    {
      header: 'Created Date',
      render: (row) => formatDate(row.createdAt),
    },
    {
      header: 'Actions',
      render: (row) => (
        /* Mobile: Compact icon button (40px) for table context */
        <button
          onClick={() => handleViewOrder(row)}
          className="h-10 w-10 flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Order Details"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  if (loading && !orders.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'packed', label: 'Packed' },
    { value: 'dispatched', label: 'Dispatched' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const clientOptions = clients.map(client => ({
    value: client.id || client._id,
    label: client.companyName
  }));

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          {isAdmin ? 'Orders Management' : 'My Orders'}
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Create Order button - only for clients */}
          {isClient && (
          <Button
            onClick={(e) => {
              e.preventDefault();
                navigate('/orders/create');
            }}
            variant="primary"
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
          )}
          <div className="w-full sm:w-auto">
            <AdvancedFilter
              onFilterChange={handleFilterChange}
              onExport={handleExport}
              statusOptions={statusOptions}
              clientOptions={clientOptions}
              showDateRange={true}
              showStatus={true}
              showClient={isAdmin}
              showExport={isAdmin}
            />
          </div>
        </div>
      </div>

      <Card>
        <Table
          columns={columns}
          data={orders}
          loading={loading}
          emptyMessage={isClient ? "You haven't created any orders yet. Create your first order to get started!" : "No orders found. Try adjusting your filters."}
          emptyAction={isClient ? {
            label: 'Create Your First Order',
            onClick: () => navigate('/orders/create')
          } : null}
          searchable={true}
          sortable={true}
          paginated={true}
          itemsPerPage={15}
        />
      </Card>

      {/* Batch Actions - only for admins */}
      {isAdmin && (
      <BatchActions
        selectedItems={selectedIds}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        totalItems={orders.length}
        onBulkDelete={handleBulkDelete}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkExport={handleBulkExport}
        statusOptions={statusOptions}
      />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <div className="pr-6">
            <div className="text-base md:text-lg font-semibold text-gray-900 truncate">
              Order Details
            </div>
            <div className="text-xs md:text-sm text-gray-500 mt-1 truncate">
              {selectedOrder?.orderNumber}
            </div>
          </div>
        }
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4 md:space-y-6">
            {/* Order Timeline */}
            <OrderTimeline order={selectedOrder} />
            
            <div className="border-t pt-4"></div>
            
            {/* Order Lock Warning */}
            {selectedOrder.invoicedIn && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">
                    🔒 Order is locked by invoice {selectedOrder.invoicedIn}
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    This order represents a billed service and cannot be modified or cancelled.
                  </p>
                  <p className="text-xs text-red-700 mt-1 font-medium">
                    For returns, refunds, or adjustments → Use Credit Note workflow
                  </p>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-medium break-words">{selectedOrder.clientId?.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge type="status">{selectedOrder.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Priority</p>
                <Badge type="priority">{selectedOrder.priority}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created Date</p>
                <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-3 font-semibold">Order Items</p>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.productId?.imageUrl ? (
                          <img
                            src={`${BACKEND_URL}${item.productId.imageUrl}`}
                            alt={item.productId.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-300 bg-white"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-16 h-16 ${item.productId?.imageUrl ? 'hidden' : 'flex'} items-center justify-center bg-gray-200 rounded-lg`}>
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-gray-900 mb-1">
                          {item.productId?.name || 'Unknown Product'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">SKU:</span>
                            <span className="ml-2 font-medium text-gray-900">{item.productId?.sku || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Category:</span>
                            <span className="ml-2 font-medium text-gray-900">{item.productId?.category || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-2 font-bold text-blue-600">{item.quantity} units</span>
                          </div>
                          {item.stockLocation && (
                            <div>
                              <span className="text-gray-600">Stock Location:</span>
                              <span className="ml-2 font-medium text-gray-900">{item.stockLocation.location}</span>
                            </div>
                          )}
                          {item.stockLocation && (
                            <div>
                              <span className="text-gray-600">Available Stock:</span>
                              <span className="ml-2 font-medium text-green-600">{item.stockLocation.availableStock} units</span>
                            </div>
                          )}
                          {item.productId?.reorderLevel !== undefined && (
                            <div>
                              <span className="text-gray-600">Reorder Level:</span>
                              <span className="ml-2 font-medium text-gray-900">{item.productId.reorderLevel}</span>
                            </div>
                          )}
                        </div>
                        {item.productId?.description && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Description:</span> {item.productId.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PDF Document Section - Visible to all users */}
            <div>
              {selectedOrder.attachmentUrl ? (
              <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-500" />
                    PDF Document {isAdmin ? '(Sent by Client)' : '(Your Upload)'}
                  </p>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {selectedOrder.attachmentUrl.split('/').pop() || 'Order Document.pdf'}
                          </p>
                          <p className="text-xs text-gray-500">Shipping label document</p>
                        </div>
                  </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`${BACKEND_URL}/${selectedOrder.attachmentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                          <span className="text-sm font-medium">View PDF</span>
                        </a>
                        <a
                          href={`${BACKEND_URL}/${selectedOrder.attachmentUrl}`}
                          download
                          className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        >
                          <Download className="h-4 w-4" />
                          <span className="text-sm font-medium">Download</span>
                  </a>
                </div>
                    </div>

                    {/* Replace PDF Section - Only for clients with pending orders */}
                    {isClient && selectedOrder.status === 'pending' && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-yellow-600" />
                          Replace PDF (Before Admin Approval)
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setNewPdfFile(e.target.files[0])}
                            className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"
                          />
                          <Button
                            onClick={handleReplacePdf}
                            disabled={!newPdfFile || replacingPdf}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            {replacingPdf ? 'Replacing...' : 'Replace PDF'}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          You can replace the PDF only while the order is pending approval
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      No PDF document attached to this order
                    </p>
              </div>
            )}
            </div>

            {selectedOrder.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Notes</p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-700 break-words">{selectedOrder.notes}</p>
                </div>
              </div>
            )}

            {isAdmin && (
              <div>
                <Select
                  label="Update Status"
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  options={(() => {
                    // Only show valid next statuses based on current status
                    const validTransitions = {
                      'pending': [
                        { value: 'approved', label: 'Approved' },
                        { value: 'cancelled', label: 'Cancelled' }
                      ],
                      'approved': [
                        { value: 'packed', label: 'Packed' },
                        { value: 'dispatched', label: 'Dispatched' },
                        { value: 'cancelled', label: 'Cancelled' }
                      ],
                      'packed': [{ value: 'dispatched', label: 'Dispatched' }],
                      'dispatched': [], // Final state
                      'cancelled': [] // Final state
                    };
                    return validTransitions[selectedOrder.status] || [];
                  })()}
                  disabled={!!selectedOrder.invoicedIn || selectedOrder.status === 'dispatched' || selectedOrder.status === 'cancelled'}
                />
                {(selectedOrder.status === 'dispatched' || selectedOrder.status === 'cancelled') && (
                  <p className="text-xs text-gray-600 mt-2">
                    ℹ️ Order is in final state ({selectedOrder.status}). No further status changes allowed.
                  </p>
                )}
                {selectedOrder.invoicedIn && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ Invoiced orders cannot be modified. Use Credit Note workflow for adjustments.
                  </p>
                )}
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleStatusUpdate} 
                    variant="primary" 
                    className="w-full sm:w-auto"
                    disabled={!!selectedOrder.invoicedIn || selectedOrder.status === 'dispatched' || selectedOrder.status === 'cancelled'}
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
