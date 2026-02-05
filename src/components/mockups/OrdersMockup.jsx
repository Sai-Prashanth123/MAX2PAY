export default function OrdersMockup() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Browser Window */}
      <rect width="800" height="600" rx="12" fill="#ffffff" />
      <rect width="800" height="40" rx="12" fill="#f1f5f9" />
      
      {/* Browser Dots */}
      <circle cx="20" cy="20" r="6" fill="#ef4444" />
      <circle cx="40" cy="20" r="6" fill="#f59e0b" />
      <circle cx="60" cy="20" r="6" fill="#10b981" />
      
      {/* URL Bar */}
      <rect x="100" y="12" width="600" height="16" rx="8" fill="#e2e8f0" />
      <text x="110" y="23" fontSize="10" fill="#64748b" fontFamily="system-ui">
        3plfast.com/client/orders
      </text>
      
      {/* Header */}
      <rect x="20" y="60" width="760" height="60" rx="8" fill="#0f172a" />
      <text x="40" y="95" fontSize="20" fill="#ffffff" fontWeight="bold" fontFamily="system-ui">
        Order Management
      </text>
      <rect x="620" y="75" width="140" height="30" rx="6" fill="#3b82f6" />
      <text x="640" y="96" fontSize="13" fill="#ffffff" fontWeight="600" fontFamily="system-ui">
        + Create Order
      </text>
      
      {/* Tabs */}
      <rect x="20" y="140" width="100" height="40" rx="8" fill="#3b82f6" />
      <text x="45" y="165" fontSize="13" fill="#ffffff" fontWeight="600" fontFamily="system-ui">
        All Orders
      </text>
      
      <rect x="130" y="140" width="100" height="40" rx="8" fill="#f1f5f9" />
      <text x="150" y="165" fontSize="13" fill="#64748b" fontWeight="600" fontFamily="system-ui">
        Pending
      </text>
      
      <rect x="240" y="140" width="120" height="40" rx="8" fill="#f1f5f9" />
      <text x="255" y="165" fontSize="13" fill="#64748b" fontWeight="600" fontFamily="system-ui">
        Dispatched
      </text>
      
      {/* Order Cards */}
      {/* Order 1 */}
      <rect x="20" y="200" width="760" height="100" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="40" y="220" width="60" height="60" rx="8" fill="#dbeafe" />
      <text x="55" y="258" fontSize="24" fill="#3b82f6" fontFamily="system-ui">
        📋
      </text>
      
      <text x="120" y="235" fontSize="16" fill="#0f172a" fontWeight="bold" fontFamily="system-ui">
        Order #ORD-2024-089
      </text>
      <text x="120" y="255" fontSize="13" fill="#64748b" fontFamily="system-ui">
        Created: Jan 23, 2024 • 12 items • Customer: ABC Corp
      </text>
      <text x="120" y="275" fontSize="13" fill="#64748b" fontFamily="system-ui">
        Delivery: 123 Main St, New York, NY 10001
      </text>
      
      <rect x="650" y="230" width="100" height="28" rx="14" fill="#dcfce7" />
      <text x="670" y="249" fontSize="12" fill="#15803d" fontWeight="600" fontFamily="system-ui">
        Dispatched
      </text>
      
      {/* Order 2 */}
      <rect x="20" y="320" width="760" height="100" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="40" y="340" width="60" height="60" rx="8" fill="#fef3c7" />
      <text x="55" y="378" fontSize="24" fill="#f59e0b" fontFamily="system-ui">
        📦
      </text>
      
      <text x="120" y="355" fontSize="16" fill="#0f172a" fontWeight="bold" fontFamily="system-ui">
        Order #ORD-2024-090
      </text>
      <text x="120" y="375" fontSize="13" fill="#64748b" fontFamily="system-ui">
        Created: Jan 24, 2024 • 8 items • Customer: XYZ Inc
      </text>
      <text x="120" y="395" fontSize="13" fill="#64748b" fontFamily="system-ui">
        Delivery: 456 Oak Ave, Los Angeles, CA 90001
      </text>
      
      <rect x="650" y="350" width="100" height="28" rx="14" fill="#fef3c7" />
      <text x="665" y="369" fontSize="12" fill="#b45309" fontWeight="600" fontFamily="system-ui">
        Processing
      </text>
      
      {/* Order 3 */}
      <rect x="20" y="440" width="760" height="100" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="40" y="460" width="60" height="60" rx="8" fill="#e0e7ff" />
      <text x="55" y="498" fontSize="24" fill="#6366f1" fontFamily="system-ui">
        🚚
      </text>
      
      <text x="120" y="475" fontSize="16" fill="#0f172a" fontWeight="bold" fontFamily="system-ui">
        Order #ORD-2024-091
      </text>
      <text x="120" y="495" fontSize="13" fill="#64748b" fontFamily="system-ui">
        Created: Jan 24, 2024 • 15 items • Customer: Tech Solutions
      </text>
      <text x="120" y="515" fontSize="13" fill="#64748b" fontFamily="system-ui">
        Delivery: 789 Pine Rd, Chicago, IL 60601
      </text>
      
      <rect x="650" y="470" width="100" height="28" rx="14" fill="#dbeafe" />
      <text x="675" y="489" fontSize="12" fill="#1e40af" fontWeight="600" fontFamily="system-ui">
        Pending
      </text>
      
      {/* Pagination */}
      <rect x="320" y="560" width="160" height="30" rx="6" fill="#f1f5f9" />
      <text x="365" y="580" fontSize="13" fill="#64748b" fontFamily="system-ui">
        Page 1 of 12
      </text>
    </svg>
  );
}
