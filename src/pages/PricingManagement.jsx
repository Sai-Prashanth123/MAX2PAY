import { useState, useEffect } from 'react';
import { pricingAPI, clientAPI } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { Plus, Edit2, Trash2, DollarSign, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const PricingManagement = () => {
  const [pricingList, setPricingList] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [formData, setFormData] = useState({
    clientId: '',
    warehouse: 'Main Warehouse',
    ratePerOrder: 2.25,
    effectiveFrom: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pricingResponse, clientsResponse] = await Promise.all([
        pricingAPI.getAll(),
        clientAPI.getAll({ limit: 100 })
      ]);
      setPricingList(pricingResponse.data.data);
      setClients(clientsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load pricing data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPricing) {
        await pricingAPI.update(editingPricing.id || editingPricing._id, {
          ratePerOrder: parseFloat(formData.ratePerOrder),
          notes: formData.notes
        });
        toast.success('Pricing updated successfully!', {
          duration: 3000,
          icon: '✅',
        });
      } else {
        await pricingAPI.create({
          clientId: formData.clientId,
          warehouse: formData.warehouse,
          ratePerOrder: parseFloat(formData.ratePerOrder),
          effectiveFrom: formData.effectiveFrom,
          notes: formData.notes
        });
        toast.success('Pricing created successfully!', {
          duration: 3000,
          icon: '✅',
        });
      }
      
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error(error.response?.data?.message || 'Failed to save pricing', { duration: 5000 });
    }
  };

  const handleEdit = (pricing) => {
    setEditingPricing(pricing);
    setFormData({
      clientId: pricing.clientId?.id || pricing.clientId?._id || pricing.clientId || '',
      warehouse: pricing.warehouse,
      ratePerOrder: pricing.ratePerOrder,
      effectiveFrom: new Date(pricing.effectiveFrom).toISOString().split('T')[0],
      notes: pricing.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this pricing?')) return;

    try {
      await pricingAPI.delete(id);
      toast.success('Pricing deactivated successfully!', {
        duration: 3000,
        icon: '✅',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting pricing:', error);
      toast.error(error.response?.data?.message || 'Failed to deactivate pricing', { duration: 5000 });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPricing(null);
    setFormData({
      clientId: '',
      warehouse: 'Main Warehouse',
      ratePerOrder: 2.25,
      effectiveFrom: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600 mt-1">Manage per-order pricing for clients and warehouses</p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Pricing
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate Per Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pricingList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No pricing configured yet. Add your first pricing rule.
                  </td>
                </tr>
              ) : (
                pricingList.map((pricing) => (
                  <tr key={pricing.id || pricing._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pricing.clientId?.companyName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pricing.clientId?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pricing.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-semibold text-green-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatCurrency(pricing.ratePerOrder)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(pricing.effectiveFrom)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pricing.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pricing.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(pricing)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pricing.id || pricing._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingPricing ? 'Edit Pricing' : 'Add New Pricing'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Client"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select a client' },
              ...clients.map(c => ({ value: c.id || c._id, label: c.companyName }))
            ]}
            required
            disabled={!!editingPricing}
          />

          <Input
            label="Warehouse"
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
            placeholder="Main Warehouse"
            disabled={!!editingPricing}
          />

          <Input
            label="Rate Per Order"
            type="number"
            name="ratePerOrder"
            value={formData.ratePerOrder}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            icon={DollarSign}
          />

          <Input
            label="Effective From"
            type="date"
            name="effectiveFrom"
            value={formData.effectiveFrom}
            onChange={handleChange}
            required
            disabled={!!editingPricing}
            icon={Calendar}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional notes about this pricing..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingPricing ? 'Update Pricing' : 'Create Pricing'}
            </Button>
            <Button type="button" onClick={handleCloseModal} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PricingManagement;
