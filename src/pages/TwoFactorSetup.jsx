import { useState, useEffect } from 'react';
import { Shield, Check, X } from 'lucide-react';
import axios from 'axios';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

import { API_URL } from '../utils/config';

const TwoFactorSetup = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('check'); // check, setup, verify, enabled

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token') || sessionStorage.getItem('token') || sessionStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/2fa/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEnabled(response.data.data.enabled);
      setStep(response.data.data.enabled ? 'enabled' : 'check');
    } catch {
      toast.error('Failed to check 2FA status');
    } finally {
      setLoading(false);
    }
  };

  const generateSecret = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('access_token') || sessionStorage.getItem('token') || sessionStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/2fa/generate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setQrCode(response.data.data.qrCode);
      setSecret(response.data.data.secret);
      setStep('setup');
      toast.success('QR code generated! Scan it with your authenticator app.');
    } catch {
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('access_token') || sessionStorage.getItem('token') || sessionStorage.getItem('access_token');
      await axios.post(`${API_URL}/2fa/verify-enable`, 
        { token: verificationCode },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setEnabled(true);
      setStep('enabled');
      setVerificationCode('');
      toast.success('Two-factor authentication enabled successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('access_token') || sessionStorage.getItem('token') || sessionStorage.getItem('access_token');
      await axios.post(`${API_URL}/2fa/disable`, 
        { token: verificationCode },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setEnabled(false);
      setStep('check');
      setVerificationCode('');
      setQrCode('');
      setSecret('');
      toast.success('Two-factor authentication disabled');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 'check') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h1>
        <p className="text-gray-600 mt-1">Add an extra layer of security to your account</p>
      </div>
      
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-2 mb-6" role="progressbar" aria-label="Setup progress">
        <div className={`w-3 h-3 rounded-full ${step === 'check' ? 'bg-blue-600' : 'bg-blue-200'}`} aria-label="Step 1: Check status" />
        <div className={`w-3 h-3 rounded-full ${step === 'setup' ? 'bg-blue-600' : step === 'enabled' ? 'bg-blue-200' : 'bg-gray-200'}`} aria-label="Step 2: Setup" />
        <div className={`w-3 h-3 rounded-full ${step === 'enabled' ? 'bg-blue-600' : 'bg-gray-200'}`} aria-label="Step 3: Complete" />
      </div>

      {step === 'check' && !enabled && (
        <Card>
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Enable Two-Factor Authentication
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Protect your account with an additional security layer. You'll need to enter a code from your authenticator app when logging in.
            </p>
            <Button onClick={generateSecret} loading={loading}>
              Get Started
            </Button>
          </div>
        </Card>
      )}

      {step === 'setup' && (
        <Card title="Setup Authenticator App">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                1. Download an authenticator app like Google Authenticator or Authy
              </p>
              <p className="text-sm text-gray-600 mb-4">
                2. Scan this QR code with your authenticator app:
              </p>
              <div className="flex justify-center my-6">
                {qrCode && (
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <img 
                      src={qrCode} 
                      alt="QR Code for authenticator app setup. Scan this code with your authenticator app like Google Authenticator or Authy." 
                      className="rounded-lg"
                      role="img"
                    />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Or enter this code manually:
              </p>
              <div 
                className="bg-gray-100 p-3 rounded-lg font-mono text-sm text-center break-all cursor-text select-all"
                role="textbox"
                aria-label="Secret key for manual entry"
                tabIndex={0}
                onClick={(e) => {
                  const range = document.createRange();
                  range.selectNodeContents(e.target);
                  const selection = window.getSelection();
                  selection.removeAllRanges();
                  selection.addRange(range);
                }}
              >
                {secret}
              </div>
              <p className="text-xs text-gray-500 mt-1">Click to select and copy</p>
            </div>

            <div>
              <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-4">
                3. Enter the 6-digit code from your authenticator app:
              </label>
              <Input
                id="verification-code"
                name="verificationCode"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                aria-label="6-digit verification code"
                required
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setStep('check');
                  setQrCode('');
                  setSecret('');
                  setVerificationCode('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={verifyAndEnable}
                loading={loading}
                disabled={verificationCode.length !== 6}
              >
                <Check size={18} /> Verify and Enable
              </Button>
            </div>
          </div>
        </Card>
      )}

      {step === 'enabled' && enabled && (
        <Card>
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Two-Factor Authentication is Enabled
                </h3>
                <p className="text-gray-600 mt-1">
                  Your account is protected with an additional security layer. You'll need to enter a code from your authenticator app when logging in.
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Disable Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600 mb-4">
                Enter a verification code from your authenticator app to disable 2FA:
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="disable-verification-code" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <Input
                    id="disable-verification-code"
                    name="disableVerificationCode"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    aria-label="6-digit verification code to disable 2FA"
                    required
                  />
                </div>
                <Button
                  variant="danger"
                  onClick={disable2FA}
                  loading={loading}
                  disabled={verificationCode.length !== 6}
                >
                  <X size={18} /> Disable 2FA
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TwoFactorSetup;
