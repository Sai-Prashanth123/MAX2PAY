import { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Briefcase, Calendar, Shield, Lock, Save, Camera, X, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../context/useAuth';
import { authAPI, clientAPI } from '../utils/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser, isClient } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loadingClient, setLoadingClient] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [companyData, setCompanyData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: ''
  });

  // Fetch client data if user is a client
  useEffect(() => {
    if (isClient && user?.clientId?.id) {
      fetchClientData();
    }
  }, [isClient, user?.clientId?.id]);

  const fetchClientData = async () => {
    if (!user?.clientId?.id) return;
    
    setLoadingClient(true);
    try {
      const response = await clientAPI.getById(user.clientId.id);
      const client = response.data.data;
      setCompanyData({
        companyName: client.companyName || '',
        contactPerson: client.contactPerson || '',
        email: client.email || '',
        phone: client.phone || '',
        address: {
          street: client.address?.street || '',
          city: client.address?.city || '',
          state: client.address?.state || '',
          zipCode: client.address?.zipCode || '',
          country: client.address?.country || 'United States',
        },
      });
    } catch (error) {
      console.error('Failed to fetch client data:', error);
    } finally {
      setLoadingClient(false);
    }
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setCompanyData({
        ...companyData,
        address: {
          ...companyData.address,
          [addressField]: value,
        },
      });
    } else {
      setCompanyData({ ...companyData, [name]: value });
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    if (!user?.clientId?.id) {
      toast.error('Client ID not found');
      return;
    }

    setLoading(true);
    try {
      await clientAPI.update(user.clientId.id, {
        companyName: companyData.companyName,
        contactPerson: companyData.contactPerson,
        email: companyData.email,
        phone: companyData.phone,
        address: companyData.address,
      });
      toast.success('Company information updated successfully!');
      await fetchClientData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update company information');
    } finally {
      setLoading(false);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    let label = '';
    let color = '';
    if (score <= 1) { label = 'Weak'; color = 'red'; }
    else if (score === 2) { label = 'Fair'; color = 'orange'; }
    else if (score === 3) { label = 'Good'; color = 'yellow'; }
    else if (score === 4) { label = 'Strong'; color = 'green'; }
    else { label = 'Very Strong'; color = 'green'; }

    return { score, label, color };
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    
    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      const response = await authAPI.uploadAvatar(file);
      const updatedUser = { ...user, avatar_url: response.data.data.avatar_url };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await authAPI.updateProfile({ avatar_url: null });
      const updatedUser = { ...user, avatar_url: null };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Avatar removed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove avatar');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data.data);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      toast.success('Profile updated successfully!', {
        duration: 4000,
        icon: '✅',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile', {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and password</p>
      </div>

      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-2 font-medium transition-colors ${
            activeTab === 'profile'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User size={18} className="inline mr-2" />
          Profile Information
        </button>
        {isClient && (
          <button
            onClick={() => setActiveTab('company')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'company'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 size={18} className="inline mr-2" />
            Company Information
          </button>
        )}
        <button
          onClick={() => setActiveTab('password')}
          className={`pb-4 px-2 font-medium transition-colors ${
            activeTab === 'password'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lock size={18} className="inline mr-2" />
          Change Password
        </button>
      </div>

      {activeTab === 'profile' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Link
              to="/2fa-setup"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Secure your account</p>
                </div>
              </div>
            </Link>
          </div>

          <Card title="Profile Information">
          <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-2xl">
            {/* Avatar Upload Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
              <div className="relative">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold border-4 border-gray-200">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg"
                  title="Upload avatar"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Profile Picture</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Upload a profile picture to personalize your account
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    loading={uploadingAvatar}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                  </Button>
                  {user?.avatar_url && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={handleRemoveAvatar}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
              
              <Input
                label="Email"
                type="email"
                value={user?.email}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
              />
              
              <Input
                label="Role"
                value={user?.role?.toUpperCase()}
                disabled
                className="bg-gray-50"
              />
            </div>

            {user?.role === 'client' && user?.clientId && (
              <Input
                label="Company"
                value={user.clientId.companyName || 'N/A'}
                disabled
                className="bg-gray-50"
              />
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" loading={loading}>
                <Save size={18} /> Save Changes
              </Button>
            </div>
          </form>
        </Card>
        </>
      )}

      {activeTab === 'company' && isClient && (
        <Card title="Company Information">
          {loadingClient ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading company information...</p>
            </div>
          ) : (
            <form onSubmit={handleCompanySubmit} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  name="companyName"
                  value={companyData.companyName}
                  onChange={handleCompanyChange}
                  required
                />
                <Input
                  label="Contact Person"
                  name="contactPerson"
                  value={companyData.contactPerson}
                  onChange={handleCompanyChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={companyData.email}
                  onChange={handleCompanyChange}
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={companyData.phone}
                  onChange={handleCompanyChange}
                  required
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                <Input
                  label="Street Address"
                  name="address.street"
                  value={companyData.address.street}
                  onChange={handleCompanyChange}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="City"
                    name="address.city"
                    value={companyData.address.city}
                    onChange={handleCompanyChange}
                  />
                  <Input
                    label="State"
                    name="address.state"
                    value={companyData.address.state}
                    onChange={handleCompanyChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="ZIP Code"
                    name="address.zipCode"
                    value={companyData.address.zipCode}
                    onChange={handleCompanyChange}
                  />
                  <Input
                    label="Country"
                    name="address.country"
                    value={companyData.address.country}
                    onChange={handleCompanyChange}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" loading={loading}>
                  <Save size={18} /> Save Company Information
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}

      {activeTab === 'password' && (
        <Card title="Change Password">
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-2xl">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Enter your current password"
            />

            <div>
              <Input
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Minimum 6 characters"
              />
              {passwordData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-semibold text-${passwordStrength.color}-600`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${passwordStrength.color}-500 h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Re-enter new password"
            />
            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
            )}
            {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
              <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Password Requirements:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
                <li>Minimum 6 characters long</li>
                <li>Use a strong, unique password</li>
                <li>Don't reuse passwords from other accounts</li>
              </ul>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" loading={loading}>
                <Lock size={18} /> Change Password
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default Profile;
