import { AlertTriangle, AlertCircle, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const StockAlert = ({ inventory }) => {
  if (!inventory || inventory.length === 0) {
    return null;
  }

  // Calculate stock levels - handle both 'products' and 'productId' field names
  const getProduct = (item) => item.products || item.productId;
  const getStockLevel = (item) => item.availableStock || item.available_stock || 0;
  
  const lowStockItems = inventory.filter(item => {
    const stockLevel = getStockLevel(item);
    const product = getProduct(item);
    const threshold = product?.reorderLevel || product?.reorder_level || 10;
    return stockLevel > 0 && stockLevel <= threshold;
  });

  const outOfStockItems = inventory.filter(item => {
    const stockLevel = getStockLevel(item);
    return stockLevel === 0;
  });

  const criticalItems = inventory.filter(item => {
    const stockLevel = getStockLevel(item);
    const product = getProduct(item);
    const threshold = (product?.reorderLevel || product?.reorder_level || 10) * 0.5;
    return stockLevel > 0 && stockLevel <= threshold;
  });

  if (lowStockItems.length === 0 && outOfStockItems.length === 0 && criticalItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Out of Stock Alert */}
      {outOfStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 text-red-600 rounded-full p-2 flex-shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-1">
                Out of Stock ({outOfStockItems.length})
              </h4>
              <p className="text-sm text-red-700 mb-2">
                The following items are out of stock and need immediate restocking:
              </p>
              <div className="space-y-1">
                {outOfStockItems.slice(0, 3).map(item => {
                  const product = getProduct(item);
                  return (
                    <div key={item._id || item.id} className="text-sm text-red-800">
                      • {product?.name || 'Unknown Product'} - SKU: {product?.sku || 'N/A'}
                    </div>
                  );
                })}
                {outOfStockItems.length > 3 && (
                  <Link to="/inventory" className="text-sm text-red-600 hover:text-red-800 font-medium">
                    + {outOfStockItems.length - 3} more items
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical Stock Alert */}
      {criticalItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 text-orange-600 rounded-full p-2 flex-shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 mb-1">
                Critical Stock Level ({criticalItems.length})
              </h4>
              <p className="text-sm text-orange-700 mb-2">
                These items are critically low and should be reordered soon:
              </p>
              <div className="space-y-1">
                {criticalItems.slice(0, 3).map(item => {
                  const product = getProduct(item);
                  const stockLevel = getStockLevel(item);
                  return (
                    <div key={item._id || item.id} className="text-sm text-orange-800 flex justify-between">
                      <span>• {product?.name || 'Unknown Product'}</span>
                      <span className="font-semibold">{stockLevel} units left</span>
                    </div>
                  );
                })}
                {criticalItems.length > 3 && (
                  <Link to="/inventory" className="text-sm text-orange-600 hover:text-orange-800 font-medium">
                    + {criticalItems.length - 3} more items
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && criticalItems.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100 text-yellow-600 rounded-full p-2 flex-shrink-0">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 mb-1">
                Low Stock Warning ({lowStockItems.length})
              </h4>
              <p className="text-sm text-yellow-700 mb-2">
                These items are running low on stock:
              </p>
              <div className="space-y-1">
                {lowStockItems.slice(0, 3).map(item => {
                  const product = getProduct(item);
                  const stockLevel = getStockLevel(item);
                  return (
                    <div key={item._id || item.id} className="text-sm text-yellow-800 flex justify-between">
                      <span>• {product?.name || 'Unknown Product'}</span>
                      <span className="font-semibold">{stockLevel} units</span>
                    </div>
                  );
                })}
                {lowStockItems.length > 3 && (
                  <Link to="/inventory" className="text-sm text-yellow-600 hover:text-yellow-800 font-medium">
                    + {lowStockItems.length - 3} more items
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAlert;
