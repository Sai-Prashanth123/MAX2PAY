import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Background Image - Optimized for mobile performance */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/3pl2.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay for readability - Responsive opacity */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
      </div>
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          {/* Main content area - Responsive padding for all screen sizes */}
          <main className="flex-1 w-full min-w-0 overflow-x-hidden px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8">
            <div className="max-w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
