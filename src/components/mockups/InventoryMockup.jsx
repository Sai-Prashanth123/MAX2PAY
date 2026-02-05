export default function InventoryMockup() {
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
        3plfast.com/client/inventory
      </text>
      
      {/* Header */}
      <rect x="20" y="60" width="760" height="60" rx="8" fill="#0f172a" />
      <text x="40" y="95" fontSize="20" fill="#ffffff" fontWeight="bold" fontFamily="system-ui">
        Inventory Management
      </text>
      <rect x="620" y="75" width="140" height="30" rx="6" fill="#3b82f6" />
      <text x="645" y="96" fontSize="13" fill="#ffffff" fontWeight="600" fontFamily="system-ui">
        + Add Product
      </text>
      
      {/* Search Bar */}
      <rect x="20" y="140" width="400" height="40" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <text x="40" y="165" fontSize="14" fill="#94a3b8" fontFamily="system-ui">
        🔍 Search products...
      </text>
      
      {/* Filter Buttons */}
      <rect x="440" y="140" width="100" height="40" rx="8" fill="#dbeafe" />
      <text x="465" y="165" fontSize="13" fill="#1e40af" fontWeight="600" fontFamily="system-ui">
        All Items
      </text>
      
      <rect x="560" y="140" width="110" height="40" rx="8" fill="#f1f5f9" />
      <text x="575" y="165" fontSize="13" fill="#64748b" fontWeight="600" fontFamily="system-ui">
        Low Stock
      </text>
      
      <rect x="690" y="140" width="90" height="40" rx="8" fill="#f1f5f9" />
      <text x="710" y="165" fontSize="13" fill="#64748b" fontWeight="600" fontFamily="system-ui">
        Out of Stock
      </text>
      
      {/* Product Cards Grid */}
      {/* Card 1 */}
      <rect x="20" y="200" width="240" height="180" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="30" y="210" width="220" height="100" rx="6" fill="#f8fafc" />
      <text x="120" y="265" fontSize="40" fill="#cbd5e1" fontFamily="system-ui">
        📦
      </text>
      <text x="40" y="330" fontSize="14" fill="#0f172a" fontWeight="bold" fontFamily="system-ui">
        Premium Widget A
      </text>
      <text x="40" y="350" fontSize="12" fill="#64748b" fontFamily="system-ui">
        SKU: WGT-001
      </text>
      <rect x="40" y="358" width="90" height="20" rx="10" fill="#dcfce7" />
      <text x="50" y="371" fontSize="11" fill="#15803d" fontWeight="600" fontFamily="system-ui">
        In Stock: 450
      </text>
      
      {/* Card 2 */}
      <rect x="280" y="200" width="240" height="180" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="290" y="210" width="220" height="100" rx="6" fill="#f8fafc" />
      <text x="380" y="265" fontSize="40" fill="#cbd5e1" fontFamily="system-ui">
        🎁
      </text>
      <text x="300" y="330" fontSize="14" fill="#0f172a" fontWeight="bold" fontFamily="system-ui">
        Deluxe Package B
      </text>
      <text x="300" y="350" fontSize="12" fill="#64748b" fontFamily="system-ui">
        SKU: PKG-002
      </text>
      <rect x="300" y="358" width="90" height="20" rx="10" fill="#fef3c7" />
      <text x="310" y="371" fontSize="11" fill="#b45309" fontWeight="600" fontFamily="system-ui">
        In Stock: 45
      </text>
      
      {/* Card 3 */}
      <rect x="540" y="200" width="240" height="180" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="550" y="210" width="220" height="100" rx="6" fill="#f8fafc" />
      <text x="640" y="265" fontSize="40" fill="#cbd5e1" fontFamily="system-ui">
        🔧
      </text>
      <text x="560" y="330" fontSize="14" fill="#0f172a" fontWeight="bold" fontFamily="system-ui">
        Tool Kit Pro
      </text>
      <text x="560" y="350" fontSize="12" fill="#64748b" fontFamily="system-ui">
        SKU: TKT-003
      </text>
      <rect x="560" y="358" width="90" height="20" rx="10" fill="#dcfce7" />
      <text x="570" y="371" fontSize="11" fill="#15803d" fontWeight="600" fontFamily="system-ui">
        In Stock: 230
      </text>
      
      {/* Card 4 */}
      <rect x="20" y="400" width="240" height="180" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="30" y="410" width="220" height="100" rx="6" fill="#f8fafc" />
      <text x="120" y="465" fontSize="40" fill="#cbd5e1" fontFamily="system-ui">
        💼
      </text>
      <text x="40" y="530" fontSize="14" fill="#0f172a" fontWeight="bold" fontFamily="system-ui">
        Business Case XL
      </text>
      <text x="40" y="550" fontSize="12" fill="#64748b" fontFamily="system-ui">
        SKU: BCS-004
      </text>
      <rect x="40" y="558" width="90" height="20" rx="10" fill="#fee2e2" />
      <text x="50" y="571" fontSize="11" fill="#991b1b" fontWeight="600" fontFamily="system-ui">
        In Stock: 5
      </text>
      
      {/* Card 5 */}
      <rect x="280" y="400" width="240" height="180" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="290" y="410" width="220" height="100" rx="6" fill="#f8fafc" />
      <text x="380" y="465" fontSize="40" fill="#cbd5e1" fontFamily="system-ui">
        🎨
      </text>
      <text x="300" y="530" fontSize="14" fill="#0f172a" fontWeight="bold" fontFamily="system-ui">
        Art Supplies Set
      </text>
      <text x="300" y="550" fontSize="12" fill="#64748b" fontFamily="system-ui">
        SKU: ART-005
      </text>
      <rect x="300" y="558" width="90" height="20" rx="10" fill="#dcfce7" />
      <text x="310" y="571" fontSize="11" fill="#15803d" fontWeight="600" fontFamily="system-ui">
        In Stock: 180
      </text>
      
      {/* Card 6 */}
      <rect x="540" y="400" width="240" height="180" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="550" y="410" width="220" height="100" rx="6" fill="#f8fafc" />
      <text x="640" y="465" fontSize="40" fill="#cbd5e1" fontFamily="system-ui">
        ⚡
      </text>
      <text x="560" y="530" fontSize="14" fill="#0f172a" fontWeight="bold" fontFamily="system-ui">
        Power Adapter Pro
      </text>
      <text x="560" y="550" fontSize="12" fill="#64748b" fontFamily="system-ui">
        SKU: PWR-006
      </text>
      <rect x="560" y="558" width="90" height="20" rx="10" fill="#dcfce7" />
      <text x="570" y="571" fontSize="11" fill="#15803d" fontWeight="600" fontFamily="system-ui">
        In Stock: 320
      </text>
    </svg>
  );
}
