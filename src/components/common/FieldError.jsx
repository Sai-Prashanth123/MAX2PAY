import { AlertCircle } from 'lucide-react';

/**
 * FieldError Component
 * Consistent error message display for individual form fields
 * Used by Input, Select, and other form components
 */
const FieldError = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`flex items-start gap-1 mt-1 animate-fadeIn ${className}`}>
      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-600 leading-tight">{error}</p>
    </div>
  );
};

export default FieldError;
