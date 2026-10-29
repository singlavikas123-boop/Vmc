import { Student, CenterSettings } from '../types';

export function formatCurrency(amount: number, symbol = '₹'): string {
  return `${symbol}${amount.toLocaleString('en-IN')}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 0) return 'Negative ' + numberToWords(Math.abs(num));

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertHundreds(n: number): string {
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + ' ';
    }
    return str.trim();
  }

  // Indian numbering system support (Lakhs, Crores) or Western (Million, Thousand)
  let result = '';
  let crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  let thousand = Math.floor(remainder / 1000);
  let hundred = remainder % 1000;

  if (crore > 0) {
    result += convertHundreds(crore) + ' Crore ';
  }
  if (lakh > 0) {
    result += convertHundreds(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    result += convertHundreds(thousand) + ' Thousand ';
  }
  if (hundred > 0) {
    result += convertHundreds(hundred);
  }

  return (result.trim() || 'Zero') + ' Only';
}

export function buildWhatsAppReminderUrl(
  student: Student,
  centerSettings: CenterSettings,
  dueAmount: number,
  dueMonths: string[]
): string {
  const targetPhone = (student.guardianPhone || student.phone).replace(/[^0-9]/g, '');
  const monthText = dueMonths.length > 0 ? dueMonths.join(', ') : 'Current Month';

  const message = `Dear Parent/Student,
This is a gentle reminder from *${centerSettings.centerName}* regarding the pending tuition fee for *${student.name}* (Roll No: ${student.rollNo}, ${student.grade}).

• Pending Amount: *${centerSettings.currencySymbol}${dueAmount.toLocaleString('en-IN')}*
• Period/Month: ${monthText}
${centerSettings.upiId ? `• UPI ID for Payment: *${centerSettings.upiId}*` : ''}
${centerSettings.phone ? `• For queries, contact: ${centerSettings.phone}` : ''}

Kindly clear the balance at your earliest convenience. If already paid, please disregard this message.

Thank you!
*${centerSettings.centerName}*`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${targetPhone}?text=${encoded}`;
}

export function exportCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row =>
      row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
