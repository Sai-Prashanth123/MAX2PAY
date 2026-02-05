import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Globe, Shield } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import axios from 'axios';
import toast from 'react-hot-toast';

const IPWhitelist = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    ip_address: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/security/ip-whitelist', {
        withCredentials: true
      });
      setEntries(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch IP whitelist');
      console.error('IP whitelist fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEntry) {
        await axios.put(`/api/security/ip-whitelist/${editingEntry.id}`, {
          description: formData.description,
          is_active: formData.is_active
        }, {
          withCredentials: true
        });
        toast.success('IP whitelist entry updated');
      } else {
        await axios.post('/api/security/ip-whitelist', formData, {
          withCredentials: true
        });
        toast.success('IP address added to whitelist');
      }
      
      fetchEntries();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save IP whitelist entry');
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      ip_address: entry.ip_address,
      description: entry.description || '',
      is_active: entry.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this IP address from the whitelist?')) {
      return;
    }

    try {
      await axios.delete(`/api/security/ip-whitelist/${id}`, {
        withCredentials: true
      });
      toast.success('IP address removed from whitelist');
      fetchEntries();
    } catch {
      toast.error('Failed to delete IP whitelist entry');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setFormData({
      ip_address: '',
      description: '',
      is_active: true
    });
  };

  const columns = [
    {
      header: 'IP Address',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-gray-400" />
          <span className="font-mono">{row.ip_address}</span>
        </div>
      )
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => row.description || <span className="text-gray-400">-</span>
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge type={row.is_active ? 'success' : 'default'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Added',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IP Whitelist Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Control which IP addresses can access your system
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add IP Address
        </Button>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">IP Whitelisting Status</h3>
            <p className="text-sm text-yellow-800 mt-1">
              IP whitelisting is currently <strong>disabled</strong>. To enable it, set 
              <code className="bg-yellow-100 px-1 rounded mx-1">IP_WHITELIST_ENABLED=true</code> 
              in your backend .env file and restart the server.
            </p>
            <p className="text-sm text-yellow-800 mt-2">
              <strong>Warning:</strong> When enabled, only IP addresses in this whitelist will be able to access the system.
              Make sure to add your current IP address before enabling!
            </p>
          </div>
        </div>
      </div>

      {/* IP Whitelist Table */}
      <Card>
        <Table
          columns={columns}
          data={entries}
          loading={loading}
          emptyMessage="No IP addresses in whitelist"
          searchable={true}
          sortable={true}
          paginated={true}
          itemsPerPage={20}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEntry ? 'Edit IP Whitelist Entry' : 'Add IP Address to Whitelist'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="IP Address"
            type="text"
            placeholder="192.168.1.100"
            value={formData.ip_address}
            onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
            required
            disabled={!!editingEntry}
            helperText={editingEntry ? 'IP address cannot be changed' : 'Enter IPv4 or IPv6 address'}
          />

          <Input
            label="Description"
            type="text"
            placeholder="Office network, Home IP, etc."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Active (allow access from this IP)
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingEntry ? 'Update' : 'Add'} IP Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default IPWhitelist;
