export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  phone: (value) => {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      return 'Please enter a valid 10-digit US phone number';
    }
    return '';
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },

  number: (value) => {
    if (!value) return null;
    if (isNaN(value)) {
      return 'Must be a valid number';
    }
    return null;
  },

  positiveNumber: (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return 'Must be a positive number';
    }
    return null;
  },

  integer: (value) => {
    if (!value) return null;
    if (!Number.isInteger(Number(value))) {
      return 'Must be a whole number';
    }
    return null;
  },

  min: (minValue) => (value) => {
    if (!value) return null;
    if (Number(value) < minValue) {
      return `Must be at least ${minValue}`;
    }
    return null;
  },

  max: (maxValue) => (value) => {
    if (!value) return null;
    if (Number(value) > maxValue) {
      return `Must be no more than ${maxValue}`;
    }
    return null;
  },

  match: (fieldName, otherValue) => (value) => {
    if (value !== otherValue) {
      return `Must match ${fieldName}`;
    }
    return null;
  },

  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  date: (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    return null;
  },

  futureDate: (value) => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return 'Date must be in the future';
    }
    return null;
  },

  pastDate: (value) => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) {
      return 'Date must be in the past';
    }
    return null;
  },
};

export const combineValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = values[field];
    
    if (Array.isArray(fieldRules)) {
      const error = combineValidators(...fieldRules)(value);
      if (error) {
        errors[field] = error;
      }
    } else if (typeof fieldRules === 'function') {
      const error = fieldRules(value);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};
