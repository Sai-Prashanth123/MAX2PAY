import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './helpers';

export const generateInvoicePDF = (invoice) => {
  const doc = new jsPDF();
  
  // Max2Pay Branding
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Blue
  doc.text('Max2Pay', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('3PL Warehouse & Fulfillment', 105, 27, { align: 'center' });
  doc.text('orders@max2pay.com', 105, 33, { align: 'center' });
  
  // Invoice Title
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('INVOICE', 20, 45);
  
  // Invoice Details - Left Side
  doc.setFontSize(10);
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, 55);
  doc.text(`Date: ${formatDate(invoice.createdAt)}`, 20, 62);
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 20, 69);
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 76);
  
  // Client Details - Right Side
  doc.setFontSize(12);
  doc.text('Bill To:', 120, 55);
  doc.setFontSize(10);
  doc.text(invoice.clientId?.companyName || 'N/A', 120, 62);
  doc.text(invoice.clientId?.email || '', 120, 69);
  doc.text(invoice.clientId?.contactPerson || '', 120, 76);
  
  // Line Items Table
  let yPos = 90;
  
  if (invoice.type === 'monthly' && invoice.lineItems && invoice.lineItems.length > 0) {
    // Monthly invoice with line items
    doc.setFontSize(12);
    doc.text('Invoice Details', 20, yPos);
    yPos += 5;
    
    if (invoice.billingPeriod) {
      doc.setFontSize(10);
      doc.text(`Billing Period: ${getMonthName(invoice.billingPeriod.month)} ${invoice.billingPeriod.year}`, 20, yPos);
      yPos += 10;
    }
    
    const tableData = invoice.lineItems.map(item => [
      item.description,
      item.quantity.toString(),
      formatCurrency(item.unitPrice),
      formatCurrency(item.amount)
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Description', 'Quantity', 'Unit Price', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right' }
      }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
  } else {
    // Regular invoice
    doc.setFontSize(12);
    doc.text('Invoice Summary', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text(`Type: ${invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)}`, 20, yPos);
    yPos += 7;
    
    if (invoice.orderId?.orderNumber) {
      doc.text(`Order: ${invoice.orderId.orderNumber}`, 20, yPos);
      yPos += 7;
    }
  }
  
  // Totals Section
  yPos += 10;
  const totalsX = 130;
  
  doc.setDrawColor(200);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.text('Subtotal:', totalsX, yPos);
  doc.text(formatCurrency(invoice.amount), 180, yPos, { align: 'right' });
  yPos += 7;
  
  if (invoice.taxAmount > 0) {
    doc.text(`Tax (${invoice.taxRate || 18}%):`, totalsX, yPos);
    doc.text(formatCurrency(invoice.taxAmount), 180, yPos, { align: 'right' });
    yPos += 7;
  }
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Total Amount:', totalsX, yPos);
  doc.text(formatCurrency(invoice.totalAmount), 180, yPos, { align: 'right' });
  
  // Notes Section
  if (invoice.notes) {
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Notes:', 20, yPos);
    yPos += 7;
    doc.setFont(undefined, 'normal');
    const splitNotes = doc.splitTextToSize(invoice.notes, 170);
    doc.text(splitNotes, 20, yPos);
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' });
  doc.text('For questions, contact: support@max2pay.com', 105, pageHeight - 15, { align: 'center' });
  
  // Save PDF
  doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
};

const getMonthName = (month) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1] || month;
};

export const generateOrderPDF = (order) => {
  const doc = new jsPDF();
  
  // Try to add logo image
  try {
    const logoImg = new Image();
    logoImg.src = '/logo.png';
    if (logoImg.complete) {
      doc.addImage(logoImg, 'PNG', 85, 10, 40, 16);
    }
  } catch {
    // Fallback to text if image fails
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text('3PL FAST', 105, 20, { align: 'center' });
  }
  
  // Order Details
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Order Number: ${order.orderNumber}`, 20, 40);
  doc.text(`Date: ${formatDate(order.createdAt)}`, 20, 47);
  doc.text(`Status: ${order.status.toUpperCase()}`, 20, 54);
  doc.text(`Priority: ${order.priority.toUpperCase()}`, 20, 61);
  
  // Client Info
  if (order.clientId) {
    doc.text(`Client: ${order.clientId.companyName}`, 120, 40);
  }
  
  // Delivery Address
  doc.setFontSize(12);
  doc.text('Delivery Address:', 20, 75);
  doc.setFontSize(10);
  let yPos = 82;
  if (order.deliveryAddress) {
    doc.text(order.deliveryAddress.name || '', 20, yPos);
    yPos += 7;
    doc.text(order.deliveryAddress.street || '', 20, yPos);
    yPos += 7;
    doc.text(`${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}`, 20, yPos);
    yPos += 7;
    doc.text(order.deliveryAddress.phone || '', 20, yPos);
  }
  
  // Order Items Table
  yPos += 15;
  const tableData = order.items?.map((item, index) => [
    (index + 1).toString(),
    item.productId?.name || 'N/A',
    item.quantity.toString(),
    item.deliveryAddress ? `${item.deliveryAddress.city}, ${item.deliveryAddress.state}` : 'Same as above'
  ]) || [];
  
  doc.autoTable({
    startY: yPos,
    head: [['#', 'Product', 'Quantity', 'Delivery Location']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 10 }
  });
  
  // Notes
  if (order.notes) {
    yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Notes:', 20, yPos);
    yPos += 7;
    doc.setFont(undefined, 'normal');
    const splitNotes = doc.splitTextToSize(order.notes, 170);
    doc.text(splitNotes, 20, yPos);
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('Max2Pay Payment & Order Management', 105, pageHeight - 15, { align: 'center' });
  
  doc.save(`order-${order.orderNumber}.pdf`);
};
