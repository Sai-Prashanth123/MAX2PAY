/**
 * Stitch: warehouse_locations_&_testimonials/code.html
 * Converted to JSX with the same Tailwind classes + Material Symbols.
 */
export default function LocationsTestimonialsStitch() {
  return (
    <div className="bg-background-light font-display text-[#0c131d] transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">hub</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight">
              MAX2PAY
            </h1>
          </div>
          <button className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Contact Sales
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-24">
        {/* Map & Network */}
        <section className="mt-6 px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">National Network</h2>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">
              5 Major Hubs
            </span>
          </div>
          <div className="relative w-full aspect-[4/3] bg-white rounded-xl overflow-hidden border border-primary/10 shadow-sm">
            <div
              className="absolute inset-0 opacity-40 grayscale"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7NrE5n9NATy1odPtubs1JdoLRwhqYglFSmnPGpcLU-9sktIVt1GgAl4IIF8sI4xBgM_2nfPwvK8moIIgHvotaYj9Ybq3Ae0jn2XOLrGwppqlxgxxbySO4DzpXz1QP49VIj7gDxYwPxRcXqA4kNlPKWBrZG1jNHjvPi4kgnSLIJlZOSWS6PzGiRPRbCPvXQvQeG7kARumTx-BohrCQWTCEbG0hpHTlV9Wf3XU3nMM4fstBDM76L9w0RY7NNRDDq8XGIPzurOVpnKc")',
                backgroundSize: 'cover',
              }}
            />
            {/* Markers */}
            <div className="absolute top-[50%] left-[10%]">
              <div className="absolute h-4 w-4 bg-primary rounded-full animate-ping opacity-75" />
              <div className="relative h-4 w-4 bg-primary rounded-full border-2 border-white" />
            </div>
            <div className="absolute top-[65%] left-[45%]">
              <div className="absolute h-4 w-4 bg-primary rounded-full animate-ping opacity-75" />
              <div className="relative h-4 w-4 bg-primary rounded-full border-2 border-white" />
            </div>
            <div className="absolute top-[35%] left-[60%]">
              <div className="absolute h-4 w-4 bg-primary rounded-full animate-ping opacity-75" />
              <div className="relative h-4 w-4 bg-primary rounded-full border-2 border-white" />
            </div>
            <div className="absolute top-[75%] left-[80%]">
              <div className="absolute h-4 w-4 bg-primary rounded-full animate-ping opacity-75" />
              <div className="relative h-4 w-4 bg-primary rounded-full border-2 border-white" />
            </div>
            <div className="absolute top-[32%] left-[88%]">
              <div className="absolute h-4 w-4 bg-primary rounded-full animate-ping opacity-75" />
              <div className="relative h-4 w-4 bg-primary rounded-full border-2 border-white" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-primary/10">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                Current Coverage
              </p>
              <p className="text-sm font-medium">
                Strategic entry points for 2-day national delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Location chips */}
        <section className="mt-4">
          <div className="flex gap-2 px-4 overflow-x-auto pb-2">
            <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-primary text-white px-4 shadow-md">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <p className="text-sm font-semibold">CA</p>
            </div>
            {['TX', 'NJ', 'FL', 'IL'].map((s) => (
              <div
                key={s}
                className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white border border-primary/10 px-4"
              >
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <p className="text-sm font-medium">{s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* KPI Grid */}
        <section className="mt-8 px-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Enterprise Performance</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl border border-primary/10">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">verified</span>
              <p className="text-2xl font-bold tracking-tighter">99.9%</p>
              <p className="text-xs text-gray-500 font-medium">Order Accuracy</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-primary/10">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">bolt</span>
              <p className="text-2xl font-bold tracking-tighter">24-48h</p>
              <p className="text-xs text-gray-500 font-medium">Last-Mile Delivery</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-primary/10">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">sync</span>
              <p className="text-2xl font-bold tracking-tighter">Real-time</p>
              <p className="text-xs text-gray-500 font-medium">Inventory Sync</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-primary/10">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">monitoring</span>
              <p className="text-2xl font-bold tracking-tighter">25%</p>
              <p className="text-xs text-gray-500 font-medium">Avg. Cost Saving</p>
            </div>
          </div>
        </section>

        {/* Testimonials (2 cards) */}
        <section className="mt-8">
          <div className="px-4 mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Founder Stories</h2>
            <p className="text-sm text-gray-500">Scale with confidence like they did.</p>
          </div>
          <div className="flex gap-4 px-4 overflow-x-auto pb-6">
            <div className="flex-none w-[85%] bg-white rounded-2xl p-5 border border-primary/10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 overflow-hidden ring-2 ring-primary/30" />
                <div>
                  <p className="font-bold text-sm">Marcus Chen</p>
                  <p className="text-[10px] uppercase font-bold text-primary tracking-widest">
                    Founder, Lumin Skin
                  </p>
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 mb-4 border-l-4 border-primary">
                <p className="text-xl font-extrabold text-primary tracking-tighter">
                  300% Speed Increase
                </p>
              </div>
              <p className="text-sm italic text-gray-600">
                &quot;MAX2PAY didn&apos;t just ship our products; they optimized our entire lifecycle.
                Our delivery speed tripled in the first 3 months.&quot;
              </p>
            </div>

            <div className="flex-none w-[85%] bg-white rounded-2xl p-5 border border-primary/10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 overflow-hidden ring-2 ring-primary/30" />
                <div>
                  <p className="font-bold text-sm">Sarah Jenkins</p>
                  <p className="text-[10px] uppercase font-bold text-primary tracking-widest">
                    CEO, Bloom Floral
                  </p>
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 mb-4 border-l-4 border-primary">
                <p className="text-xl font-extrabold text-primary tracking-tighter">
                  50% Lower Overheads
                </p>
              </div>
              <p className="text-sm italic text-gray-600">
                &quot;Moving our warehousing to this network was the best decision for our bottom line.
                The accuracy is unparalleled.&quot;
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

