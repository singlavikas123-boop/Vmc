import React, { useState } from 'react';
import { X, Printer, Share2, Copy, Check, Download } from 'lucide-react';
import { FeePayment, Student, Batch, CenterSettings } from '../types';
import { formatCurrency, formatDate, numberToWords } from '../utils/formatters';

interface FeeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: FeePayment | null;
  student: Student | null;
  batches: Batch[];
  settings: CenterSettings;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  student,
  batches,
  settings,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !payment || !student) return null;

  const studentBatches = batches.filter(b => student.batchIds.includes(b.id));
  const batchNames = studentBatches.map(b => b.name).join(', ') || 'Regular Academic Coaching';
  const amountWords = numberToWords(payment.amount);
  const balanceDue = Math.max(0, payment.expectedFee - payment.amount);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsAppText = () => {
    const summary = `*${settings.centerName}*
*OFFICIAL FEE PAYMENT RECEIPT*
━━━━━━━━━━━━━━━━━━━━━━━
• Receipt No: *${payment.receiptNo}*
• Date: ${formatDate(payment.paymentDate)}
• Student: *${student.name}* (Roll: ${student.rollNo})
• Class: ${student.grade}
• Period: *${payment.month}*
• Amount Paid: *${settings.currencySymbol}${payment.amount.toLocaleString('en-IN')}*
• Payment Mode: ${payment.paymentMode} ${payment.referenceNo ? `(${payment.referenceNo})` : ''}
• Balance Due: ${settings.currencySymbol}${balanceDue.toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━━━━
Amount in Words: ${amountWords}
Received by: ${payment.recordedBy || 'Accounts'}

Thank you for your payment!
${settings.phone ? `Contact: ${settings.phone}` : ''}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[96vh] flex flex-col border border-neutral-200">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="no-print px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-neutral-600">
              Receipt #{payment.receiptNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWhatsAppText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg cursor-pointer transition-colors"
              title="Copy receipt summary for WhatsApp"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-neutral-100/60 flex justify-center">
          <div className="printable-card bg-white border border-neutral-300 rounded-lg p-6 sm:p-8 w-full max-w-xl shadow-sm text-neutral-900 text-xs sm:text-sm">
            
            {/* Header: Institute Brand */}
            <div className="text-center pb-4 border-b-2 border-red-600">
              <div className="flex justify-center mb-1.5">
                <img
                  src="/vmc-logo.svg"
                  alt="VMC Logo"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-red-600 uppercase font-serif">
                VANITA MATH CLASSES
              </h1>
              <p className="text-xs font-bold text-neutral-700 mt-0.5 tracking-wide">
                Specialized Mathematics Coaching (8th, 9th, 10th, +1, +2)
              </p>
              <p className="text-[11px] text-neutral-500 mt-1 max-w-md mx-auto leading-relaxed">
                {settings.address || 'Civil Lines, Bathinda / Punjab · Head: Er. Vikas'}
              </p>
              <div className="text-[11px] text-neutral-600 font-mono mt-0.5 flex flex-wrap items-center justify-center gap-x-3">
                {settings.phone && <span>Tel: {settings.phone}</span>}
                {settings.email && <span>Email: {settings.email}</span>}
                {settings.upiId && <span className="text-emerald-700 font-bold">UPI: {settings.upiId}</span>}
              </div>
            </div>

            {/* Receipt Title Strip */}
            <div className="py-2.5 my-3 bg-neutral-900 text-white text-center rounded">
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">
                Official Tuition Fee Receipt
              </span>
            </div>

            {/* Receipt Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 py-2 border-b border-neutral-200 text-xs">
              <div>
                <span className="text-neutral-500">Receipt Number:</span>{' '}
                <strong className="font-mono text-neutral-900">{payment.receiptNo}</strong>
              </div>
              <div className="text-right">
                <span className="text-neutral-500">Date of Issue:</span>{' '}
                <strong className="text-neutral-900">{formatDate(payment.paymentDate)}</strong>
              </div>
              <div>
                <span className="text-neutral-500">Academic Session:</span>{' '}
                <strong className="text-neutral-900">{settings.academicYear}</strong>
              </div>
              <div className="text-right">
                <span className="text-neutral-500">Fee Month / Term:</span>{' '}
                <strong className="text-neutral-900">{payment.month}</strong>
              </div>
            </div>

            {/* Student Info Box */}
            <div className="my-4 p-3 bg-neutral-50 rounded border border-neutral-200 text-xs space-y-1.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-neutral-500">Student Name:</span>{' '}
                  <strong className="text-neutral-900 text-sm">{student.name}</strong>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500">Roll / Reg No:</span>{' '}
                  <strong className="font-mono text-neutral-900">{student.rollNo}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-neutral-500">Class / Grade:</span>{' '}
                  <span className="font-medium text-neutral-800">{student.grade}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500">Parent/Guardian:</span>{' '}
                  <span className="font-medium text-neutral-800">{student.guardianName}</span>
                </div>
              </div>

              <div>
                <span className="text-neutral-500">Enrolled Courses:</span>{' '}
                <span className="text-neutral-800">{batchNames}</span>
              </div>
            </div>

            {/* Payment Items Table */}
            <div className="my-4 border border-neutral-200 rounded overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-700 font-semibold border-b border-neutral-200">
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3 text-right">Gross Fee</th>
                    <th className="py-2 px-3 text-right">Concession</th>
                    <th className="py-2 px-3 text-right">Net Payable</th>
                    <th className="py-2 px-3 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-100">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-neutral-900">
                        Monthly Tuition Fee ({payment.month})
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {batchNames}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {formatCurrency(payment.expectedFee + (payment.discount || 0), settings.currencySymbol)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-700">
                      {payment.discount > 0 ? `- ${formatCurrency(payment.discount, settings.currencySymbol)}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold">
                      {formatCurrency(payment.expectedFee, settings.currencySymbol)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-neutral-900 text-sm">
                      {formatCurrency(payment.amount, settings.currencySymbol)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-neutral-50 font-bold border-t border-neutral-200">
                    <td colSpan={4} className="py-2.5 px-3 text-right uppercase text-neutral-700 text-[11px]">
                      Total Amount Received:
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-base text-neutral-900">
                      {formatCurrency(payment.amount, settings.currencySymbol)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Amount in words */}
            <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200 text-xs mb-3">
              <span className="text-neutral-500 font-medium">Amount in Words:</span>{' '}
              <strong className="text-neutral-900 italic">{amountWords}</strong>
            </div>

            {/* Payment Details & Remaining Due */}
            <div className="grid grid-cols-2 gap-3 text-xs py-2 border-y border-neutral-200">
              <div>
                <span className="text-neutral-500">Payment Mode:</span>{' '}
                <strong className="font-mono text-neutral-900">{payment.paymentMode}</strong>
                {payment.referenceNo && (
                  <div className="text-[11px] font-mono text-neutral-600 mt-0.5">
                    Ref ID: {payment.referenceNo}
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="text-neutral-500">Balance Remaining for {payment.month}:</span>{' '}
                <div className={`font-mono font-bold ${balanceDue > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {balanceDue > 0 ? formatCurrency(balanceDue, settings.currencySymbol) : 'Nil (Fully Cleared)'}
                </div>
              </div>
            </div>

            {/* Terms and signature boxes */}
            <div className="mt-4 pt-2">
              <p className="text-[10px] text-neutral-500 leading-normal">
                {settings.termsAndConditions}
              </p>

              <div className="grid grid-cols-2 gap-6 mt-12 pt-4 text-center text-xs">
                <div>
                  <div className="border-t border-neutral-400 pt-1 font-medium text-neutral-600">
                    Depositor / Student Signature
                  </div>
                </div>

                <div>
                  <div className="border-t border-neutral-400 pt-1 font-medium text-neutral-900">
                    Authorized Signatory & Stamp
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    {settings.centerName}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
