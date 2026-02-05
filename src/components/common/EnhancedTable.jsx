import { ChevronUp, ChevronDown, Edit, Trash2, Eye } from 'lucide-react';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import Button from './Button';
import useTable from '../../hooks/useTable';

const EnhancedTable = ({
  data = [],
  columns = [],
  itemsPerPage = 25,
  onEdit = null,
  onDelete = null,
  onView = null,
  showActions = true,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
}) => {
  const {
    currentItems,
    currentPage,
    totalPages,
    totalItems,
    searchQuery,
    sortConfig,
    handleSort,
    handleSearch,
    paginate,
  } = useTable(data, itemsPerPage);

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="inline h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="inline h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder={searchPlaceholder}
          className="w-full sm:w-96"
        />
        <div className="text-sm text-gray-600">
          Showing {currentItems.length} of {totalItems} results
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                >
                  {column.label}
                  {column.sortable !== false && renderSortIcon(column.key)}
                </th>
              ))}
              {showActions && (onEdit || onDelete || onView) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={item.id || item._id || index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {showActions && (onEdit || onDelete || onView) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        />
      )}
    </div>
  );
};

export default EnhancedTable;
