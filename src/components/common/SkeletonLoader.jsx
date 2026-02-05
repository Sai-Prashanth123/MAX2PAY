const SkeletonLoader = ({ 
  type = 'card', 
  lines = 3, 
  height = 'h-4',
  className = '' 
}) => {
  if (type === 'card') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(lines)].map((_, i) => (
              <div key={i} className={`${height} bg-gray-200 rounded`} style={{ width: `${100 - (i * 10)}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b border-gray-100 flex items-center px-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-100 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse ${className}`}>
      <div className={`${height} bg-gray-200 rounded`}></div>
    </div>
  );
};

export default SkeletonLoader;
