import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './helpers';

/**
 * Generate Professional Invoice PDF
 * Inspired by HolyFoods invoice format with 3PL FAST branding
 */
export const generateProfessionalInvoicePDF = (invoice) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Colors
  const primaryBlue = [37, 99, 235];
  const darkGray = [60, 60, 60];
  const lightGray = [150, 150, 150];
  
  // Max2Pay Branding
  doc.setFontSize(18);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.setFont(undefined, 'bold');
  doc.text('Max2Pay', 20, 20);
  
  doc.setFontSize(9);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont(undefined, 'normal');
  doc.text('3PL Warehouse & Fulfillment', 20, 27);
  doc.text('Email: orders@max2pay.com', 20, 32);
  
  // Invoice Title - Right Side
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('Invoice', pageWidth - 20, 20, { align: 'right' });
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`Invoice No.`, pageWidth - 20, 28, { align: 'right' });
  doc.setFont(undefined, 'bold');
  doc.text(invoice.invoiceNumber || 'N/A', pageWidth - 20, 33, { align: 'right' });
  
  doc.setFont(undefined, 'normal');
  doc.text(`Invoice Date`, pageWidth - 20, 40, { align: 'right' });
  doc.setFont(undefined, 'bold');
  doc.text(formatDate(invoice.createdAt), pageWidth - 20, 45, { align: 'right' });
  
  // Divider Line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 55, pageWidth - 20, 55);
  
  // Bill To Section - Left
  let yPos = 65;
  doc.setFontSize(10);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont(undefined, 'bold');
  doc.text('Bill To:', 20, yPos);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  yPos += 6;
  
  // Client Information
  const clientName = invoice.clientId?.companyName || invoice.clientId?.company_name || 'N/A';
  const clientEmail = invoice.clientId?.email || '';
  const contactPerson = invoice.clientId?.contactPerson || invoice.clientId?.contact_person || '';
  const clientPhone = invoice.clientId?.phone || '';
  
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text(clientName, 20, yPos);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  yPos += 5;
  
  if (contactPerson) {
    doc.text(`Attn: ${contactPerson}`, 20, yPos);
    yPos += 5;
  }
  
  if (clientEmail) {
    doc.text(clientEmail, 20, yPos);
    yPos += 5;
  }
  
  if (clientPhone) {
    doc.text(clientPhone, 20, yPos);
  }
  
  // Due Date Section - Right
  yPos = 65;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text('Due Date:', pageWidth - 80, yPos);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  yPos += 6;
  const dueDate = invoice.dueDate || invoice.due_date;
  doc.text(formatDate(dueDate), pageWidth - 20, yPos, { align: 'right' });
  doc.setFontSize(9);
  doc.text(formatDate(invoice.dueDate), pageWidth - 20, yPos, { align: 'right' });
  
  yPos += 6;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text('Terms:', pageWidth - 80, yPos);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text('Net 30', pageWidth - 20, yPos, { align: 'right' });
  
  // Service Details Table
  yPos = 100;
  
  // Billing Period for Monthly Invoices
  if (invoice.type === 'monthly' && invoice.billingPeriod) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    const monthName = getMonthName(invoice.billingPeriod.month);
    doc.text(`Billing Period: ${monthName} ${invoice.billingPeriod.year}`, 20, yPos);
    yPos += 8;
  }
  
  // Table Headers
  const tableData = [];
  
  // Check if this is a monthly invoice with detailed breakdown
  const hasDetailedBreakdown = invoice.type === 'monthly' && 
    invoice.lineItems && 
    invoice.lineItems[0]?.detailedBreakdown && 
    invoice.lineItems[0].detailedBreakdown.length > 0;
  
  if (invoice.lineItems && invoice.lineItems.length > 0) {
    // Show one line per order on page 1
    invoice.lineItems.forEach(item => {
      tableData.push([
        item.description || 'Order Fulfillment',
        item.quantity || 0,
        formatCurrency(item.unitPrice || 0),
        formatCurrency(item.amount || 0)
      ]);
    });
  } else {
    // Fallback to basic info
    tableData.push([
      `${invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)} Service`,
      1,
      formatCurrency(invoice.amount || 0),
      formatCurrency(invoice.amount || 0)
    ]);
  }
  
  doc.autoTable({
    startY: yPos,
    head: [['Service', 'Quantity', 'Rate Per', 'Amount']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [60, 60, 60],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 4
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' }
    },
    styles: {
      lineColor: [220, 220, 220],
      lineWidth: 0.1
    }
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  // Totals Section
  const totalsX = pageWidth - 75;
  const totalsValueX = pageWidth - 20;
  
  // Subtotal
  doc.setFontSize(9);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Subtotal:', totalsX, yPos);
  doc.text(formatCurrency(invoice.subtotal || invoice.amount || 0), totalsValueX, yPos, { align: 'right' });
  yPos += 6;
  
  // Tax (only if > 0)
  if (invoice.taxAmount && invoice.taxAmount > 0) {
    doc.text('Total Tax:', totalsX, yPos);
    doc.text(formatCurrency(invoice.taxAmount), totalsValueX, yPos, { align: 'right' });
    yPos += 6;
  }
  
  // Total Line
  doc.setDrawColor(220, 220, 220);
  doc.line(totalsX - 5, yPos, totalsValueX, yPos);
  yPos += 6;
  
  // Total Amount
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Total:', totalsX, yPos);
  doc.text(formatCurrency(invoice.totalAmount || invoice.amount || 0), totalsValueX, yPos, { align: 'right' });
  
  // Pricing Formula Note
  if (invoice.notes && invoice.notes.includes('$2.50')) {
    yPos += 15;
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('Pricing Formula: $2.50 + (units - 1) × $1.25 per order', 20, yPos);
    yPos += 4;
    doc.text('Only orders ≤ 5 lbs included', 20, yPos);
  }
  
  // Notes Section
  if (invoice.notes) {
    yPos += 10;
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text('Notes:', 20, yPos);
    yPos += 5;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 40);
    doc.text(splitNotes, 20, yPos);
  }
  
  // Payment Status Badge
  if (invoice.status === 'paid') {
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(pageWidth - 50, 65, 30, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('PAID', pageWidth - 35, 70, { align: 'center' });
  }
  
  // Footer
  doc.setDrawColor(200, 200, 200);
  doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
  
  doc.setFontSize(8);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFont(undefined, 'normal');
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 22, { align: 'center' });
  doc.text('For questions, contact: billing@3plfast.com | (555) 123-4567', pageWidth / 2, pageHeight - 17, { align: 'center' });
  
  // Page number
  doc.setFontSize(7);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, pageHeight - 10);
  
  // Add detailed breakdown page for monthly invoices
  if (hasDetailedBreakdown) {
    const detailedItems = invoice.lineItems[0].detailedBreakdown;
    
    // Add new page for detailed breakdown
    doc.addPage();
    
    // Header
    doc.setFontSize(14);
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setFont(undefined, 'bold');
    doc.text('Invoice Detail Attachment', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont(undefined, 'normal');
    doc.text(`Invoice No: ${invoice.invoiceNumber || 'N/A'}`, 20, 28);
    
    // Detailed items table
    const detailedTableData = detailedItems.map(item => [
      item.sku || 'N/A',
      item.productName || 'Unknown',
      item.orderNumber || 'N/A',
      formatDate(item.orderDate),
      item.quantity || 0,
      'EA',
      item.quantity || 0,
      'ORD',
      formatCurrency(item.rate || 0),
      formatCurrency(item.amount || 0)
    ]);
    
    doc.autoTable({
      startY: 35,
      head: [['SKU', 'Product', 'Order #', 'Date', 'Qty', 'Unit', 'Chrg Qty', 'Unit', 'Rate', 'Amount']],
      body: detailedTableData,
      theme: 'striped',
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        cellPadding: 3
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
        textColor: [60, 60, 60]
      },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 35 },
        2: { cellWidth: 22 },
        3: { cellWidth: 20 },
        4: { cellWidth: 12, halign: 'center' },
        5: { cellWidth: 12, halign: 'center' },
        6: { cellWidth: 15, halign: 'center' },
        7: { cellWidth: 12, halign: 'center' },
        8: { cellWidth: 18, halign: 'right' },
        9: { cellWidth: 20, halign: 'right' }
      },
      styles: {
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      },
      margin: { left: 10, right: 10 }
    });
    
    // Page 2 footer
    doc.setFontSize(7);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, pageHeight - 10);
    doc.text('Page 2 of 2', pageWidth - 20, pageHeight - 10, { align: 'right' });
    
    // Update page 1 footer
    doc.setPage(1);
    doc.text('Page 1 of 2', pageWidth - 20, pageHeight - 10, { align: 'right' });
  } else {
    doc.text('Page 1 of 1', pageWidth - 20, pageHeight - 10, { align: 'right' });
  }
  
  // Save PDF
  const fileName = `${clientName.replace(/[^a-z0-9]/gi, '_')}_INV${invoice.invoiceNumber}.pdf`;
  doc.save(fileName);
};

const getMonthName = (month) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1] || month;
};

export default generateProfessionalInvoicePDF;
