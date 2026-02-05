import { useState } from 'react';
import { X, DollarSign, Calendar, CreditCard, FileText } from 'lucide-react';
import Button from '../common/Button';
import { invoiceAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const RecordPaymentModal = ({ isOpen, onClose, invoice, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    referenceNumber: '',
    notes: ''
  });

  if (!isOpen || !invoice) return null;

  const balanceDue = parseFloat(invoice.balance_due || invoice.balanceDue || (invoice.totalAmount - (invoice.paid_amount || invoice.paidAmount || 0)));
  const totalAmount = parseFloat(invoice.total_amount || invoice.totalAmount);
  const paidAmount = parseFloat(invoice.paid_amount || invoice.paidAmount || 0);
  const isPaid = invoice.status === 'paid';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentAmount = parseFloat(formData.amount);

      // Validation
      if (!paymentAmount || paymentAmount <= 0) {
        toast.error('Please enter a valid payment amount');
        setLoading(false);
        return;
      }

      if (paymentAmount > balanceDue) {
        toast.error(`Payment amount cannot exceed balance due ($${balanceDue.toFixed(2)})`);
        setLoading(false);
        return;
      }

      const response = await invoiceAPI.recordPayment(invoice.id || invoice._id, {
        amount: paymentAmount,
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod || undefined,
        referenceNumber: formData.referenceNumber || undefined,
        notes: formData.notes || undefined
      });

      const isFullyPaid = response.data.data.summary.fullyPaid;

      toast.success(
        isFullyPaid 
          ? `✅ Payment recorded! Invoice is now fully paid.`
          : `✅ Partial payment recorded. Balance: $${response.data.data.summary.balanceDue.toFixed(2)}`,
        {
          duration: 5000,
          icon: isFullyPaid ? '🎉' : '💰',
          style: {
            background: isFullyPaid ? '#10b981' : '#3b82f6',
            color: 'white',
          }
        }
      );

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: '',
        referenceNumber: '',
        notes: ''
      });

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to record payment';
      toast.error(errorMessage, { duration: 5000 });
      console.error('Payment error:', error.response?.data);
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

  const handleQuickAmount = (percentage) => {
    const amount = (balanceDue * percentage).toFixed(2);
    setFormData(prev => ({
      ...prev,
      amount: amount
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="text-green-600" size={24} />
              Record Payment
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Invoice: {invoice.invoice_number || invoice.invoiceNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Invoice Summary */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-lg font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-lg font-bold text-green-600">${paidAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance Due</p>
              <p className="text-lg font-bold text-red-600">${balanceDue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Payment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={18} className="text-gray-400" />
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                max={balanceDue}
                disabled={isPaid}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="0.00"
                required
              />
            </div>
            
            {/* Quick Amount Buttons */}
            {!isPaid && balanceDue > 0 && (
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleQuickAmount(0.25)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(0.50)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(0.75)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  75%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(1.0)}
                  className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors font-medium"
                >
                  Full Amount
                </button>
              </div>
            )}
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                disabled={isPaid}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard size={18} className="text-gray-400" />
              </div>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                disabled={isPaid}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select method...</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="wire">Wire Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Number
            </label>
            <input
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              disabled={isPaid}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Check #, Transaction ID, etc."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText size={18} className="text-gray-400" />
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                disabled={isPaid}
                rows={3}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Additional payment details..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || isPaid}
            >
              {loading ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>

        {/* Paid Invoice Notice */}
        {isPaid && (
          <div className="px-6 pb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">
                ✅ This invoice is fully paid. No additional payments can be recorded.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordPaymentModal;
