import FieldError from './FieldError';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error,
  required = false,
  disabled = false,
  className = '',
  showOptionalLabel = true,
  ...props
}) => {
  // Add optional indicator to placeholder if not required
  const defaultPlaceholder = !required && showOptionalLabel 
    ? `${placeholder} (optional)` 
    : placeholder;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1" title="Required field">*</span>}
          {!required && showOptionalLabel && (
            <span className="text-gray-500 text-sm font-normal ml-1">(Optional)</span>
          )}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        aria-required={required ? 'true' : 'false'}
        className={`input ${error ? 'border-red-500 focus:ring-red-500 bg-red-50' : ''} ${className}`}
        {...props}
      >
        <option value="">{defaultPlaceholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div id={`${name}-error`} role="alert">
          <FieldError error={error} />
        </div>
      )}
    </div>
  );
};

export default Select;
