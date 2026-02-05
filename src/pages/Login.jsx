import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../context/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { Home, AlertCircle, ArrowRight, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../utils/config';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedRole) {
      newErrors.role = 'Please select a portal type';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setShowErrorModal(false);
    setLoginErrorMessage('');

    try {
      const result = await login(formData);
      
      if (result && result.success) {
        navigate('/dashboard');
      } else {
        setLoginErrorMessage(result?.error || 'Invalid email or password. Please check your credentials and try again.');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginErrorMessage(error.response?.data?.message || error.message || 'Login failed. Please check your credentials and try again.');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail || !/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setForgotPasswordLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Password reset instructions have been sent to your email (if account exists).');
        setShowForgotPasswordModal(false);
        setForgotPasswordEmail('');
      } else {
        toast.error(data.message || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset email. Please try again or contact your administrator.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light font-display text-[#0c131d] flex items-center justify-center px-4 py-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="3PL FAST" 
              className="h-12 w-auto md:h-16 md:w-auto"
            />
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-black mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-600 text-center mb-6">
            Sign in to your account to continue
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Login As"
              name="role"
              value={selectedRole}
              onChange={handleRoleChange}
              options={[
                { value: '', label: 'Choose Account Type...' },
                { value: 'admin', label: 'Admin - Full Access' },
                { value: 'client', label: 'Client - Client Portal' }
              ]}
              error={errors.role}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot?
                </button>
              </div>
              <Input
                label=""
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Enter your password"
                error={errors.password}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* Back to Home */}
          <div className="mt-6">
            <Link to="/">
              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

      </div>

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title=""
        size="sm"
      >
        <div className="text-center py-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Login Failed</h3>
          <p className="text-slate-600 mb-4">
            {loginErrorMessage || 'Invalid email or password. Please check your credentials and try again.'}
          </p>
          <p className="text-sm text-slate-500 mb-4">
            If you've forgotten your password, click "Forgot?" on the login form.
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowErrorModal(false);
                setSelectedRole('');
                setFormData({ email: '', password: '' });
              }}
              className="flex-1"
            >
              Try Again
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowErrorModal(false)}
              className="flex-1"
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotPasswordModal}
        onClose={() => {
          setShowForgotPasswordModal(false);
          setForgotPasswordEmail('');
        }}
        title="Reset Password"
        size="sm"
      >
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-600">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>
          <Input
            label="Email Address"
            type="email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForgotPasswordModal(false);
                setForgotPasswordEmail('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              loading={forgotPasswordLoading}
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Login;
