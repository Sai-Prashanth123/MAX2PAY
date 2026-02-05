/**
 * Invoice Calculation Engine
 * Finance-grade billing calculations with real-time auto-update
 * Reusable across: Invoices, Billing Reports, Client Statements, Finance Dashboard
 */

/**
 * 1. LINE ITEM CALCULATION
 * Calculate amount for each invoice line item
 * Formula: amount = charge_qty × rate
 */
export const calculateLineItemAmount = (chargeQty, rate) => {
  const qty = parseFloat(chargeQty) || 0;
  const rateValue = parseFloat(rate) || 0;
  return Number((qty * rateValue).toFixed(2));
};

/**
 * 2. SERVICE SUMMARY CALCULATION
 * Calculate service amount based on quantity and rate
 * Formula: service_amount = total_orders × service_rate
 */
export const calculateServiceAmount = (quantity, serviceRate) => {
  const qty = parseFloat(quantity) || 0;
  const rate = parseFloat(serviceRate) || 0;
  return Number((qty * rate).toFixed(2));
};

/**
 * 3. SUBTOTAL CALCULATION
 * Sum all line item amounts
 * Formula: subtotal = SUM(all service_amount)
 */
export const calculateSubtotal = (lineItems) => {
  if (!Array.isArray(lineItems)) return 0;
  
  const subtotal = lineItems.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0;
    return sum + amount;
  }, 0);
  
  return Number(subtotal.toFixed(2));
};

/**
 * 4. TAX CALCULATION
 * Calculate tax based on subtotal and tax percentage
 * Formula: tax = subtotal × tax_percentage
 */
export const calculateTax = (subtotal, taxPercentage, taxEnabled = true) => {
  if (!taxEnabled) return 0;
  
  const sub = parseFloat(subtotal) || 0;
  const taxRate = parseFloat(taxPercentage) || 0;
  const tax = sub * (taxRate / 100);
  
  return Number(tax.toFixed(2));
};

/**
 * 5. TOTAL INVOICE AMOUNT
 * Calculate total invoice amount
 * Formula: total = subtotal + tax
 */
export const calculateTotal = (subtotal, tax) => {
  const sub = parseFloat(subtotal) || 0;
  const taxAmount = parseFloat(tax) || 0;
  
  return Number((sub + taxAmount).toFixed(2));
};

/**
 * 6. BALANCE CALCULATION
 * Calculate balance after advance deduction
 * Formula: balance = total - advance_paid
 */
export const calculateBalance = (total, advancePaid) => {
  const totalAmount = parseFloat(total) || 0;
  const advance = parseFloat(advancePaid) || 0;
  const balance = totalAmount - advance;
  
  // Prevent negative balance
  return Number(Math.max(0, balance).toFixed(2));
};

/**
 * 7. COMPLETE INVOICE CALCULATION
 * Auto-calculate all invoice values in one function
 * Returns: { lineItems, subtotal, tax, total, balance }
 */
export const calculateInvoice = (data) => {
  const {
    lineItems = [],
    taxPercentage = 0,
    taxEnabled = true,
    advancePaid = 0
  } = data;

  // Step 1: Calculate each line item amount
  const calculatedLineItems = lineItems.map(item => ({
    ...item,
    amount: calculateLineItemAmount(item.chargeQty || item.quantity, item.rate)
  }));

  // Step 2: Calculate subtotal
  const subtotal = calculateSubtotal(calculatedLineItems);

  // Step 3: Calculate tax
  const tax = calculateTax(subtotal, taxPercentage, taxEnabled);

  // Step 4: Calculate total
  const total = calculateTotal(subtotal, tax);

  // Step 5: Calculate balance
  const balance = calculateBalance(total, advancePaid);

  return {
    lineItems: calculatedLineItems,
    subtotal,
    tax,
    total,
    balance,
    advancePaid: parseFloat(advancePaid) || 0
  };
};

/**
 * 8. FULFILLMENT INVOICE CALCULATION
 * Formula: $2.50 + (number_of_units - 1) × $1.25 per order
 */
export const calculateFulfillmentInvoice = (data) => {
  const {
    totalOrders = 0,
    totalUnits = 0,
    advancePaid = 0
  } = data;

  // Pricing formula: $2.50 + (number_of_units - 1) × $1.25 per order
  const BASE_RATE = 2.50;
  const ADDITIONAL_UNIT_RATE = 1.25;

  const lineItems = [];

  if (totalOrders > 0 && totalUnits > 0) {
    // Calculate average units per order for frontend preview
    const avgUnitsPerOrder = totalUnits / totalOrders;
    const chargePerOrder = BASE_RATE + ((avgUnitsPerOrder - 1) * ADDITIONAL_UNIT_RATE);
    const totalAmount = Number((totalOrders * chargePerOrder).toFixed(2));
    
    lineItems.push({
      description: `Order Fulfillment (${totalOrders} orders, ${totalUnits} total units)`,
      chargeQty: totalOrders,
      rate: Number(chargePerOrder.toFixed(2)),
      amount: totalAmount
    });
  }

  // No tax, no other fees
  return calculateInvoice({
    lineItems,
    taxPercentage: 0,
    taxEnabled: false,
    advancePaid
  });
};

/**
 * 9. MONTHLY INVOICE CALCULATION
 * Formula: $2.50 + (number_of_units - 1) × $1.25 per order
 */
export const calculateMonthlyInvoice = (data) => {
  const {
    totalOrders = 0,
    totalUnits = 0,
    advancePaid = 0
  } = data;

  // Pricing formula: $2.50 + (number_of_units - 1) × $1.25 per order
  const BASE_RATE = 2.50;
  const ADDITIONAL_UNIT_RATE = 1.25;

  const lineItems = [];

  if (totalOrders > 0 && totalUnits > 0) {
    // Calculate average units per order for frontend preview
    const avgUnitsPerOrder = totalUnits / totalOrders;
    const chargePerOrder = BASE_RATE + ((avgUnitsPerOrder - 1) * ADDITIONAL_UNIT_RATE);
    const totalAmount = Number((totalOrders * chargePerOrder).toFixed(2));
    
    lineItems.push({
      description: `Order Fulfillment (${totalOrders} orders, ${totalUnits} total units)`,
      chargeQty: totalOrders,
      rate: Number(chargePerOrder.toFixed(2)),
      amount: totalAmount
    });
  }

  // No tax, no other fees
  return calculateInvoice({
    lineItems,
    taxPercentage: 0,
    taxEnabled: false,
    advancePaid
  });
};

/**
 * 10. VALIDATION HELPERS
 */
export const validateInvoiceData = (data) => {
  const errors = [];

  if (!data.lineItems || data.lineItems.length === 0) {
    errors.push('At least one line item is required');
  }

  data.lineItems?.forEach((item, index) => {
    if (!item.chargeQty && !item.quantity) {
      errors.push(`Line item ${index + 1}: Quantity is required`);
    }
    if (!item.rate) {
      errors.push(`Line item ${index + 1}: Rate is required`);
    }
    if (parseFloat(item.chargeQty || item.quantity) < 0) {
      errors.push(`Line item ${index + 1}: Quantity cannot be negative`);
    }
    if (parseFloat(item.rate) < 0) {
      errors.push(`Line item ${index + 1}: Rate cannot be negative`);
    }
  });

  if (data.taxPercentage && (parseFloat(data.taxPercentage) < 0 || parseFloat(data.taxPercentage) > 100)) {
    errors.push('Tax percentage must be between 0 and 100');
  }

  if (data.advancePaid && parseFloat(data.advancePaid) < 0) {
    errors.push('Advance paid cannot be negative');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 11. CURRENCY FORMATTING
 */
export const formatCurrency = (amount, currency = 'USD') => {
  const value = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * 12. PERCENTAGE FORMATTING
 */
export const formatPercentage = (value) => {
  const num = parseFloat(value) || 0;
  return `${num.toFixed(2)}%`;
};

/**
 * Export all calculation functions
 */
export default {
  calculateLineItemAmount,
  calculateServiceAmount,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  calculateBalance,
  calculateInvoice,
  calculateFulfillmentInvoice,
  calculateMonthlyInvoice,
  validateInvoiceData,
  formatCurrency,
  formatPercentage
};
