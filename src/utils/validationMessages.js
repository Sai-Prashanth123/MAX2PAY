/**
 * Validation Error Messages
 * Centralized, consistent error messages for all form validations
 */

export const validationMessages = {
  // Required field errors
  required: {
    email: 'Email address is required',
    password: 'Password is required',
    name: 'Name is required',
    phone: 'Phone number is required',
    companyName: 'Company name is required',
    address: 'Address is required',
    city: 'City is required',
    state: 'State is required',
    zipCode: 'ZIP code is required',
    country: 'Country is required',
    role: 'Role selection is required',
    client: 'Client selection is required',
    product: 'Product selection is required',
    quantity: 'Quantity is required',
    rate: 'Rate is required',
    date: 'Date is required',
    startDate: 'Start date is required',
    endDate: 'End date is required',
    invoiceNumber: 'Invoice number is required',
    orderNumber: 'Order number is required',
    sku: 'SKU is required',
    description: 'Description is required',
    amount: 'Amount is required',
    status: 'Status is required',
    default: 'This field is required'
  },

  // Format errors
  format: {
    email: 'Please enter a valid email address (e.g., user@example.com)',
    phone: 'Please enter a valid phone number (e.g., (555) 123-4567)',
    zipCode: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)',
    url: 'Please enter a valid URL (e.g., https://example.com)',
    number: 'Please enter a valid number',
    integer: 'Please enter a whole number',
    decimal: 'Please enter a valid decimal number',
    date: 'Please enter a valid date',
    time: 'Please enter a valid time'
  },

  // Length errors
  length: {
    password: {
      min: 'Password must be at least 6 characters long',
      max: 'Password cannot exceed 50 characters'
    },
    name: {
      min: 'Name must be at least 2 characters long',
      max: 'Name cannot exceed 100 characters'
    },
    companyName: {
      min: 'Company name must be at least 2 characters long',
      max: 'Company name cannot exceed 100 characters'
    },
    phone: {
      min: 'Phone number must be at least 10 digits',
      max: 'Phone number cannot exceed 15 digits'
    },
    zipCode: {
      min: 'ZIP code must be at least 5 digits',
      max: 'ZIP code cannot exceed 10 characters'
    },
    description: {
      max: 'Description cannot exceed 500 characters'
    },
    notes: {
      max: 'Notes cannot exceed 1000 characters'
    }
  },

  // Range errors
  range: {
    quantity: {
      min: 'Quantity must be at least 1',
      max: 'Quantity cannot exceed 10,000'
    },
    rate: {
      min: 'Rate must be greater than 0',
      max: 'Rate cannot exceed $1,000,000'
    },
    amount: {
      min: 'Amount must be greater than 0',
      max: 'Amount cannot exceed $10,000,000'
    },
    percentage: {
      min: 'Percentage must be at least 0%',
      max: 'Percentage cannot exceed 100%'
    },
    weight: {
      min: 'Weight must be greater than 0',
      max: 'Weight cannot exceed 10,000 lbs'
    }
  },

  // Comparison errors
  comparison: {
    passwordMismatch: 'Passwords do not match',
    dateRange: 'End date must be after start date',
    amountExceeds: 'Amount cannot exceed the total',
    quantityExceeds: 'Quantity exceeds available stock',
    duplicateEntry: 'This entry already exists'
  },

  // Business logic errors
  business: {
    insufficientStock: (available) => `Only ${available} units available in stock`,
    orderMinimum: (min) => `Minimum order quantity is ${min}`,
    invalidDiscount: 'Discount cannot exceed the subtotal',
    pastDate: 'Date cannot be in the past',
    futureDate: 'Date cannot be in the future',
    weekendNotAllowed: 'Weekends are not allowed',
    duplicateSKU: 'This SKU already exists',
    duplicateEmail: 'This email is already registered',
    invalidCredentials: 'Invalid email or password',
    accountLocked: 'Account is locked. Please contact support',
    sessionExpired: 'Your session has expired. Please login again'
  },

  // File upload errors
  file: {
    required: 'Please select a file to upload',
    tooLarge: (maxSize) => `File size cannot exceed ${maxSize}MB`,
    invalidType: (allowed) => `Only ${allowed} files are allowed`,
    uploadFailed: 'File upload failed. Please try again'
  },

  // Network errors
  network: {
    timeout: 'Request timed out. Please try again',
    serverError: 'Server error. Please try again later',
    noConnection: 'No internet connection. Please check your network',
    forbidden: 'You do not have permission to perform this action',
    notFound: 'The requested resource was not found'
  }
};

/**
 * Get error message for a field
 */
export const getErrorMessage = (field, type, ...args) => {
  try {
    const message = validationMessages[type]?.[field];
    
    if (typeof message === 'function') {
      return message(...args);
    }
    
    if (typeof message === 'object') {
      return message[args[0]] || message.default;
    }
    
    return message || validationMessages.required.default;
  } catch {
    return 'Invalid input';
  }
};

/**
 * Validate all fields and return all errors simultaneously
 */
export const validateAllFields = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(fieldName => {
    const rules = validationRules[fieldName];
    const value = formData[fieldName];
    
    // Required validation
    if (rules.required && (!value || value === '')) {
      errors[fieldName] = getErrorMessage(fieldName, 'required');
      return; // Skip other validations if required fails
    }
    
    // Skip other validations if field is empty and not required
    if (!value || value === '') {
      return;
    }
    
    // Format validation
    if (rules.format) {
      const formatError = validateFormat(value, rules.format);
      if (formatError) {
        errors[fieldName] = getErrorMessage(rules.format, 'format');
        return;
      }
    }
    
    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors[fieldName] = getErrorMessage(fieldName, 'length', 'min');
      return;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[fieldName] = getErrorMessage(fieldName, 'length', 'max');
      return;
    }
    
    // Range validation
    if (rules.min !== undefined && Number(value) < rules.min) {
      errors[fieldName] = getErrorMessage(fieldName, 'range', 'min');
      return;
    }
    
    if (rules.max !== undefined && Number(value) > rules.max) {
      errors[fieldName] = getErrorMessage(fieldName, 'range', 'max');
      return;
    }
    
    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value, formData);
      if (customError) {
        errors[fieldName] = customError;
      }
    }
  });
  
  return errors;
};

/**
 * Format validators
 */
const validateFormat = (value, format) => {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s()-]+$/,
    zipCode: /^\d{5}(-\d{4})?$/,
    url: /^https?:\/\/.+/, 
    number: /^\d+(\.\d+)?$/,
    integer: /^\d+$/
  };
  
  return patterns[format] && !patterns[format].test(value);
};

/**
 * Get all error messages as an array
 */
export const getErrorArray = (errors) => {
  return Object.entries(errors).map(([field, message]) => ({
    field,
    message
  }));
};

/**
 * Check if form has any errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Format field name for display
 */
export const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

export default {
  validationMessages,
  getErrorMessage,
  validateAllFields,
  getErrorArray,
  hasErrors,
  formatFieldName
};
