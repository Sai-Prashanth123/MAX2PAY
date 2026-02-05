import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

const DatePicker = ({ 
  label, 
  selected, 
  onChange, 
  error, 
  required = false,
  placeholder = 'Select date',
  minDate,
  maxDate,
  dateFormat = 'MM/dd/yyyy',
  showTimeSelect = false,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <ReactDatePicker
          selected={selected}
          onChange={onChange}
          dateFormat={dateFormat}
          placeholderText={placeholder}
          minDate={minDate}
          maxDate={maxDate}
          showTimeSelect={showTimeSelect}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          wrapperClassName="w-full"
          isClearable={true}
          {...props}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default DatePicker;
