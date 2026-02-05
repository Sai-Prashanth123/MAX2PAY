import { useState } from 'react';
import { Download } from 'lucide-react';
import { reportAPI } from '../utils/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import toast from 'react-hot-toast';

const Reports = () => {
  const [reportType, setReportType] = useState('inventory');
  const [loading, setLoading] = useState(false);

  const downloadCSV = (data, filename) => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadReport = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (reportType) {
        case 'inventory':
          response = await reportAPI.getInventory({ format: 'csv' });
          break;
        case 'orders':
          response = await reportAPI.getOrders({ format: 'csv' });
          break;
        case 'inbound':
          response = await reportAPI.getInbound({ format: 'csv' });
          break;
        default:
          return;
      }

      downloadCSV(response.data, `${reportType}-report-${Date.now()}.csv`);
      toast.success('Report downloaded successfully');
    } catch {
      toast.error('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <Card title="Generate Reports">
        <div className="space-y-4">
          <Select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={[
              { value: 'inventory', label: 'Inventory Report' },
              { value: 'orders', label: 'Orders Report' },
              { value: 'inbound', label: 'Inbound Report' },
            ]}
          />

          <Button
            onClick={handleDownloadReport}
            loading={loading}
            variant="primary"
          >
            <Download size={18} /> Download CSV Report
          </Button>
        </div>
      </Card>

      <Card title="Available Reports">
        <div className="space-y-3">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900">Inventory Report</h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete inventory details with stock levels, locations, and client information
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900">Orders Report</h3>
            <p className="text-sm text-gray-600 mt-1">
              All orders with status, client details, and delivery information
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900">Inbound Report</h3>
            <p className="text-sm text-gray-600 mt-1">
              Inbound shipment logs with quantities, dates, and storage locations
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
