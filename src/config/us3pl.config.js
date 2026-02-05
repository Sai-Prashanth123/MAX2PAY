// US 3PL Industry Standards Configuration

export const US_3PL_CONFIG = {
  // Currency
  currency: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US'
  },

  // Date & Time
  dateFormat: 'MM/dd/yyyy',
  dateTimeFormat: 'MM/dd/yyyy hh:mm a',
  timezone: 'America/New_York',

  // Terminology Mapping (Old → New)
  terminology: {
    vendor: 'Shipper',
    customer: 'Client',
    delivery: 'Fulfillment',
    warehouse: 'Fulfillment Center',
    transport: 'Carrier',
    stock: 'Inventory',
    gst: 'Sales Tax',
    dispatch: 'Ship Out',
    inbound: 'Receiving',
    outbound: 'Fulfillment'
  },

  // US States
  states: [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' }
  ],

  // 3PL Pricing Structure
  pricing: {
    // Storage Fees
    storage: {
      perPallet: 15.00,        // $ per pallet per month
      perCubicFoot: 0.50,      // $ per cubic foot per month
      perSqFoot: 8.00,         // $ per square foot per month
      minimumMonthly: 100.00   // Minimum monthly storage fee
    },

    // Fulfillment Fees
    fulfillment: {
      pickAndPack: 3.50,       // $ per order
      orderProcessing: 2.25,    // $ per order
      kitting: 1.50,           // $ per kit assembled
      labelingPerUnit: 0.25    // $ per unit labeled
    },

    // Receiving Fees
    receiving: {
      perPallet: 25.00,        // $ per pallet received
      perCarton: 2.00,         // $ per carton
      inspection: 15.00,       // $ per hour for inspection
      unloadingPerHour: 75.00  // $ per hour for unloading
    },

    // Shipping Fees (base rates, carrier charges separate)
    shipping: {
      labelGeneration: 0.50,   // $ per label
      packingMaterials: 2.00,  // $ per order
      oversizeHandling: 15.00, // $ per oversize item
      weightTiers: [
        { maxWeight: 5, fee: 2.50 },      // Up to 5 lbs: $2.50
        { maxWeight: 10, fee: 5.00 },     // 5-10 lbs: $5.00
        { maxWeight: 20, fee: 8.50 },     // 10-20 lbs: $8.50
        { maxWeight: 50, fee: 15.00 },    // 20-50 lbs: $15.00
        { maxWeight: Infinity, fee: 25.00 } // 50+ lbs: $25.00
      ]
    },

    // Value Added Services
    vas: {
      returnProcessing: 5.00,  // $ per return
      qualityControl: 10.00,   // $ per hour
      photoServices: 3.00,     // $ per SKU
      customPackaging: 5.00    // $ per order
    }
  },

  // Subscription Plans (Monthly)
  subscriptionPlans: [
    {
      id: 'starter',
      name: 'Starter',
      price: 299,
      features: [
        'Up to 100 orders/month',
        '500 sq ft storage',
        'Basic reporting',
        'Email support'
      ],
      limits: {
        orders: 100,
        storage: 500,
        users: 2
      }
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 799,
      features: [
        'Up to 500 orders/month',
        '2,000 sq ft storage',
        'Advanced reporting',
        'Priority support',
        'API access'
      ],
      limits: {
        orders: 500,
        storage: 2000,
        users: 5
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 1999,
      features: [
        'Unlimited orders',
        'Custom storage',
        'Custom reporting',
        '24/7 support',
        'Dedicated account manager',
        'Custom integrations'
      ],
      limits: {
        orders: -1,
        storage: -1,
        users: -1
      }
    }
  ],

  // Shipping Carriers
  carriers: [
    { code: 'UPS', name: 'UPS', services: ['Ground', 'Next Day Air', '2nd Day Air', '3 Day Select'] },
    { code: 'FEDEX', name: 'FedEx', services: ['Ground', 'Express', 'Priority', 'Standard Overnight'] },
    { code: 'USPS', name: 'USPS', services: ['Priority Mail', 'First Class', 'Priority Express', 'Parcel Select'] },
    { code: 'DHL', name: 'DHL Express', services: ['Express', 'Ground'] }
  ],

  // Fulfillment KPIs
  kpis: {
    orderAccuracy: { target: 99.5, unit: '%' },
    onTimeShipment: { target: 98.0, unit: '%' },
    inventoryAccuracy: { target: 99.0, unit: '%' },
    orderCycleTime: { target: 24, unit: 'hours' },
    pickAccuracy: { target: 99.8, unit: '%' },
    damageRate: { target: 0.5, unit: '%' }
  },

  // Sales Tax Rates by State (example rates - should be updated regularly)
  salesTaxRates: {
    AL: 4.00, AK: 0.00, AZ: 5.60, AR: 6.50, CA: 7.25,
    CO: 2.90, CT: 6.35, DE: 0.00, FL: 6.00, GA: 4.00,
    HI: 4.00, ID: 6.00, IL: 6.25, IN: 7.00, IA: 6.00,
    KS: 6.50, KY: 6.00, LA: 4.45, ME: 5.50, MD: 6.00,
    MA: 6.25, MI: 6.00, MN: 6.88, MS: 7.00, MO: 4.23,
    MT: 0.00, NE: 5.50, NV: 6.85, NH: 0.00, NJ: 6.63,
    NM: 5.13, NY: 4.00, NC: 4.75, ND: 5.00, OH: 5.75,
    OK: 4.50, OR: 0.00, PA: 6.00, RI: 7.00, SC: 6.00,
    SD: 4.50, TN: 7.00, TX: 6.25, UT: 6.10, VT: 6.00,
    VA: 5.30, WA: 6.50, WV: 6.00, WI: 5.00, WY: 4.00
  },

  // Invoice Terms
  invoiceTerms: {
    net15: 'Net 15',
    net30: 'Net 30',
    net45: 'Net 45',
    net60: 'Net 60',
    dueOnReceipt: 'Due on Receipt'
  },

  // Default Settings
  defaults: {
    paymentTerms: 'net30',
    currency: 'USD',
    taxRate: 8.00,
    country: 'United States',
    measurementSystem: 'imperial', // imperial vs metric
    weightUnit: 'lbs',
    dimensionUnit: 'inches'
  }
};

export default US_3PL_CONFIG;
