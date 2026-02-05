import LoadingSpinner from './LoadingSpinner';

/**
 * MOBILE UI SAFETY GUARD:
 * On mobile, actions that affect money, inventory, or billing
 * must never be the primary action. Use secondary or danger variants
 * for destructive/financial operations.
 * 
 * MOBILE STANDARDS ENFORCED:
 * - Minimum button height: 44px (52px for primary on mobile)
 * - Active animation: scale(0.97) only
 * - Variants: primary, secondary, danger only on mobile
 * - Default: full-width on mobile unless explicitly overridden
 */

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  fullWidthMobile = true, // Changed default to true for mobile safety
  ...props 
}) => {
  // MOBILE STANDARD: Single active animation scale(0.97)
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible-ring active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation';
  
  // MOBILE STANDARD: Only primary, secondary, danger on mobile
  // success and outline map to secondary on mobile
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-primary-700 hover:bg-primary-50 active:bg-primary-100 border-2 border-primary-600 hover:border-primary-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg',
    // Desktop-only variants (map to secondary on mobile)
    success: 'bg-white text-primary-700 hover:bg-primary-50 active:bg-primary-100 border-2 border-primary-600 hover:border-primary-700 md:bg-green-600 md:text-white md:hover:bg-green-700 md:active:bg-green-800 md:shadow-md md:hover:shadow-lg',
    outline: 'bg-white text-primary-700 hover:bg-primary-50 active:bg-primary-100 border-2 border-primary-600 hover:border-primary-700 md:bg-transparent md:border-slate-300 md:text-slate-700 md:hover:bg-slate-50 md:hover:border-slate-400',
  };

  // MOBILE STANDARD: Enforce 44px minimum, remove sm on mobile
  // Primary buttons get 52px on mobile for prominence
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[44px] md:min-h-[40px]', // 44px on mobile, 40px on desktop
    md: variant === 'primary' 
      ? 'px-6 py-3 text-base min-h-[52px] md:min-h-[44px]' // 52px primary on mobile
      : 'px-6 py-3 text-base min-h-[48px] md:min-h-[44px]', // 48px secondary on mobile
    lg: 'px-8 py-4 text-lg min-h-[52px]',
  };

  // MOBILE STANDARD: Full-width by default on mobile
  const mobileClass = fullWidthMobile ? 'w-full sm:w-auto' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${mobileClass} ${className}`}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size={size === 'sm' ? 'sm' : 'md'} 
          color={variant === 'secondary' || variant === 'outline' ? 'primary' : 'white'} 
        />
      )}
      {loading ? (
        <span>{typeof children === 'string' ? `${children}...` : children}</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
