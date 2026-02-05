const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{value}</p>
          {trend && (
            <p className={`mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${colors[color]} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
