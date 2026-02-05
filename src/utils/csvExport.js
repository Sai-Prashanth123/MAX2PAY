export const exportToCSV = (data, filename = 'export.csv', columns = null) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // If columns not specified, use all keys from first object
  const headers = columns || Object.keys(data[0]);

  // Create CSV header row
  const csvHeader = headers.join(',');

  // Create CSV data rows
  const csvRows = data.map(row => {
    return headers.map(header => {
      let value = row[header];

      // Handle nested objects
      if (typeof value === 'object' && value !== null) {
        if (value._id) {
          value = value.name || value.companyName || value._id;
        } else {
          value = JSON.stringify(value);
        }
      }

      // Handle null/undefined
      if (value === null || value === undefined) {
        value = '';
      }

      // Convert to string and escape quotes
      value = String(value).replace(/"/g, '""');

      // Wrap in quotes if contains comma, newline, or quote
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = `"${value}"`;
      }

      return value;
    }).join(',');
  });

  // Combine header and rows
  const csv = [csvHeader, ...csvRows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatDataForExport = (data, type) => {
  switch (type) {
    case 'inventory':
      return data.map(item => ({
        'Product Name': item.productId?.name || 'N/A',
        'SKU': item.productId?.sku || 'N/A',
        'Client': item.clientId?.companyName || 'N/A',
        'Total Quantity': item.totalQuantity,
        'Available': item.availableQuantity,
        'Reserved': item.reservedQuantity,
        'Location': item.location || 'N/A',
        'Reorder Level': item.reorderLevel,
        'Status': item.availableQuantity <= item.reorderLevel ? 'Low Stock' : 'In Stock',
      }));

    case 'orders':
      return data.map(item => ({
        'Order Number': item.orderNumber,
        'Client': item.clientId?.companyName || 'N/A',
        'Status': item.status,
        'Priority': item.priority,
        'Items Count': item.items?.length || 0,
        'Total Amount': item.totalAmount || 'N/A',
        'Delivery Address': `${item.deliveryAddress?.street}, ${item.deliveryAddress?.city}`,
        'Created Date': new Date(item.createdAt).toLocaleDateString(),
      }));

    case 'inbound':
      return data.map(item => ({
        'Reference Number': item.referenceNumber,
        'Client': item.clientId?.companyName || 'N/A',
        'Product': item.productId?.name || 'N/A',
        'SKU': item.productId?.sku || 'N/A',
        'Quantity': item.quantity,
        'Supplier': item.supplier || 'N/A',
        'Received Date': new Date(item.receivedDate).toLocaleDateString(),
        'Notes': item.notes || '',
      }));

    case 'clients':
      return data.map(item => ({
        'Company Name': item.companyName,
        'Contact Person': item.contactPerson,
        'Email': item.email,
        'Phone': item.phone,
        'Address': `${item.address?.street}, ${item.address?.city}, ${item.address?.state}`,
        'Status': item.isActive ? 'Active' : 'Inactive',
        'Created Date': new Date(item.createdAt).toLocaleDateString(),
      }));

    case 'products':
      return data.map(item => ({
        'Product Name': item.name,
        'SKU': item.sku,
        'Category': item.category,
        'Client': item.clientId?.companyName || 'N/A',
        'Unit Price': item.unitPrice,
        'Weight': item.weight,
        'Dimensions': `${item.dimensions?.length}x${item.dimensions?.width}x${item.dimensions?.height}`,
        'Reorder Level': item.reorderLevel,
      }));

    default:
      return data;
  }
};
