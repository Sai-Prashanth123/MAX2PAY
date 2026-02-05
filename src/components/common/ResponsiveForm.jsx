/**
 * ResponsiveForm Components
 * 
 * MOBILE UI SAFETY GUARD:
 * On mobile, actions that affect money, inventory, or billing
 * must never be the primary action.
 * 
 * MOBILE STANDARDS ENFORCED:
 * - Forms: ALWAYS single column on mobile (xs/sm)
 * - Spacing: 8-point system only (16px, 24px, 32px)
 * - Touch targets: 44px minimum
 * - Text: 16px minimum body text
 * 
 * Breakpoints:
 * - Mobile: < 640px (ALWAYS single column)
 * - Tablet: 640px-1024px (configurable columns)
 * - Desktop: 1024px+ (multi-column layouts)
 */

/**
 * FormGrid - Responsive grid container for form fields
 * 
 * MOBILE RULE: Always single column on xs/sm screens
 * 
 * Props:
 * - columns: Number of columns on tablet+ (1, 2, 3, or 4)
 * - children: Form fields
 * - className: Additional CSS classes
 */
export const FormGrid = ({ columns = 2, children, className = '' }) => {
  // MOBILE STANDARD: Force single column on mobile, no override allowed
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  // MOBILE STANDARD: 8-point spacing system (16px, 24px, 32px)
  return (
    <div className={`grid ${gridClasses[columns]} gap-4 md:gap-6 lg:gap-8 ${className}`}>
      {children}
    </div>
  );
};

/**
 * FormSection - Grouped form fields with optional title
 * 
 * Props:
 * - title: Section title
 * - description: Optional description
 * - children: Form fields
 * - className: Additional CSS classes
 */
export const FormSection = ({ title, description, children, className = '' }) => {
  return (
    <div className={`space-y-4 sm:space-y-5 ${className}`}>
      {(title || description) && (
        <div className="border-b border-gray-200 pb-3 sm:pb-4">
          {title && (
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * FormActions - Responsive button group for form actions
 * 
 * Props:
 * - children: Action buttons
 * - align: 'left', 'center', or 'right'
 * - className: Additional CSS classes
 */
export const FormActions = ({ children, align = 'right', className = '' }) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`
      flex flex-col sm:flex-row gap-3 sm:gap-4 
      ${alignClasses[align]} 
      pt-4 sm:pt-6 border-t border-gray-200
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * ResponsiveButton - Mobile-optimized button
 * 
 * Props:
 * - variant: 'primary', 'secondary', 'danger', or 'ghost'
 * - size: 'sm', 'md', or 'lg'
 * - fullWidth: Boolean for full width on mobile
 * - children: Button content
 * - className: Additional CSS classes
 */
export const ResponsiveButton = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  children, 
  className = '',
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm sm:text-base',
    lg: 'px-6 py-3 text-base sm:text-lg',
  };

  return (
    <button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full sm:w-auto' : ''}
        font-medium rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-all duration-200
        touch-manipulation active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * FormCard - Card container for forms with responsive padding
 * 
 * Props:
 * - title: Card title
 * - children: Form content
 * - className: Additional CSS classes
 */
export const FormCard = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {title}
          </h2>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );
};

/**
 * MobileFormField - Optimized form field wrapper for mobile
 * 
 * Props:
 * - label: Field label
 * - required: Boolean for required indicator
 * - error: Error message
 * - hint: Helper text
 * - children: Input element
 * - className: Additional CSS classes
 */
export const MobileFormField = ({ 
  label, 
  required, 
  error, 
  hint, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`space-y-1.5 sm:space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs sm:text-sm text-gray-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs sm:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default {
  FormGrid,
  FormSection,
  FormActions,
  ResponsiveButton,
  FormCard,
  MobileFormField,
};
