import { useState, useEffect, useRef } from 'react';

/**
 * OptimizedImage Component
 * Provides WebP support with fallback, lazy loading, and accessibility
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
  objectFit = 'cover',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Generate WebP source if original is not WebP
  const getWebPSource = (originalSrc) => {
    if (!originalSrc) return null;
    if (originalSrc.endsWith('.webp')) return originalSrc;
    
    // Replace extension with .webp
    const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpSrc;
  };

  const webpSrc = getWebPSource(src);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  // Intersection Observer for lazy loading (if not using native lazy loading)
  useEffect(() => {
    if (priority || loading === 'eager') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            // Image is in viewport, browser will handle loading
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority, loading]);

  // Validate alt text (development-only warning)
  if (!alt && import.meta.env?.MODE === 'development') {
    console.warn('OptimizedImage: Missing alt text for image:', src);
  }

  return (
    <picture>
      {/* WebP source for modern browsers */}
      {webpSrc && webpSrc !== src && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      
      {/* Fallback to original format */}
      <img
        ref={imgRef}
        src={src}
        alt={alt || ''}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding={priority ? 'sync' : 'async'}
        style={{ objectFit }}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div
          className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm"
          style={{ width, height }}
        >
          Image failed to load
        </div>
      )}
    </picture>
  );
};

export default OptimizedImage;
