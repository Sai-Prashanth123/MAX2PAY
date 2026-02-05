import { useState } from 'react';
import useAuth from '../context/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { HelpCircle, Mail, MessageSquare, FileText, Search, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactAPI } from '../utils/api';

const Support = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('contact');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      category: 'Orders',
      questions: [
        {
          q: 'How do I create a new order?',
          a: 'Navigate to "Create Order" in the sidebar, select your products, enter quantities, upload a shipping label PDF (optional), and click "Create Order".'
        },
        {
          q: 'How long does it take to process an order?',
          a: 'Orders are typically processed within 1-2 business days. You can track the status in "My Orders".'
        },
        {
          q: 'Can I cancel an order?',
          a: 'Orders can be cancelled if they are still in "pending" status. Contact support for assistance with order cancellations.'
        },
        {
          q: 'How do I track my order?',
          a: 'View your order details in "My Orders" to see the current status and tracking information once the order is dispatched.'
        }
      ]
    },
    {
      category: 'Inventory',
      questions: [
        {
          q: 'How often is inventory updated?',
          a: 'Inventory is updated in real-time. When admins make changes, they are reflected immediately in your portal.'
        },
        {
          q: 'What does "Reserved Stock" mean?',
          a: 'Reserved stock is inventory that has been allocated to pending orders but not yet shipped.'
        },
        {
          q: 'How do I request more inventory?',
          a: 'Contact your account manager or submit an inbound shipment request through the admin portal.'
        }
      ]
    },
    {
      category: 'Invoices',
      questions: [
        {
          q: 'When are invoices generated?',
          a: 'Invoices are typically generated monthly or after order fulfillment, depending on your billing cycle.'
        },
        {
          q: 'How do I pay an invoice?',
          a: 'Invoices can be paid through the payment methods specified in your account. Contact support for payment options.'
        },
        {
          q: 'Can I download my invoices?',
          a: 'Yes, you can download PDF copies of your invoices from the "Invoices" page.'
        }
      ]
    },
    {
      category: 'Account',
      questions: [
        {
          q: 'How do I update my company information?',
          a: 'Go to "Profile" in the sidebar to update your company details, contact information, and preferences.'
        },
        {
          q: 'How do I change my password?',
          a: 'Navigate to "Profile" and use the "Change Password" section to update your password.'
        },
        {
          q: 'Who can I contact for account issues?',
          a: 'Use the contact form on this page or email support@max2pay.com for account-related assistance.'
        }
      ]
    }
  ];

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    try {
      await contactAPI.create({
        name: user?.name || 'Client User',
        email: user?.email || '',
        company: user?.clientId?.companyName || '',
        phone: '',
        subject: formData.subject,
        message: `[Priority: ${formData.priority}]\n\n${formData.message}`,
      });
      
      setSubmitted(true);
      setFormData({ subject: '', message: '', priority: 'medium' });
      toast.success('Support request submitted successfully! We\'ll get back to you soon.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit support request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-1">Get help with your account, orders, and more</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contact'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Support
            </div>
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'faq'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </div>
          </button>
        </nav>
      </div>

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
              
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    We've received your support request and will get back to you within 24 hours.
                  </p>
                  <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low - General Question</option>
                      <option value="medium">Medium - Standard Request</option>
                      <option value="high">High - Urgent Issue</option>
                    </select>
                  </div>

                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    error={errors.subject}
                    placeholder="e.g., Order processing question"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Describe your issue or question in detail..."
                      required
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  <Button type="submit" loading={loading} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a href="mailto:support@max2pay.com" className="text-sm text-blue-600 hover:underline">
                      support@max2pay.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Response Time</p>
                    <p className="text-sm text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/orders" className="block text-sm text-blue-600 hover:underline">
                  View My Orders
                </a>
                <a href="/inventory" className="block text-sm text-blue-600 hover:underline">
                  Check Inventory
                </a>
                <a href="/invoices" className="block text-sm text-blue-600 hover:underline">
                  View Invoices
                </a>
                <a href="/profile" className="block text-sm text-blue-600 hover:underline">
                  Update Profile
                </a>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredFAQs.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No FAQs found matching your search.</p>
              </div>
            </Card>
          ) : (
            filteredFAQs.map((category, idx) => (
              <Card key={idx}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
                <div className="space-y-4">
                  {category.questions.map((faq, qIdx) => (
                    <div key={qIdx} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-900 mb-1">{faq.q}</h4>
                      <p className="text-gray-600 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Support;
