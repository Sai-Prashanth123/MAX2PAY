export default function DashboardMockup() {
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
        3plfast.com/client/dashboard
      </text>
      
      {/* Header */}
      <rect x="20" y="60" width="760" height="60" rx="8" fill="#0f172a" />
      <text x="40" y="95" fontSize="20" fill="#ffffff" fontWeight="bold" fontFamily="system-ui">
        Client Dashboard
      </text>
      
      {/* Stats Cards */}
      <rect x="20" y="140" width="180" height="100" rx="8" fill="#dbeafe" />
      <text x="40" y="170" fontSize="28" fill="#1e40af" fontWeight="bold" fontFamily="system-ui">
        1,247
      </text>
      <text x="40" y="195" fontSize="14" fill="#3b82f6" fontFamily="system-ui">
        Total Products
      </text>
      
      <rect x="220" y="140" width="180" height="100" rx="8" fill="#dcfce7" />
      <text x="240" y="170" fontSize="28" fill="#15803d" fontWeight="bold" fontFamily="system-ui">
        89
      </text>
      <text x="240" y="195" fontSize="14" fill="#22c55e" fontFamily="system-ui">
        Active Orders
      </text>
      
      <rect x="420" y="140" width="180" height="100" rx="8" fill="#fef3c7" />
      <text x="440" y="170" fontSize="28" fill="#b45309" fontWeight="bold" fontFamily="system-ui">
        23
      </text>
      <text x="440" y="195" fontSize="14" fill="#f59e0b" fontFamily="system-ui">
        Pending Inbound
      </text>
      
      <rect x="620" y="140" width="160" height="100" rx="8" fill="#e0e7ff" />
      <text x="640" y="170" fontSize="28" fill="#4338ca" fontWeight="bold" fontFamily="system-ui">
        $12.5K
      </text>
      <text x="640" y="195" fontSize="14" fill="#6366f1" fontFamily="system-ui">
        Monthly Cost
      </text>
      
      {/* Recent Orders Table */}
      <rect x="20" y="260" width="760" height="320" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <text x="40" y="290" fontSize="16" fill="#0f172a" fontWeight="bold" fontFamily="system-ui">
        Recent Orders
      </text>
      
      {/* Table Header */}
      <rect x="40" y="305" width="720" height="35" rx="4" fill="#e2e8f0" />
      <text x="50" y="325" fontSize="12" fill="#475569" fontWeight="600" fontFamily="system-ui">
        Order ID
      </text>
      <text x="200" y="325" fontSize="12" fill="#475569" fontWeight="600" fontFamily="system-ui">
        Date
      </text>
      <text x="350" y="325" fontSize="12" fill="#475569" fontWeight="600" fontFamily="system-ui">
        Items
      </text>
      <text x="500" y="325" fontSize="12" fill="#475569" fontWeight="600" fontFamily="system-ui">
        Status
      </text>
      
      {/* Table Rows */}
      <rect x="40" y="345" width="720" height="40" fill="#ffffff" />
      <text x="50" y="370" fontSize="12" fill="#0f172a" fontFamily="system-ui">
        ORD-2024-001
      </text>
      <text x="200" y="370" fontSize="12" fill="#64748b" fontFamily="system-ui">
        Jan 20, 2024
      </text>
      <text x="350" y="370" fontSize="12" fill="#64748b" fontFamily="system-ui">
        15 items
      </text>
      <rect x="500" y="358" width="80" height="24" rx="12" fill="#dcfce7" />
      <text x="515" y="373" fontSize="11" fill="#15803d" fontWeight="600" fontFamily="system-ui">
        Dispatched
      </text>
      
      <rect x="40" y="390" width="720" height="40" fill="#f8fafc" />
      <text x="50" y="415" fontSize="12" fill="#0f172a" fontFamily="system-ui">
        ORD-2024-002
      </text>
      <text x="200" y="415" fontSize="12" fill="#64748b" fontFamily="system-ui">
        Jan 21, 2024
      </text>
      <text x="350" y="415" fontSize="12" fill="#64748b" fontFamily="system-ui">
        8 items
      </text>
      <rect x="500" y="403" width="80" height="24" rx="12" fill="#fef3c7" />
      <text x="515" y="418" fontSize="11" fill="#b45309" fontWeight="600" fontFamily="system-ui">
        Processing
      </text>
      
      <rect x="40" y="435" width="720" height="40" fill="#ffffff" />
      <text x="50" y="460" fontSize="12" fill="#0f172a" fontFamily="system-ui">
        ORD-2024-003
      </text>
      <text x="200" y="460" fontSize="12" fill="#64748b" fontFamily="system-ui">
        Jan 22, 2024
      </text>
      <text x="350" y="460" fontSize="12" fill="#64748b" fontFamily="system-ui">
        22 items
      </text>
      <rect x="500" y="448" width="80" height="24" rx="12" fill="#dbeafe" />
      <text x="515" y="463" fontSize="11" fill="#1e40af" fontWeight="600" fontFamily="system-ui">
        Pending
      </text>
    </svg>
  );
}
