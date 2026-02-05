const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4'
  };

  const colorClasses = {
    primary: 'border-primary-600 border-r-transparent',
    white: 'border-white border-r-transparent',
    slate: 'border-slate-600 border-r-transparent'
  };

  return (
    <div 
      className={`inline-block animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
