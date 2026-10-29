import React, { useState } from 'react';
import { 
  Award, 
  CreditCard, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Receipt, 
  Clock, 
  User, 
  LogOut, 
  FileText,
  Bookmark,
  Building2,
  Phone,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Student, Batch, FeePayment, WeeklyTest, StudentTestMark, StudyNote, CenterSettings } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getStudentMonthlyTotal } from '../utils/storage';

interface StudentPortalProps {
  student: Student;
  batches: Batch[];
  payments: FeePayment[];
  tests: WeeklyTest[];
  marks: StudentTestMark[];
  notes: StudyNote[];
  settings: CenterSettings;
  currentMonth: string;
  onLogout: () => void;
  onViewReceipt: (payment: FeePayment) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  batches,
  payments,
  tests,
  marks,
  notes,
  settings,
  currentMonth,
  onLogout,
  onViewReceipt,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'fees' | 'notes'>('overview');
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(null);

  // Student batches
  const studentBatches = batches.filter(b => student.batchIds.includes(b.id));
  const primaryBatch = studentBatches[0];

  // Fee metrics
  const studentPayments = payments.filter(p => p.studentId === student.id);
  const totalPaidTillDate = studentPayments.reduce((acc, p) => acc + p.amount, 0);

  const monthlyExpected = getStudentMonthlyTotal(student, batches);
  const paidThisMonth = studentPayments
    .filter(p => p.month.toLowerCase() === currentMonth.toLowerCase())
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingDueThisMonth = Math.max(0, monthlyExpected - paidThisMonth);
  const isMonthCleared = pendingDueThisMonth === 0;

  // Tests & Marks metrics - match grade, batch, recorded mark or normalized class string
  const studentMarks = marks.filter(m => m.studentId === student.id);
  const classTests = tests.filter(t => 
    t.grade === student.grade ||
    (t.batchId && student.batchIds.includes(t.batchId)) ||
    studentMarks.some(m => m.testId === t.id) ||
    t.grade.toLowerCase().replace(/[^0-9a-z]/g, '').includes(student.grade.toLowerCase().replace(/[^0-9a-z]/g, '')) ||
    student.grade.toLowerCase().replace(/[^0-9a-z]/g, '').includes(t.grade.toLowerCase().replace(/[^0-9a-z]/g, ''))
  );

  const gradedCount = studentMarks.filter(m => m.isPresent).length;
  const overallPercentage = gradedCount > 0
    ? Math.round(
        studentMarks
          .filter(m => m.isPresent)
          .reduce((acc, m) => {
            const test = tests.find(t => t.id === m.testId);
            return acc + (test ? (m.marksObtained / test.maxMarks) * 100 : 0);
          }, 0) / gradedCount
      )
    : 0;

  // Notes for this student's grade
  const classNotes = notes.filter(n => 
    n.grade === student.grade ||
    (n.batchId && student.batchIds.includes(n.batchId)) ||
    n.grade.toLowerCase().replace(/[^0-9a-z]/g, '').includes(student.grade.toLowerCase().replace(/[^0-9a-z]/g, '')) ||
    student.grade.toLowerCase().replace(/[^0-9a-z]/g, '').includes(n.grade.toLowerCase().replace(/[^0-9a-z]/g, ''))
  );

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
        {/* Large Brand Banner Bar */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-lg shadow-sm shrink-0 flex items-center justify-center">
                <img
                  src="/vmc-logo.svg"
                  alt="VMC Logo"
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black uppercase font-serif tracking-tight text-white leading-none">
                  VANITA MATH CLASSES
                </h1>
                <p className="text-[10px] sm:text-xs text-rose-100 font-medium">
                  Mathmatics tuition classes for 8th, 9th, 10th, +1 & +2 · Student Portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right text-xs">
                <span className="font-bold text-white">{student.name}</span>
                <span className="text-rose-200 font-mono">Roll: {student.rollNo}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-900 bg-white hover:bg-rose-50 rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Logout from student portal"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-bar with Student context */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800">{student.name}</span>
            <span className="text-neutral-400">·</span>
            <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold border border-red-200">{student.grade}</span>
            <span className="text-neutral-400">·</span>
            <span className="font-mono text-neutral-600">Roll No: {student.rollNo}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
              Faculty: Vanita Rani Gupta (M.Sc, M.Phil, B.Ed, 17+ yrs exp)
            </span>
          </div>
        </div>
      </header>

      {/* Main Student Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Welcome Greeting Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-neutral-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Mathematics Academic Session {settings.academicYear}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Welcome back, {student.name}!
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-xl">
                Track your weekly mathematics test performance, view submitted fee records, and access formula sheets & notes.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-indigo-200 block">Current Status</span>
                <span className="text-sm font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Active Student
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Professional KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Fee Submitted */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Fee Submitted Till Date</span>
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-700 mt-2 tabular-nums">
                {formatCurrency(totalPaidTillDate, settings.currencySymbol)}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between">
              <span>{studentPayments.length} receipts verified</span>
              <button 
                onClick={() => setActiveTab('fees')}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                View Ledger
              </button>
            </div>
          </div>

          {/* Card 2: Pending Fee Status */}
          <div className={`border rounded-xl p-5 shadow-xs flex flex-col justify-between ${
            isMonthCleared ? 'bg-white border-neutral-200' : 'bg-amber-50/40 border-amber-300'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Fee For {currentMonth}
                </span>
                {isMonthCleared ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className={`text-2xl font-bold font-mono mt-2 tabular-nums ${
                isMonthCleared ? 'text-neutral-900' : 'text-amber-800'
              }`}>
                {isMonthCleared ? 'Fully Cleared' : formatCurrency(pendingDueThisMonth, settings.currencySymbol)}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between">
              <span>Monthly rate: {formatCurrency(monthlyExpected, settings.currencySymbol)}</span>
              <span className={`font-semibold ${isMonthCleared ? 'text-emerald-600' : 'text-amber-700'}`}>
                {isMonthCleared ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Card 3: Weekly Tests Average */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Weekly Tests Score</span>
                <Award className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-indigo-700 mt-2 tabular-nums">
                {overallPercentage > 0 ? `${overallPercentage}%` : 'N/A'}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between">
              <span>{gradedCount} tests evaluated</span>
              <button 
                onClick={() => setActiveTab('tests')}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                View Marks
              </button>
            </div>
          </div>

          {/* Card 4: Study Material Available */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Math Notes & Formulas</span>
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-neutral-900 mt-2 tabular-nums">
                {classNotes.length} Chapters
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between">
              <span>Formula sheets & questions</span>
              <button 
                onClick={() => setActiveTab('notes')}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Access Notes
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selector Navigation - HIGH CONTRAST SOLID BUTTONS */}
        <div className="p-1.5 bg-neutral-200/90 rounded-xl border border-neutral-300 flex items-center gap-1.5 overflow-x-auto shadow-2xs">
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              backgroundColor: activeTab === 'overview' ? '#312e81' : '#ffffff',
              color: activeTab === 'overview' ? '#ffffff' : '#1f2937',
              borderColor: activeTab === 'overview' ? '#1e1b4b' : '#d1d5db',
            }}
            className={`py-2 px-3.5 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap border ${
              activeTab === 'overview' ? 'shadow-md ring-2 ring-indigo-300' : 'hover:bg-neutral-50'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" style={{ color: activeTab === 'overview' ? '#ffffff' : '#4f46e5' }} />
            <span style={{ color: activeTab === 'overview' ? '#ffffff' : '#1f2937', fontWeight: 800 }}>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            style={{
              backgroundColor: activeTab === 'tests' ? '#312e81' : '#ffffff',
              color: activeTab === 'tests' ? '#ffffff' : '#1f2937',
              borderColor: activeTab === 'tests' ? '#1e1b4b' : '#d1d5db',
            }}
            className={`py-2 px-3.5 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap border ${
              activeTab === 'tests' ? 'shadow-md ring-2 ring-indigo-300' : 'hover:bg-neutral-50'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" style={{ color: activeTab === 'tests' ? '#ffffff' : '#4f46e5' }} />
            <span style={{ color: activeTab === 'tests' ? '#ffffff' : '#1f2937', fontWeight: 800 }}>Weekly Test Marks ({classTests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            style={{
              backgroundColor: activeTab === 'fees' ? '#312e81' : '#ffffff',
              color: activeTab === 'fees' ? '#ffffff' : '#1f2937',
              borderColor: activeTab === 'fees' ? '#1e1b4b' : '#d1d5db',
            }}
            className={`py-2 px-3.5 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap border ${
              activeTab === 'fees' ? 'shadow-md ring-2 ring-indigo-300' : 'hover:bg-neutral-50'
            }`}
          >
            <Receipt className="w-4 h-4 shrink-0" style={{ color: activeTab === 'fees' ? '#ffffff' : '#4f46e5' }} />
            <span style={{ color: activeTab === 'fees' ? '#ffffff' : '#1f2937', fontWeight: 800 }}>Fee Records & Receipts ({studentPayments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            style={{
              backgroundColor: activeTab === 'notes' ? '#312e81' : '#ffffff',
              color: activeTab === 'notes' ? '#ffffff' : '#1f2937',
              borderColor: activeTab === 'notes' ? '#1e1b4b' : '#d1d5db',
            }}
            className={`py-2 px-3.5 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap border ${
              activeTab === 'notes' ? 'shadow-md ring-2 ring-indigo-300' : 'hover:bg-neutral-50'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" style={{ color: activeTab === 'notes' ? '#ffffff' : '#4f46e5' }} />
            <span style={{ color: activeTab === 'notes' ? '#ffffff' : '#1f2937', fontWeight: 800 }}>Mathematics Notes & Formulas ({classNotes.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Recent Test Performance */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span>Recent Weekly Mathematics Tests</span>
                    </h2>
                    <button
                      onClick={() => setActiveTab('tests')}
                      className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                    >
                      View All Tests →
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-100 mt-2">
                    {classTests.length === 0 ? (
                      <p className="text-xs text-neutral-400 py-6 text-center italic">No tests conducted yet for your class.</p>
                    ) : (
                      classTests.slice(0, 3).map(test => {
                        const mark = studentMarks.find(m => m.testId === test.id);
                        const percent = mark && mark.isPresent ? Math.round((mark.marksObtained / test.maxMarks) * 100) : 0;

                        return (
                          <div key={test.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-neutral-900">{test.title}</span>
                              </div>
                              <p className="text-xs text-neutral-500 mt-0.5">
                                Topic: {test.topic} · {formatDate(test.testDate)}
                              </p>
                              {mark?.remarks && (
                                <p className="text-xs text-indigo-700 bg-indigo-50/70 px-2 py-1 rounded mt-1.5 italic">
                                  Teacher: "{mark.remarks}"
                                </p>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              {mark ? (
                                mark.isPresent ? (
                                  <div>
                                    <div className="text-lg font-bold font-mono text-indigo-700 tabular-nums">
                                      {mark.marksObtained} / {test.maxMarks}
                                    </div>
                                    <span className="text-xs font-semibold text-emerald-600">
                                      {percent}% Score
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                                    Absent
                                  </span>
                                )
                              ) : (
                                <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                                  Grading in progress
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Latest Study Notes snippet */}
                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span>Class Formula Sheets & Study Material</span>
                    </h2>
                    <button
                      onClick={() => setActiveTab('notes')}
                      className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Browse All Notes →
                    </button>
                  </div>

                  <div className="space-y-3 mt-3">
                    {classNotes.slice(0, 2).map(n => (
                      <div key={n.id} className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-neutral-900 block">{n.title}</span>
                          <span className="text-[11px] text-neutral-500">Topic: {n.topic} · Posted {formatDate(n.postedDate)}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedNote(n);
                            setActiveTab('notes');
                          }}
                          className="px-3 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-xs font-semibold text-indigo-600 cursor-pointer"
                        >
                          Read Formulas
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col: Class Schedule & Center Details */}
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
                  <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>Your Class Batch Schedule</span>
                  </h2>

                  {primaryBatch ? (
                    <div className="mt-3 space-y-3 text-xs">
                      <div>
                        <span className="text-neutral-500 block">Enrolled Course:</span>
                        <strong className="text-neutral-900 text-sm">{primaryBatch.name}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Faculty:</span>
                        <span className="font-semibold text-neutral-800">{primaryBatch.instructor}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Days & Timings:</span>
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded inline-block mt-0.5">
                          {primaryBatch.schedule}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Classroom:</span>
                        <span className="font-medium text-neutral-800">{primaryBatch.room || 'Main Hall'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 mt-2">No batch assigned.</p>
                  )}
                </div>

                {/* Institute Contact Info */}
                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs text-xs space-y-3">
                  <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Coaching Center Info</span>
                  </h2>
                  <div>
                    <span className="text-neutral-500 block">Institute:</span>
                    <strong className="text-neutral-900">{settings.centerName}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Address:</span>
                    <span className="text-neutral-700">{settings.address}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Helpline / Inquiry:</span>
                    <span className="font-mono text-neutral-800 font-semibold">{settings.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Fee Payment UPI:</span>
                    <span className="font-mono text-indigo-700 font-semibold">{settings.upiId}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: WEEKLY TEST MARKS */}
        {activeTab === 'tests' && (
          <div className="space-y-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-200">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    Weekly Mathematics Test Performance
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Evaluations conducted for {student.grade}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs">
                    <span className="text-neutral-500">Overall Average:</span>{' '}
                    <strong className="text-indigo-700 font-mono text-sm">{overallPercentage}%</strong>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-neutral-50 font-semibold text-neutral-600 border-b border-neutral-200">
                      <th className="py-3 px-4">Test Title & Topic</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-center">Attendance</th>
                      <th className="py-3 px-4 text-right">Max Marks</th>
                      <th className="py-3 px-4 text-right">Marks Scored</th>
                      <th className="py-3 px-4 text-right">Percentage</th>
                      <th className="py-3 px-4">Teacher's Feedback Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {classTests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-neutral-400">
                          No weekly tests recorded for your class yet.
                        </td>
                      </tr>
                    ) : (
                      classTests.map(test => {
                        const mark = studentMarks.find(m => m.testId === test.id);
                        const percent = mark && mark.isPresent ? Math.round((mark.marksObtained / test.maxMarks) * 100) : 0;

                        return (
                          <tr key={test.id} className="hover:bg-neutral-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-bold text-neutral-900 block">{test.title}</span>
                              <span className="text-xs text-neutral-500">{test.topic}</span>
                            </td>

                            <td className="py-3 px-4 text-neutral-600 whitespace-nowrap font-mono text-xs">
                              {formatDate(test.testDate)}
                            </td>

                            <td className="py-3 px-4 text-center">
                              {mark ? (
                                mark.isPresent ? (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold">
                                    Present
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-xs font-semibold">
                                    Absent
                                  </span>
                                )
                              ) : (
                                <span className="text-neutral-400 text-xs">Pending</span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right font-mono text-neutral-600">
                              {test.maxMarks}
                            </td>

                            <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 text-sm tabular-nums">
                              {mark && mark.isPresent ? mark.marksObtained : '-'}
                            </td>

                            <td className="py-3 px-4 text-right">
                              {mark && mark.isPresent ? (
                                <span className={`font-mono font-bold ${
                                  percent >= 80 ? 'text-emerald-700' : percent >= 60 ? 'text-indigo-700' : 'text-amber-700'
                                }`}>
                                  {percent}%
                                </span>
                              ) : '-'}
                            </td>

                            <td className="py-3 px-4 text-xs">
                              {mark?.remarks ? (
                                <span className="text-neutral-800 italic bg-neutral-50 p-1.5 rounded border border-neutral-200 block">
                                  "{mark.remarks}"
                                </span>
                              ) : (
                                <span className="text-neutral-400 italic">No remarks</span>
                              )}
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
        )}

        {/* TAB 3: FEE RECORDS & RECEIPTS */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            {/* Status Summary Banner */}
            <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isMonthCleared ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/60 border-amber-300'
            }`}>
              <div className="flex items-start gap-3">
                {isMonthCleared ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {isMonthCleared
                      ? `Fees Cleared for ${currentMonth}`
                      : `Pending Fee Due for ${currentMonth}: ${formatCurrency(pendingDueThisMonth, settings.currencySymbol)}`}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {isMonthCleared
                      ? 'All monthly dues for your enrolled mathematics batch are settled.'
                      : `Please deposit monthly fee before the 10th of the month via Cash or UPI (${settings.upiId}).`}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-neutral-500 block">Total Submitted Till Date</span>
                <span className="text-lg font-bold font-mono text-emerald-700 tabular-nums">
                  {formatCurrency(totalPaidTillDate, settings.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Receipts History Table */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
              <h2 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100 flex items-center justify-between">
                <span>Fee Receipts & Payment History</span>
                <span className="text-xs font-mono text-neutral-500">{studentPayments.length} Official Receipts</span>
              </h2>

              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-neutral-50 font-semibold text-neutral-600 border-b border-neutral-200">
                      <th className="py-2.5 px-3">Receipt #</th>
                      <th className="py-2.5 px-3">Payment Date</th>
                      <th className="py-2.5 px-3">Billing Month</th>
                      <th className="py-2.5 px-3">Payment Mode</th>
                      <th className="py-2.5 px-3">Reference No</th>
                      <th className="py-2.5 px-3 text-right">Amount Paid</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {studentPayments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-neutral-400">
                          No payments recorded yet.
                        </td>
                      </tr>
                    ) : (
                      studentPayments.map(payment => (
                        <tr key={payment.id} className="hover:bg-neutral-50">
                          <td className="py-3 px-3 font-mono font-semibold text-neutral-900">
                            {payment.receiptNo}
                          </td>
                          <td className="py-3 px-3 text-neutral-600 text-xs">
                            {formatDate(payment.paymentDate)}
                          </td>
                          <td className="py-3 px-3 font-medium text-neutral-900">
                            {payment.month}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded font-mono text-xs">
                              {payment.paymentMode}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-xs text-neutral-500 truncate max-w-[120px]">
                            {payment.referenceNo || '-'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 text-sm tabular-nums">
                            {formatCurrency(payment.amount, settings.currencySymbol)}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => onViewReceipt(payment)}
                              className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
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
        )}

        {/* TAB 4: MATHEMATICS NOTES & FORMULAS */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
              <h2 className="text-lg font-bold text-neutral-900">
                Mathematics Notes, Formula Sheets & Study Repository
              </h2>
              <p className="text-xs text-neutral-500">
                Curated study material for {student.grade} by Er. Vikas & Vanita Mam
              </p>

              <div className="space-y-4 mt-4">
                {classNotes.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-8 text-center italic">No notes uploaded for your class yet.</p>
                ) : (
                  classNotes.map(n => (
                    <div
                      key={n.id}
                      className={`border rounded-xl p-5 transition-all ${
                        n.isImportant ? 'border-amber-300 bg-amber-50/20' : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {n.isImportant && (
                            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <Bookmark className="w-3 h-3 text-amber-600 fill-amber-600" />
                              <span>Important Formula Sheet</span>
                            </span>
                          )}
                          <span className="text-xs text-neutral-500 font-medium">Topic: {n.topic}</span>
                        </div>
                        <span className="text-xs text-neutral-400 font-mono">Posted: {formatDate(n.postedDate)}</span>
                      </div>

                      <h3 className="text-base font-bold text-neutral-900 mt-2">{n.title}</h3>

                      <div className="mt-3 p-4 bg-neutral-900 text-neutral-100 rounded-lg font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                        {n.content}
                      </div>

                      <div className="mt-3 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                        <span className="text-neutral-500 font-medium truncate max-w-xs">
                          {n.pdfAttachmentName || 'Direct Reference Note'}
                        </span>
                        <button
                          onClick={() => {
                            if (n.pdfAttachmentUrl) {
                              const a = document.createElement('a');
                              a.href = n.pdfAttachmentUrl;
                              a.download = n.pdfAttachmentName || `${n.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                              a.target = '_blank';
                              a.click();
                            } else {
                              const blob = new Blob([`${settings.centerName}\n${n.title}\n\n${n.content}`], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${n.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download / Open Notes</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-neutral-500 space-y-1">
          <p className="font-bold text-neutral-800 uppercase tracking-tight">{settings.centerName} · Student Portal</p>
          <p className="text-[11px] text-neutral-500">
            #302, Phase-II, Vishal Nagar, Bathinda · Phone: 98159-62612 · Email: singla_vikas123@yahhoo.com
          </p>
        </div>
      </footer>
    </div>
  );
};
