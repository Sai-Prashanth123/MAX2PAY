import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowPositions = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children || (
        <HelpCircle 
          className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" 
          aria-label="Help"
        />
      )}
      {isVisible && content && (
        <div
          className={`absolute z-50 ${positions[position]} px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg whitespace-normal max-w-xs`}
          role="tooltip"
        >
          {content}
          <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowPositions[position]}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
