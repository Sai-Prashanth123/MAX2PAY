import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Export to PDF
export const exportToPDF = (data, columns, title = 'Export') => {
  const doc = new jsPDF();
  
  // Try to add logo image
  try {
    const logoImg = new Image();
    logoImg.src = '/logo.png';
    if (logoImg.complete) {
      doc.addImage(logoImg, 'PNG', 14, 10, 30, 12);
    }
  } catch {
    // Fallback to text if image fails
  }
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 30);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, 14, 38);
  
  // Prepare table data
  const headers = columns.map(col => col.header);
  const rows = data.map(row => 
    columns.map(col => {
      if (col.accessor) {
        return row[col.accessor] || '-';
      } else if (col.render) {
        // For rendered columns, try to extract text
        return '-';
      }
      return '-';
    })
  );
  
  // Add table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] }
  });
  
  // Save PDF
  doc.save(`${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

// Export to Excel
export const exportToExcel = (data, columns, title = 'Export') => {
  // Prepare data
  const headers = columns.map(col => col.header);
  const rows = data.map(row => 
    columns.map(col => {
      if (col.accessor) {
        return row[col.accessor] || '';
      }
      return '';
    })
  );
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
  // Set column widths
  const colWidths = headers.map(() => ({ wch: 15 }));
  ws['!cols'] = colWidths;
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
  // Save file
  XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${Date.now()}.xlsx`);
};

// Export to CSV (enhanced)
export const exportToCSV = (data, columns, title = 'Export') => {
  const headers = columns.map(col => col.header);
  const rows = data.map(row => 
    columns.map(col => {
      if (col.accessor) {
        const value = row[col.accessor] || '';
        // Escape commas and quotes
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }
      return '';
    })
  );
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/\s+/g, '_')}_${Date.now()}.csv`;
  link.click();
};

// Export with filters applied
export const exportWithFilters = (data, columns, filters, format = 'csv', title = 'Export') => {
  let filteredData = [...data];
  
  // Apply filters
  if (filters.search) {
    filteredData = filteredData.filter(row =>
      columns.some(col => {
        const value = col.accessor ? row[col.accessor] : '';
        return String(value).toLowerCase().includes(filters.search.toLowerCase());
      })
    );
  }
  
  if (filters.status && filters.status.length > 0) {
    filteredData = filteredData.filter(row => filters.status.includes(row.status));
  }
  
  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    filteredData = filteredData.filter(row => {
      const date = new Date(row.createdAt || row.date);
      return date >= start && date <= end;
    });
  }
  
  // Export based on format
  switch (format) {
    case 'pdf':
      exportToPDF(filteredData, columns, title);
      break;
    case 'excel':
      exportToExcel(filteredData, columns, title);
      break;
    default:
      exportToCSV(filteredData, columns, title);
  }
};
