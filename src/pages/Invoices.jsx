import { useState, useEffect, useCallback } from 'react';
import { Eye, CheckCircle, FileText, Download, DollarSign } from 'lucide-react';
import { invoiceAPI, clientAPI } from '../utils/api';
import useAuth from '../context/useAuth';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import AdvancedFilter from '../components/common/AdvancedFilter';
import RecordPaymentModal from '../components/invoices/RecordPaymentModal';
import Tooltip from '../components/common/Tooltip';
import { formatDate, formatCurrency } from '../utils/helpers';
import { generateEnterprise3PLInvoicePDF } from '../utils/enterprise3PLInvoicePDF';
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/exportUtils';
import toast from 'react-hot-toast';

const Invoices = () => {
  const { isAdmin } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    startDate: null,
    endDate: null,
    clientId: ''
  });

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (filters.status && filters.status.length > 0) {
        params.status = filters.status;
      }
      if (filters.startDate) {
        params.startDate = filters.startDate.toISOString();
      }
      if (filters.endDate) {
        params.endDate = filters.endDate.toISOString();
      }
      if (filters.clientId) {
        params.clientId = filters.clientId;
      }

      const response = await invoiceAPI.getAll(params);
      setInvoices(response.data.data || []);
    } catch {
      toast.error('Failed to load invoices', { duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchClients = useCallback(async () => {
    try {
      const response = await clientAPI.getAll({ limit: 100 });
      setClients(response.data.data);
    } catch {
      console.error('Failed to fetch clients');
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
    if (isAdmin) {
      fetchClients();
    }
  }, [fetchInvoices, fetchClients, isAdmin]);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleDownloadPDF = (invoice) => {
    try {
      generateEnterprise3PLInvoicePDF(invoice);
      toast.success('Enterprise invoice PDF downloaded!', {
        duration: 3000,
        icon: '✅',
      });
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error('PDF generation error:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleExport = (format, data = invoices) => {
    const exportData = data.map(invoice => ({
      'Invoice Number': invoice.invoiceNumber,
      'Client': invoice.clientId?.companyName || '',
      'Type': invoice.type,
      'Amount': invoice.totalAmount,
      'Status': invoice.status,
      'Date': formatDate(invoice.createdAt),
      'Due Date': formatDate(invoice.dueDate)
    }));
    
    const columns = [
      { header: 'Invoice Number', accessor: 'Invoice Number' },
      { header: 'Client', accessor: 'Client' },
      { header: 'Type', accessor: 'Type' },
      { header: 'Amount', accessor: 'Amount' },
      { header: 'Status', accessor: 'Status' },
      { header: 'Date', accessor: 'Date' },
      { header: 'Due Date', accessor: 'Due Date' }
    ];

    if (format === 'csv') {
      exportToCSV(exportData, `invoices_${new Date().toISOString().split('T')[0]}.csv`);
    } else if (format === 'excel') {
      exportToExcel(exportData, columns, 'Invoices Report');
    } else if (format === 'pdf') {
      exportToPDF(exportData, columns, 'Invoices Report');
    }
    toast.success('Invoices exported successfully');
  };

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const clientOptions = clients.map(client => ({
    value: client.id || client._id,
    label: client.companyName
  }));

  const columns = [
    {
      header: 'Invoice Number',
      accessor: 'invoiceNumber',
    },
    {
      header: 'Client',
      render: (row) => {
        const clientName = row.clientId?.companyName;
        return clientName && clientName !== 'undefined' && clientName !== 'null' ? clientName : '-';
      },
    },
    {
      header: 'Type',
      render: (row) => (
        <Badge type={row.type === 'monthly' ? 'info' : 'default'}>
          {row.type === 'monthly' ? 'Monthly' : 'Outbound'}
        </Badge>
      ),
    },
    {
      header: 'Amount',
      render: (row) => formatCurrency(row.totalAmount),
    },
    {
      header: 'Status',
      render: (row) => <Badge type="status">{row.status}</Badge>,
    },
    {
      header: 'Date',
      render: (row) => formatDate(row.createdAt),
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleViewInvoice(row)}
          className="text-blue-600 hover:text-blue-800"
          title="View Details"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <Tooltip content="Invoices are automatically generated on the 1st of each month at 2:00 AM EST for all dispatched orders from the previous month.">
            <span className="sr-only">Help</span>
          </Tooltip>
        </div>
        <div className="flex gap-2 items-center">
          <AdvancedFilter
            onFilterChange={handleFilterChange}
            onExport={handleExport}
            statusOptions={statusOptions}
            clientOptions={clientOptions}
            showDateRange={true}
            showStatus={true}
            showClient={isAdmin}
            showExport={true}
          />
        </div>
      </div>

      <Card>
        <Table 
          columns={columns} 
          data={invoices} 
          loading={loading}
          emptyMessage="No invoices found. Invoices are automatically generated monthly on the 1st of each month."
          emptyAction={null}
          searchable={true}
          sortable={true}
          paginated={true}
          itemsPerPage={10}
        />
      </Card>

      {/* Invoice Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Invoice Details - ${selectedInvoice?.invoiceNumber}`}
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold text-lg">{selectedInvoice.clientId?.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge type="status">{selectedInvoice.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Invoice Date</p>
                <p className="font-medium">{formatDate(selectedInvoice.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-medium">{formatDate(selectedInvoice.dueDate)}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="grid grid-cols-3 gap-4 py-4 bg-gray-50 rounded-lg px-4">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-bold text-lg text-gray-900">{formatCurrency(selectedInvoice.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid Amount</p>
                <p className="font-bold text-lg text-green-600">
                  {formatCurrency(selectedInvoice.paidAmount || selectedInvoice.paid_amount || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Balance Due</p>
                <p className="font-bold text-lg text-red-600">
                  {formatCurrency(
                    selectedInvoice.balanceDue ?? 
                    selectedInvoice.balance_due ?? 
                    (selectedInvoice.totalAmount - (selectedInvoice.paidAmount || selectedInvoice.paid_amount || 0))
                  )}
                </p>
              </div>
            </div>

            {/* Line Items */}
            {selectedInvoice.lineItems && selectedInvoice.lineItems.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Invoice Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedInvoice.lineItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Amount Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Amount Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(selectedInvoice.subtotal || selectedInvoice.amount)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-bold text-lg text-blue-600">
                    {formatCurrency(selectedInvoice.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedInvoice.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Notes</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedInvoice.notes}</p>
              </div>
            )}

            {/* Payment Info */}
            {selectedInvoice.paidDate && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  <CheckCircle size={16} className="inline mr-2" />
                  Paid on {formatDate(selectedInvoice.paidDate)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleDownloadPDF(selectedInvoice)} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download size={18} />
                  Download PDF
                </Button>
                {isAdmin && (
                  <Button 
                    onClick={() => {
                      setIsPaymentModalOpen(true);
                    }} 
                    variant="primary"
                    disabled={selectedInvoice.status === 'paid'}
                  >
                    <DollarSign size={18} className="mr-2" />
                    {selectedInvoice.status === 'paid' ? 'Fully Paid' : 'Record Payment'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={selectedInvoice}
        onSuccess={() => {
          fetchInvoices();
          // Refresh the selected invoice to show updated payment info
          if (selectedInvoice) {
            invoiceAPI.getById(selectedInvoice.id || selectedInvoice._id)
              .then(response => setSelectedInvoice(response.data.data))
              .catch(err => console.error('Failed to refresh invoice:', err));
          }
        }}
      />
    </div>
  );
};

export default Invoices;
