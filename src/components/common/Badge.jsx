import { getStatusColor, getPriorityColor } from '../../utils/helpers';

const Badge = ({ children, variant = 'default', type = 'status' }) => {
  let colorClass = 'bg-gray-100 text-gray-800';

  if (type === 'status') {
    colorClass = getStatusColor(children);
  } else if (type === 'priority') {
    colorClass = getPriorityColor(children);
  } else if (variant) {
    const variants = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      default: 'bg-gray-100 text-gray-800',
    };
    colorClass = variants[variant] || variants.default;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {children}
    </span>
  );
};

export default Badge;
