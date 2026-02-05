import { useState } from 'react';
import { Settings as SettingsIcon, Save, DollarSign, MapPin, Bell, Shield, Database } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Tooltip from '../components/common/Tooltip';
import toast from 'react-hot-toast';
import useAuth from '../context/useAuth';

const Settings = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'MAX2PAY',
    supportEmail: 'support@max2pay.com',
    supportPhone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    currency: 'USD',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    defaultTaxRate: 8,
    defaultShippingFee: 2.50,
    defaultPickPackFee: 3.50,
    defaultStorageFee: 2.00,
    paymentTerms: 30,
  });

  const [warehouseSettings, setWarehouseSettings] = useState({
    defaultWarehouse: 'Main Warehouse',
    locations: ['Main Warehouse'],
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    orderNotifications: true,
    invoiceNotifications: true,
  });

  const handleSaveGeneral = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('General settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayment = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Payment settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWarehouse = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Warehouse settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Notification settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">You don't have permission to access settings.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'payment', label: 'Payment', icon: DollarSign },
    { id: 'warehouse', label: 'Warehouse', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <Card title="General Settings">
          <div className="space-y-4">
            <Input
              label="Company Name"
              value={generalSettings.companyName}
              onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
            />
            <Input
              label="Support Email"
              type="email"
              value={generalSettings.supportEmail}
              onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
            />
            <Input
              label="Support Phone"
              value={generalSettings.supportPhone}
              onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
            />
            <Select
              label="Timezone"
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
              options={[
                { value: 'America/New_York', label: 'Eastern Time (ET)' },
                { value: 'America/Chicago', label: 'Central Time (CT)' },
                { value: 'America/Denver', label: 'Mountain Time (MT)' },
                { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
              ]}
            />
            <Select
              label="Currency"
              value={generalSettings.currency}
              onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
              ]}
            />
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveGeneral} loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <Card title="Payment Settings">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-semibold text-gray-700">Default Tax Rate (%)</label>
                <Tooltip content="Default tax rate applied to invoices. Can be overridden per client." />
              </div>
              <Input
                type="number"
                value={paymentSettings.defaultTaxRate}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, defaultTaxRate: parseFloat(e.target.value) })}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-semibold text-gray-700">Default Shipping Fee ($)</label>
                <Tooltip content="Default shipping fee per order. Can be customized per order." />
              </div>
              <Input
                type="number"
                value={paymentSettings.defaultShippingFee}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, defaultShippingFee: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-semibold text-gray-700">Default Pick & Pack Fee ($)</label>
                <Tooltip content="Fee charged per order for picking and packing services." />
              </div>
              <Input
                type="number"
                value={paymentSettings.defaultPickPackFee}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, defaultPickPackFee: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-semibold text-gray-700">Default Storage Fee ($/unit/month)</label>
                <Tooltip content="Monthly storage fee per unit. Calculated based on inventory levels." />
              </div>
              <Input
                type="number"
                value={paymentSettings.defaultStorageFee}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, defaultStorageFee: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-semibold text-gray-700">Payment Terms (days)</label>
                <Tooltip content="Default number of days before invoice payment is due." />
              </div>
              <Input
                type="number"
                value={paymentSettings.paymentTerms}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, paymentTerms: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSavePayment} loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Warehouse Settings */}
      {activeTab === 'warehouse' && (
        <Card title="Warehouse Settings">
          <div className="space-y-4">
            <Input
              label="Default Warehouse Name"
              value={warehouseSettings.defaultWarehouse}
              onChange={(e) => setWarehouseSettings({ ...warehouseSettings, defaultWarehouse: e.target.value })}
            />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Warehouse Locations</label>
              <div className="space-y-2">
                {warehouseSettings.locations.map((location, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={location}
                      onChange={(e) => {
                        const newLocations = [...warehouseSettings.locations];
                        newLocations[index] = e.target.value;
                        setWarehouseSettings({ ...warehouseSettings, locations: newLocations });
                      }}
                    />
                    <Button
                      variant="danger"
                      onClick={() => {
                        const newLocations = warehouseSettings.locations.filter((_, i) => i !== index);
                        setWarehouseSettings({ ...warehouseSettings, locations: newLocations });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  onClick={() => {
                    setWarehouseSettings({
                      ...warehouseSettings,
                      locations: [...warehouseSettings.locations, 'New Location']
                    });
                  }}
                >
                  Add Location
                </Button>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveWarehouse} loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <Card title="Notification Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="font-medium text-gray-900">Email Notifications</label>
                <p className="text-sm text-gray-600">Enable email notifications for system events</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                className="h-5 w-5 text-blue-600 rounded"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="font-medium text-gray-900">Low Stock Alerts</label>
                <p className="text-sm text-gray-600">Get notified when inventory falls below reorder level</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.lowStockAlerts}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockAlerts: e.target.checked })}
                className="h-5 w-5 text-blue-600 rounded"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="font-medium text-gray-900">Order Notifications</label>
                <p className="text-sm text-gray-600">Receive notifications for new orders and status changes</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.orderNotifications}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, orderNotifications: e.target.checked })}
                className="h-5 w-5 text-blue-600 rounded"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="font-medium text-gray-900">Invoice Notifications</label>
                <p className="text-sm text-gray-600">Get notified when invoices are generated or paid</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.invoiceNotifications}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, invoiceNotifications: e.target.checked })}
                className="h-5 w-5 text-blue-600 rounded"
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveNotifications} loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Settings;
