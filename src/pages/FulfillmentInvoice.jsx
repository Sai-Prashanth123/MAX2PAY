import { useState, useEffect } from 'react';
import { invoiceAPI, clientAPI } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import { getId } from '../utils/idHelper';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import DatePicker from '../components/common/DatePicker';
import Tooltip from '../components/common/Tooltip';
import { FileText, Download, DollarSign, Calendar, Package, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const FulfillmentInvoice = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    warehouse: 'Main Warehouse',
    startDate: null,
    endDate: null,
    ratePerOrder: '',
    advancePaid: 0
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll({ limit: 100 });
      setClients(response.data.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    }
  };

  // Simplified pricing: Fixed $2.50 per order (up to 5 lbs only)
  // No need to fetch client pricing anymore

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Simplified pricing - no need to fetch client pricing
  };

  const validateForm = () => {
    if (!formData.clientId) {
      toast.error('Please select a client');
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select date range');
      return false;
    }
    const start = formData.startDate instanceof Date ? formData.startDate : new Date(formData.startDate);
    const end = formData.endDate instanceof Date ? formData.endDate : new Date(formData.endDate);
    if (start > end) {
      toast.error('Start date must be before end date');
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Format dates to ISO string if they are Date objects
      const startDate = formData.startDate instanceof Date 
        ? formData.startDate.toISOString().split('T')[0]
        : formData.startDate;
      const endDate = formData.endDate instanceof Date
        ? formData.endDate.toISOString().split('T')[0]
        : formData.endDate;

      const response = await invoiceAPI.generateFulfillment({
        clientId: formData.clientId,
        warehouse: formData.warehouse,
        startDate: startDate,
        endDate: endDate,
        // ratePerOrder is ignored - backend always uses $2.50
        advancePaid: parseFloat(formData.advancePaid) || 0
      });

      setGeneratedInvoice(response.data.data);
      setShowPreview(true);
      toast.success('Invoice generated successfully!');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error(error.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // This will be implemented with the PDF generator
    toast.info('PDF download will be available soon');
  };

  const handleReset = () => {
    setFormData({
      clientId: '',
      warehouse: 'Main Warehouse',
      startDate: null,
      endDate: null,
      ratePerOrder: '',
      advancePaid: 0
    });
    setGeneratedInvoice(null);
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fulfillment Invoice Generator</h1>
            <p className="text-gray-600 mt-1">Generate invoices based on order fulfillment</p>
          </div>
          <Tooltip content="Generate invoices for order fulfillment services. Select a client, date range, and pricing. The system will calculate fees based on orders processed in that period.">
            <span className="sr-only">Help</span>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Invoice Details">
            <div className="space-y-4">
              <Select
                label="Client"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select a client' },
                  ...clients.map(c => ({ value: getId(c), label: c.companyName || c.company_name }))
                ]}
                required
              />

              <Input
                label="Warehouse"
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                placeholder="Main Warehouse"
              />

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  label="Start Date"
                  selected={formData.startDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                  maxDate={formData.endDate || new Date()}
                  required
                />

                <DatePicker
                  label="End Date"
                  selected={formData.endDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                  minDate={formData.startDate}
                  maxDate={new Date()}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="block text-sm font-semibold text-gray-700">Rate Per Order</label>
                    <Tooltip content="Pricing: $2.50 base + ($1.25 × (units - 1)) per order. Orders up to 5 lbs only." />
                  </div>
                  <Input
                    type="number"
                    name="ratePerOrder"
                    value="2.50"
                    readOnly
                    disabled
                    step="0.01"
                    icon={DollarSign}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    $2.50 base + $1.25 per additional unit (up to 5 lbs only)
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="block text-sm font-semibold text-gray-700">Advance Paid</label>
                    <Tooltip content="Any advance payment received from the client. This will be deducted from the total invoice amount." />
                  </div>
                  <Input
                    type="number"
                    name="advancePaid"
                    value={formData.advancePaid}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    icon={DollarSign}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleGenerate}
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card title="Quick Info">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Per-Order Pricing</p>
                  <p className="text-xs text-blue-700 mt-1">
                    $2.50 base + ($1.25 × (units - 1)) per order. Orders up to 5 lbs only.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Date Range</p>
                  <p className="text-xs text-green-700 mt-1">
                    Select the billing period for order fulfillment
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Advance Payment</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Record any advance payments received
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Auto-Calculate</p>
                  <p className="text-xs text-orange-700 mt-1">
                    System automatically calculates tax and balance
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Invoice Preview"
        size="large"
      >
        {generatedInvoice && (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">MAX2PAY</h2>
                  <p className="text-blue-100 mt-1">Fulfillment Invoice</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">Invoice Number</p>
                  <p className="text-xl font-bold">{generatedInvoice.invoiceNumber}</p>
                </div>
              </div>
            </div>

            {/* Client & Period Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Bill To:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900">
                    {generatedInvoice.clientId?.companyName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {generatedInvoice.clientId?.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Billing Period:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">From:</span> {formatDate(generatedInvoice.billingPeriod?.startDate)}
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    <span className="font-medium">To:</span> {formatDate(generatedInvoice.billingPeriod?.endDate)}
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    <span className="font-medium">Warehouse:</span> {generatedInvoice.warehouse}
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Order Fulfillment Services
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {generatedInvoice.orderCount} orders
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {formatCurrency(generatedInvoice.ratePerOrder)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(generatedInvoice.subtotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(generatedInvoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({generatedInvoice.taxRate}%):</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(generatedInvoice.taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-blue-600">
                    {formatCurrency(generatedInvoice.totalAmount)}
                  </span>
                </div>
                {generatedInvoice.advancePaid > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Advance Paid:</span>
                      <span className="font-medium">
                        -{formatCurrency(generatedInvoice.advancePaid)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span className="text-gray-900">Balance Due:</span>
                      <span className="text-orange-600">
                        {formatCurrency(generatedInvoice.balanceDue)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Due Date:</span> {formatDate(generatedInvoice.dueDate)}
              </p>
              <p className="text-sm text-blue-900 mt-1">
                <span className="font-semibold">Status:</span>{' '}
                <span className="capitalize">{generatedInvoice.status}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadPDF}
                variant="primary"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FulfillmentInvoice;
