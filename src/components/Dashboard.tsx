import React from 'react';
import { 
  Users, 
  CreditCard, 
  AlertTriangle, 
  GraduationCap, 
  ArrowUpRight, 
  Receipt, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  Edit3,
  Upload,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Batch, Student, FeePayment, CenterSettings, WeeklyTest, StudentTestMark, StudyNote, AdmissionEnquiry } from '../types';
import { formatCurrency, formatDate, buildWhatsAppReminderUrl } from '../utils/formatters';
import { getStudentMonthlyTotal } from '../utils/storage';

interface DashboardProps {
  students: Student[];
  batches: Batch[];
  payments: FeePayment[];
  tests: WeeklyTest[];
  marks: StudentTestMark[];
  notes: StudyNote[];
  settings: CenterSettings;
  currentMonth: string;
  enquiries?: AdmissionEnquiry[];
  onOpenRecordPayment: (studentId?: string) => void;
  onOpenAddStudent: () => void;
  onOpenInputMarks?: () => void;
  onOpenPostNotes?: () => void;
  onViewReceipt: (payment: FeePayment) => void;
  onViewStudent: (student: Student) => void;
  onNavigateTab: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  batches,
  payments,
  tests,
  marks,
  notes,
  settings,
  currentMonth,
  enquiries = [],
  onOpenRecordPayment,
  onOpenAddStudent,
  onOpenInputMarks,
  onOpenPostNotes,
  onViewReceipt,
  onViewStudent,
  onNavigateTab,
}) => {
  // Active student calculations
  const activeStudents = students.filter(s => s.status === 'active');
  
  // Total expected monthly fee from all active students
  const totalExpectedMonthly = activeStudents.reduce((acc, s) => {
    return acc + getStudentMonthlyTotal(s, batches);
  }, 0);

  // Payments in current month
  const currentMonthPayments = payments.filter(p => p.month.toLowerCase() === currentMonth.toLowerCase());
  const currentMonthCollected = currentMonthPayments.reduce((acc, p) => acc + p.amount, 0);

  // Calculate per-student payment status for current month
  const dueStudentsList = activeStudents.map(student => {
    const expected = getStudentMonthlyTotal(student, batches);
    const paidForMonth = currentMonthPayments
      .filter(p => p.studentId === student.id)
      .reduce((acc, p) => acc + p.amount, 0);
    const due = Math.max(0, expected - paidForMonth);
    return {
      student,
      expected,
      paid: paidForMonth,
      due,
      isFullyPaid: due === 0,
      isPartiallyPaid: paidForMonth > 0 && due > 0,
    };
  }).filter(item => item.due > 0);

  const totalOutstandingThisMonth = dueStudentsList.reduce((acc, item) => acc + item.due, 0);
  const collectionRate = totalExpectedMonthly > 0 
    ? Math.min(100, Math.round((currentMonthCollected / totalExpectedMonthly) * 100)) 
    : 0;

  // Grade-wise student breakdown for Vanita Math Classes
  const gradeDistribution = [
    { grade: '8th Class', label: '8th Class', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200', count: students.filter(s => s.grade === '8th Class').length },
    { grade: '9th Class', label: '9th Class', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200', count: students.filter(s => s.grade === '9th Class').length },
    { grade: '10th Class', label: '10th (Board)', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200', count: students.filter(s => s.grade === '10th Class').length },
    { grade: '+1 (11th) Mathematics', label: '+1 (11th)', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200', count: students.filter(s => s.grade === '+1 (11th) Mathematics').length },
    { grade: '+2 (12th) Mathematics', label: '+2 (12th Board)', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200', count: students.filter(s => s.grade === '+2 (12th) Mathematics').length },
  ];

  // Recent 5 payments
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER: VANITA MATH CLASSES + ATTACHED LOGO + SIMPLE SUMMARY */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 bg-rose-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6 text-center md:text-left">
            {/* VMC Official Logo */}
            <div className="bg-white p-2.5 rounded-2xl shadow-md shrink-0 flex items-center justify-center">
              <img
                src="/vmc-logo.svg"
                alt="VMC Logo"
                className="h-12 sm:h-16 w-auto object-contain"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold tracking-wide text-rose-100 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mathmatics tuition classes for 8th, 9th, 10th, +1 & +2</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase font-serif tracking-tight drop-shadow-xs text-white">
                VANITA MATH CLASSES
              </h1>
              <p className="text-xs sm:text-sm text-rose-100 font-medium mt-1">
                Faculty: <strong className="text-white">Vanita Rani Gupta</strong> (M.Sc, M.Phil, B.Ed, More than 17 years teaching experience)
              </p>
              <p className="text-xs text-rose-200 mt-0.5">
                #302, Phase-II, Vishal Nagar, Bathinda · Contact: 98159-62612 · singla_vikas123@yahhoo.com
              </p>
            </div>
          </div>

          {/* Quick Active Month Indicator */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-xl p-3 sm:p-4 text-center shrink-0 min-w-[170px]">
            <span className="text-[11px] font-semibold text-rose-200 block uppercase tracking-wider">Active Billing Cycle</span>
            <span className="text-lg sm:text-xl font-black font-mono text-white block mt-0.5">{currentMonth}</span>
            <span className="text-[11px] text-emerald-300 font-bold block mt-0.5">
              {collectionRate}% Fees Received
            </span>
          </div>
        </div>

        {/* New Admission Enquiry Notification Banner if pending */}
        {enquiries.filter(e => e.status === 'new').length > 0 && (
          <div className="mt-4 p-3 bg-amber-400 text-amber-950 font-bold text-xs rounded-xl flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-900 shrink-0" />
              <span>
                {enquiries.filter(e => e.status === 'new').length} New Admission Enquiry Received from Website Home Page!
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="px-3 py-1 bg-amber-950 text-white rounded-lg text-xs hover:bg-black transition-colors cursor-pointer shrink-0"
            >
              View Enquiries →
            </button>
          </div>
        )}

        {/* 2. BIG SIMPLE ACTION BUTTONS - PROMINENT, COLORFUL & ALWAYS VISIBLE */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => onOpenRecordPayment()}
            style={{ backgroundColor: '#10b981', color: '#064e3b' }}
            className="flex items-center justify-center gap-1.5 py-3 px-3 hover:bg-emerald-400 active:bg-emerald-600 font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            title="Record student monthly fee"
          >
            <CreditCard className="w-4 h-4 shrink-0" style={{ color: '#064e3b' }} />
            <span style={{ color: '#064e3b', fontWeight: 800 }}>+ Record Fee</span>
          </button>

          <button
            onClick={onOpenAddStudent}
            style={{ backgroundColor: '#ffffff', color: '#171717' }}
            className="flex items-center justify-center gap-1.5 py-3 px-3 hover:bg-neutral-100 active:bg-neutral-200 font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            title="Register new student"
          >
            <Users className="w-4 h-4 shrink-0 text-red-600" />
            <span style={{ color: '#171717', fontWeight: 800 }}>+ Add Student</span>
          </button>

          <button
            onClick={() => {
              if (onOpenInputMarks) onOpenInputMarks();
              else onNavigateTab('tests');
            }}
            style={{ backgroundColor: '#fbbf24', color: '#451a03' }}
            className="flex items-center justify-center gap-1.5 py-3 px-3 hover:bg-amber-300 active:bg-amber-500 font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            title="Input weekly test marks"
          >
            <Edit3 className="w-4 h-4 shrink-0" style={{ color: '#451a03' }} />
            <span style={{ color: '#451a03', fontWeight: 800 }}>✍️ Input Marks</span>
          </button>

          <button
            onClick={() => {
              if (onOpenPostNotes) onOpenPostNotes();
              else onNavigateTab('notes');
            }}
            style={{ backgroundColor: '#38bdf8', color: '#082f49' }}
            className="flex items-center justify-center gap-1.5 py-3 px-3 hover:bg-sky-300 active:bg-sky-500 font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            title="Upload PDF notes or formula sheets"
          >
            <Upload className="w-4 h-4 shrink-0" style={{ color: '#082f49' }} />
            <span style={{ color: '#082f49', fontWeight: 800 }}>📤 Upload Notes</span>
          </button>

          <button
            onClick={() => onNavigateTab('tests')}
            style={{ backgroundColor: '#a855f7', color: '#ffffff' }}
            className="flex items-center justify-center gap-1.5 py-3 px-3 hover:bg-purple-400 active:bg-purple-600 font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            title="Weekly test records"
          >
            <Award className="w-4 h-4 shrink-0" />
            <span style={{ color: '#ffffff', fontWeight: 800 }}>Weekly Tests</span>
          </button>

          <button
            onClick={() => onNavigateTab('dues')}
            style={{ backgroundColor: '#f43f5e', color: '#ffffff' }}
            className="flex items-center justify-center gap-1.5 py-3 px-3 hover:bg-rose-400 active:bg-rose-600 font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            title="Check pending fees"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span style={{ color: '#ffffff', fontWeight: 800 }}>Due ({dueStudentsList.length})</span>
          </button>
        </div>
      </div>

      {/* 3. FOUR SIMPLE, EYE-CATCHING STAT CARDS WITH RICH COLORS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Enrolled Students */}
        <div 
          onClick={() => onNavigateTab('students')}
          className="bg-white border-2 border-blue-500/30 hover:border-blue-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Enrolled Students</span>
            <span className="p-2 rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-neutral-900 tracking-tight">
              {activeStudents.length}
            </span>
            <span className="text-xs font-semibold text-neutral-500">
              Active in Math
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-600 pt-3 border-t border-neutral-100 font-medium">
            <span>{batches.length} Mathematics Batches</span>
            <span className="text-blue-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              View List →
            </span>
          </div>
        </div>

        {/* Metric 2: Monthly Fee Collections */}
        <div 
          onClick={() => onNavigateTab('ledger')}
          className="bg-white border-2 border-emerald-500/30 hover:border-emerald-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{currentMonth} Fees</span>
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 tracking-tight">
              {formatCurrency(currentMonthCollected, settings.currencySymbol)}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs text-neutral-600 mb-1 font-medium">
              <span>Target: {formatCurrency(totalExpectedMonthly, settings.currencySymbol)}</span>
              <span className="font-bold text-emerald-700">{collectionRate}%</span>
            </div>
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${collectionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Pending Fee Dues */}
        <div 
          onClick={() => onNavigateTab('dues')}
          className="bg-white border-2 border-rose-500/30 hover:border-rose-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Pending Dues</span>
            <span className="p-2 rounded-xl bg-rose-100 text-rose-600 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-rose-600 tracking-tight">
              {formatCurrency(totalOutstandingThisMonth, settings.currencySymbol)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-600 pt-3 border-t border-neutral-100 font-medium">
            <span className="font-bold text-rose-600">{dueStudentsList.length} Students Pending</span>
            <span className="text-rose-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Send Reminders →
            </span>
          </div>
        </div>

        {/* Metric 4: Academic Tests & Notes */}
        <div 
          onClick={() => onNavigateTab('tests')}
          className="bg-white border-2 border-purple-500/30 hover:border-purple-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Tests & Notes</span>
            <span className="p-2 rounded-xl bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-purple-700 tracking-tight">
              {tests.length}
            </span>
            <span className="text-xs font-semibold text-neutral-500">
              Tests · {notes.length} Notes
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-600 pt-3 border-t border-neutral-100 font-medium">
            <span>{marks.length} Graded Papers</span>
            <span className="text-purple-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Enter Marks →
            </span>
          </div>
        </div>
      </div>

      {/* 4. SIMPLE CLASS-WISE STUDENT BREAKDOWN (8th to 12th) */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-neutral-900">
              Vanita Math Classes · Enrollment by Standard
            </h3>
            <p className="text-xs text-neutral-500">Click any class to view registered students</p>
          </div>
          <span className="text-xs font-bold font-mono text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            {students.length} Total Enrolled
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          {gradeDistribution.map(item => (
            <button
              key={item.grade}
              onClick={() => onNavigateTab('students')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer hover:shadow-sm hover:scale-[1.02] ${item.badgeColor}`}
            >
              <span className="text-xs font-bold block">{item.label}</span>
              <span className="text-2xl font-black font-mono mt-1 block">{item.count}</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider opacity-80">Students</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. TWO CLEAR CORE COLUMNS: DEFAULTERS WITH REMINDERS & RECENT COLLECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Fee Follow-up Defaulters */}
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-rose-50/40">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Fee Dues Requiring Attention ({currentMonth})</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Send 1-Click WhatsApp payment reminders directly to parents
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('dues')}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-rose-200"
              >
                View All ({dueStudentsList.length}) →
              </button>
            </div>

            <div className="divide-y divide-neutral-100 max-h-[420px] overflow-y-auto">
              {dueStudentsList.length === 0 ? (
                <div className="p-10 text-center text-neutral-500">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <span className="text-sm font-bold text-neutral-800 block">All Fees Cleared!</span>
                  <span className="text-xs text-neutral-500">Every active student has paid their fees for {currentMonth}.</span>
                </div>
              ) : (
                dueStudentsList.slice(0, 6).map(({ student, due }) => {
                  const reminderUrl = buildWhatsAppReminderUrl(student, settings, due, [currentMonth]);
                  return (
                    <div key={student.id} className="p-4 hover:bg-neutral-50/80 transition-colors flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewStudent(student)}
                            className="font-bold text-neutral-900 hover:text-red-600 text-sm truncate text-left cursor-pointer"
                          >
                            {student.name}
                          </button>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 shrink-0 font-medium">
                            {student.rollNo}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                          <span>{student.grade}</span>
                          <span className="text-neutral-300">·</span>
                          <span className="font-bold text-rose-600 font-mono">
                            Due: {formatCurrency(due, settings.currencySymbol)}
                          </span>
                        </div>
                      </div>

                      {/* CLEAR, BRIGHT ACTION BUTTONS */}
                      <div className="flex items-center gap-2 shrink-0">
                        {student.guardianPhone && (
                          <a
                            href={reminderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-lg shadow-xs transition-colors cursor-pointer"
                            title="Send WhatsApp payment reminder to parent"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </a>
                        )}

                        <button
                          onClick={() => onOpenRecordPayment(student.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                          title="Record fee payment for this student"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Collect</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {dueStudentsList.length > 0 && (
            <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
              <span>Total outstanding this cycle:</span>
              <strong className="font-mono text-rose-600 text-sm">
                {formatCurrency(totalOutstandingThisMonth, settings.currencySymbol)}
              </strong>
            </div>
          )}
        </div>

        {/* Column 2: Recent Fee Receipts */}
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-emerald-50/40">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Recent Fee Receipts</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Instantly print or share official fee receipts
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('ledger')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                Full Ledger →
              </button>
            </div>

            <div className="divide-y divide-neutral-100 max-h-[420px] overflow-y-auto">
              {recentPayments.length === 0 ? (
                <div className="p-10 text-center text-neutral-500">
                  <Receipt className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <span className="text-sm font-semibold text-neutral-700 block">No payments recorded yet</span>
                  <span className="text-xs text-neutral-400">Click "+ Record Fee" above to log fee collections.</span>
                </div>
              ) : (
                recentPayments.map(payment => {
                  const student = students.find(s => s.id === payment.studentId);
                  return (
                    <div key={payment.id} className="p-4 hover:bg-neutral-50/80 transition-colors flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 text-sm truncate">
                            {student?.name || 'Student'}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
                            #{payment.receiptNo}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                          <span>{payment.month}</span>
                          <span className="text-neutral-300">·</span>
                          <span>{formatDate(payment.paymentDate)}</span>
                          <span className="text-neutral-300">·</span>
                          <span className="font-bold font-mono text-emerald-700">
                            {formatCurrency(payment.amount, settings.currencySymbol)}
                          </span>
                        </div>
                      </div>

                      {/* PROMINENT RECEIPT BUTTON */}
                      <button
                        onClick={() => onViewReceipt(payment)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer border border-emerald-300 shrink-0"
                        title="View and print official fee receipt"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
            <span>Collected in {currentMonth}:</span>
            <strong className="font-mono text-emerald-600 text-sm">
              {formatCurrency(currentMonthCollected, settings.currencySymbol)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
