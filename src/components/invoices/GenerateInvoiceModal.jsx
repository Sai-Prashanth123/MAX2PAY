import { useState, useEffect } from 'react';
import { X, FileText, Users, Calendar } from 'lucide-react';
import Button from '../common/Button';
import Select from '../common/Select';
import { clientAPI, invoiceAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const GenerateInvoiceModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState('single');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll({ limit: 100 });
      setClients(response.data.data);
    } catch {
      toast.error('Failed to load clients');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'single') {
        if (!formData.clientId) {
          toast.error('Please select a client');
          setLoading(false);
          return;
        }

        const response = await invoiceAPI.generateMonthly({
          clientId: formData.clientId,
          month: parseInt(formData.month),
          year: parseInt(formData.year)
        });

        // Check if invoice was rebuilt
        const wasRebuilt = response.data.meta?.rebuilt;
        const orderCount = response.data.meta?.orderCount;
        
        if (wasRebuilt) {
          toast.success(
            `🔄 ${response.data.message}`,
            {
              duration: 6000,
              icon: '✅',
              style: {
                background: '#f59e0b',
                color: 'white',
              }
            }
          );
        } else {
          toast.success(
            orderCount 
              ? `✅ Invoice generated with ${orderCount} order${orderCount > 1 ? 's' : ''}`
              : response.data.message,
            {
              duration: 4000,
              icon: '✅',
              style: {
                background: '#10b981',
                color: 'white',
              }
            }
          );
        }
        onSuccess();
        onClose();
      } else {
        const response = await invoiceAPI.generateBulk({
          month: parseInt(formData.month),
          year: parseInt(formData.year)
        });

        const { success, failed, skipped } = response.data.data;
        
        if (success.length > 0) {
          toast.success(
            `✅ Generated ${success.length} invoice${success.length > 1 ? 's' : ''} successfully!`,
            { 
              duration: 5000,
              style: {
                background: '#10b981',
                color: 'white',
              }
            }
          );
        }
        
        if (skipped.length > 0) {
          toast.info(
            `ℹ️ Skipped ${skipped.length} invoice${skipped.length > 1 ? 's' : ''} (no activity)`,
            { duration: 4000 }
          );
        }

        if (failed.length > 0) {
          toast.error(
            `❌ Failed to generate ${failed.length} invoice${failed.length > 1 ? 's' : ''}`,
            { duration: 6000 }
          );
          console.error('Failed invoices:', failed);
        }

        onSuccess();
        onClose();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to generate invoice';
      const errorCode = error.response?.data?.code;
      
      // Show specific error messages with appropriate styling
      if (errorCode === 'INVOICE_PAID') {
        toast.error(
          `🔒 ${errorMessage}`,
          { 
            duration: 6000,
            style: {
              background: '#ef4444',
              color: 'white',
            }
          }
        );
      } else {
        toast.error(errorMessage, { duration: 5000 });
      }
      
      console.error('Invoice generation error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scaleIn">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Generate Monthly Invoice</h3>
              <p className="text-sm text-gray-600">Create invoices for client activities</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === 'single'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Single Client
              </button>
              <button
                type="button"
                onClick={() => setMode('bulk')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === 'bulk'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                All Clients
              </button>
            </div>

            {mode === 'single' && (
              <Select
                name="clientId"
                label="Client"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                options={clients.map(c => ({ 
                  value: c._id, 
                  label: `${c.companyName} (${c._id.slice(-6).toUpperCase()})` 
                }))}
                required
                placeholder="Select a client"
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Select
                name="month"
                label="Month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                options={months}
                required
              />

              <Select
                name="year"
                label="Year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                options={years}
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Pricing Formula:</strong>
              </p>
              <div className="text-sm text-blue-700 mt-2 space-y-2">
                <p className="font-mono bg-white px-3 py-2 rounded border border-blue-300">
                  $2.50 + (units - 1) × $1.25 per order
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All orders are included</li>
                  <li>Based on total units per order</li>
                  <li>No tax applied</li>
                </ul>
              </div>
            </div>

            {mode === 'bulk' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This will generate invoices for all active clients with billable activities in the selected period.
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="secondary" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={loading}>
                <FileText className="h-4 w-4 mr-2" />
                {mode === 'single' ? 'Generate Invoice' : 'Generate All Invoices'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateInvoiceModal;
