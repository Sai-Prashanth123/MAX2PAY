import { CheckCircle, Package, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import Button from '../common/Button';
import Card from '../common/Card';

const OrderConfirmation = ({ order, onClose, onViewOrders }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Created Successfully!</h2>
          <p className="text-gray-600">Your order has been submitted and is being processed</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Order Number</p>
              <p className="text-2xl font-bold text-blue-900">{order.orderNumber}</p>
            </div>
            <Package className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="font-semibold text-gray-900 capitalize">{order.status}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Priority</p>
              <p className="font-semibold text-gray-900 capitalize">{order.priority}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Created On</p>
                <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">Order Items ({order.items?.length || 0})</p>
            <div className="space-y-2">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productId?.name || 'Product'}</p>
                    {item.deliveryAddress && (
                      <p className="text-xs text-gray-500 mt-1">
                        Ships to: {item.deliveryAddress.city}, {item.deliveryAddress.state}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Qty: <span className="font-semibold text-gray-900">{item.quantity}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Notes</p>
              <p className="text-gray-900">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>What's Next?</strong> Your order is currently pending approval. 
            You'll be notified once it's approved and ready for processing. 
            You can track your order status from the Orders page.
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={onViewOrders} variant="primary" className="flex-1">
            View All Orders
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            Create Another Order
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderConfirmation;
