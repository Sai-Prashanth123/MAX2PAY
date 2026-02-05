import { format } from 'date-fns';

export const formatDate = (date, formatStr = 'MM/dd/yyyy') => {
  if (!date) return '-';
  return format(new Date(date), formatStr);
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return format(new Date(date), 'MM/dd/yyyy hh:mm a');
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    packed: 'bg-purple-100 text-purple-800',
    dispatched: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    received: 'bg-blue-100 text-blue-800',
    verified: 'bg-green-100 text-green-800',
    stored: 'bg-purple-100 text-purple-800',
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };
  return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

export const truncate = (str, length = 50) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const downloadCSV = (data, filename) => {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  // US phone format: (XXX) XXX-XXXX or XXX-XXX-XXXX
  const re = /^[+]?[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4,6}$/;
  return re.test(phone);
};

export const formatUSPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export const validateZipCode = (zip) => {
  // US ZIP code: XXXXX or XXXXX-XXXX
  const re = /^\d{5}(-\d{4})?$/;
  return re.test(zip);
};

export const calculateShippingFee = (totalWeight) => {
  // Weight-based shipping fee tiers
  const tiers = [
    { maxWeight: 5, fee: 2.50 },
    { maxWeight: 10, fee: 5.00 },
    { maxWeight: 20, fee: 8.50 },
    { maxWeight: 50, fee: 15.00 },
    { maxWeight: Infinity, fee: 25.00 }
  ];

  for (const tier of tiers) {
    if (totalWeight <= tier.maxWeight) {
      return tier.fee;
    }
  }
  return 25.00; // Default for very heavy items
};
