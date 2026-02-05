import { AlertCircle, X } from 'lucide-react';
import { formatFieldName } from '../../utils/validationMessages';

/**
 * ErrorSummary Component
 * Displays all validation errors simultaneously in a consistent format
 * Shows at the top of forms for better visibility
 */
const ErrorSummary = ({ errors, onDismiss, className = '' }) => {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  const errorEntries = Object.entries(errors);

  return (
    <div className={`bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 animate-slideDown ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            {errorEntries.length === 1 
              ? 'Please fix the following error:' 
              : `Please fix the following ${errorEntries.length} errors:`}
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errorEntries.map(([field, message]) => (
              <li key={field} className="text-sm text-red-700">
                <span className="font-medium">{formatFieldName(field)}:</span> {message}
              </li>
            ))}
          </ul>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-3 text-red-500 hover:text-red-700 transition-colors"
            aria-label="Dismiss errors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorSummary;
