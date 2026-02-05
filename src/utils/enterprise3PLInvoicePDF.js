import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './helpers';

/**
 * Enterprise-Grade 3PL Warehouse Invoice Generator
 * Multi-page format matching professional warehouse billing standards
 */
export const generateEnterprise3PLInvoicePDF = (invoice) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Professional color scheme - minimal color, black & white focus
  const black = [0, 0, 0];
  const darkGray = [60, 60, 60];
  const mediumGray = [120, 120, 120];
  const lightGray = [180, 180, 180];
  
  // Company Information - Max2Pay Branding
  const companyInfo = {
    name: 'Max2Pay',
    tagline: '3PL Warehouse & Fulfillment',
    email: 'orders@max2pay.com'
  };
  
  // Warehouse Information
  const warehouseInfo = {
    name: 'Max2Pay Fulfillment Center',
    email: 'orders@max2pay.com'
  };
  
  // Client Information
  const clientName = invoice.clientId?.companyName || invoice.clientId?.company_name || 'N/A';
  const clientEmail = invoice.clientId?.email || '';
  const contactPerson = invoice.clientId?.contactPerson || invoice.clientId?.contact_person || '';
  const clientPhone = invoice.clientId?.phone || '';
  const clientAddress = invoice.clientId?.address || '';
  const clientId = invoice.clientId?.id || invoice.clientId?._id || '';
  
  // Check if detailed breakdown exists
  const hasDetailedBreakdown = invoice.type === 'monthly' && 
    invoice.lineItems && 
    invoice.lineItems[0]?.detailedBreakdown && 
    invoice.lineItems[0].detailedBreakdown.length > 0;
  
  const detailedItems = hasDetailedBreakdown ? invoice.lineItems[0].detailedBreakdown : [];
  
  // Calculate total pages (1 summary + detail pages)
  const itemsPerPage = 35; // Dense table, ~35 rows per page
  const detailPages = Math.ceil(detailedItems.length / itemsPerPage);
  const totalPages = 1 + detailPages;
  
  // ==================== PAGE 1: INVOICE SUMMARY ====================
  
  const drawPage1 = () => {
    let yPos = 20;
    
    // Title: INVOICE or BILL
    doc.setFontSize(24);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFont(undefined, 'bold');
    doc.text('INVOICE', pageWidth / 2, yPos, { align: 'center' });
    
    yPos = 35;
    
    // Left Column: Company Branding
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(companyInfo.name, 20, yPos);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    yPos += 5;
    doc.text(companyInfo.tagline, 20, yPos);
    yPos += 5;
    doc.text(`Email: ${companyInfo.email}`, 20, yPos);
    
    // Warehouse Details
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text('WAREHOUSE:', 20, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 5;
    doc.text(warehouseInfo.name, 20, yPos);
    yPos += 4;
    doc.text(`Contact: ${warehouseInfo.email}`, 20, yPos);
    
    // Right Column: Invoice Metadata
    yPos = 35;
    const rightX = pageWidth - 70;
    const rightValueX = pageWidth - 20;
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Invoice Number:', rightX, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(invoice.invoiceNumber || 'N/A', rightValueX, yPos, { align: 'right' });
    
    yPos += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Invoice Date:', rightX, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(formatDate(invoice.createdAt), rightValueX, yPos, { align: 'right' });
    
    yPos += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Due Date:', rightX, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(formatDate(invoice.dueDate || invoice.due_date), rightValueX, yPos, { align: 'right' });
    
    yPos += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Payment Terms:', rightX, yPos);
    doc.setFont(undefined, 'normal');
    doc.text('Net 30', rightValueX, yPos, { align: 'right' });
    
    // Billing Period (if monthly)
    if (invoice.type === 'monthly' && invoice.billingPeriod) {
      yPos += 5;
      doc.setFont(undefined, 'bold');
      doc.text('Billing Period:', rightX, yPos);
      doc.setFont(undefined, 'normal');
      const monthName = getMonthName(invoice.billingPeriod.month);
      doc.text(`${monthName} ${invoice.billingPeriod.year}`, rightValueX, yPos, { align: 'right' });
    }
    
    // Divider Line
    yPos = 85;
    doc.setDrawColor(black[0], black[1], black[2]);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    
    // Bill To Section
    yPos = 92;
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('BILL TO:', 20, yPos);
    
    doc.setFont(undefined, 'normal');
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(clientName, 20, yPos);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    yPos += 5;
    
    if (contactPerson) {
      doc.text(`Attn: ${contactPerson}`, 20, yPos);
      yPos += 4;
    }
    
    if (clientAddress) {
      const addressLines = doc.splitTextToSize(clientAddress, 80);
      addressLines.forEach(line => {
        doc.text(line, 20, yPos);
        yPos += 4;
      });
    }
    
    if (clientEmail) {
      doc.text(clientEmail, 20, yPos);
      yPos += 4;
    }
    
    if (clientPhone) {
      doc.text(clientPhone, 20, yPos);
      yPos += 4;
    }
    
    if (clientId) {
      doc.setFont(undefined, 'bold');
      doc.text(`Client ID: `, 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(clientId.slice(-8).toUpperCase(), 40, yPos);
    }
    
    // Service Summary Table
    yPos = 130;
    
    const tableData = [];
    
    if (invoice.lineItems && invoice.lineItems.length > 0) {
      invoice.lineItems.forEach(item => {
        tableData.push([
          item.description || 'Order Fulfillment',
          (item.quantity || 0).toString(),
          formatCurrency(item.unitPrice || 0),
          formatCurrency(item.amount || 0)
        ]);
      });
    } else {
      tableData.push([
        'Order Processing',
        '1',
        formatCurrency(invoice.amount || 0),
        formatCurrency(invoice.amount || 0)
      ]);
    }
    
    doc.autoTable({
      startY: yPos,
      head: [['Service Name', 'Quantity', 'Rate Per Order', 'Amount']],
      body: tableData,
      theme: 'plain',
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: black,
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: black
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: darkGray,
        lineWidth: 0.1,
        lineColor: lightGray
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      styles: {
        lineColor: black,
        lineWidth: 0.5
      }
    });
    
    // Financial Summary (right-aligned)
    yPos = doc.lastAutoTable.finalY + 15;
    const summaryX = pageWidth - 75;
    const summaryValueX = pageWidth - 20;
    
    doc.setFontSize(9);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont(undefined, 'normal');
    
    // Subtotal
    doc.text('Subtotal:', summaryX, yPos);
    doc.text(formatCurrency(invoice.subtotal || invoice.amount || 0), summaryValueX, yPos, { align: 'right' });
    yPos += 6;
    
    // Tax
    const taxAmount = invoice.taxAmount || 0;
    doc.text('Tax:', summaryX, yPos);
    doc.text(formatCurrency(taxAmount), summaryValueX, yPos, { align: 'right' });
    yPos += 6;
    
    // Total line
    doc.setDrawColor(black[0], black[1], black[2]);
    doc.setLineWidth(0.5);
    doc.line(summaryX - 5, yPos - 2, summaryValueX, yPos - 2);
    
    // Total
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text('Total:', summaryX, yPos);
    doc.text(formatCurrency(invoice.totalAmount || invoice.amount || 0), summaryValueX, yPos, { align: 'right' });
    yPos += 8;
    
    // Less Advance (if applicable)
    const advancePaid = invoice.advancePaid || 0;
    if (advancePaid > 0) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text('Less Advance:', summaryX, yPos);
      doc.text(`(${formatCurrency(advancePaid)})`, summaryValueX, yPos, { align: 'right' });
      yPos += 6;
    }
    
    // Balance Due (highlighted)
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text('BALANCE DUE:', summaryX, yPos);
    doc.text(formatCurrency(invoice.balanceDue || invoice.totalAmount || invoice.amount || 0), summaryValueX, yPos, { align: 'right' });
    
    // Footer
    drawFooter(1, totalPages, invoice.invoiceNumber);
  };
  
  // ==================== PAGE 2+: INVOICE DETAIL ATTACHMENT ====================
  
  const drawDetailPages = () => {
    if (!hasDetailedBreakdown || detailedItems.length === 0) return;
    
    let currentPage = 2;
    let itemIndex = 0;
    
    while (itemIndex < detailedItems.length) {
      doc.addPage();
      
      let yPos = 20;
      
      // Header on every detail page
      doc.setFontSize(14);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.setFont(undefined, 'bold');
      doc.text('Invoice Detail Attachment', 20, yPos);
      
      yPos = 30;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text(`Invoice Number: ${invoice.invoiceNumber || 'N/A'}`, 20, yPos);
      doc.text(`Invoice Date: ${formatDate(invoice.createdAt)}`, 100, yPos);
      
      yPos += 5;
      doc.text(`Bill To: ${clientName}`, 20, yPos);
      
      yPos = 42;
      
      // Get items for this page
      const pageItems = detailedItems.slice(itemIndex, itemIndex + itemsPerPage);
      
      // Build table data
      const tableData = pageItems.map(item => [
        item.sku || 'N/A',
        formatDate(item.orderDate) || '',
        item.orderNumber || 'N/A',
        item.orderNumber || 'N/A',
        (item.quantity || 0).toString(),
        'ORD',
        (item.quantity || 0).toString(),
        formatCurrency(item.rate || 0),
        formatCurrency(item.amount || 0)
      ]);
      
      // Detailed table with auto-pagination
      doc.autoTable({
        startY: yPos,
        head: [['SKU', 'Lot/Ref Date', 'Doc #', 'Doc Ref', 'Qty', 'Unit', 'Chrg Qty', 'Unit Rate', 'Amount']],
        body: tableData,
        theme: 'plain',
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: black,
          fontStyle: 'bold',
          fontSize: 8,
          cellPadding: 2,
          lineWidth: 0.5,
          lineColor: black
        },
        bodyStyles: {
          fontSize: 7,
          cellPadding: 2,
          textColor: darkGray,
          lineWidth: 0.1,
          lineColor: lightGray
        },
        columnStyles: {
          0: { cellWidth: 20 },  // SKU
          1: { cellWidth: 22 },  // Lot/Ref Date
          2: { cellWidth: 25 },  // Doc #
          3: { cellWidth: 25 },  // Doc Ref
          4: { cellWidth: 15, halign: 'center' },  // Qty
          5: { cellWidth: 15, halign: 'center' },  // Unit
          6: { cellWidth: 18, halign: 'center' },  // Chrg Qty
          7: { cellWidth: 20, halign: 'right' },   // Unit Rate
          8: { cellWidth: 24, halign: 'right' }    // Amount
        },
        styles: {
          lineColor: black,
          lineWidth: 0.3,
          overflow: 'linebreak'
        },
        margin: { left: 10, right: 10 }
      });
      
      itemIndex += itemsPerPage;
      
      // If this is the last page, add total line
      if (itemIndex >= detailedItems.length) {
        yPos = doc.lastAutoTable.finalY + 8;
        
        const totalQty = detailedItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalAmt = detailedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(black[0], black[1], black[2]);
        
        const totalText = `Order Processing – ${totalQty} ORD – ${formatCurrency(totalAmt)}`;
        doc.text(totalText, pageWidth / 2, yPos, { align: 'center' });
      }
      
      // Footer
      drawFooter(currentPage, totalPages, invoice.invoiceNumber);
      currentPage++;
    }
  };
  
  // Footer helper function
  const drawFooter = (pageNum, totalPages, invoiceNum) => {
    const footerY = pageHeight - 20;
    
    // Divider line
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.3);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
    
    // Max2Pay branding (left)
    doc.setFontSize(7);
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    doc.setFont(undefined, 'normal');
    doc.text(`${companyInfo.name} | ${companyInfo.email}`, 20, footerY);
    
    // Invoice Number (center)
    doc.text(`Invoice: ${invoiceNum || 'N/A'}`, pageWidth / 2, footerY, { align: 'center' });
    
    // Page number (right)
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 20, footerY, { align: 'right' });
  };
  
  // Generate all pages
  drawPage1();
  drawDetailPages();
  
  // Save PDF
  const fileName = `Invoice_${invoice.invoiceNumber}_${clientName.replace(/[^a-z0-9]/gi, '_')}.pdf`;
  doc.save(fileName);
};

const getMonthName = (month) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1] || month;
};

export default generateEnterprise3PLInvoicePDF;
