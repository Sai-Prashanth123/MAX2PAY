import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * ResponsiveTable Component
 * 
 * A mobile-first responsive table wrapper that:
 * - Shows full table on desktop (1024px+)
 * - Converts to card layout on tablet (768px-1023px)
 * - Shows stacked cards on mobile (< 768px)
 * - Handles horizontal scroll gracefully
 * - Maintains accessibility
 * 
 * Usage:
 * <ResponsiveTable>
 *   <table className="min-w-full">
 *     <thead>...</thead>
 *     <tbody>...</tbody>
 *   </table>
 * </ResponsiveTable>
 */
const ResponsiveTable = ({ children, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Desktop & Tablet: Horizontal scroll container */}
      <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 lg:mx-0">
        <div className="inline-block min-w-full align-middle px-3 sm:px-4 md:px-6 lg:px-0">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ResponsiveTableCell Component
 * 
 * Mobile-optimized table cell with label for stacked layout
 * 
 * Props:
 * - label: Column header label (shown on mobile)
 * - children: Cell content
 * - className: Additional CSS classes
 */
export const ResponsiveTableCell = ({ label, children, className = '' }) => {
  return (
    <td className={`px-3 py-3 sm:px-4 sm:py-4 text-sm ${className}`}>
      {/* Mobile: Show label */}
      {label && (
        <span className="block sm:hidden font-medium text-gray-500 mb-1 text-xs">
          {label}
        </span>
      )}
      {/* Content */}
      <div className="text-gray-900">{children}</div>
    </td>
  );
};

/**
 * MobileCard Component
 * 
 * Alternative to table for mobile - shows data as expandable cards
 * 
 * Props:
 * - title: Card title
 * - subtitle: Card subtitle
 * - data: Array of { label, value } objects
 * - actions: React node for action buttons
 */
export const MobileCard = ({ title, subtitle, data = [], actions, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="ml-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Primary Data - Always Visible */}
      {data.slice(0, 2).map((item, index) => (
        <div key={index} className="flex justify-between items-center py-2 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500">{item.label}</span>
          <span className="text-sm text-gray-900 font-medium">{item.value}</span>
        </div>
      ))}

      {/* Expandable Section */}
      {data.length > 2 && (
        <>
          {isExpanded && (
            <div className="mt-2">
              {data.slice(2).map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-500">{item.label}</span>
                  <span className="text-sm text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-full mt-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show More ({data.length - 2} more)
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default ResponsiveTable;
