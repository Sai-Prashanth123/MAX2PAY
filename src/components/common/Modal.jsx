import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      // Keyboard handler
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
        {/* Backdrop with blur */}
        <div 
          className="modal-backdrop animate-fadeIn" 
          onClick={onClose}
          aria-hidden="true"
        ></div>
        
        {/* Modal content */}
        <div 
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className={`relative z-50 bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full animate-scaleIn border border-slate-200`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex-1 min-w-0 pr-4">
              {typeof title === 'string' ? (
                <h2 id="modal-title" className="text-xl font-bold text-slate-900 truncate">
                  {title}
                </h2>
              ) : (
                <div id="modal-title">{title}</div>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 focus-visible-ring"
                aria-label="Close modal"
                type="button"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          {/* Body */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
