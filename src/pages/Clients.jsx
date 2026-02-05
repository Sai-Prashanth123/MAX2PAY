import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { clientAPI } from '../utils/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import toast from 'react-hot-toast';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [currentClient, setCurrentClient] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', zipCode: '', country: 'United States' },
    taxId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchClients();
  }, [pagination.page]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAll({ page: pagination.page, limit: 10 });
      
      // Handle response structure
      if (response.data && response.data.success !== false) {
        setClients(response.data.data || []);
        setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 });
      } else {
        // If API returns error in response.data
        setClients([]);
        setPagination({ page: 1, pages: 1, total: 0 });
        toast.error(response.data?.message || 'Failed to fetch clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
      setPagination({ page: 1, pages: 1, total: 0 });
      
      // More detailed error handling
      if (error.response?.status === 401) {
        toast.error('Please log in to view clients');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to view clients');
      } else {
      toast.error(error?.response?.data?.message || 'Failed to fetch clients');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);
    
    // Ensure address object is always present
    const submitData = {
      ...formData,
      address: formData.address || { street: '', city: '', state: '', zipCode: '', country: 'United States' }
    };

    try {
      if (currentClient) {
        await clientAPI.update(currentClient.id || currentClient._id, submitData);
        toast.success('Client updated successfully!', {
          duration: 3000,
          icon: '✅',
        });
      } else {
        await clientAPI.create(submitData);
        toast.success('Client created successfully!', {
          duration: 3000,
          icon: '✅',
        });
      }
      setIsModalOpen(false);
      resetForm();
      fetchClients();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Operation failed';
      const errorDetails = error.response?.data?.error || '';
      
      // Check if this is the address_city schema error
      if (errorMessage.includes('address_city') || errorDetails.includes('address_city')) {
        toast.error(
          <div className="space-y-2">
            <div className="font-semibold">Database Schema Error</div>
            <div className="text-sm">
              Address columns are missing. Please run the migration script:
              <br />
              <code className="bg-gray-100 px-2 py-1 rounded text-xs mt-1 inline-block">
                backend/scripts/addAddressColumnsToClients.sql
              </code>
              <br />
              <span className="text-xs text-gray-600 mt-1 block">
                Run this in Supabase SQL Editor to fix the issue.
              </span>
            </div>
          </div>,
          { duration: 10000 }
        );
      } else {
        toast.error(errorMessage);
      }
      
      // Try to extract field-level errors if available
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (client) => {
    setCurrentClient(client);
    setFormData({
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      address: client.address || { street: '', city: '', state: '', zipCode: '', country: 'United States' },
      taxId: client.taxId || '',
      isActive: client.isActive !== undefined ? client.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteConfirmation('');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation !== clientToDelete.companyName) {
      toast.error('Company name does not match. Please type the exact company name.');
      return;
    }

    try {
      await clientAPI.delete(clientToDelete.id || clientToDelete._id);
      toast.success('Client permanently deleted');
      setIsDeleteModalOpen(false);
      setClientToDelete(null);
      setDeleteConfirmation('');
      fetchClients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete client');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setClientToDelete(null);
    setDeleteConfirmation('');
  };

  const resetForm = () => {
    setCurrentClient(null);
    setFormErrors({});
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: { street: '', city: '', state: '', zipCode: '', country: 'United States' },
      taxId: '',
      isActive: true,
    });
  };

  const columns = [
    { header: 'Company Name', accessor: 'companyName' },
    { header: 'Contact Person', accessor: 'contactPerson' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Status',
      render: (row) => <Badge type="status">{row.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      header: 'Actions',
      render: (row) => (
        /* Mobile: Compact icon buttons (40px) for table context */
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(row)} 
            className="h-10 w-10 flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Client"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => handleDeleteClick(row)} 
            className="h-10 w-10 flex items-center justify-center text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors" 
            title="Delete Client"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        {/* Mobile: Compact button sizing (44px height) */}
        <Button 
          onClick={() => { resetForm(); setIsModalOpen(true); }} 
          icon={Plus}
          className="h-11 sm:h-12 text-sm sm:text-base px-4 py-2"
        >
          Add Company
        </Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          data={clients} 
          loading={loading}
          emptyMessage="No clients found. Click 'Add Company' to create your first client."
        />
        {pagination.pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
          />
        )}
      </Card>

      <Modal
        key={currentClient ? currentClient._id || currentClient.id : 'new-client'}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={currentClient ? 'Edit Client' : 'Add New Client'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, companyName: e.target.value }));
              if (formErrors.companyName) setFormErrors(prev => ({ ...prev, companyName: '' }));
            }}
            error={formErrors.companyName}
            required
          />
          <Input
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, contactPerson: e.target.value }));
              if (formErrors.contactPerson) setFormErrors(prev => ({ ...prev, contactPerson: '' }));
            }}
            error={formErrors.contactPerson}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, email: e.target.value }));
              if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
            }}
            error={formErrors.email}
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, phone: e.target.value }));
              if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
            }}
            error={formErrors.phone}
            required
          />
          <Input
            label="Tax ID"
            name="taxId"
            value={formData.taxId}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, taxId: e.target.value }));
              if (formErrors.taxId) setFormErrors(prev => ({ ...prev, taxId: '' }));
            }}
            error={formErrors.taxId}
          />
          {currentClient && (
            <Select
              label="Status"
              value={formData.isActive ? 'active' : 'inactive'}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          )}
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {currentClient ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                currentClient ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Delete Client - Confirmation Required"
        size="md"
      >
        {clientToDelete && (
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
                    This action cannot be undone. This will permanently delete the client and all associated data.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Client to be deleted:</p>
              <div>
                <p className="font-semibold text-gray-900">{clientToDelete.companyName}</p>
                <p className="text-sm text-gray-600">Contact: {clientToDelete.contactPerson}</p>
                <p className="text-sm text-gray-600">Email: {clientToDelete.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Type the company name <span className="font-bold text-red-600">"{clientToDelete.companyName}"</span> to confirm deletion:
              </label>
              <Input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Enter company name exactly"
                className="font-mono"
                autoFocus
              />
              {deleteConfirmation && deleteConfirmation !== clientToDelete.companyName && (
                <p className="text-xs text-red-600 mt-1">
                  ✗ Company name does not match
                </p>
              )}
              {deleteConfirmation === clientToDelete.companyName && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Company name matches
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmation !== clientToDelete.companyName}
                className={`${
                  deleteConfirmation !== clientToDelete.companyName
                    ? 'opacity-50 cursor-not-allowed bg-red-400'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Permanently Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Clients;
