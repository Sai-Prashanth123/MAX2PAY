import { useState } from 'react';
import { Trash2, Plus, Package, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import { US_STATES } from '../../utils/localization';

export function OrderItemRow({ 
  item, 
  itemIndex, 
  onProductChange, 
  onQuantityChange, 
  onRemoveItem,
  isLastItem,
  onAddItem,
  availableProducts,
  inventory = {},
  quantityError,
  productError,
  separateAddresses = false,
  onAddressChange,
  addressErrors = {}
}) {
  const [showAddress, setShowAddress] = useState(false);
  const selectedProduct = availableProducts.find(p => p._id === item.productId);
  const availableStock = inventory[item.productId] || 0;
  return (
    <div className="order-item-container bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
      {/* Item Header with Numbering */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Item #{itemIndex + 1}
        </h3>
        {itemIndex > 0 && (
          <button
            type="button"
            onClick={() => onRemoveItem(itemIndex)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            title="Remove this item"
            aria-label={`Remove order item ${itemIndex + 1}`}
          >
            <Trash2 size={16} />
            Remove
          </button>
        )}
      </div>

      {/* Item Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1">
          <Select
            label="Product"
            value={item.productId || ''}
            onChange={(e) => onProductChange(itemIndex, e.target.value)}
            options={availableProducts.map(p => ({ 
              value: p._id, 
              label: `${p.name} (${p.sku})` 
            }))}
            error={productError}
            required
          />
          {selectedProduct && inventory[item.productId] !== undefined && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-gray-500" />
              <span className={`font-medium ${availableStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {availableStock} units available in stock
              </span>
            </div>
          )}
        </div>

        <div className="w-full md:w-40">
          <Input
            label="Quantity"
            type="number"
            value={item.quantity}
            onChange={(e) => onQuantityChange(itemIndex, parseInt(e.target.value))}
            error={quantityError}
            min="1"
            max={availableStock || undefined}
            step="1"
            required
          />
        </div>
      </div>

      {/* Delivery Address Section (if separate addresses enabled) */}
      {separateAddresses && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowAddress(!showAddress)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
          >
            <MapPin className="h-4 w-4" />
            Delivery Address for this item
            {showAddress ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showAddress && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <Input
                label="Recipient Name"
                value={item.deliveryAddress?.name || ''}
                onChange={(e) => onAddressChange(itemIndex, 'name', e.target.value)}
                error={addressErrors?.name}
                placeholder="Enter recipient name"
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={item.deliveryAddress?.phone || ''}
                onChange={(e) => onAddressChange(itemIndex, 'phone', e.target.value)}
                error={addressErrors?.phone}
                placeholder="(XXX) XXX-XXXX"
                required
              />
              <div className="md:col-span-2">
                <Input
                  label="Street Address"
                  value={item.deliveryAddress?.street || ''}
                  onChange={(e) => onAddressChange(itemIndex, 'street', e.target.value)}
                  error={addressErrors?.street}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <Input
                label="City"
                value={item.deliveryAddress?.city || ''}
                onChange={(e) => onAddressChange(itemIndex, 'city', e.target.value)}
                error={addressErrors?.city}
                placeholder="Enter city"
                required
              />
              <Select
                label="State"
                value={item.deliveryAddress?.state || ''}
                onChange={(e) => onAddressChange(itemIndex, 'state', e.target.value)}
                error={addressErrors?.state}
                options={[{ value: '', label: 'Select State' }, ...US_STATES]}
                required
              />
              <Input
                label="Zip Code"
                value={item.deliveryAddress?.zipCode || ''}
                onChange={(e) => onAddressChange(itemIndex, 'zipCode', e.target.value)}
                error={addressErrors?.zipCode}
                placeholder="5-digit zip code"
                required
              />
            </div>
          )}
        </div>
      )}

      {/* Add Item Button (only on last item) */}
      {isLastItem && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onAddItem}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors font-medium"
            aria-label="Add another product to this order"
          >
            <Plus size={18} />
            Add Another Item
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderItemRow;
