import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import { orderAPI, productAPI, clientAPI, inventoryAPI } from '../utils/api';
import { BACKEND_URL } from '../utils/config';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import OrderConfirmation from '../components/orders/OrderConfirmation';
import toast from 'react-hot-toast';
import { AlertCircle, Upload, X, Package, Plus, Trash2, FileText } from 'lucide-react';

const CreateOrder = () => {
  const navigate = useNavigate();
  const { user, isClient } = useAuth();
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    clientId: '',
    items: [{ productId: '', quantity: 1, attachmentFile: null }],
  });
  const [itemErrors, setItemErrors] = useState([{}]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [deleteItemConfirm, setDeleteItemConfirm] = useState({ open: false, index: null });

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        
        if (isClient && (user?.clientId || user?.client_id)) {
          // For client users, use their assigned clientId (backend returns camelCase)
          const clientId = user.clientId || user.client_id;
          if (!clientId) {
            console.error('[CreateOrder] No clientId found in user object');
            toast.error('Client ID not found. Please contact support.');
            setLoading(false);
            return;
          }
          setFormData(prev => ({ ...prev, clientId }));
          await fetchProductsByClient(clientId);
        } else if (!isClient) {
          // For admin users, fetch clients and auto-select first one
          await fetchClients();
        } else {
          console.warn('Client user but no clientId found:', user);
          toast.error('Client ID not found. Please contact support.');
        }
      } catch (error) {
        console.error('Error initializing page:', error);
        toast.error('Failed to load page data');
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [isClient, user]);

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll({ limit: 100 });
      setClients(response.data.data);
      
      // Auto-select first client for admin if none selected
      if (response.data.data.length > 0 && !formData.clientId) {
        const firstClient = response.data.data[0];
        setFormData(prev => ({ ...prev, clientId: firstClient.id || firstClient._id }));
        await fetchProductsByClient(firstClient.id || firstClient._id);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      toast.error('Failed to load clients');
    }
  };

  const fetchProductsByClient = async (clientId) => {
    if (!clientId) {
      setProducts([]);
      return;
    }
    try {
      const response = await productAPI.getByClient(clientId);
      const productsData = response.data?.data || response.data || [];
      
      if (Array.isArray(productsData)) {
        setProducts(productsData);
        if (productsData.length === 0) {
          toast.error('No active products found for this client. Please ensure products are created and marked as active.', {
            duration: 5000,
          });
        }
      } else {
        console.error('Products data is not an array:', productsData);
        setProducts([]);
        toast.error('Invalid products data format');
      }
      await fetchInventory(clientId);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load products';
      toast.error(errorMessage, { duration: 5000 });
      setProducts([]);
    }
  };

  const fetchInventory = async (clientId) => {
    try {
      const response = await inventoryAPI.getByClient(clientId);
      const inventoryData = response.data?.data || [];
      
      const inventoryMap = {};
      inventoryData.forEach(item => {
        // Handle both nested object and direct string formats
        let productId = null;
        
        if (typeof item.productId === 'object' && item.productId !== null) {
          // Nested object format: { id: '...', _id: '...', name: '...' }
          productId = item.productId.id || item.productId._id;
        } else if (item.productId) {
          // Direct string format
          productId = item.productId;
        } else if (item.product_id) {
          // Fallback to snake_case
          productId = item.product_id;
        }
        
        if (productId) {
          const availableStock = Number(item.availableStock) || Number(item.available_stock) || 0;
          inventoryMap[productId] = availableStock;
        }
      });
      
      setInventory(inventoryMap);
    } catch (error) {
      console.error('[CreateOrder] Failed to fetch inventory:', error);
      // Don't show toast for inventory errors as it's not critical for order creation
      setInventory({});
    }
  };

  const handleClientChange = (clientId) => {
    setFormData({ ...formData, clientId, items: [{ productId: '', quantity: 1 }] });
    fetchProductsByClient(clientId);
  };

  const validateItemQuantity = (value, productId) => {
    // Check if value is empty
    if (!value || value === '') {
      return 'Quantity is required';
    }
    
    const num = Number(value);
    
    // Check if it's a valid number
    if (isNaN(num)) {
      return 'Please enter a valid number';
    }
    
    // Check if it's positive
    if (num <= 0) {
      return 'Quantity must be greater than 0';
    }
    
    // Check if it's a whole number
    if (!Number.isInteger(num)) {
      return 'Quantity must be a whole number';
    }
    
    // Check stock availability
    if (productId && inventory[productId] !== undefined) {
      const available = inventory[productId];
      if (num > available) {
        return `Only ${available} units available in stock`;
      }
    }
    
    return '';
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });

    // Real-time validation
    if (field === 'quantity') {
      const newErrors = [...itemErrors];
      newErrors[index] = { 
        ...newErrors[index], 
        quantity: validateItemQuantity(value, newItems[index].productId),
        product: !newItems[index].productId ? 'Please select a product' : ''
      };
      setItemErrors(newErrors);
    } else if (field === 'productId') {
      const newErrors = [...itemErrors];
      newErrors[index] = { 
        ...newErrors[index], 
        product: !value ? 'Please select a product' : '',
        quantity: validateItemQuantity(newItems[index].quantity, value) 
      };
      setItemErrors(newErrors);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1, attachmentFile: null }],
    });
    setItemErrors([...itemErrors, {}]);
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length <= 1) {
      toast.error('You must have at least one item in the order');
      return;
    }
    setDeleteItemConfirm({ open: true, index });
  };

  const confirmRemoveItem = () => {
    const { index } = deleteItemConfirm;
    if (index !== null) {
      const newItems = formData.items.filter((_, i) => i !== index);
      const newErrors = itemErrors.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
      setItemErrors(newErrors);
      toast.success('Item removed from order');
    }
    setDeleteItemConfirm({ open: false, index: null });
  };

  const handleFileUpload = (index, file) => {
    if (!file) {
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('PDF file size must be less than 5MB');
      return;
    }

    // Update the item with the file
    const newItems = [...formData.items];
    newItems[index].attachmentFile = file;
    setFormData({ ...formData, items: newItems });

    // Clear PDF error for this item
    const newErrors = [...itemErrors];
    if (newErrors[index]) {
      newErrors[index] = { ...newErrors[index], pdf: '' };
      setItemErrors(newErrors);
    }

    toast.success(`PDF uploaded: ${file.name}`, {
      duration: 2000,
      icon: '📄',
    });
  };

  const handleRemoveFile = (index) => {
    const newItems = [...formData.items];
    newItems[index].attachmentFile = null;
    setFormData({ ...formData, items: newItems });

    // Set PDF error for this item
    const newErrors = [...itemErrors];
    if (newErrors[index]) {
      newErrors[index] = { ...newErrors[index], pdf: 'Please upload a shipping label for this order' };
      setItemErrors(newErrors);
    }

    toast.info('PDF removed');
  };

  const filteredProducts = products.filter(product => {
    if (!productSearch) return true;
    const searchLower = productSearch.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.sku?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) {
      return;
    }
    
    // Validate clientId
    if (!formData.clientId) {
      toast.error('Client is required');
      return;
    }

    // Validate that there is at least one item
    if (!formData.items || formData.items.length === 0) {
      toast.error('Order must have at least one item');
      return;
    }

    // Validate items with detailed error messages
    const newItemErrors = formData.items.map((item) => {
      const errors = {
        quantity: validateItemQuantity(item.quantity, item.productId),
        product: !item.productId ? 'Please select a product' : '',
        pdf: !item.attachmentFile ? 'Shipping label PDF is required' : ''
      };
      
      // Check PDF file validity if present
      if (item.attachmentFile) {
        if (item.attachmentFile.type !== 'application/pdf') {
          errors.pdf = 'File must be a PDF';
        } else if (item.attachmentFile.size > 5 * 1024 * 1024) {
          errors.pdf = 'PDF must be less than 5MB';
        }
      }
      
      return errors;
    });
    
    const hasItemErrors = newItemErrors.some(err => err.quantity || err.product || err.pdf);
    
    if (hasItemErrors) {
      setItemErrors(newItemErrors);
      
      // Show specific error messages
      const errorMessages = [];
      newItemErrors.forEach((err, index) => {
        if (err.product) errorMessages.push(`Item ${index + 1}: ${err.product}`);
        if (err.quantity) errorMessages.push(`Item ${index + 1}: ${err.quantity}`);
        if (err.pdf) errorMessages.push(`Item ${index + 1}: ${err.pdf}`);
      });
      
      toast.error(
        <div>
          <p className="font-semibold mb-1">Please fix the following errors:</p>
          <ul className="text-sm list-disc list-inside">
            {errorMessages.slice(0, 3).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
            {errorMessages.length > 3 && <li>...and {errorMessages.length - 3} more</li>}
          </ul>
        </div>,
        { duration: 6000 }
      );
      return;
    }
    
    setLoading(true);
    try {
      if (!formData.clientId) {
        toast.error('Client ID is missing. Please refresh the page and try again.');
        setLoading(false);
        return;
      }

      // Create separate orders for each product (each with its own PDF)
      const createdOrders = [];
      const failedOrders = [];
      
      for (const item of formData.items) {
        try {
          // Validate and prepare data
          const quantity = Number(item.quantity);
          if (!item.productId) {
            throw new Error('Product is required');
          }
          if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
            throw new Error(`Invalid quantity: ${item.quantity}`);
          }

          const formDataToSend = new FormData();
          formDataToSend.append('clientId', formData.clientId);
          formDataToSend.append('items', JSON.stringify([{
            productId: item.productId,
            quantity: quantity // Ensure it's a number
          }]));
          formDataToSend.append('deliveryAddress', JSON.stringify({
            name: 'N/A',
            phone: '0000000000',
            street: 'N/A',
            city: 'N/A',
            state: 'CA',
            zipCode: '00000',
            country: 'United States'
          }));
          formDataToSend.append('notes', '');
          formDataToSend.append('priority', 'medium');
          
          if (item.attachmentFile) {
            formDataToSend.append('attachment', item.attachmentFile);
          } else {
            toast.warning('No shipping label provided. Order created but you may need to upload the label separately.');
          }

          const response = await orderAPI.create(formDataToSend);
          
          if (response?.data?.success && response?.data?.data) {
            createdOrders.push(response.data.data);
            
            // Show warning if PDF wasn't saved
            if (response.data.pdfWarning) {
              toast('Order created but PDF was not saved. Please run database migration to enable PDF storage.', {
                duration: 8000,
                icon: '⚠️',
                style: {
                  background: '#f59e0b',
                  color: '#fff',
                },
              });
            }
          } else {
            const errorMsg = response?.data?.message || 'Unknown error';
            console.error('[CreateOrder] Order creation failed - no data in response:', errorMsg);
            failedOrders.push({ ...item, error: errorMsg });
          }
        } catch (itemError) {
          console.error('[CreateOrder] Failed to create order for item:', item);
          console.error('[CreateOrder] Error details:', {
            message: itemError.message,
            response: itemError.response?.data,
            status: itemError.response?.status,
            statusText: itemError.response?.statusText
          });
          
          let errorMessage = itemError.response?.data?.message 
            || itemError.response?.data?.error 
            || itemError.message 
            || 'Unknown error occurred';
          
          // Check if migration is required
          if (itemError.response?.data?.migrationRequired) {
            errorMessage = 'Database migration required. Please contact administrator to run the migration script.';
            console.error('[CreateOrder] MIGRATION REQUIRED:', itemError.response.data.migrationSQL);
          }
          
          failedOrders.push({ ...item, error: errorMessage });
        }
      }

      // Show results
      if (createdOrders.length > 0) {
        setCreatedOrder(createdOrders[0]); // Show first order in confirmation
        setShowConfirmation(true);
        
        if (failedOrders.length > 0) {
          const errorMessages = failedOrders.map(f => f.error || 'Unknown error').join(', ');
          toast.error(`${failedOrders.length} order(s) failed to create. ${createdOrders.length} order(s) created successfully. Errors: ${errorMessages}`, {
            duration: 7000,
          });
        } else {
          toast.success(`${createdOrders.length} order(s) created successfully!`, {
            duration: 4000,
            icon: '✅',
            style: {
              background: '#10b981',
              color: '#fff',
            },
          });
        }
      } else {
        // All orders failed - show detailed error messages
        const errorMessages = failedOrders.map((f) => {
          const productName = products.find(p => (p.id || p._id) === f.productId)?.name || 'Unknown Product';
          return `${productName}: ${f.error || 'Unknown error'}`;
        }).join('; ');
        
        const mainError = failedOrders[0]?.error || 'Unknown error occurred';
        console.error('[CreateOrder] All orders failed. Errors:', errorMessages);
        
        toast.error(`All orders failed to create. ${mainError}${failedOrders.length > 1 ? ` (${failedOrders.length} items)` : ''}`, {
          duration: 8000,
        });
      }
    } catch (error) {
      // Handle different types of errors
      if (error.response?.data?.errors) {
        // Show validation errors
        const errorMessages = error.response.data.errors.map(err => `${err.field}: ${err.message}`).join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setCreatedOrder(null);
    const clientId = isClient ? (user?.clientId || user?.client_id) : formData.clientId;
    setFormData({
      clientId: clientId || '',
      items: [{ productId: '', quantity: 1, attachmentFile: null }],
    });
    setItemErrors([{}]);
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (isClient && products.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
        <Card>
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold mb-2">No products available for your account.</p>
            <p className="text-gray-400 text-sm mb-6">Products need to be assigned to your account before you can create orders.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => navigate('/contact')}
              >
                Contact Administrator
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showConfirmation && createdOrder && (
        <OrderConfirmation
          order={createdOrder}
          onClose={handleCloseConfirmation}
          onViewOrders={handleViewOrders}
        />
      )}
      
      <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>

      <form 
        onSubmit={handleSubmit}
        className="space-y-6"
        id="create-order-form"
      >
        {!isClient && (
          <Card title="Client Selection">
            <Select
              label="Client"
              value={formData.clientId}
              onChange={(e) => handleClientChange(e.target.value)}
              options={[
                { value: '', label: 'Select a client' },
                ...clients.map(c => ({ value: c.id || c._id, label: c.companyName || c.company_name }))
              ]}
              required
            />
          </Card>
        )}

        <Card title="Order Items">
          {Object.keys(inventory).length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Stock availability is checked in real-time. You can only order quantities that are currently available.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {formData.items.map((item, index) => (
              <div key={index} className="p-6 border-2 border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* Product Image Preview */}
                {item.productId && (
                  <div className="mb-4">
                    {(() => {
                      const selectedProduct = products.find(p => (p.id || p._id) === item.productId);
                      
                      if (selectedProduct) {
                        return (
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="relative flex-shrink-0">
                              {selectedProduct.imageUrl ? (
                                <img
                                  src={`${BACKEND_URL}${selectedProduct.imageUrl}`}
                                  alt={selectedProduct.name}
                                  className="w-4 h-4 object-cover rounded border border-gray-200 bg-white"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-4 h-4 flex items-center justify-center bg-gray-100 rounded-lg">
                                  <Package className="h-2 w-2 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-blue-900">{selectedProduct.name}</p>
                              <p className="text-sm text-blue-600">SKU: {selectedProduct.sku}</p>
                              <p className="text-sm text-blue-500">{selectedProduct.category}</p>
                              <p className="text-sm text-green-600 font-medium">
                                📦 {inventory[selectedProduct.id || selectedProduct._id] || 0} units available
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Product Selection - Visual Grid */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select a product *
                    </label>
                    
                    {/* Search Bar */}
                    <div className="mb-4">
                      <Input
                        type="text"
                        placeholder="Search products by name, SKU, or category..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                      {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-8">
                          <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">No products found</p>
                        </div>
                      ) : (
                        filteredProducts.map(product => {
                          const productId = product.id || product._id;
                          const isSelected = item.productId === productId;
                          const availableStock = inventory[productId] || 0;
                          
                          return (
                            <button
                              key={productId}
                              type="button"
                              onClick={() => handleItemChange(index, 'productId', productId)}
                              className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 shadow-md'
                                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                              }`}
                            >
                              {/* Product Image */}
                              <div className="aspect-square mb-2 rounded-md overflow-hidden bg-gray-100">
                                {product.imageUrl ? (
                                  <img
                                    src={`${BACKEND_URL}${product.imageUrl}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '';
                                      e.target.style.display = 'none';
                                      e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="space-y-1">
                                <p className={`text-xs font-semibold line-clamp-2 ${
                                  isSelected ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {product.name}
                                </p>
                                <p className={`text-xs ${
                                  isSelected ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                  SKU: {product.sku}
                                </p>
                                <p className={`text-xs font-medium ${
                                  availableStock > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {availableStock > 0 ? `${availableStock} in stock` : 'Out of stock'}
                                </p>
                              </div>

                              {/* Selected Indicator */}
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                    {itemErrors[index]?.product && (
                      <p className="text-red-600 text-xs mt-2">{itemErrors[index].product}</p>
                    )}
                  </div>

                  {/* Quantity - Full Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="1"
                      required
                      error={itemErrors[index]?.quantity}
                      className="w-full"
                      placeholder="Enter quantity"
                    />
                  </div>

                  {/* PDF Upload - Full Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Label (PDF) *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(index, e.target.files[0])}
                        className="sr-only"
                        id={`file-upload-${index}`}
                      />
                      <label
                        htmlFor={`file-upload-${index}`}
                        className={`flex items-center justify-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all ${
                          itemErrors[index]?.pdf ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                        }`}
                      >
                        {item.attachmentFile ? (
                          <>
                            <FileText className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                              {item.attachmentFile.name}
                            </span>
                            <Badge type="success">Uploaded</Badge>
                          </>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Click to upload PDF (up to 5MB)</span>
                          </>
                        )}
                      </label>
                      {item.attachmentFile && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="absolute right-3 top-3 text-red-600 hover:text-red-800 transition-colors bg-white rounded-full p-1"
                          title="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {itemErrors[index]?.pdf && (
                      <p className="text-red-600 text-xs mt-1">{itemErrors[index].pdf}</p>
                    )}
                  </div>
                </div>
                {formData.items.length > 1 && (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Remove Item</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              className="w-full flex items-center justify-center gap-2 py-3"
            >
              <Plus className="h-5 w-5" />
              <span>Add Another Product</span>
            </Button>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/orders')} 
              className="w-full sm:w-auto sm:flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              loading={loading}
              disabled={loading}
              className="w-full sm:w-auto sm:flex-1"
            >
              {loading ? 'Creating Order...' : 'Create Order'}
            </Button>
          </div>
        </Card>
      </form>

      {/* Remove Item Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteItemConfirm.open}
        onClose={() => setDeleteItemConfirm({ open: false, index: null })}
        onConfirm={confirmRemoveItem}
        title="Remove Item"
        message="Are you sure you want to remove this item from the order? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default CreateOrder;
