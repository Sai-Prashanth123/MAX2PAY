import { Warehouse, Package, Clock3, RotateCcw, ClipboardList, Truck, CheckSquare, Cpu } from 'lucide-react';

const services = [
  {
    icon: Warehouse,
    title: 'Warehousing',
    description: 'Secure, climate-controlled hubs for your inventory.',
  },
  {
    icon: Package,
    title: 'Pick & Pack',
    description: '99.9% order accuracy with optimized pick paths.',
  },
  {
    icon: Clock3,
    title: 'Same-day Shipping',
    description: 'Orders placed by 2PM ship the same day.',
  },
  {
    icon: RotateCcw,
    title: 'Returns Management',
    description: 'Seamless reverse logistics and restocking.',
  },
  {
    icon: ClipboardList,
    title: 'FBA Prep',
    description: 'Amazon-compliant labeling and cartonization.',
  },
  {
    icon: Truck,
    title: 'Freight',
    description: 'LTL/FTL coverage across the US.',
  },
  {
    icon: CheckSquare,
    title: 'Inventory Control',
    description: 'Real-time stock visibility and cycle counts.',
  },
  {
    icon: Cpu,
    title: 'Automation',
    description: 'API-first fulfillment workflows.',
  },
];

const steps = [
  {
    step: 1,
    title: 'Connect Store',
    description: 'Sync Shopify, Amazon, or your custom cart in seconds.',
    tags: ['Shopify', 'Amazon', 'Etsy'],
  },
  {
    step: 2,
    title: 'Inbound Inventory',
    description:
      'Ship products to our US hubs. We receive, inspect, and stow every unit.',
  },
  {
    step: 3,
    title: 'Auto-Fulfillment',
    description:
      'New orders automatically trigger picking, packing, and shipping.',
  },
  {
    step: 4,
    title: 'Real-time Dashboard',
    description:
      'Track every shipment, stock level, and return from one interface.',
  },
];

const ServicesHowItWorks = () => {
  return (
    <section className="bg-slate-950 text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Badge + Heading */}
        <div className="space-y-3 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            Enterprise Ready
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            The backbone of your commerce engine.
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            Full-stack 3PL services that plug into your storefront and keep every
            order moving.
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-semibold tracking-tight">
              Our Services
            </h3>
            <span className="text-blue-400 text-sm font-medium">
              {services.length} Specialized Solutions
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/60 p-5 shadow-sm hover:border-blue-500/40 hover:shadow-lg transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-base font-semibold leading-tight">
                      {service.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How it Works */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold tracking-tight">
              The Fulfillment Journey
            </h3>
            <p className="text-sm text-slate-400">
              4 steps to get from integration to fully automated fulfillment.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px flex-1 bg-blue-500/20" />
                  )}
                </div>
                <div className="pb-6 pt-1 flex-1">
                  <h4 className="text-lg font-semibold">{step.title}</h4>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                  {step.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-900 rounded-full border border-blue-500/30 text-[10px] font-bold text-blue-300 uppercase tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHowItWorks;

