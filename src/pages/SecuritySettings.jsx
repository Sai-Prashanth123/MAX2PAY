import { useState, useEffect } from 'react';
import { Shield, Key, Activity, Lock } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import TwoFactorSetup from '../components/security/TwoFactorSetup';
import toast from 'react-hot-toast';
import axios from 'axios';
import useAuth from '../context/useAuth';

const SecuritySettings = () => {
  const { user } = useAuth();
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFASetupDate, setTwoFASetupDate] = useState(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  useEffect(() => {
    fetch2FAStatus();
  }, []);

  const fetch2FAStatus = async () => {
    try {
      const response = await axios.get('/api/2fa-supabase/status', {
        withCredentials: true
      });
      setTwoFAEnabled(response.data.data.enabled);
      setTwoFASetupDate(response.data.data.setupDate);
    } catch (error) {
      console.error('Failed to fetch 2FA status:', error);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return;
    }

    try {
      await axios.post('/api/2fa-supabase/disable', {}, {
        withCredentials: true
      });
      setTwoFAEnabled(false);
      toast.success('2FA disabled successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to disable 2FA');
    }
  };

  const handleRegenerateBackupCodes = async () => {
    try {
      const response = await axios.post('/api/2fa-supabase/regenerate-backup-codes', {}, {
        withCredentials: true
      });
      
      const codes = response.data.data.backupCodes;
      const text = `3PL FAST - Two-Factor Authentication Backup Codes\n\n` +
                   `Generated: ${new Date().toLocaleString()}\n\n` +
                   `Keep these codes in a safe place. Each code can only be used once.\n\n` +
                   codes.map((code, i) => `${i + 1}. ${code}`).join('\n');
      
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '3plfast-backup-codes.txt';
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('New backup codes generated and downloaded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to regenerate backup codes');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
      </div>

      {/* Two-Factor Authentication */}
      <Card title="Two-Factor Authentication">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add an extra layer of security to your account by requiring a verification code
                  from your authenticator app when signing in.
                </p>
                {twoFAEnabled && twoFASetupDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Enabled on {new Date(twoFASetupDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <Badge type={twoFAEnabled ? 'success' : 'default'}>
              {twoFAEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            {!twoFAEnabled ? (
              <Button onClick={() => setIsSetupModalOpen(true)}>
                Enable 2FA
              </Button>
            ) : (
              <>
                <Button onClick={handleRegenerateBackupCodes} variant="outline">
                  Regenerate Backup Codes
                </Button>
                <Button onClick={handleDisable2FA} variant="danger">
                  Disable 2FA
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Login History */}
      <Card title="Login History">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Key className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Recent Login Activity</h3>
              <p className="text-sm text-gray-600 mt-1">
                View your recent login attempts and security events.
              </p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={() => window.location.href = '/security/login-audit'}>
              View Login History
            </Button>
          </div>
        </div>
      </Card>

      {/* Activity Timeline */}
      <Card title="Activity Timeline">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Account Activity</h3>
              <p className="text-sm text-gray-600 mt-1">
                Track all actions performed on your account including orders, invoices, and data changes.
              </p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={() => window.location.href = '/security/activity'}>
              View Activity Timeline
            </Button>
          </div>
        </div>
      </Card>

      {/* IP Whitelist (Admin Only) */}
      {user?.role === 'admin' && (
        <Card title="IP Whitelist Management">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">IP Address Whitelist</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Restrict access to your system by allowing only specific IP addresses.
                  This feature is currently disabled by default.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button variant="outline" onClick={() => window.location.href = '/security/ip-whitelist'}>
                Manage IP Whitelist
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 2FA Setup Modal */}
      <TwoFactorSetup
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onSuccess={() => {
          fetch2FAStatus();
          toast.success('Two-factor authentication enabled successfully!');
        }}
      />
    </div>
  );
};

export default SecuritySettings;
