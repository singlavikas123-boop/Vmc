import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  MessageSquare, 
  CreditCard, 
  Search, 
  Download, 
  CheckCircle2, 
  Phone,
  Copy,
  Check
} from 'lucide-react';
import { Student, Batch, FeePayment, CenterSettings } from '../types';
import { formatCurrency, buildWhatsAppReminderUrl, exportCsv } from '../utils/formatters';
import { getStudentMonthlyTotal } from '../utils/storage';

interface DueFeesViewProps {
  students: Student[];
  batches: Batch[];
  payments: FeePayment[];
  settings: CenterSettings;
  currentMonth: string;
  onRecordPayment: (studentId: string) => void;
  onViewStudent: (student: Student) => void;
}

const MONTH_OPTIONS = [
  'April 2026', 'May 2026', 'June 2026', 'July 2026',
  'August 2026', 'September 2026', 'October 2026', 'November 2026',
  'December 2026', 'January 2027', 'February 2027', 'March 2027'
];

export const DueFeesView: React.FC<DueFeesViewProps> = ({
  students,
  batches,
  payments,
  settings,
  currentMonth,
  onRecordPayment,
  onViewStudent,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedBatch, setCopiedBatch] = useState(false);

  // Compute dues for selected month
  const defaulterList = useMemo(() => {
    const activeStudents = students.filter(s => s.status === 'active');
    
    return activeStudents.map(student => {
      const monthlyExpected = getStudentMonthlyTotal(student, batches);
      const paidForMonth = payments
        .filter(p => p.studentId === student.id && p.month.toLowerCase() === selectedMonth.toLowerCase())
        .reduce((sum, p) => sum + p.amount, 0);

      const balanceDue = Math.max(0, monthlyExpected - paidForMonth);
      const isUnpaid = paidForMonth === 0;

      return {
        student,
        monthlyExpected,
        paidForMonth,
        balanceDue,
        isUnpaid,
      };
    })
    .filter(item => item.balanceDue > 0)
    .sort((a, b) => b.balanceDue - a.balanceDue);
  }, [students, batches, payments, selectedMonth]);

  const filteredDefaulters = useMemo(() => {
    return defaulterList.filter(({ student }) => {
      const q = searchQuery.toLowerCase();
      return (
        student.name.toLowerCase().includes(q) ||
        student.rollNo.toLowerCase().includes(q) ||
        student.guardianName.toLowerCase().includes(q) ||
        student.guardianPhone.includes(q) ||
        student.phone.includes(q)
      );
    });
  }, [defaulterList, searchQuery]);

  const totalOutstanding = filteredDefaulters.reduce((acc, item) => acc + item.balanceDue, 0);

  const handleExportCsv = () => {
    const headers = [
      'Roll No',
      'Student Name',
      'Parent Name',
      'Parent Phone',
      'Grade',
      'Fee Month',
      'Expected Fee (₹)',
      'Paid Amount (₹)',
      'Balance Due (₹)'
    ];

    const rows = filteredDefaulters.map(({ student, monthlyExpected, paidForMonth, balanceDue }) => [
      student.rollNo,
      student.name,
      student.guardianName,
      student.guardianPhone,
      student.grade,
      selectedMonth,
      monthlyExpected,
      paidForMonth,
      balanceDue,
    ]);

    exportCsv(`defaulters_${selectedMonth.replace(/\s+/g, '_')}.csv`, headers, rows);
  };

  const handleCopyBatchList = () => {
    const lines = filteredDefaulters.map(({ student, balanceDue }, idx) => 
      `${idx + 1}. ${student.name} (${student.rollNo}) - Due: ${settings.currencySymbol}${balanceDue.toLocaleString('en-IN')} [Parent: ${student.guardianName} - ${student.guardianPhone}]`
    );
    const summary = `*${settings.centerName} - Fee Dues Summary for ${selectedMonth}*\nTotal Due: ${settings.currencySymbol}${totalOutstanding.toLocaleString('en-IN')}\n\n${lines.join('\n')}`;
    navigator.clipboard.writeText(summary);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>Fee Recovery & Follow-ups</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-amber-700 font-semibold">{filteredDefaulters.length} Pending Students</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Due & Overdue Fees
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyBatchList}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg cursor-pointer transition-colors"
            title="Copy list of all defaulters for administrative review"
          >
            {copiedBatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
            <span>{copiedBatch ? 'Copied List!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-amber-200 rounded-xl p-4 bg-amber-50/20">
          <span className="text-xs text-amber-800 font-semibold">Total Outstanding Balance</span>
          <div className="text-2xl font-bold font-mono text-amber-900 mt-1 tabular-nums">
            {formatCurrency(totalOutstanding, settings.currencySymbol)}
          </div>
          <span className="text-[11px] text-amber-700 mt-1 block">For {selectedMonth}</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <span className="text-xs text-neutral-500 font-medium">Pending Defaulters Count</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {filteredDefaulters.length} students
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">Require follow-up</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <span className="text-xs text-neutral-500 font-medium">Fee Billing Month</span>
          <div className="mt-1">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full px-2.5 py-1.5 text-sm font-semibold border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:ring-2 focus:ring-indigo-500/20"
            >
              {MONTH_OPTIONS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter search */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3 sm:p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search defaulter by student name, roll number, or parent contact..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-neutral-50/50"
          />
        </div>
      </div>

      {/* Defaulters Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/75 text-xs font-semibold text-neutral-600">
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-4">Class & Parent Details</th>
                <th className="py-3 px-4 text-right">Expected Fee</th>
                <th className="py-3 px-4 text-right">Paid So Far</th>
                <th className="py-3 px-4 text-right">Pending Due</th>
                <th className="py-3 px-4 text-center">Follow-up</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
              {filteredDefaulters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-neutral-500">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-base font-bold text-neutral-900">No outstanding dues for {selectedMonth}!</p>
                    <p className="text-xs text-neutral-400 mt-1">All active students have fully cleared their tuition fees for this period.</p>
                  </td>
                </tr>
              ) : (
                filteredDefaulters.map(({ student, monthlyExpected, paidForMonth, balanceDue, isUnpaid }) => {
                  const whatsappUrl = buildWhatsAppReminderUrl(student, settings, balanceDue, [selectedMonth]);

                  return (
                    <tr key={student.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onViewStudent(student)}
                          className="font-semibold text-neutral-900 hover:text-indigo-600 text-left block cursor-pointer"
                        >
                          {student.name}
                        </button>
                        <span className="font-mono text-xs text-neutral-500">
                          {student.rollNo}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs text-neutral-600">
                        <div className="font-medium text-neutral-900">{student.grade}</div>
                        <div className="text-neutral-500 mt-0.5 flex items-center gap-1">
                          <span>Parent: {student.guardianName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono font-semibold">{student.guardianPhone}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-neutral-600 tabular-nums">
                        {formatCurrency(monthlyExpected, settings.currencySymbol)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-600">
                        {paidForMonth > 0 ? (
                          <span className="text-neutral-800 font-semibold">
                            {formatCurrency(paidForMonth, settings.currencySymbol)}
                          </span>
                        ) : (
                          <span className="text-neutral-400">₹0</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-bold font-mono text-rose-700 tabular-nums">
                          {formatCurrency(balanceDue, settings.currencySymbol)}
                        </span>
                        <div className="text-[10px] text-neutral-400">
                          {isUnpaid ? 'Full month unpaid' : 'Partially paid'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Reminder</span>
                        </a>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onRecordPayment(student.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-1 ml-auto"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Collect Now</span>
                        </button>
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
