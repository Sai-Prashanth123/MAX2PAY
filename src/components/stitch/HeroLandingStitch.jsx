import { Link } from 'react-router-dom';

/**
 * Stitch: 3pl_logistics_landing_page_-_hero/code.html
 * Converted to JSX with the same Tailwind classes + Material Symbols.
 */
export default function HeroLandingStitch() {
  return (
    <>
      {/* TopAppBar (Stitch) */}
      <nav className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center px-4 py-4 justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="text-primary-600 flex items-center">
              <span className="material-symbols-outlined text-3xl font-bold">package_2</span>
            </div>
            <h2 className="text-[#0c131d] text-xl font-bold leading-tight tracking-[-0.015em]">
              MAX2PAY
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="bg-primary/10 text-primary-600 px-4 py-2 rounded-lg text-sm font-bold tracking-tight"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HeroSection */}
      <main className="relative">
        <div className="px-4 py-12">
          <div className="flex flex-col gap-10">
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/40 to-transparent" />
              <div
                className="w-full h-full bg-center bg-cover"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBS_WqFQQbgukIbhwSgPsEhKk6phEbQIv_drZNy--Un_wBqAdvJLaHywKEQH0OD7igTtFJh8cgosutdFfkESAXgWBeViNWIsW3KeGJiN2kUI_6oHzFePTPpwsRUU_Xd41XjV6F3_ihVHr6lLkkeFfhT2hRSgQoyplhw5GQmqpf3Y4dYayRPJnxLhs19OVPWGoYOrcpnBjKjUs0sv_bE8e9C_1hgJ8mfrU7426sQ8PK_oFRcqmkNQOLk9FYRRVQwojXTIMU8RXVxcU4")',
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-600 flex items-center justify-center text-[10px] text-white font-bold">
                    JD
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">
                    AL
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-400 flex items-center justify-center text-[10px] text-white font-bold">
                    SK
                  </div>
                </div>
                <p className="text-[12px] font-medium text-slate-600">
                  Trusted by 500+ US Founders
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary-600 rounded-full w-fit">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Fast-Track 2024
                  </span>
                </div>
                <h1 className="text-[#0c131d] text-4xl font-black leading-[1.1] tracking-[-0.04em]">
                  Fast, Reliable Fulfillment Across the USA
                </h1>
                <p className="text-slate-600 text-lg font-normal leading-relaxed">
                  Scale your e-commerce brand without the logistics headaches. We handle
                  the heavy lifting while you focus on growth.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/contact"
                  className="flex w-full items-center justify-center overflow-hidden rounded-xl h-14 bg-white border-2 border-slate-200 text-[#0c131d] text-lg font-bold active:scale-[0.98] transition-transform"
                >
                  <span className="truncate">Book a Demo</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-white/40 py-8 border-y border-slate-100">
          <p className="text-[#456aa1] text-[10px] font-black leading-normal tracking-[0.2em] px-4 mb-6 text-center uppercase">
            OFFICIAL PARTNER INTEGRATIONS
          </p>
          <div className="flex justify-around items-center px-6 gap-8 overflow-x-auto">
            <div className="flex flex-col items-center gap-1 min-w-[80px]">
              <span className="material-symbols-outlined text-4xl opacity-40">shopping_cart</span>
              <span className="text-[10px] font-bold opacity-40">Shopify</span>
            </div>
            <div className="flex flex-col items-center gap-1 min-w-[80px]">
              <span className="material-symbols-outlined text-4xl opacity-40">storefront</span>
              <span className="text-[10px] font-bold opacity-40">Amazon</span>
            </div>
            <div className="flex flex-col items-center gap-1 min-w-[80px]">
              <span className="material-symbols-outlined text-4xl opacity-40">local_shipping</span>
              <span className="text-[10px] font-bold opacity-40">FedEx</span>
            </div>
            <div className="flex flex-col items-center gap-1 min-w-[80px]">
              <span className="material-symbols-outlined text-4xl opacity-40">inventory_2</span>
              <span className="text-[10px] font-bold opacity-40">Walmart</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

