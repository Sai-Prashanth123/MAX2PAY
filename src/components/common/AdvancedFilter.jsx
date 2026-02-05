import { useState, useEffect, useRef } from 'react';
import { Filter, X, Calendar, Download, ChevronDown } from 'lucide-react';
import Button from './Button';
import DatePicker from './DatePicker';
import Select from './Select';

const AdvancedFilter = ({ 
  onFilterChange, 
  onExport,
  statusOptions = [],
  clientOptions = [],
  showDateRange = true,
  showStatus = true,
  showClient = true,
  showExport = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportDropdownRef = useRef(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: [],
    clientId: '',
    search: ''
  });

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setIsExportOpen(false);
      }
    };

    if (isExportOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportOpen]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusToggle = (status) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    handleFilterChange('status', newStatus);
  };

  const clearFilters = () => {
    const clearedFilters = {
      startDate: null,
      endDate: null,
      status: [],
      clientId: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilterCount = 
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0) +
    filters.status.length +
    (filters.clientId ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="relative">
      {/* Mobile: Stack vertically with same width/height, Desktop: Row layout */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-stretch sm:items-center">
        <Button
          variant={activeFilterCount > 0 ? 'primary' : 'outline'}
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-11 w-full sm:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button 
            variant="outline" 
            onClick={clearFilters} 
            className="h-11 w-full sm:w-auto text-xs sm:text-sm"
          >
            <X className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Clear All</span>
          </Button>
        )}

        {showExport && onExport && (
          <div className="relative sm:ml-auto w-full sm:w-auto" ref={exportDropdownRef}>
            <Button 
              variant="outline" 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="h-11 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download as</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    onExport('csv');
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  CSV
                </button>
                <button
                  onClick={() => {
                    onExport('excel');
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Excel
                </button>
                <button
                  onClick={() => {
                    onExport('pdf');
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 sm:left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 w-screen sm:w-96 max-w-[calc(100vw-2rem)]">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {showDateRange && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date Range
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <DatePicker
                    selected={filters.startDate}
                    onChange={(date) => handleFilterChange('startDate', date)}
                    placeholder="Start date"
                    maxDate={filters.endDate || new Date()}
                  />
                  <DatePicker
                    selected={filters.endDate}
                    onChange={(date) => handleFilterChange('endDate', date)}
                    placeholder="End date"
                    minDate={filters.startDate}
                    maxDate={new Date()}
                  />
                </div>
              </div>
            )}

            {showStatus && statusOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusToggle(option.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filters.status.includes(option.value)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showClient && clientOptions.length > 0 && (
              <div>
                <Select
                  label="Client"
                  value={filters.clientId}
                  onChange={(e) => handleFilterChange('clientId', e.target.value)}
                  options={[
                    { value: '', label: 'All Clients' },
                    ...clientOptions
                  ]}
                />
              </div>
            )}

            <div className="pt-2 border-t">
              <Button
                variant="primary"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter;
