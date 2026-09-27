/**
 * Format currency strictly in Australian Dollars (AUD)
 * Examples: 4525000 -> "$4.53M AUD" or "$4,525,000"
 */

export const formatAUD = (val, compact = true) => {
  if (val === null || val === undefined || isNaN(val)) return '$0 AUD';
  
  if (compact) {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M AUD`;
    }
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}K AUD`;
    }
    return `$${val.toLocaleString()} AUD`;
  }
  
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0
  }).format(val);
};

export const formatCompactAUD = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '$0';
  if (val >= 1000000) {
    return `$${(val / 1000000).toFixed(2)}M`;
  }
  if (val >= 1000) {
    return `$${Math.round(val / 1000)}K`;
  }
  return `$${val.toLocaleString()}`;
};

export const formatInteger = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-AU').format(val);
};

/**
 * Export array of objects to CSV file
 */
export const exportToCSV = (data, filename = 'victorian_housing_data.csv') => {
  if (!data || !data.length) return;
  
  const headers = ['Suburb', 'Average Price (AUD)', 'Property Count', 'Market Segment'];
  const rows = data.map(item => [
    `"${item.suburb}"`,
    item.average_price.toFixed(2),
    item.property_count,
    `"${item.average_price >= 2500000 ? 'Ultra Luxury' : item.average_price >= 2000000 ? 'Premium' : 'High Value'}"`
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export array of objects to JSON file
 */
export const exportToJSON = (data, filename = 'victorian_housing_data.json') => {
  if (!data || !data.length) return;
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
