import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Scan, Upload, X, Package } from 'lucide-react';
import { productAPI, clientAPI } from '../utils/api';
import { BACKEND_URL } from '../utils/config';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import BatchActions from '../components/common/BatchActions';
import BarcodeScanner from '../components/common/BarcodeScanner';
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/exportUtils';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    name: '',
    sku: '',
    description: '',
    category: '',
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchClients();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({ limit: 100 });
      setProducts(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll({ limit: 100 });
      setClients(response.data.data);
    } catch {
      console.error('Failed to fetch clients');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const validationErrors = {};
    
    if (!formData.clientId) {
      validationErrors.clientId = 'Client is required';
    }
    
    if (!formData.name || formData.name.trim() === '') {
      validationErrors.name = 'Product name is required';
    }
    
    if (!formData.sku || formData.sku.trim() === '') {
      validationErrors.sku = 'SKU is required';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      // Show validation errors
      Object.values(validationErrors).forEach(error => {
        toast.error(error, { duration: 4000 });
      });
      return;
    }
    
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData[key]) {
          // Backend expects the file field to be named 'image'
          submitData.append('image', formData[key]);
        } else if (key !== 'photo') {
          submitData.append(key, formData[key]);
        }
      });

      if (currentProduct) {
        await productAPI.update(currentProduct.id || currentProduct._id, submitData);
        toast.success('Product updated successfully!', {
          duration: 3000,
          icon: '✅',
        });
      } else {
        await productAPI.create(submitData);
        toast.success('Product created successfully!', {
          duration: 3000,
          icon: '✅',
        });
      }
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Operation failed';
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      clientId: product.clientId?.id || product.clientId?._id || product.clientId || '',
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      category: product.category || '',
      photo: null,
    });
    if (product.imageUrl) {
      setPhotoPreview(`${BACKEND_URL}${product.imageUrl}`);
    } else {
      setPhotoPreview(null);
    }
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteConfirmation('');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation !== productToDelete.name) {
      toast.error('Product name does not match. Please type the exact product name.');
      return;
    }

    try {
      await productAPI.delete(productToDelete.id || productToDelete._id);
      toast.success('Product permanently deleted!', {
        duration: 3000,
        icon: '✅',
      });
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      setDeleteConfirmation('');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product', { duration: 5000 });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
    setDeleteConfirmation('');
  };

  const resetForm = () => {
    setCurrentProduct(null);
    setFormData({
      clientId: '',
      name: '',
      sku: '',
      description: '',
      category: '',
      photo: null,
    });
    setPhotoPreview(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPhotoPreview(null);
  };

  const handleBarcodeDetected = (barcode) => {
    setFormData({ ...formData, sku: barcode.toUpperCase() });
    setIsScannerOpen(false);
    setIsModalOpen(true);
    toast.success(`Barcode scanned: ${barcode}`);
  };

  const toggleSelectProduct = (productId) => {
    setSelectedIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(products.map(product => product.id || product._id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = async (ids) => {
    try {
      await Promise.all(ids.map(id => productAPI.delete(id)));
      toast.success(`Deleted ${ids.length} products successfully!`, {
        duration: 3000,
        icon: '✅',
      });
      setSelectedIds([]);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete products', { duration: 5000 });
    }
  };

  const handleBulkStatusUpdate = async (ids, status) => {
    const isActive = status === 'active';
    try {
      await Promise.all(ids.map(id => productAPI.update(id, { isActive })));
      toast.success(`Updated ${ids.length} products to ${status}!`, {
        duration: 3000,
        icon: '✅',
      });
      setSelectedIds([]);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update products', { duration: 5000 });
    }
  };

  const handleBulkExport = (ids, format = 'csv') => {
    const selectedProducts = products.filter(product => ids.includes(product.id || product._id));
    const exportData = selectedProducts.map(product => ({
      'SKU': product.sku,
      'Name': product.name,
      'Client': product.clientId?.companyName || '',
      'Category': product.category,
      'Quantity': product.quantity || 0,
      'Reorder Level': product.reorderLevel,
      'Status': product.isActive ? 'Active' : 'Inactive'
    }));
    const columns = [
      { header: 'SKU', accessor: 'SKU' },
      { header: 'Name', accessor: 'Name' },
      { header: 'Client', accessor: 'Client' },
      { header: 'Category', accessor: 'Category' },
      { header: 'Quantity', accessor: 'Quantity' },
      { header: 'Reorder Level', accessor: 'Reorder Level' },
      { header: 'Status', accessor: 'Status' }
    ];
    
    if (format === 'csv') {
      exportToCSV(exportData, columns, `Selected_Products_${new Date().toISOString().split('T')[0]}`);
    } else if (format === 'excel') {
      exportToExcel(exportData, columns, 'Selected Products');
    } else if (format === 'pdf') {
      exportToPDF(exportData, columns, 'Selected Products');
    }
    toast.success(`Exported ${selectedProducts.length} products as ${format.toUpperCase()}`);
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedIds.length === products.length && products.length > 0}
          onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
          className="rounded border-gray-300"
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id || row._id)}
          onChange={() => toggleSelectProduct(row.id || row._id)}
          className="rounded border-gray-300"
        />
      ),
    },
    {
      header: 'Photo',
      render: (row) => (
        row.imageUrl ? (
          <img 
            src={`${BACKEND_URL}${row.imageUrl}`} 
            alt={row.name}
            className="w-16 h-16 object-contain rounded border border-gray-200 bg-white p-1"
            onError={(e) => {
              console.error('Image load error:', e.target.src);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
            <Package size={24} className="text-gray-400" />
          </div>
        )
      ),
    },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Name', accessor: 'name' },
    {
      header: 'Client',
      render: (row) => row.clientId?.companyName || '-',
    },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Status',
      render: (row) => <Badge type="status">{row.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-800" title="Edit Product">
            <Edit size={18} />
          </button>
          <button onClick={() => handleDeleteClick(row)} className="text-red-600 hover:text-red-800" title="Delete Product">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => setIsScannerOpen(true)}>
            <Scan size={20} /> Scan Barcode
          </Button>
          <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
            <Plus size={20} /> Add Product
          </Button>
        </div>
      </div>

      <Card>
        <Table
          columns={columns}
          data={products}
          loading={loading}
          emptyMessage="No products found"
          searchable={true}
          sortable={true}
          paginated={true}
          itemsPerPage={10}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={currentProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Client"
            name="clientId"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            options={clients.map(c => ({ value: c.id || c._id, label: c.companyName }))}
            required
          />
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="relative">
            <Input
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
              required
            />
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setIsScannerOpen(true); }}
              className="absolute right-2 top-9 text-blue-600 hover:text-blue-800"
              title="Scan Barcode"
            >
              <Scan size={20} />
            </button>
          </div>
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          
          {/* Photo Upload - Optional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Photo <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            
            {photoPreview ? (
              <div className="relative inline-block">
                <img 
                  src={photoPreview} 
                  alt="Product preview" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove photo"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {currentProduct ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Delete Product - Confirmation Required"
        size="md"
      >
        {productToDelete && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900">
                    Warning: Permanent Deletion
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    This action cannot be undone. This will permanently delete the product and remove all associated data.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Product to be deleted:</p>
              <div className="flex items-center gap-3">
                {productToDelete.imageUrl ? (
                  <img 
                    src={`${BACKEND_URL}${productToDelete.imageUrl}`} 
                    alt={productToDelete.name}
                    className="w-20 h-20 object-contain rounded border border-gray-200 bg-white p-1"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                    <Package size={28} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{productToDelete.name}</p>
                  <p className="text-sm text-gray-600">SKU: {productToDelete.sku}</p>
                  <p className="text-sm text-gray-600">Client: {productToDelete.clientId?.companyName}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Type the product name <span className="font-bold text-red-600">"{productToDelete.name}"</span> to confirm deletion:
              </label>
              <Input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Enter product name exactly"
                className="font-mono"
                autoFocus
              />
              {deleteConfirmation && deleteConfirmation !== productToDelete.name && (
                <p className="text-xs text-red-600 mt-1">
                  ✗ Product name does not match
                </p>
              )}
              {deleteConfirmation === productToDelete.name && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Product name matches
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmation !== productToDelete.name}
                className={`${
                  deleteConfirmation !== productToDelete.name
                    ? 'opacity-50 cursor-not-allowed bg-red-400'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Permanently Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <BatchActions
        selectedItems={selectedIds}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        totalItems={products.length}
        onBulkDelete={handleBulkDelete}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkExport={handleBulkExport}
        statusOptions={[
          { value: 'active', label: 'Activate' },
          { value: 'inactive', label: 'Deactivate' }
        ]}
      />

      {isScannerOpen && (
        <BarcodeScanner
          onDetected={handleBarcodeDetected}
          onClose={() => setIsScannerOpen(false)}
        />
      )}
    </div>
  );
};

export default Products;
