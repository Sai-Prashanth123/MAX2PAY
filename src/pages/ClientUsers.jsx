import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Key, Search } from 'lucide-react';
import { clientUserAPI, clientAPI } from '../utils/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import toast from 'react-hot-toast';

const ClientUsers = () => {
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClient, setFilterClient] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    clientId: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchClients();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await clientUserAPI.getAll();
      setUsers(response.data.data);
    } catch {
      toast.error('Failed to fetch client users');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll({ limit: 100 });
      setClients(response.data.data);
    } catch {
      toast.error('Failed to fetch clients');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingUser) {
        await clientUserAPI.update(editingUser.id || editingUser._id, {
          name: formData.name,
          phone: formData.phone,
          isActive: formData.isActive,
        });
        toast.success('Client user updated successfully!', {
          duration: 3000,
          icon: '✅',
        });
      } else {
        await clientUserAPI.create(formData);
        toast.success('Client user created successfully!', {
          duration: 3000,
          icon: '✅',
        });
      }
      
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed', { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await clientUserAPI.resetPassword(selectedUserId, {
        newPassword: passwordData.newPassword,
      });
      toast.success('Password reset successfully!', {
        duration: 3000,
        icon: '✅',
      });
      setShowPasswordModal(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed', { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client user?')) {
      return;
    }

    try {
      await clientUserAPI.delete(id);
      toast.success('Client user deleted successfully!', {
        duration: 3000,
        icon: '✅',
      });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete client user', { duration: 5000 });
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      clientId: user.clientId?.id || user.clientId?._id || user.clientId || '',
      phone: user.phone || '',
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
    setShowModal(true);
  };

  const openPasswordModal = (userId) => {
    setSelectedUserId(userId);
    setShowPasswordModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      clientId: '',
      phone: '',
    });
    setEditingUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = !filterClient || user.clientId?._id === filterClient;
    return matchesSearch && matchesClient;
  });

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Client',
      render: (row) => row.clientId?.companyName || 'N/A',
    },
    {
      header: 'Phone',
      accessor: 'phone',
      render: (row) => row.phone || 'N/A',
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge type={row.isActive ? 'success' : 'danger'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openEditModal(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => openPasswordModal(row._id || row.id)}
            className="text-green-600 hover:text-green-800"
            title="Reset Password"
          >
            <Key size={18} />
          </button>
          <button
            onClick={() => handleDelete(row._id || row.id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
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
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={18} /> Add User Account
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <Select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            options={[
              { value: '', label: 'All Clients' },
              ...clients.map(client => ({
                value: client.id || client._id,
                label: client.companyName
              }))
            ]}
          />
        </div>

        <Table
          columns={columns}
          data={filteredUsers}
          loading={loading}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingUser ? 'Edit Client User' : 'Add Client User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          {!editingUser && (
            <>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimum 6 characters"
              />
            </>
          )}

          <Select
            label="Client"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Client' },
              ...clients.map(client => ({
                value: client._id,
                label: client.companyName
              }))
            ]}
            required
            disabled={editingUser}
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          {editingUser && (
            <Select
              label="Status"
              name="isActive"
              value={formData.isActive}
              onChange={handleChange}
              options={[
                { value: true, label: 'Active' },
                { value: false, label: 'Inactive' }
              ]}
            />
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordData({ newPassword: '', confirmPassword: '' });
        }}
        title="Reset Password"
      >
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
            placeholder="Minimum 6 characters"
          />
          
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            required
            placeholder="Re-enter password"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({ newPassword: '', confirmPassword: '' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Reset Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClientUsers;
