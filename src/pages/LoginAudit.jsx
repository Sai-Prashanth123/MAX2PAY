import { useState, useEffect } from 'react';
import { Calendar, MapPin, Monitor, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuth from '../context/useAuth';

const LoginAudit = () => {
  useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    twoFARequired: 0
  });

  useEffect(() => {
    fetchLoginAudit();
  }, [filters]);

  const fetchLoginAudit = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('limit', '100');

      const response = await axios.get(`/api/security/login-audit?${params}`, {
        withCredentials: true
      });

      const auditLogs = response.data.data || [];
      setLogs(auditLogs);

      // Calculate stats
      const stats = {
        total: auditLogs.length,
        successful: auditLogs.filter(log => log.login_status === 'success').length,
        failed: auditLogs.filter(log => log.login_status === 'failed').length,
        twoFARequired: auditLogs.filter(log => log.login_status === '2fa_required').length
      };
      setStats(stats);

    } catch (error) {
      toast.error('Failed to fetch login audit logs');
      console.error('Login audit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <Badge type="success">Success</Badge>;
      case 'failed':
        return <Badge type="danger">Failed</Badge>;
      case '2fa_required':
        return <Badge type="info">2FA Required</Badge>;
      case '2fa_failed':
        return <Badge type="warning">2FA Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
      case '2fa_failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case '2fa_required':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const columns = [
    {
      header: 'Status',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(row.login_status)}
          {getStatusBadge(row.login_status)}
        </div>
      )
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'IP Address',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="font-mono text-sm">{row.ip_address}</span>
        </div>
      )
    },
    {
      header: 'Device',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Monitor className="h-4 w-4 text-gray-400" />
          <span className="text-sm truncate max-w-xs" title={row.user_agent}>
            {row.user_agent?.substring(0, 50)}...
          </span>
        </div>
      )
    },
    {
      header: 'Date & Time',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {new Date(row.created_at).toLocaleString()}
          </span>
        </div>
      )
    },
    {
      header: 'Reason',
      render: (row) => row.failure_reason ? (
        <span className="text-sm text-red-600">{row.failure_reason}</span>
      ) : (
        <span className="text-sm text-gray-400">-</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Login Audit</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Monitor className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">2FA Required</p>
              <p className="text-2xl font-bold text-blue-600">{stats.twoFARequired}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'success', label: 'Success' },
              { value: 'failed', label: 'Failed' },
              { value: '2fa_required', label: '2FA Required' },
              { value: '2fa_failed', label: '2FA Failed' }
            ]}
          />
          <Input
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
      </Card>

      {/* Login Audit Table */}
      <Card title="Login History">
        <Table
          columns={columns}
          data={logs}
          loading={loading}
          emptyMessage="No login attempts found"
          searchable={false}
          sortable={false}
          paginated={true}
          itemsPerPage={20}
        />
      </Card>
    </div>
  );
};

export default LoginAudit;
