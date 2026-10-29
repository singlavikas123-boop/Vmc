import React, { useState, useEffect } from 'react';
import { X, Check, Calculator, Receipt, CreditCard } from 'lucide-react';
import { Student, Batch, FeePayment, CenterSettings, PaymentMode } from '../types';
import { formatCurrency } from '../utils/formatters';
import { getStudentMonthlyTotal, generateNextReceiptNumber } from '../utils/storage';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (payment: FeePayment) => void;
  students: Student[];
  batches: Batch[];
  payments: FeePayment[];
  settings: CenterSettings;
  preselectedStudentId?: string;
  defaultMonth: string;
}

const MONTH_OPTIONS = [
  'April 2026', 'May 2026', 'June 2026', 'July 2026',
  'August 2026', 'September 2026', 'October 2026', 'November 2026',
  'December 2026', 'January 2027', 'February 2027', 'March 2027'
];

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  onSavePayment,
  students,
  batches,
  payments,
  settings,
  preselectedStudentId,
  defaultMonth,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [month, setMonth] = useState<string>(defaultMonth);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [expectedFee, setExpectedFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [recordedBy, setRecordedBy] = useState<string>('Admin Desk');
  const [receiptNo, setReceiptNo] = useState<string>('');

  // Set student on open
  useEffect(() => {
    if (isOpen) {
      const initialStudent = preselectedStudentId || (students.length > 0 ? students[0].id : '');
      setSelectedStudentId(initialStudent);
      setMonth(defaultMonth);
      setPaymentDate(new Date().toISOString().slice(0, 10));
      setReceiptNo(generateNextReceiptNumber(settings, payments));
      setReferenceNo('');
      setNotes('');
    }
  }, [isOpen, preselectedStudentId, students, defaultMonth, settings, payments]);

  // Recalculate fees whenever selected student or month changes
  useEffect(() => {
    if (!selectedStudentId) return;
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    // Calculate raw batch fee
    const studentBatches = batches.filter(b => student.batchIds.includes(b.id));
    const rawFee = studentBatches.reduce((acc, b) => acc + b.monthlyFee, 0);
    const calculatedDiscount = student.discountPercent > 0 
      ? Math.round((rawFee * student.discountPercent) / 100)
      : 0;

    const netMonthlyFee = Math.max(0, rawFee - calculatedDiscount);

    // Check if any payment was already recorded for this month
    const existingForMonth = payments
      .filter(p => p.studentId === student.id && p.month.toLowerCase() === month.toLowerCase())
      .reduce((sum, p) => sum + p.amount, 0);

    const remainingDue = Math.max(0, netMonthlyFee - existingForMonth);

    setExpectedFee(netMonthlyFee);
    setDiscount(calculatedDiscount);
    setAmount(remainingDue > 0 ? remainingDue : netMonthlyFee);
  }, [selectedStudentId, month, students, batches, payments]);

  if (!isOpen) return null;

  const currentStudent = students.find(s => s.id === selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert('Please select a student');
      return;
    }
    if (amount <= 0) {
      alert('Payment amount must be greater than 0');
      return;
    }

    const newPayment: FeePayment = {
      id: `pay-${Date.now()}`,
      receiptNo: receiptNo || generateNextReceiptNumber(settings, payments),
      studentId: selectedStudentId,
      batchId: currentStudent?.batchIds[0],
      amount: Number(amount),
      expectedFee: Number(expectedFee),
      discount: Number(discount),
      month,
      year: parseInt(month.split(' ')[1]) || 2026,
      paymentDate,
      paymentMode,
      referenceNo: referenceNo.trim(),
      notes: notes.trim(),
      recordedBy: recordedBy.trim(),
    };

    onSavePayment(newPayment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full border border-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span>Record Fee Collection</span>
            </h2>
            <p className="text-xs text-neutral-500">
              Generate official receipt and log transaction in financial ledger
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Student Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Select Student <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-medium text-neutral-900"
            >
              <option value="" disabled>-- Choose Enrolled Student --</option>
              {students.map(s => {
                const total = getStudentMonthlyTotal(s, batches);
                return (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo}) · {s.grade} · {formatCurrency(total, settings.currencySymbol)}/mo
                  </option>
                );
              })}
            </select>
          </div>

          {/* Month & Payment Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Fee For Month <span className="text-rose-500">*</span>
              </label>
              <select
                value={month}
                onChange={e => setMonth(e.target.value)}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {MONTH_OPTIONS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Receipt Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          {/* Fee Breakdown Calculation */}
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>Standard Monthly Fee:</span>
              <span className="font-mono tabular-nums font-semibold text-neutral-900">
                {formatCurrency(expectedFee, settings.currencySymbol)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-700">
                <span>Concession / Scholarship Discount:</span>
                <span className="font-mono tabular-nums font-semibold">
                  - {formatCurrency(discount, settings.currencySymbol)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs font-bold text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Net Expected Payable:</span>
              <span className="font-mono tabular-nums text-indigo-700 text-sm">
                {formatCurrency(expectedFee, settings.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Payment Amount & Receipt No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Amount Received ({settings.currencySymbol}) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                step="50"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-base font-bold font-mono text-emerald-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Receipt Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={receiptNo}
                onChange={e => setReceiptNo(e.target.value)}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          {/* Payment Mode & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Payment Mode <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-medium"
              >
                <option value="Cash">Cash (Front Desk)</option>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Bank Transfer">Bank Transfer / IMPS / NEFT</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Credit / Debit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Transaction ID / Ref / Cheque No
              </label>
              <input
                type="text"
                placeholder="e.g. UPI/123456789 or CHQ-00123"
                value={referenceNo}
                onChange={e => setReferenceNo(e.target.value)}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          {/* Notes & Staff identifier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Remarks / Receipt Note
              </label>
              <input
                type="text"
                placeholder="e.g. September fee paid in full"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Received & Verified By
              </label>
              <input
                type="text"
                value={recordedBy}
                onChange={e => setRecordedBy(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Record & Generate Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
