/**
 * Indian Rupee and date/string formatters
 */
export function formatCurrencyINR(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar) return 'XXXX XXXX XXXX';
  const clean = aadhaar.replace(/\s+/g, '');
  if (clean.length < 4) return 'XXXX XXXX ' + clean;
  const lastFour = clean.slice(-4);
  return `XXXX XXXX ${lastFour}`;
}

export function maskBankAccount(accountNo: string): string {
  if (!accountNo) return 'XXXX XXXX 0000';
  const clean = accountNo.replace(/\s+/g, '');
  if (clean.length <= 4) return clean;
  const lastFour = clean.slice(-4);
  return `XXXX XXXX ${lastFour}`;
}
