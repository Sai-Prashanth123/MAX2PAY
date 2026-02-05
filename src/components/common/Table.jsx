import { useState, useMemo, useEffect } from 'react';
import { ChevronUp, ChevronDown, Search, Package } from 'lucide-react';

const Table = ({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = 'No data available',
  emptyAction = null, // { label: string, onClick: function }
  searchable = false,
  sortable = false,
  paginated = false,
  itemsPerPage = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search term for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return data;
    
    const sorted = [...data].sort((a, b) => {
      const column = columns.find(col => col.accessor === sortConfig.key);
      let aValue = column?.accessor ? a[column.accessor] : '';
      let bValue = column?.accessor ? b[column.accessor] : '';
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [data, sortConfig, columns, sortable]);

  // Enhanced filtering logic - searches all fields including nested objects
  const filteredData = useMemo(() => {
    if (!searchable || !debouncedSearchTerm) return sortedData;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return sortedData.filter(row => {
      // Search in all columns
      const columnMatch = columns.some(column => {
        if (column.accessor) {
          const value = row[column.accessor];
          if (value !== null && value !== undefined) {
            // Handle nested objects (e.g., clientId.companyName)
            if (typeof value === 'object' && !Array.isArray(value)) {
              return Object.values(value).some(v => 
                String(v).toLowerCase().includes(searchLower)
              );
            }
            return String(value).toLowerCase().includes(searchLower);
          }
        }
        // Also check rendered values if possible
        if (column.render) {
          try {
            const rendered = column.render(row);
            if (rendered && typeof rendered === 'object' && rendered.props) {
              // Try to extract text from React elements
              const text = rendered.props.children || '';
              return String(text).toLowerCase().includes(searchLower);
            }
            return String(rendered).toLowerCase().includes(searchLower);
          } catch {
            // Ignore render errors
          }
        }
        return false;
      });
      
      // Also search in all row properties (for nested data)
      const rowMatch = Object.values(row).some(value => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'object' && !Array.isArray(value)) {
          return Object.values(value).some(v => 
            String(v).toLowerCase().includes(searchLower)
          );
        }
        if (Array.isArray(value)) {
          return value.some(v => String(v).toLowerCase().includes(searchLower));
        }
        return String(value).toLowerCase().includes(searchLower);
      });
      
      return columnMatch || rowMatch;
    });
  }, [sortedData, debouncedSearchTerm, columns, searchable]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!paginated) return filteredData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage, paginated]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (accessor) => {
    if (!sortable || !accessor) return;
    
    setSortConfig(prev => ({
      key: accessor,
      direction: prev.key === accessor && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const displayData = paginatedData;
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 px-4" role="status" aria-live="polite">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-gray-400" aria-hidden="true" />
        </div>
        <p className="text-gray-500 text-base mb-4">{emptyMessage}</p>
        {emptyAction && (
          <button
            onClick={emptyAction.onClick}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {emptyAction.label}
          </button>
        )}
      </div>
    );
  }

  if (filteredData.length === 0 && debouncedSearchTerm) {
    return (
      <div>
        {searchable && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search table"
              />
            </div>
          </div>
        )}
        <div className="text-center py-12" role="status" aria-live="polite">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Search className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <p className="text-gray-500">No results found for "{debouncedSearchTerm}"</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      {searchable && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search table"
              />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300" role="table" aria-label="Data table">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      onClick={() => column.accessor && handleSort(column.accessor)}
                      className={`px-3 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider whitespace-nowrap ${
                        sortable && column.accessor ? 'cursor-pointer hover:bg-gray-100 select-none focus:outline-none focus:ring-2 focus:ring-blue-500' : ''
                      }`}
                      role="columnheader"
                      aria-sort={sortable && column.accessor && sortConfig.key === column.accessor ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                      tabIndex={sortable && column.accessor ? 0 : -1}
                      onKeyDown={(e) => {
                        if (sortable && column.accessor && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          handleSort(column.accessor);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.header}</span>
                        {sortable && column.accessor && sortConfig.key === column.accessor && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp size={16} className="text-blue-600" aria-hidden="true" /> : 
                            <ChevronDown size={16} className="text-blue-600" aria-hidden="true" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-3 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {column.render ? column.render(row) : row[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4 md:px-0">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
