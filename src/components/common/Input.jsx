import { AlertCircle, CheckCircle } from 'lucide-react';
import FieldError from './FieldError';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  className = '',
  showOptionalLabel = true,
  ...props
}) => {
  const defaultPlaceholder = placeholder || (
    !required && showOptionalLabel ? `Enter ${label?.toLowerCase() || 'value'} (optional)` : undefined
  );

  const inputClasses = `input ${
    error ? 'input-error' : success ? 'input-success' : ''
  } ${disabled ? 'bg-slate-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={name} 
          className={`label ${required ? 'label-required' : showOptionalLabel ? 'label-optional' : ''}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={defaultPlaceholder}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          aria-required={required}
          className={inputClasses}
          {...props}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
      {error && (
        <div id={`${name}-error`} className="error-message" role="alert">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <FieldError error={error} />
        </div>
      )}
      {success && !error && (
        <div className="success-message">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {helperText && !error && !success && (
        <p id={`${name}-helper`} className="text-sm text-slate-600 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
