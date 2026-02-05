import PublicNavbar from '../layout/PublicNavbar';

/**
 * Reusable wrapper to apply Stitch theme background + typography without changing app routing.
 * Use on public pages only.
 */
export default function StitchShell({ children, showNavbar = true }) {
  return (
    <div className="bg-background-light text-[#0c131d] antialiased font-display min-h-screen">
      {showNavbar ? <PublicNavbar /> : null}
      <div className="min-h-screen">{children}</div>
    </div>
  );
}

