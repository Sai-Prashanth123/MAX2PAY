import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import toast from 'react-hot-toast';
import axios from 'axios';

const TwoFactorSetup = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Setup, 2: Verify, 3: Backup Codes
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/2fa-supabase/setup', {}, {
        withCredentials: true
      });

      setQrCode(response.data.data.qrCode);
      setSecret(response.data.data.secret);
      setBackupCodes(response.data.data.backupCodes);
      setStep(2);
      toast.success('Scan the QR code with your authenticator app');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      await axios.post('/api/2fa-supabase/verify', {
        token: verificationCode
      }, {
        withCredentials: true
      });

      setStep(3);
      toast.success('2FA enabled successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    onSuccess?.();
    onClose();
    setStep(1);
    setVerificationCode('');
  };

  const downloadBackupCodes = () => {
    const text = `3PL FAST - Two-Factor Authentication Backup Codes\n\n` +
                 `Generated: ${new Date().toLocaleString()}\n\n` +
                 `Keep these codes in a safe place. Each code can only be used once.\n\n` +
                 backupCodes.map((code, i) => `${i + 1}. ${code}`).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '3plfast-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enable Two-Factor Authentication"
      size="md"
    >
      <div className="space-y-6">
        {/* Step 1: Initial Setup */}
        {step === 1 && (
          <div className="text-center space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Two-factor authentication adds an extra layer of security to your account.
                You'll need an authenticator app like Google Authenticator or Authy.
              </p>
            </div>
            <Button onClick={handleSetup} loading={loading} className="w-full">
              Start Setup
            </Button>
          </div>
        )}

        {/* Step 2: Scan QR Code and Verify */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
              <div className="flex justify-center mb-4">
                {qrCode && (
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Scan this QR code with your authenticator app
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <p className="text-xs text-gray-500 mb-1">Manual Entry Key:</p>
                <code className="text-sm font-mono break-all">{secret}</code>
              </div>
            </div>

            <div className="border-t pt-4">
              <Input
                label="Verification Code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
              <Button 
                onClick={handleVerify} 
                loading={loading}
                disabled={verificationCode.length !== 6}
                className="w-full mt-4"
              >
                Verify and Enable
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Backup Codes */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Save Your Backup Codes
              </h3>
              <p className="text-sm text-yellow-800 mb-4">
                Keep these codes in a safe place. You can use them to access your account
                if you lose access to your authenticator app. Each code can only be used once.
              </p>
              <div className="bg-white border border-yellow-300 rounded p-4 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm">
                      {index + 1}. {code}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadBackupCodes} variant="outline" className="flex-1">
                  Download Codes
                </Button>
                <Button onClick={handleComplete} className="flex-1">
                  I've Saved My Codes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TwoFactorSetup;
