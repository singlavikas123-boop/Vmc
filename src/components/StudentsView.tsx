import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Phone, 
  MessageSquare, 
  MoreVertical, 
  CreditCard, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student, Batch, FeePayment, CenterSettings } from '../types';
import { formatCurrency, exportCsv, buildWhatsAppReminderUrl } from '../utils/formatters';
import { getStudentMonthlyTotal } from '../utils/storage';

interface StudentsViewProps {
  students: Student[];
  batches: Batch[];
  payments: FeePayment[];
  settings: CenterSettings;
  currentMonth: string;
  onOpenAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onViewStudent: (student: Student) => void;
  onRecordPayment: (studentId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  batches,
  payments,
  settings,
  currentMonth,
  onOpenAddStudent,
  onEditStudent,
  onDeleteStudent,
  onViewStudent,
  onRecordPayment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [feeStatusFilter, setFeeStatusFilter] = useState<string>('all');

  // Compute fee status for each student in the current month
  const studentsWithFeeStatus = useMemo(() => {
    return students.map(student => {
      const monthlyFee = getStudentMonthlyTotal(student, batches);
      const paymentsForMonth = payments.filter(
        p => p.studentId === student.id && p.month.toLowerCase() === currentMonth.toLowerCase()
      );
      const paidThisMonth = paymentsForMonth.reduce((sum, p) => sum + p.amount, 0);
      const balanceDue = Math.max(0, monthlyFee - paidThisMonth);
      
      let feeStatus: 'paid' | 'partial' | 'due' = 'paid';
      if (monthlyFee > 0) {
        if (paidThisMonth === 0) feeStatus = 'due';
        else if (paidThisMonth < monthlyFee) feeStatus = 'partial';
      }

      return {
        ...student,
        monthlyFee,
        paidThisMonth,
        balanceDue,
        feeStatus,
      };
    });
  }, [students, batches, payments, currentMonth]);

  // Filtering
  const filteredStudents = useMemo(() => {
    return studentsWithFeeStatus.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        s.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.schoolOrCollege && s.schoolOrCollege.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBatch = selectedBatch === 'all' || s.batchIds.includes(selectedBatch);
      const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
      const matchesFee = 
        feeStatusFilter === 'all' || 
        (feeStatusFilter === 'due' && s.balanceDue > 0) ||
        (feeStatusFilter === 'paid' && s.balanceDue === 0);

      return matchesSearch && matchesBatch && matchesStatus && matchesFee;
    });
  }, [studentsWithFeeStatus, searchQuery, selectedBatch, selectedStatus, feeStatusFilter]);

  const handleExportCsv = () => {
    const headers = [
      'Roll No',
      'Student Name',
      'Phone',
      'Email',
      'Guardian Name',
      'Guardian Phone',
      'Grade',
      'School/College',
      'Batches',
      'Monthly Fee (₹)',
      'Status',
      'Balance Due Current Month (₹)'
    ];

    const rows = filteredStudents.map(s => {
      const batchNames = s.batchIds
        .map(id => batches.find(b => b.id === id)?.name || id)
        .join('; ');
      return [
        s.rollNo,
        s.name,
        s.phone,
        s.email || '',
        s.guardianName,
        s.guardianPhone,
        s.grade,
        s.schoolOrCollege || '',
        batchNames,
        s.monthlyFee,
        s.status,
        s.balanceDue,
      ];
    });

    exportCsv(`coaching_students_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>Student Directory</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{students.length} Total Enrolled</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Students Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors cursor-pointer"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, roll no, phone, parent name, school..."
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

          {/* Batch Selector */}
          <div className="w-full md:w-56">
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              aria-label="Filter by Batch"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            >
              <option value="all">All Batches ({batches.length})</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-40">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              aria-label="Filter by Student Status"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive / On Leave</option>
              <option value="alumni">Alumni / Completed</option>
            </select>
          </div>

          {/* Fee Status Filter */}
          <div className="w-full md:w-44">
            <select
              value={feeStatusFilter}
              onChange={e => setFeeStatusFilter(e.target.value)}
              aria-label="Filter by Fee Status"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            >
              <option value="all">Fee Status ({currentMonth.split(' ')[0]})</option>
              <option value="due">Fee Pending / Due</option>
              <option value="paid">Fee Cleared</option>
            </select>
          </div>
        </div>

        {/* Quick summary line */}
        <div className="text-xs text-neutral-500 flex items-center justify-between pt-2 border-t border-neutral-100">
          <span>Showing {filteredStudents.length} of {students.length} students</span>
          {searchQuery || selectedBatch !== 'all' || selectedStatus !== 'all' || feeStatusFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBatch('all');
                setSelectedStatus('all');
                setFeeStatusFilter('all');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          ) : null}
        </div>
      </div>

      {/* Table Data View */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/75 text-xs font-semibold text-neutral-600">
                <th className="py-3 px-4">Roll No & Student</th>
                <th className="py-3 px-4">Class & Contact</th>
                <th className="py-3 px-4">Enrolled Batches</th>
                <th className="py-3 px-4 text-right">Monthly Fee</th>
                <th className="py-3 px-4">{currentMonth.split(' ')[0]} Status</th>
                <th className="py-3 px-4 text-center">Enrollment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <p className="text-sm font-medium">No students match your filter criteria.</p>
                    <p className="text-xs text-neutral-400 mt-1">Try modifying search keywords or clearing filters.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const studentBatches = batches.filter(b => student.batchIds.includes(b.id));
                  const whatsappUrl = buildWhatsAppReminderUrl(student, settings, student.balanceDue, [currentMonth]);

                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-neutral-50/80 transition-colors group"
                    >
                      {/* Roll & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0"
                            style={{ backgroundColor: student.avatarColor || '#4f46e5' }}
                          >
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <button
                              onClick={() => onViewStudent(student)}
                              className="font-semibold text-neutral-900 hover:text-indigo-600 cursor-pointer block text-left"
                            >
                              {student.name}
                            </button>
                            <span className="font-mono text-xs text-neutral-500">
                              {student.rollNo}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Grade & Contact */}
                      <td className="py-3 px-4 text-xs text-neutral-600">
                        <div className="font-medium text-neutral-900">{student.grade}</div>
                        <div className="text-neutral-500 mt-0.5 flex items-center gap-1">
                          <span>Parent: {student.guardianName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{student.guardianPhone || student.phone}</span>
                        </div>
                      </td>

                      {/* Enrolled Batches */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {studentBatches.length === 0 ? (
                            <span className="text-xs text-neutral-400 italic">No batch assigned</span>
                          ) : (
                            studentBatches.map(b => (
                              <span 
                                key={b.id} 
                                className="text-xs text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded font-medium truncate max-w-[150px]"
                                title={b.name}
                              >
                                {b.subject}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Monthly Fee */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-bold text-neutral-900 tabular-nums">
                          {formatCurrency(student.monthlyFee, settings.currencySymbol)}
                        </div>
                        {student.discountPercent > 0 && (
                          <div className="text-[11px] text-emerald-600 font-medium">
                            {student.discountPercent}% scholarship
                          </div>
                        )}
                      </td>

                      {/* Current Month Fee Status */}
                      <td className="py-3 px-4">
                        {student.balanceDue === 0 ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Cleared</span>
                          </div>
                        ) : student.paidThisMonth > 0 ? (
                          <div className="text-xs">
                            <span className="text-amber-700 font-medium font-mono tabular-nums">
                              Due: {formatCurrency(student.balanceDue, settings.currencySymbol)}
                            </span>
                            <div className="text-[11px] text-neutral-500">
                              (Paid {formatCurrency(student.paidThisMonth, settings.currencySymbol)})
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs">
                            <span className="text-rose-700 font-medium font-mono tabular-nums">
                              Unpaid: {formatCurrency(student.balanceDue, settings.currencySymbol)}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Enrollment status */}
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          student.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : student.status === 'inactive'
                            ? 'bg-neutral-100 text-neutral-600'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {student.balanceDue > 0 && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="WhatsApp Fee Reminder"
                              className="px-2 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">WhatsApp</span>
                            </a>
                          )}

                          <button
                            onClick={() => onRecordPayment(student.id)}
                            title="Record Fee Payment"
                            className="px-2.5 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Fee</span>
                          </button>

                          <button
                            onClick={() => onViewStudent(student)}
                            title="View Full Student Profile"
                            className="px-2 py-1 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-neutral-600" />
                            <span className="hidden lg:inline">View</span>
                          </button>

                          <button
                            onClick={() => onEditStudent(student)}
                            title="Edit Student Information"
                            className="p-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteStudent(student.id)}
                            title="Remove Student"
                            className="p-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
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
