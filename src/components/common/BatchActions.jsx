import { useState } from 'react';
import { Trash2, Edit, Download, CheckSquare, Square, FileText, FileSpreadsheet, File } from 'lucide-react';
import Button from './Button';
import toast from 'react-hot-toast';

const BatchActions = ({ 
  selectedItems, 
  onSelectAll, 
  onDeselectAll, 
  totalItems,
  onBulkDelete,
  onBulkStatusUpdate,
  onBulkExport,
  statusOptions = [],
  exportFormats = ['csv', 'excel', 'pdf']
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const allSelected = selectedItems.length === totalItems && totalItems > 0;

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      onBulkDelete(selectedItems);
    }
  };

  const handleStatusUpdate = (status) => {
    onBulkStatusUpdate(selectedItems, status);
    setShowStatusMenu(false);
    toast.success(`Updated ${selectedItems.length} items to ${status}`);
  };

  const handleExport = (format) => {
    if (onBulkExport) {
      onBulkExport(selectedItems, format);
      setShowExportMenu(false);
    }
  };

  const exportFormatLabels = {
    csv: 'Export as CSV',
    excel: 'Export as Excel',
    pdf: 'Export as PDF'
  };

  const exportFormatIcons = {
    csv: FileText,
    excel: FileSpreadsheet,
    pdf: File
  };

  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:bottom-6 z-50 max-w-lg sm:max-w-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title={allSelected ? 'Deselect all' : 'Select all'}
          >
            {allSelected ? (
              <CheckSquare className="h-5 w-5 text-blue-600" />
            ) : (
              <Square className="h-5 w-5 text-gray-400" />
            )}
          </button>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            {selectedItems.length} selected
          </span>
        </div>

        <div className="h-px sm:h-8 sm:w-px bg-gray-300 sm:bg-gray-300" />

        <div className="flex flex-wrap items-center gap-2 flex-1">
          {onBulkStatusUpdate && statusOptions.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Update Status</span>
                <span className="sm:hidden">Status</span>
              </Button>
              {showStatusMenu && (
                <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[150px] z-50">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusUpdate(option.value)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {onBulkExport && exportFormats.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </Button>
              {showExportMenu && (
                <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[180px] z-50">
                  {exportFormats.map((format) => {
                    const Icon = exportFormatIcons[format] || Download;
                    return (
                      <button
                        key={format}
                        onClick={() => handleExport(format)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {exportFormatLabels[format] || `Export as ${format.toUpperCase()}`}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {onBulkDelete && (
            <Button
              variant="outline"
              onClick={handleBulkDelete}
              className="text-red-600 hover:bg-red-50 border-red-200 text-xs sm:text-sm px-2 sm:px-4"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              Delete
            </Button>
          )}
        </div>

        <button
          onClick={onDeselectAll}
          className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto sm:ml-2 text-gray-400 hover:text-gray-600 text-xl sm:text-lg"
          title="Clear selection"
          aria-label="Clear selection"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default BatchActions;
