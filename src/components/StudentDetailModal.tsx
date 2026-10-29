import React from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  GraduationCap, 
  CreditCard, 
  MessageSquare, 
  Receipt, 
  Edit,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student, Batch, FeePayment, CenterSettings } from '../types';
import { formatCurrency, formatDate, buildWhatsAppReminderUrl } from '../utils/formatters';
import { getStudentMonthlyTotal } from '../utils/storage';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  batches: Batch[];
  payments: FeePayment[];
  settings: CenterSettings;
  currentMonth: string;
  onEditStudent: (student: Student) => void;
  onRecordPayment: (studentId: string) => void;
  onViewReceipt: (payment: FeePayment) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  batches,
  payments,
  settings,
  currentMonth,
  onEditStudent,
  onRecordPayment,
  onViewReceipt,
}) => {
  if (!isOpen || !student) return null;

  const studentBatches = batches.filter(b => student.batchIds.includes(b.id));
  const studentPayments = payments.filter(p => p.studentId === student.id);
  
  // Financial summaries
  const monthlyFee = getStudentMonthlyTotal(student, batches);
  const totalPaidAllTime = studentPayments.reduce((acc, p) => acc + p.amount, 0);
  
  const currentMonthPaid = studentPayments
    .filter(p => p.month.toLowerCase() === currentMonth.toLowerCase())
    .reduce((acc, p) => acc + p.amount, 0);

  const currentMonthDue = Math.max(0, monthlyFee - currentMonthPaid);

  const whatsappUrl = buildWhatsAppReminderUrl(student, settings, currentMonthDue, [currentMonth]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-neutral-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-start justify-between bg-neutral-50/50">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-sm"
              style={{ backgroundColor: student.avatarColor || '#4f46e5' }}
            >
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900">{student.name}</h2>
                <span className="font-mono text-xs px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded font-semibold">
                  {student.rollNo}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  student.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {student.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {student.grade} {student.schoolOrCollege ? `· ${student.schoolOrCollege}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEditStudent(student);
              }}
              className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-200/60 cursor-pointer"
              title="Edit Profile"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
              <span className="text-xs text-neutral-500 block">Monthly Tuition Fee</span>
              <div className="text-lg font-bold font-mono text-neutral-900 mt-0.5 tabular-nums">
                {formatCurrency(monthlyFee, settings.currencySymbol)}
                {student.discountPercent > 0 && (
                  <span className="text-xs font-normal text-emerald-600 ml-1">
                    ({student.discountPercent}% off)
                  </span>
                )}
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
              <span className="text-xs text-neutral-500 block">Fee for {currentMonth.split(' ')[0]}</span>
              <div className="text-lg font-bold font-mono mt-0.5 tabular-nums">
                {currentMonthDue === 0 ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Cleared
                  </span>
                ) : (
                  <span className="text-amber-700">
                    Due: {formatCurrency(currentMonthDue, settings.currencySymbol)}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
              <span className="text-xs text-neutral-500 block">Total Lifetime Paid</span>
              <div className="text-lg font-bold font-mono text-indigo-700 mt-0.5 tabular-nums">
                {formatCurrency(totalPaidAllTime, settings.currencySymbol)}
              </div>
            </div>
          </div>

          {/* Contact & Guardian Information */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Contact & Guardian Records
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block">Parent / Guardian:</span>
                <span className="font-semibold text-neutral-900 text-sm block mt-0.5">
                  {student.guardianName}
                </span>
                <div className="flex items-center gap-2 mt-1 text-neutral-600">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-mono">{student.guardianPhone}</span>
                </div>
              </div>

              <div>
                <span className="text-neutral-500 block">Student Contact:</span>
                <div className="flex items-center gap-2 mt-1 text-neutral-600">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-mono">{student.phone || 'Not provided'}</span>
                </div>
                {student.email && (
                  <div className="flex items-center gap-2 mt-1 text-neutral-600">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{student.email}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-neutral-500 block">Admission Date:</span>
                <div className="flex items-center gap-2 mt-1 text-neutral-700">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{formatDate(student.admissionDate)}</span>
                </div>
              </div>

              {student.notes && (
                <div>
                  <span className="text-neutral-500 block">Internal Notes:</span>
                  <p className="mt-1 text-neutral-700 italic">{student.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Enrolled Batches */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Assigned Batches ({studentBatches.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {studentBatches.map(batch => (
                <div key={batch.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-semibold text-neutral-900">{batch.name}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Faculty: {batch.instructor} · {batch.room || 'Main Hall'}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200/60 text-xs font-mono">
                    <span className="text-neutral-600">{batch.schedule}</span>
                    <span className="font-bold text-neutral-900">
                      {formatCurrency(batch.monthlyFee, settings.currencySymbol)}/mo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Receipts History */}
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Payment History & Receipts
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  All fee receipts generated for {student.name}
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onRecordPayment(student.id);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>+ Collect Fee</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                    <th className="py-2.5 px-3">Receipt #</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {studentPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-neutral-400">
                        No payments recorded for this student yet.
                      </td>
                    </tr>
                  ) : (
                    studentPayments.map(p => (
                      <tr key={p.id} className="hover:bg-neutral-50">
                        <td className="py-2.5 px-3 font-mono font-semibold text-neutral-800">
                          {p.receiptNo}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-600">
                          {formatDate(p.paymentDate)}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-neutral-900">
                          {p.month}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-neutral-600">
                          {p.paymentMode}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-neutral-500">
                          {p.referenceNo || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                          {formatCurrency(p.amount, settings.currencySymbol)}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              onClose();
                              onViewReceipt(p);
                            }}
                            className="px-2 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded cursor-pointer"
                          >
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <div>
            {currentMonthDue > 0 && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send WhatsApp Fee Reminder</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRecordPayment(student.id);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
