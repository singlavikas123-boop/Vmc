import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CreditCard, 
  Download, 
  Receipt, 
  Filter, 
  Calendar,
  Eye,
  Trash2,
  DollarSign
} from 'lucide-react';
import { FeePayment, Student, Batch, CenterSettings } from '../types';
import { formatCurrency, formatDate, exportCsv } from '../utils/formatters';

interface FeeLedgerViewProps {
  payments: FeePayment[];
  students: Student[];
  batches: Batch[];
  settings: CenterSettings;
  onOpenRecordPayment: () => void;
  onViewReceipt: (payment: FeePayment) => void;
  onDeletePayment: (paymentId: string) => void;
}

export const FeeLedgerView: React.FC<FeeLedgerViewProps> = ({
  payments,
  students,
  batches,
  settings,
  onOpenRecordPayment,
  onViewReceipt,
  onDeletePayment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');

  // Collect unique months from payments
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    payments.forEach(p => set.add(p.month));
    return Array.from(set);
  }, [payments]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const student = students.find(s => s.id === p.studentId);
      const studentName = student?.name.toLowerCase() || '';
      const rollNo = student?.rollNo.toLowerCase() || '';
      const receiptNo = p.receiptNo.toLowerCase();
      const ref = (p.referenceNo || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch = 
        studentName.includes(q) || 
        rollNo.includes(q) || 
        receiptNo.includes(q) || 
        ref.includes(q);

      const matchesMonth = selectedMonth === 'all' || p.month === selectedMonth;
      const matchesMode = selectedMode === 'all' || p.paymentMode === selectedMode;

      return matchesSearch && matchesMonth && matchesMode;
    });
  }, [payments, students, searchQuery, selectedMonth, selectedMode]);

  // Calculations
  const totalAmountFiltered = filteredPayments.reduce((acc, p) => acc + p.amount, 0);

  const handleExportCsv = () => {
    const headers = [
      'Receipt No',
      'Payment Date',
      'Student Roll No',
      'Student Name',
      'Month/Period',
      'Amount Paid (₹)',
      'Payment Mode',
      'Reference No',
      'Discount (₹)',
      'Recorded By',
      'Notes'
    ];

    const rows = filteredPayments.map(p => {
      const student = students.find(s => s.id === p.studentId);
      return [
        p.receiptNo,
        p.paymentDate,
        student?.rollNo || '',
        student?.name || 'Unknown',
        p.month,
        p.amount,
        p.paymentMode,
        p.referenceNo || '',
        p.discount || 0,
        p.recordedBy || '',
        p.notes || '',
      ];
    });

    exportCsv(`fee_ledger_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>Accounting Ledger</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{payments.length} Lifetime Receipts</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Fee Collection Ledger
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenRecordPayment}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <span className="text-xs text-neutral-500 font-medium">Filtered Total Collections</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {formatCurrency(totalAmountFiltered, settings.currencySymbol)}
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <span className="text-xs text-neutral-500 font-medium">Transaction Receipts Count</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {filteredPayments.length} receipts
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <span className="text-xs text-neutral-500 font-medium">Average Transaction Size</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {formatCurrency(
              filteredPayments.length > 0 ? Math.round(totalAmountFiltered / filteredPayments.length) : 0,
              settings.currencySymbol
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by receipt #, student name, roll no, ref ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-neutral-50/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Month Selector */}
          <div className="w-full md:w-52">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              aria-label="Filter by Billing Month"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            >
              <option value="all">All Months</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Payment Mode Selector */}
          <div className="w-full md:w-48">
            <select
              value={selectedMode}
              onChange={e => setSelectedMode(e.target.value)}
              aria-label="Filter by Payment Mode"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            >
              <option value="all">All Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI / GPay / PhonePe</option>
              <option value="Bank Transfer">Bank Transfer / NEFT</option>
              <option value="Cheque">Cheque</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-neutral-500 flex items-center justify-between pt-2 border-t border-neutral-100">
          <span>Showing {filteredPayments.length} of {payments.length} transactions</span>
          {(searchQuery || selectedMonth !== 'all' || selectedMode !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedMonth('all');
                setSelectedMode('all');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/75 text-xs font-semibold text-neutral-600">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-4">Fee Month</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Reference No</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    <p className="text-sm font-medium">No fee payment records found.</p>
                    <p className="text-xs text-neutral-400 mt-1">Try changing filter values or record a new fee payment.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => {
                  const student = students.find(s => s.id === payment.studentId);

                  return (
                    <tr 
                      key={payment.id} 
                      className="hover:bg-neutral-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-neutral-900">
                        {payment.receiptNo}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 text-xs whitespace-nowrap">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">
                          {student?.name || 'Unknown Student'}
                        </div>
                        <div className="text-xs font-mono text-neutral-500">
                          {student?.rollNo || '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-800">
                        {payment.month}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded">
                          {payment.paymentMode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-500 text-xs truncate max-w-[140px]" title={payment.referenceNo}>
                        {payment.referenceNo || '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                        {formatCurrency(payment.amount, settings.currencySymbol)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewReceipt(payment)}
                            title="Print / View Official Receipt"
                            className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>

                          <button
                            onClick={() => onDeletePayment(payment.id)}
                            title="Delete Record"
                            className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
