import { useState, useEffect, useCallback } from 'react';
import { calculateInvoice, validateInvoiceData } from '../utils/invoiceCalculations';

/**
 * React Hook for Real-Time Invoice Calculations
 * Auto-recalculates whenever any value changes
 * Provides live updates without page reload
 */
const useInvoiceCalculation = (initialData = {}) => {
  const [invoiceData, setInvoiceData] = useState({
    lineItems: initialData.lineItems || [],
    taxPercentage: initialData.taxPercentage || 0,
    taxEnabled: initialData.taxEnabled !== false,
    advancePaid: initialData.advancePaid || 0
  });

  const [calculations, setCalculations] = useState({
    lineItems: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    balance: 0,
    advancePaid: 0
  });

  const [validation, setValidation] = useState({
    isValid: true,
    errors: []
  });

  // Auto-recalculate whenever invoice data changes
  useEffect(() => {
    const result = calculateInvoice(invoiceData);
    setCalculations(result);

    // Validate data
    const validationResult = validateInvoiceData(invoiceData);
    setValidation(validationResult);
  }, [invoiceData]);

  // Update line item
  const updateLineItem = useCallback((index, field, value) => {
    setInvoiceData(prev => {
      const newLineItems = [...(prev.lineItems || [])];
      if (index >= 0 && index < newLineItems.length) {
        newLineItems[index] = {
          ...newLineItems[index],
          [field]: value
        };
      }
      return {
        ...prev,
        lineItems: newLineItems
      };
    });
  }, []);

  // Add line item
  const addLineItem = useCallback((item = {}) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: [
        ...(prev.lineItems || []),
        {
          description: item.description || '',
          chargeQty: item.chargeQty || 0,
          rate: item.rate || 0,
          amount: 0
        }
      ]
    }));
  }, []);

  // Remove line item
  const removeLineItem = useCallback((index) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: (prev.lineItems || []).filter((_, i) => i !== index)
    }));
  }, []);

  // Update tax percentage
  const updateTaxPercentage = useCallback((value) => {
    setInvoiceData(prev => ({
      ...prev,
      taxPercentage: parseFloat(value) || 0
    }));
  }, []);

  // Toggle tax enabled
  const toggleTax = useCallback((enabled) => {
    setInvoiceData(prev => ({
      ...prev,
      taxEnabled: enabled
    }));
  }, []);

  // Update advance paid
  const updateAdvancePaid = useCallback((value) => {
    setInvoiceData(prev => ({
      ...prev,
      advancePaid: parseFloat(value) || 0
    }));
  }, []);

  // Reset all data
  const reset = useCallback((newData = {}) => {
    setInvoiceData({
      lineItems: newData.lineItems || [],
      taxPercentage: newData.taxPercentage || 0,
      taxEnabled: newData.taxEnabled !== false,
      advancePaid: newData.advancePaid || 0
    });
  }, []);

  // Set complete invoice data
  const setData = useCallback((data) => {
    setInvoiceData({
      lineItems: data.lineItems || [],
      taxPercentage: data.taxPercentage || 0,
      taxEnabled: data.taxEnabled !== false,
      advancePaid: data.advancePaid || 0
    });
  }, []);

  return {
    // Current data
    invoiceData,
    
    // Calculated values
    calculations,
    
    // Validation
    validation,
    
    // Update functions
    updateLineItem,
    addLineItem,
    removeLineItem,
    updateTaxPercentage,
    toggleTax,
    updateAdvancePaid,
    
    // Utility functions
    reset,
    setData
  };
};

export default useInvoiceCalculation;
