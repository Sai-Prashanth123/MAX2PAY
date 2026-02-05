import { useState, useEffect } from 'react';
import { Mail, Phone, Building, Calendar, Eye, Trash2, MessageSquare } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { contactAPI } from '../utils/api';

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await contactAPI.getAll(params);
      setSubmissions(response.data.data || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch contact submissions';
      toast.error(errorMessage);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await contactAPI.update(id, { status: newStatus });
      toast.success('Status updated successfully');
      fetchSubmissions();
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update status';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      await contactAPI.delete(id);
      toast.success('Submission deleted successfully');
      fetchSubmissions();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete submission';
      toast.error(errorMessage);
    }
  };

  const getStatusBadgeType = (status) => {
    const types = {
      new: 'warning',
      read: 'info',
      responded: 'success',
      archived: 'default'
    };
    return types[status] || 'default';
  };

  const columns = [
    {
      header: 'Date',
      render: (row) => formatDate(row.created_at || row.createdAt),
    },
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Email',
      render: (row) => (
        <div className="flex items-center">
          <Mail size={14} className="mr-1 text-gray-400" />
          {row.email}
        </div>
      ),
    },
    {
      header: 'Company',
      render: (row) => row.company || '-',
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge type={getStatusBadgeType(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(row)}
            className="text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.id || row._id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const stats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    read: submissions.filter(s => s.status === 'read').length,
    responded: submissions.filter(s => s.status === 'responded').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
        <p className="text-gray-600 mt-1">View and manage contact form submissions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.new}</p>
            </div>
            <Mail className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Read</p>
              <p className="text-2xl font-bold text-blue-600">{stats.read}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Responded</p>
              <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Submissions</h2>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'new', label: 'New' },
                { value: 'read', label: 'Read' },
                { value: 'responded', label: 'Responded' },
                { value: 'archived', label: 'Archived' },
              ]}
              className="w-48"
            />
          </div>
        </div>
        <Table
          columns={columns}
          data={submissions}
          loading={loading}
          emptyMessage="No contact submissions found"
        />
      </Card>

      {selectedSubmission && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Contact Submission Details"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{selectedSubmission.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900 flex items-center">
                  <Mail size={14} className="mr-1" />
                  {selectedSubmission.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Company</label>
                <p className="text-gray-900 flex items-center">
                  <Building size={14} className="mr-1" />
                  {selectedSubmission.company || '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900 flex items-center">
                  <Phone size={14} className="mr-1" />
                  {selectedSubmission.phone || '-'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Submitted On</label>
              <p className="text-gray-900 flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(selectedSubmission.created_at || selectedSubmission.createdAt)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Message</label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded border border-gray-200 whitespace-pre-wrap">
                {selectedSubmission.message}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
              <Select
                value={selectedSubmission.status}
                onChange={(e) => handleStatusUpdate(selectedSubmission.id || selectedSubmission._id, e.target.value)}
                options={[
                  { value: 'new', label: 'New' },
                  { value: 'read', label: 'Read' },
                  { value: 'responded', label: 'Responded' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => window.location.href = `mailto:${selectedSubmission.email}`}
              >
                <Mail size={16} className="mr-2" />
                Reply via Email
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContactSubmissions;
