import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Home, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../config/supabase';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    // Check if we have a valid reset token in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (type === 'recovery' && accessToken) {
      setValidToken(true);
    } else {
      setError('Invalid or expired reset link. Please request a new password reset.');
    }
  }, []);

  const validatePassword = () => {
    if (!newPassword) {
      setError('Password is required');
      return false;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      toast.success('Password reset successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background-light font-display text-[#0c131d] flex items-center justify-center px-4 py-8">
        <div className="fixed inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="3PL FAST" 
                className="h-12 w-auto md:h-16 md:w-auto"
              />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Password Reset Successful!</h3>
              <p className="text-slate-600 mb-4">
                Your password has been reset successfully. You will be redirected to the login page shortly.
              </p>
              <Link to="/login">
                <Button variant="primary" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light font-display text-[#0c131d] flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="3PL FAST" 
              className="h-12 w-auto md:h-16 md:w-auto"
            />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-black mb-2 text-center">
            Reset Your Password
          </h2>
          <p className="text-sm text-slate-600 text-center mb-6">
            Enter your new password below
          </p>

          {!validToken && error ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Invalid Reset Link</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Link to="/login">
                <Button variant="primary" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter new password"
                required
                minLength={6}
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                placeholder="Confirm new password"
                required
                minLength={6}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Reset Password
              </Button>

              <div className="mt-6">
                <Link to="/login">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
