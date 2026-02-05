import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { inboundAPI, productAPI, clientAPI } from '../utils/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const Inbound = () => {
  const [inboundLogs, setInboundLogs] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const generateReferenceNumber = () => {
    // Generate unique 6-digit reference number
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const refNumber = (timestamp.slice(-3) + random).slice(0, 6);
    return 'INB-' + refNumber;
  };

  const [formData, setFormData] = useState({
    clientId: '',
    productId: '',
    quantity: '',
    referenceNumber: generateReferenceNumber(),
    storageLocation: '',
    notes: '',
    status: 'received',
  });
  const [errors, setErrors] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Force clear any cached data on initial load
    setInboundLogs([]);
    fetchInboundLogs();
    fetchClients();
  }, []);

  const fetchInboundLogs = async () => {
    try {
      setLoading(true);
      const response = await inboundAPI.getAll({ limit: 100, _t: Date.now() });
      setInboundLogs(response.data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch inbound logs');
      setInboundLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll({ limit: 100 });
      setClients(response.data.data);
    } catch {
      console.error('Failed to fetch clients');
    }
  };

  const fetchProductsByClient = async (clientId) => {
    try {
      const response = await productAPI.getByClient(clientId);
      setProducts(response.data.data);
    } catch {
      console.error('Failed to fetch products');
    }
  };

  const validateQuantity = (value) => {
    const num = Number(value);
    if (!value || value === '') {
      return 'Quantity is required';
    }
    if (num <= 0) {
      return 'Quantity must be greater than 0';
    }
    if (!Number.isInteger(num)) {
      return 'Quantity must be a whole number';
    }
    return '';
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, quantity: value });
    
    const error = validateQuantity(value);
    setErrors({ ...errors, quantity: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const quantityError = validateQuantity(formData.quantity);
    if (quantityError) {
      setErrors({ ...errors, quantity: quantityError });
      toast.error('Please fix validation errors');
      return;
    }
    
    try {
      // Ensure quantity is sent as a number
      const submitData = {
        ...formData,
        quantity: parseInt(formData.quantity, 10)
      };
      
      await inboundAPI.create(submitData);
      toast.success('Inbound entry created successfully!', {
        duration: 3000,
        icon: '✅',
      });
      setIsModalOpen(false);
      resetForm();
      fetchInboundLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed', { duration: 5000 });
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;

    setDeleting(true);
    try {
      await inboundAPI.delete(deleteDialog.item.id || deleteDialog.item._id);
      toast.success('Inbound entry deleted successfully!', {
        duration: 3000,
        icon: '✅',
      });
      setDeleteDialog({ open: false, item: null });
      fetchInboundLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete inbound entry', { duration: 5000 });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, item: null });
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      productId: '',
      quantity: '',
      referenceNumber: generateReferenceNumber(),
      storageLocation: '',
      notes: '',
      status: 'received',
    });
    setProducts([]);
    setErrors({});
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: 'Reference #',
      accessor: 'referenceNumber',
    },
    {
      header: 'Client',
      render: (row) => row.clientId?.companyName || '-',
    },
    {
      header: 'Product',
      render: (row) => (
        <div>
          <div className="font-medium">{row.productId?.name}</div>
          <div className="text-sm text-gray-500">{row.productId?.sku}</div>
        </div>
      ),
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
    },
    {
      header: 'Location',
      accessor: 'storageLocation',
    },
    {
      header: 'Status',
      render: (row) => <Badge type="status">{row.status}</Badge>,
    },
    {
      header: 'Received Date',
      render: (row) => formatDate(row.receivedDate),
    },
    {
      header: 'Actions',
      render: (row) => (
        /* Mobile: Compact icon button (40px) for table context */
        <button
          onClick={() => handleDeleteClick(row)}
          className="h-10 w-10 flex items-center justify-center text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Inbound Entry"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inbound Shipments</h1>
        {/* Mobile: Compact button sizing (44px height) */}
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => fetchInboundLogs()}
            className="h-11 sm:h-12 text-sm sm:text-base px-4 py-2"
          >
            <RefreshCw size={18} className="sm:w-5 sm:h-5" /> 
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button 
            onClick={handleOpenModal}
            className="h-11 sm:h-12 text-sm sm:text-base px-4 py-2"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" /> Add Inbound Entry
          </Button>
        </div>
      </div>

      <Card>
        <Table 
          columns={columns} 
          data={inboundLogs} 
          loading={loading}
          emptyMessage="No inbound shipments found. Click 'Add Inbound Entry' to record a new shipment."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title="Add Inbound Entry"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Client"
            name="clientId"
            value={formData.clientId}
            onChange={(e) => {
              setFormData({ ...formData, clientId: e.target.value, productId: '' });
              fetchProductsByClient(e.target.value);
            }}
            options={clients.map(c => ({ value: c.id || c._id, label: c.companyName }))}
            required
          />
          <Select
            label="Product"
            name="productId"
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            options={products.map(p => ({ value: p.id || p._id, label: `${p.name} (${p.sku})` }))}
            required
            disabled={!formData.clientId}
          />
          <Input
            label="Quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleQuantityChange}
            error={errors.quantity}
            min="1"
            step="1"
            required
          />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'pending', label: 'Pending (Expected)' },
              { value: 'received', label: 'Received (In Stock)' }
            ]}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                name="referenceNumber"
                value={formData.referenceNumber}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-green-600 font-semibold">Auto-generated</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Unique 6-digit reference number generated automatically</p>
          </div>
          <Input
            label="Storage Location"
            name="storageLocation"
            value={formData.storageLocation}
            onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
            placeholder="e.g., Rack-1-Shelf-2"
            required
          />
          <Input
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Entry
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteDialog.open}
        onClose={handleDeleteCancel}
        title="Delete Inbound Entry - Confirmation Required"
        size="md"
      >
        {deleteDialog.item && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900">
                    Warning: Permanent Deletion
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    This action cannot be undone. This will permanently delete the inbound entry and remove all associated data.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Inbound entry to be deleted:</p>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">Reference: {deleteDialog.item.referenceNumber}</p>
                <p className="text-sm text-gray-600">Product: {deleteDialog.item.productId?.name}</p>
                <p className="text-sm text-gray-600">Quantity: {deleteDialog.item.quantity}</p>
                <p className="text-sm text-gray-600">Client: {deleteDialog.item.clientId?.companyName}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? 'Deleting...' : 'Delete Entry'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inbound;
