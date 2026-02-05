import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight, MessageSquare, Clock } from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';
import { contactAPI } from '../utils/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        }
        break;
      case 'subject':
        if (!value.trim()) {
          error = 'Subject is required';
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.trim().length < 10) {
          error = 'Message must be at least 10 characters';
        }
        break;
      case 'phone':
        if (value && !/^[\d\s()+-]+$/.test(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate on blur or after first interaction
    if (touched[name] || value) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};
    
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    
    setTouched(newTouched);
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
      await contactAPI.create(formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
      });
      setErrors({});
      setTouched({});
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light text-[#0c131d] font-display min-h-screen">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full w-fit mx-auto mb-6">
            <span className="material-symbols-outlined text-sm">mail</span>
            <span className="text-xs font-bold uppercase tracking-wider">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
            Let's Start a
            <span className="block mt-2 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Conversation
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-4 py-16 md:py-24 bg-background-light">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Send Us a Message</h2>
            <p className="text-lg text-slate-600">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  error={errors.name}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="john@example.com"
                  error={errors.email}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Company Name"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your Company"
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+1 (555) 123-4567"
                  error={errors.phone}
                />
              </div>

              <Input
                label="Subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="What is this regarding?"
                error={errors.subject}
                required
              />

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tell us more about your inquiry..."
                  required
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 transition-colors resize-none ${
                    errors.message ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-slate-300 focus:border-primary-600'
                  }`}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  loading={loading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFormData({
                      name: '',
                      email: '',
                      company: '',
                      phone: '',
                      subject: '',
                      message: '',
                    });
                  }}
                  className="flex-1"
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-background-dark text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} MAX2PAY. All rights reserved.</p>
        </div>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-black mb-2">Message Sent!</h3>
              <p className="text-slate-600 mb-6">
                Thank you for contacting us. We've received your message and will get back to you within 24 hours.
              </p>
              <Button
                variant="primary"
                onClick={() => setShowSuccessModal(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
