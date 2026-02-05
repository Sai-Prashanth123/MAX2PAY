import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import DashboardMockup from '../components/mockups/DashboardMockup';
import InventoryMockup from '../components/mockups/InventoryMockup';
import OrdersMockup from '../components/mockups/OrdersMockup';

export default function Home() {
  const stats = [
    { value: '500+', label: 'Active Clients' },
    { value: '2M+', label: 'Orders Processed' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="bg-background-light text-[#0c131d] font-display min-h-screen">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <img 
                  src="/logo.png" 
                  alt="3PL FAST" 
                  className="h-12 w-auto md:h-16 md:w-auto"
                />
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full w-fit">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Fast-Track 2024</span>
                </div>
              </div>
              
              <h1 className="heading-1 animate-fadeIn">
                Premium 3PL Warehouse Management System
              </h1>
              
              <p className="body-text text-slate-700 max-w-2xl animate-fadeIn" style={{animationDelay: '0.1s'}}>
                Streamline your logistics operations with our comprehensive warehouse management platform.
                Track inventory, manage orders, and serve multiple clients from a single, elegant solution.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                <Link
                  to="/login"
                  className="btn btn-primary text-lg px-8 py-4 btn-mobile-full"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="btn btn-secondary text-lg px-8 py-4 btn-mobile-full"
                >
                  Schedule Your Demo
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-black text-primary-600 mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-primary-600/10 to-transparent" />
                <div
                  className="w-full h-full bg-center bg-cover"
                  style={{
                    backgroundImage: 'url(/3pl2.webp)',
                  }}
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-600 flex items-center justify-center text-xs text-white font-bold">
                        JD
                      </div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-green-500 flex items-center justify-center text-xs text-white font-bold">
                        AL
                      </div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-orange-400 flex items-center justify-center text-xs text-white font-bold">
                        SK
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Trusted by 500+ US Companies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-black mb-4">How Our 3PL Warehouse Works</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 animate-fadeIn" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Get Started</h3>
              <p className="text-slate-600 leading-relaxed">
                Reach out to us through our contact form. Once approved, we'll create your dedicated account and give you secure access to our system.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 animate-fadeIn" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Send Us Your Products</h3>
              <p className="text-slate-600 leading-relaxed">
                Ship your products to our warehouse. Our team will receive and inbound them carefully.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 animate-fadeIn" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Inventory Goes Live</h3>
              <p className="text-slate-600 leading-relaxed">
                As soon as inbounding is complete, your products will be visible in your dashboard with real-time stock updates.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 animate-fadeIn md:col-span-2 lg:col-span-1" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-6">
                4
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Place Orders Easily</h3>
              <p className="text-slate-600 leading-relaxed">
                Create orders directly from your account by selecting products, adding quantities, and uploading the required PDF or documents.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 animate-fadeIn md:col-span-2" style={{animationDelay: '0.5s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-6">
                5
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">We Dispatch to Your Customers</h3>
              <p className="text-slate-600 leading-relaxed">
                We pick, pack, and dispatch the orders to your customers quickly and accurately — you focus on sales, we handle fulfillment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="px-4 py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Powerful Client Portal Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience a modern, intuitive interface designed to streamline your warehouse operations
            </p>
          </div>

          <div className="space-y-24">
            {/* Dashboard Feature */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 animate-fadeIn" style={{animationDelay: '0.1s'}}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
                  <span className="text-sm font-bold uppercase tracking-wider">Real-Time Dashboard</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-4">
                  Monitor Everything at a Glance
                </h3>
                <p className="text-lg text-slate-600 mb-6">
                  Get instant insights into your inventory levels, active orders, pending shipments, and monthly costs. 
                  Our intuitive dashboard puts all critical information right at your fingertips.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1 text-xl">✓</span>
                    <span className="text-slate-700">Live inventory tracking across all products</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1 text-xl">✓</span>
                    <span className="text-slate-700">Real-time order status updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1 text-xl">✓</span>
                    <span className="text-slate-700">Comprehensive analytics and reporting</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 lg:order-2 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                <div className="rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <DashboardMockup />
                </div>
              </div>
            </div>

            {/* Inventory Feature */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fadeIn" style={{animationDelay: '0.1s'}}>
                <div className="rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <InventoryMockup />
                </div>
              </div>
              <div className="animate-fadeIn" style={{animationDelay: '0.2s'}}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-6">
                  <span className="text-sm font-bold uppercase tracking-wider">Inventory Management</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-4">
                  Complete Control Over Your Stock
                </h3>
                <p className="text-lg text-slate-600 mb-6">
                  View all your products in one place with detailed stock levels, SKU information, and smart filtering. 
                  Get instant alerts for low stock items and manage your inventory efficiently.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1 text-xl">✓</span>
                    <span className="text-slate-700">Visual product cards with stock status</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1 text-xl">✓</span>
                    <span className="text-slate-700">Advanced search and filtering options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1 text-xl">✓</span>
                    <span className="text-slate-700">Low stock and out-of-stock alerts</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Orders Feature */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 animate-fadeIn" style={{animationDelay: '0.1s'}}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-6">
                  <span className="text-sm font-bold uppercase tracking-wider">Order Management</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-4">
                  Streamlined Order Processing
                </h3>
                <p className="text-lg text-slate-600 mb-6">
                  Create, track, and manage orders with ease. Upload documents, monitor fulfillment status, 
                  and keep your customers informed every step of the way.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1 text-xl">✓</span>
                    <span className="text-slate-700">Quick order creation with product selection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1 text-xl">✓</span>
                    <span className="text-slate-700">Document upload and attachment support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1 text-xl">✓</span>
                    <span className="text-slate-700">Real-time order tracking and status updates</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 lg:order-2 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                <div className="rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <OrdersMockup />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Join thousands of businesses that trust our platform to manage their warehouse operations efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-background-dark text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} 3PL FAST. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
