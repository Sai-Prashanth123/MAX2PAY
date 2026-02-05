/**
 * Comprehensive Form Validation Utilities
 * Centralized validation functions for all forms in the application
 */

import { validators } from './validators';

/**
 * Validation rules for different form types
 */
export const validationRules = {
  // Contact Form
  contact: {
    name: [validators.required],
    email: [validators.required, validators.email],
    phone: [validators.phone],
    subject: [validators.required, validators.minLength(3)],
    message: [validators.required, validators.minLength(10)],
  },

  // Login Form
  login: {
    email: [validators.required, validators.email],
    password: [validators.required, validators.minLength(6)],
    role: [validators.required],
  },

  // Order Creation
  order: {
    clientId: [validators.required],
    productId: [validators.required],
    quantity: [
      validators.required,
      validators.positiveNumber,
      validators.integer,
      validators.min(1),
    ],
  },

  // Profile Form
  profile: {
    name: [validators.required, validators.minLength(2)],
    phone: [validators.phone],
  },

  // Password Change
  password: {
    currentPassword: [validators.required],
    newPassword: [validators.required, validators.minLength(6)],
    confirmPassword: [validators.required],
  },

  // Company Information
  company: {
    companyName: [validators.required, validators.minLength(2)],
    contactPerson: [validators.required, validators.minLength(2)],
    email: [validators.required, validators.email],
    phone: [validators.required, validators.phone],
  },
};

/**
 * Validate a single field
 */
export const validateField = (fieldName, value, rules) => {
  if (!rules || !Array.isArray(rules)) {
    return null;
  }

  for (const rule of rules) {
    const error = rule(value);
    if (error) {
      return error;
    }
  }

  return null;
};

/**
 * Validate entire form
 */
export const validateForm = (formData, formType) => {
  const rules = validationRules[formType];
  if (!rules) {
    console.warn(`No validation rules found for form type: ${formType}`);
    return {};
  }

  const errors = {};
  
  Object.keys(rules).forEach(fieldName => {
    const value = formData[fieldName];
    const fieldRules = rules[fieldName];
    const error = validateField(fieldName, value, fieldRules);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

/**
 * Real-time validation hook
 */
export const useFieldValidation = (fieldName, value, rules) => {
  const error = validateField(fieldName, value, rules);
  return {
    error,
    isValid: !error,
  };
};

/**
 * Validate quantity with stock check
 */
export const validateQuantityWithStock = (quantity, availableStock) => {
  // Check required
  if (!quantity || quantity === '') {
    return 'Quantity is required';
  }

  // Check if number
  const num = Number(quantity);
  if (isNaN(num)) {
    return 'Please enter a valid number';
  }

  // Check if positive
  if (num <= 0) {
    return 'Quantity must be greater than 0';
  }

  // Check if integer
  if (!Number.isInteger(num)) {
    return 'Quantity must be a whole number';
  }

  // Check stock availability
  if (availableStock !== undefined && num > availableStock) {
    return `Only ${availableStock} units available in stock`;
  }

  return null;
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Validate phone format (US)
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return null; // Phone is optional in most forms
  }
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) {
    return 'Please enter a valid 10-digit phone number';
  }
  return null;
};

/**
 * Validate password strength
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return null;
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

/**
 * Validate file upload
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['application/pdf'],
    required = false,
  } = options;

  if (!file) {
    if (required) {
      return 'File is required';
    }
    return null;
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return `File must be one of: ${allowedTypes.join(', ')}`;
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return `File size must be less than ${maxSizeMB}MB`;
  }

  return null;
};

export default {
  validationRules,
  validateField,
  validateForm,
  useFieldValidation,
  validateQuantityWithStock,
  validateEmail,
  validatePhone,
  validatePassword,
  validatePasswordConfirmation,
  validateFile,
};
