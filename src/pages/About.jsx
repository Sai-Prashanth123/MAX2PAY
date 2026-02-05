import { Link } from 'react-router-dom';
import { Target, Users, Award, Package, TrendingUp, Shield, Zap, Globe, Check } from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We\'re committed to simplifying logistics for businesses of all sizes.',
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Innovation',
      description: 'We constantly improve our platform based on customer feedback.',
    },
    {
      icon: Users,
      title: 'Customer-Centric',
      description: 'Your success is our success. We\'re here to support you every step.',
    },
  ];

  const milestones = [
    { year: '2020', title: 'Company Founded', description: 'Started with a vision to revolutionize 3PL management' },
    { year: '2021', title: 'First 100 Clients', description: 'Reached our first major milestone' },
    { year: '2022', title: 'Enterprise Launch', description: 'Launched enterprise features and multi-warehouse support' },
    { year: '2023', title: '500+ Clients', description: 'Serving businesses across the United States' },
    { year: '2024', title: 'AI Integration', description: 'Introduced AI-powered analytics and automation' },
  ];

  const team = [
    { name: 'John Doe', role: 'CEO & Founder', initials: 'JD', color: 'bg-primary-600' },
    { name: 'Alice Lee', role: 'CTO', initials: 'AL', color: 'bg-green-500' },
    { name: 'Sarah Kim', role: 'Head of Operations', initials: 'SK', color: 'bg-orange-400' },
  ];

  return (
    <div className="bg-background-light text-[#0c131d] font-display min-h-screen">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full w-fit mx-auto mb-6">
            <span className="material-symbols-outlined text-sm">info</span>
            <span className="text-xs font-bold uppercase tracking-wider">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
            Building the Future of
            <span className="block mt-2 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              3PL Management
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We're a team of logistics experts, developers, and innovators dedicated to making warehouse management
            simple, efficient, and scalable for businesses of all sizes.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Founded in 2020, MAX2PAY was born from a simple observation: warehouse management systems were
                  outdated, expensive, and difficult to use. We set out to change that.
                </p>
                <p>
                  Today, we serve over 500 companies across the United States, processing millions of orders annually.
                  Our platform combines cutting-edge technology with intuitive design to deliver a solution that
                  actually works for modern businesses.
                </p>
                <p>
                  We believe that logistics shouldn't be a barrier to growth. That's why we've built a platform
                  that scales with you—from startup to enterprise—without the complexity or cost of traditional systems.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <div
                  className="w-full h-full bg-center bg-cover"
                  style={{
                    backgroundImage: 'url(/3pl.webp)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-16 md:py-24 bg-background-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl border border-slate-200 hover:border-primary-600/30 hover:shadow-lg transition-all text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-4 py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Our Journey</h2>
            <p className="text-lg text-slate-600">
              Key milestones in our growth and evolution.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-black text-lg">{milestone.year}</span>
                  </div>
                </div>
                <div className="flex-1 pb-8 border-b border-slate-200 last:border-0">
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-slate-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-16 md:py-24 bg-background-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Meet Our Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The passionate people behind MAX2PAY, dedicated to your success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-slate-200 hover:border-primary-600/30 hover:shadow-lg transition-all text-center"
              >
                <div className={`w-20 h-20 ${member.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black`}>
                  {member.initials}
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-slate-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to Join Us?
          </h2>
          <p className="text-lg text-primary-50 mb-8 max-w-2xl mx-auto">
            Start your free trial today and experience the difference our platform can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all active:scale-[0.98] shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/90 transition-all active:scale-[0.98] shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-background-dark text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} MAX2PAY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
