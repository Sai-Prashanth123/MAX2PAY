import { useState } from 'react';
import toast from 'react-hot-toast';
import { contactAPI } from '../../utils/api';

/**
 * Stitch: 3pl_pricing_&_contact_lead_gen/code.html
 * Converted to JSX with the same Tailwind classes + Material Symbols.
 *
 * Note: This component submits to existing backend contact endpoint.
 */
export default function PricingContactStitch() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    volume: '100 - 500 orders/mo',
  });

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.create({
        name: form.name,
        email: form.email,
        company: '',
        phone: '',
        subject: 'Quote Request',
        message: `Monthly Order Volume: ${form.volume}`,
      });
      toast.success('Quote request sent!');
      setForm({ name: '', email: '', volume: '100 - 500 orders/mo' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light text-[#0c131d] font-display transition-colors duration-300">
      {/* Top Navigation (Stitch) */}
      <nav className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between p-4 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary-600 rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">package_2</span>
            </div>
            <span className="font-bold text-lg tracking-tight">MAX2PAY</span>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              className="material-symbols-outlined p-2 text-gray-600"
              aria-label="Search"
            >
              search
            </button>
            <button
              type="button"
              className="material-symbols-outlined p-2 text-gray-600"
              aria-label="Menu"
            >
              menu
            </button>
          </div>
        </div>
      </nav>

      <main className="pb-32 max-w-7xl mx-auto">
        {/* Hero */}
        <header className="px-4 pt-10 pb-6">
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight mb-4">
            Scale Your Brand with <span className="text-primary">Precision Logistics.</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Transparent rates and enterprise-grade tech for fast-growing US ecommerce brands.
          </p>
        </header>

        {/* Pricing Cards */}
        <section className="px-4 py-6">
          <div className="flex flex-col gap-4">
            {/* Storage */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-2xl">warehouse</span>
                </div>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Storage
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">Storage Solutions</h3>
              <p className="text-gray-500 text-sm mb-4">Climate-controlled secure warehousing</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-primary">$15</span>
                <span className="text-gray-500 font-medium">/ pallet / mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                  Real-time inventory tracking
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                  No long-term contracts
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                  Multi-warehouse distribution
                </li>
              </ul>
              <button className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                Get Custom Quote
              </button>
            </div>

            {/* Fulfillment */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <span className="material-symbols-outlined text-blue-500 text-2xl">conveyor_belt</span>
                </div>
                <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Fulfillment
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">Order Fulfillment</h3>
              <p className="text-gray-500 text-sm mb-4">Pick, pack &amp; same-day shipping</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-primary">$2.50</span>
                <span className="text-gray-500 font-medium">/ order</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                  Shopify &amp; Amazon Integration
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                  Custom unboxing experience
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                  99.9% shipping accuracy
                </li>
              </ul>
              <button className="w-full py-4 bg-gray-100 text-[#0c131d] font-bold rounded-lg transition-colors">
                Explore Full Rates
              </button>
            </div>
          </div>
        </section>

        {/* Lead Gen Form (wired) */}
        <section className="px-4 py-12">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-3">Ready to Grow?</h2>
            <p className="text-gray-500">Get a tailored quote in minutes from our experts.</p>
          </div>
          <form className="space-y-4 max-w-xl mx-auto" onSubmit={onSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 px-1">Full Name</label>
              <input
                className="w-full bg-white border-gray-200 rounded-lg p-4 focus:ring-primary focus:border-primary"
                placeholder="John Doe"
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 px-1">Work Email</label>
              <input
                className="w-full bg-white border-gray-200 rounded-lg p-4 focus:ring-primary focus:border-primary"
                placeholder="john@brand.com"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 px-1">Monthly Order Volume</label>
              <select
                className="w-full bg-white border-gray-200 rounded-lg p-4 focus:ring-primary focus:border-primary"
                name="volume"
                value={form.volume}
                onChange={onChange}
              >
                <option>100 - 500 orders/mo</option>
                <option>501 - 2,500 orders/mo</option>
                <option>2,501 - 10,000 orders/mo</option>
                <option>10,000+ orders/mo</option>
              </select>
            </div>
            <button
              className="w-full py-4 bg-primary text-white font-bold rounded-lg mt-4 shadow-lg shadow-primary/20 disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Submitting…' : 'Submit Quote Request'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

