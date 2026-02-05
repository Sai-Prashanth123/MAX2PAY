import { CheckCircle, Clock, Package, Truck, Home, XCircle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const OrderTimeline = ({ order }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5" />;
      case 'packed':
        return <Package className="h-5 w-5" />;
      case 'dispatched':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <Home className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status, isActive) => {
    if (!isActive) return 'bg-gray-200 text-gray-400';
    
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'approved':
        return 'bg-blue-100 text-blue-600';
      case 'packed':
        return 'bg-purple-100 text-purple-600';
      case 'dispatched':
        return 'bg-indigo-100 text-indigo-600';
      case 'delivered':
        return 'bg-green-100 text-green-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const statusOrder = ['pending', 'approved', 'packed', 'dispatched'];
  const currentStatusIndex = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  const timelineSteps = [
    {
      status: 'pending',
      label: 'Order Placed',
      date: order.createdAt,
      description: 'Order submitted and awaiting approval'
    },
    {
      status: 'approved',
      label: 'Approved',
      date: order.approvedAt,
      description: 'Order approved and ready for processing',
      user: order.approvedBy?.name
    },
    {
      status: 'packed',
      label: 'Packed',
      date: order.packedAt,
      description: 'Items picked and packed for shipment'
    },
    {
      status: 'dispatched',
      label: 'Dispatched',
      date: order.dispatchedAt,
      description: 'Order shipped for delivery',
      tracking: order.trackingNumber
    }
  ];

  // Add cancelled step if order is cancelled
  if (isCancelled) {
    timelineSteps.push({
      status: 'cancelled',
      label: 'Cancelled',
      date: order.updatedAt,
      description: 'Order has been cancelled'
    });
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900 mb-4">Order Timeline</h4>
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Timeline Steps */}
        <div className="space-y-6">
          {timelineSteps.map((step) => {
            const isCompleted = isCancelled 
              ? step.status === 'cancelled' 
              : statusOrder.indexOf(step.status) <= currentStatusIndex;
            const isActive = step.status === order.status;
            
            return (
              <div key={step.status} className="relative flex gap-4">
                {/* Icon */}
                <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${getStatusColor(step.status, isCompleted)}`}>
                  {getStatusIcon(step.status)}
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </h5>
                      <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                      {step.user && isCompleted && (
                        <p className="text-xs text-gray-500 mt-1">
                          By: {step.user}
                        </p>
                      )}
                      {step.tracking && isCompleted && (
                        <p className="text-xs text-gray-500 mt-1">
                          Tracking: <span className="font-mono">{step.tracking}</span>
                        </p>
                      )}
                    </div>
                    {step.date && isCompleted && (
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(step.date)}
                      </span>
                    )}
                  </div>
                  
                  {isActive && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      Current Status
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
