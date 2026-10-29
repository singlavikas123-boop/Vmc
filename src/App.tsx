import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StudentsView } from './components/StudentsView';
import { StudentModal } from './components/StudentModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { BatchesView } from './components/BatchesView';
import { BatchModal } from './components/BatchModal';
import { FeeLedgerView } from './components/FeeLedgerView';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { FeeReceiptModal } from './components/FeeReceiptModal';
import { DueFeesView } from './components/DueFeesView';
import { SettingsView } from './components/SettingsView';
import { WeeklyTestsView } from './components/WeeklyTestsView';
import { StudyNotesView } from './components/StudyNotesView';
import { LoginPage } from './components/LoginPage';
import { StudentPortal } from './components/StudentPortal';
import { AdmissionEnquiriesView } from './components/AdmissionEnquiriesView';
import { 
  Batch, 
  Student, 
  FeePayment, 
  CenterSettings, 
  WeeklyTest, 
  StudentTestMark, 
  StudyNote, 
  AuthSession,
  AdmissionEnquiry 
} from './types';
import { 
  loadBatches, saveBatches, 
  loadStudents, saveStudents, 
  loadPayments, savePayments, 
  loadSettings, saveSettings, 
  loadTests, saveTests,
  loadMarks, saveMarks,
  loadNotes, saveNotes,
  loadEnquiries, saveEnquiries,
  loadSession, saveSession,
  resetAllData,
  getStudentMonthlyTotal
} from './utils/storage';

export default function App() {
  // Authentication session
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());

  // Primary database state
  const [batches, setBatches] = useState<Batch[]>(() => loadBatches());
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const [payments, setPayments] = useState<FeePayment[]>(() => loadPayments());
  const [settings, setSettings] = useState<CenterSettings>(() => loadSettings());
  const [tests, setTests] = useState<WeeklyTest[]>(() => loadTests());
  const [marks, setMarks] = useState<StudentTestMark[]>(() => loadMarks());
  const [notes, setNotes] = useState<StudyNote[]>(() => loadNotes());
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>(() => loadEnquiries());

  // Navigation tab for Admin
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentMonth, setCurrentMonth] = useState<string>('September 2026');

  // Modals & Action Triggers
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [preselectedStudentId, setPreselectedStudentId] = useState<string | undefined>(undefined);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);

  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchToEdit, setBatchToEdit] = useState<Batch | null>(null);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<FeePayment | null>(null);

  // Quick action triggers for tests and notes
  const [isQuickInputMarksOpen, setIsQuickInputMarksOpen] = useState(false);
  const [isQuickUploadNotesOpen, setIsQuickUploadNotesOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state changes with localStorage
  useEffect(() => { saveSession(session); }, [session]);
  useEffect(() => { saveBatches(batches); }, [batches]);
  useEffect(() => { saveStudents(students); }, [students]);
  useEffect(() => { savePayments(payments); }, [payments]);
  useEffect(() => { saveSettings(settings); }, [settings]);
  useEffect(() => { saveTests(tests); }, [tests]);
  useEffect(() => { saveMarks(marks); }, [marks]);
  useEffect(() => { saveNotes(notes); }, [notes]);
  useEffect(() => { saveEnquiries(enquiries); }, [enquiries]);

  // Auth Handlers
  const handleAdminLogin = () => {
    const adminSession: AuthSession = { role: 'admin', username: 'vikas' };
    setSession(adminSession);
    showToast('Logged in as Administrator (Vikas)');
  };

  const handleStudentLogin = (student: Student) => {
    const studentSession: AuthSession = { 
      role: 'student', 
      username: student.rollNo, 
      studentId: student.id 
    };
    setSession(studentSession);
    showToast(`Welcome back, ${student.name}!`);
  };

  const handleLogout = () => {
    setSession(null);
    showToast('Logged out successfully.');
  };

  // Student registration from login page
  const handleRegisterStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    showToast(`Registration completed! Roll No: ${newStudent.rollNo}`);
  };

  // Calculate current month due count for navigation badge
  const dueStudentsCount = students.filter(student => {
    if (student.status !== 'active') return false;
    const monthlyTotal = getStudentMonthlyTotal(student, batches);
    if (monthlyTotal <= 0) return false;
    const paidForMonth = payments
      .filter(p => p.studentId === student.id && p.month === currentMonth)
      .reduce((sum, p) => sum + p.amount, 0);
    return paidForMonth < monthlyTotal;
  }).length;

  // Handlers for Students
  const handleSaveStudent = (savedStudent: Student) => {
    if (students.some(s => s.id === savedStudent.id)) {
      setStudents(prev => prev.map(s => s.id === savedStudent.id ? savedStudent : s));
      showToast(`Student record for ${savedStudent.name} updated.`);
    } else {
      setStudents(prev => [savedStudent, ...prev]);
      showToast(`Student ${savedStudent.name} successfully enrolled!`);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    if (confirm(`Are you sure you want to remove student "${target?.name || 'this student'}"?`)) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      showToast('Student record removed.');
    }
  };

  // Handlers for Batches
  const handleSaveBatch = (savedBatch: Batch) => {
    if (batches.some(b => b.id === savedBatch.id)) {
      setBatches(prev => prev.map(b => b.id === savedBatch.id ? savedBatch : b));
      showToast(`Batch "${savedBatch.name}" updated.`);
    } else {
      setBatches(prev => [...prev, savedBatch]);
      showToast(`New batch "${savedBatch.name}" created.`);
    }
  };

  const handleDeleteBatch = (batchId: string) => {
    const target = batches.find(b => b.id === batchId);
    if (confirm(`Are you sure you want to delete batch "${target?.name || 'this batch'}"?`)) {
      setBatches(prev => prev.filter(b => b.id !== batchId));
      showToast('Batch deleted.');
    }
  };

  // Handlers for Payments
  const handleSavePayment = (payment: FeePayment) => {
    setPayments(prev => [payment, ...prev]);
    showToast(`Fee receipt #${payment.receiptNo} of ${settings.currencySymbol}${payment.amount.toLocaleString('en-IN')} recorded.`);
    
    // Automatically open the receipt for immediate printing or sharing
    setSelectedPaymentForReceipt(payment);
    setIsReceiptOpen(true);
  };

  const handleDeletePayment = (paymentId: string) => {
    if (confirm('Are you sure you want to delete this payment receipt?')) {
      setPayments(prev => prev.filter(p => p.id !== paymentId));
      showToast('Payment record removed from ledger.');
    }
  };

  // Handlers for Weekly Tests
  const handleSaveTest = (test: WeeklyTest) => {
    if (tests.some(t => t.id === test.id)) {
      setTests(prev => prev.map(t => t.id === test.id ? test : t));
      showToast(`Weekly test "${test.title}" updated.`);
    } else {
      setTests(prev => [test, ...prev]);
      showToast(`New weekly test "${test.title}" scheduled!`);
    }
  };

  const handleDeleteTest = (testId: string) => {
    setTests(prev => prev.filter(t => t.id !== testId));
    setMarks(prev => prev.filter(m => m.testId !== testId));
    showToast('Weekly test and associated marks deleted.');
  };

  // Handlers for Test Marks
  const handleSaveMarks = (updatedMarks: StudentTestMark[]) => {
    setMarks(prev => {
      const remaining = prev.filter(m => !updatedMarks.some(u => u.id === m.id || (u.testId === m.testId && u.studentId === m.studentId)));
      return [...updatedMarks, ...remaining];
    });
    showToast('Student test marks saved successfully.');
  };

  // Handlers for Notes
  const handleSaveNote = (note: StudyNote) => {
    setNotes(prev => {
      const exists = prev.some(n => n.id === note.id);
      if (exists) {
        return prev.map(n => n.id === note.id ? note : n);
      } else {
        return [note, ...prev];
      }
    });
    showToast(`Mathematics study note "${note.title}" saved!`);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    showToast('Note deleted.');
  };

  // Handlers for Admission Enquiries
  const handleAddAdmissionEnquiry = (newEnquiry: AdmissionEnquiry) => {
    setEnquiries(prev => [newEnquiry, ...prev]);
    showToast(`Admission enquiry received for ${newEnquiry.studentName}!`);
  };

  const handleUpdateEnquiryStatus = (enquiryId: string, status: 'new' | 'contacted' | 'enrolled') => {
    setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status } : e));
    showToast(`Enquiry status marked as ${status}.`);
  };

  const handleDeleteEnquiry = (enquiryId: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== enquiryId));
    showToast('Admission enquiry removed.');
  };

  const handleConvertToStudent = (enq: AdmissionEnquiry) => {
    const classCode = enq.grade.includes('8th') ? '8' 
      : enq.grade.includes('9th') ? '9' 
      : enq.grade.includes('10th') ? '10' 
      : enq.grade.includes('+1') ? '11' 
      : '12';
    
    const count = students.filter(s => s.grade === enq.grade).length + 1;
    const newRoll = `VMC-${classCode}${String(count).padStart(2, '0')}`;
    const matchingBatch = batches.find(b => b.grade === enq.grade);

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      rollNo: newRoll,
      name: enq.studentName,
      phone: enq.phone,
      guardianName: enq.parentName,
      guardianPhone: enq.phone,
      grade: enq.grade,
      schoolOrCollege: enq.schoolName,
      admissionDate: new Date().toISOString().slice(0, 10),
      batchIds: matchingBatch ? [matchingBatch.id] : [],
      discountPercent: 0,
      status: 'active',
      notes: `Converted from online enquiry. Note: ${enq.message || ''}`,
      avatarColor: '#DC2626',
    };

    setStudents(prev => [newStudent, ...prev]);
    setEnquiries(prev => prev.map(e => e.id === enq.id ? { ...e, status: 'enrolled' } : e));
    showToast(`Enrolled ${enq.studentName} as student! Roll No: ${newRoll}`);
    setActiveTab('students');
  };

  // Open Record Fee modal with optional student preselection
  const handleOpenRecordPayment = (studentId?: string) => {
    setPreselectedStudentId(studentId);
    setIsRecordPaymentOpen(true);
  };

  // Open Edit student modal
  const handleEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsStudentModalOpen(true);
  };

  // Open View Student detail modal
  const handleViewStudent = (student: Student) => {
    setSelectedStudentForDetail(student);
    setIsStudentDetailOpen(true);
  };

  // Open View Receipt modal
  const handleViewReceipt = (payment: FeePayment) => {
    setSelectedPaymentForReceipt(payment);
    setIsReceiptOpen(true);
  };

  // Open Edit Batch modal
  const handleEditBatch = (batch: Batch) => {
    setBatchToEdit(batch);
    setIsBatchModalOpen(true);
  };

  // Reset database back to default factory demo seed
  const handleResetAllData = () => {
    if (confirm('Are you sure you want to reset all data to default Vanita Math Classes demo data?')) {
      const resetData = resetAllData();
      setStudents(resetData.students);
      setBatches(resetData.batches);
      setPayments(resetData.payments);
      setSettings(resetData.settings);
      setTests(resetData.tests);
      setMarks(resetData.marks);
      setNotes(resetData.notes);
      showToast('All system records reset to default demo data.');
    }
  };

  // Import JSON backup
  const handleImportAllData = (data: {
    students?: Student[];
    batches?: Batch[];
    payments?: FeePayment[];
    settings?: CenterSettings;
  }) => {
    if (data.students) setStudents(data.students);
    if (data.batches) setBatches(data.batches);
    if (data.payments) setPayments(data.payments);
    if (data.settings) setSettings(data.settings);
    showToast('Backup restored successfully!');
  };

  // Find student for active receipt modal
  const receiptStudent = selectedPaymentForReceipt
    ? students.find(s => s.id === selectedPaymentForReceipt.studentId) || null
    : null;

  // VIEW 1: NOT LOGGED IN -> SHOW VANITA MATH CLASSES LOGIN PORTAL
  if (!session) {
    return (
      <LoginPage
        settings={settings}
        students={students}
        batches={batches}
        onAdminLogin={handleAdminLogin}
        onStudentLogin={handleStudentLogin}
        onRegisterStudent={handleRegisterStudent}
        onAddAdmissionEnquiry={handleAddAdmissionEnquiry}
      />
    );
  }

  // VIEW 2: LOGGED IN AS STUDENT -> SHOW INDIVIDUAL STUDENT PORTAL
  if (session.role === 'student' && session.studentId) {
    const currentStudent = students.find(s => s.id === session.studentId);
    
    if (!currentStudent) {
      return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md">
            <h2 className="text-lg font-bold text-red-600 mb-2">Student Record Not Found</h2>
            <p className="text-xs text-neutral-600 mb-4">
              Your session could not find an associated student profile in the database.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <StudentPortal
          student={currentStudent}
          batches={batches}
          payments={payments}
          tests={tests}
          marks={marks}
          notes={notes}
          settings={settings}
          currentMonth={currentMonth}
          onLogout={handleLogout}
          onViewReceipt={handleViewReceipt}
        />

        {/* Official Fee Receipt Print & Share Modal */}
        <FeeReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          payment={selectedPaymentForReceipt}
          student={receiptStudent}
          batches={batches}
          settings={settings}
        />

        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg shadow-xl border border-neutral-700 animate-fade-in flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  // VIEW 3: LOGGED IN AS ADMIN (Vikas) -> SHOW COMPLETE ADMIN SUITE
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onOpenRecordPayment={() => handleOpenRecordPayment()}
        onOpenAddStudent={() => {
          setStudentToEdit(null);
          setIsStudentModalOpen(true);
        }}
        onOpenScheduleTest={() => {
          setActiveTab('tests');
        }}
        onOpenInputMarks={() => {
          setActiveTab('tests');
          setIsQuickInputMarksOpen(true);
        }}
        onOpenPostNotes={() => {
          setActiveTab('notes');
          setIsQuickUploadNotesOpen(true);
        }}
        onOpenCreateBatch={() => {
          setActiveTab('batches');
          setBatchToEdit(null);
          setIsBatchModalOpen(true);
        }}
        onLogout={handleLogout}
        dueCount={dueStudentsCount}
        enquiryCount={enquiries.filter(e => e.status === 'new').length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            students={students}
            batches={batches}
            payments={payments}
            tests={tests}
            marks={marks}
            notes={notes}
            settings={settings}
            currentMonth={currentMonth}
            enquiries={enquiries}
            onOpenRecordPayment={handleOpenRecordPayment}
            onOpenAddStudent={() => {
              setStudentToEdit(null);
              setIsStudentModalOpen(true);
            }}
            onOpenInputMarks={() => {
              setActiveTab('tests');
              setIsQuickInputMarksOpen(true);
            }}
            onOpenPostNotes={() => {
              setActiveTab('notes');
              setIsQuickUploadNotesOpen(true);
            }}
            onViewReceipt={handleViewReceipt}
            onViewStudent={handleViewStudent}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'students' && (
          <StudentsView
            students={students}
            batches={batches}
            payments={payments}
            settings={settings}
            currentMonth={currentMonth}
            onOpenAddStudent={() => {
              setStudentToEdit(null);
              setIsStudentModalOpen(true);
            }}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onViewStudent={handleViewStudent}
            onRecordPayment={handleOpenRecordPayment}
          />
        )}

        {activeTab === 'tests' && (
          <WeeklyTestsView
            tests={tests}
            marks={marks}
            students={students}
            batches={batches}
            settings={settings}
            onSaveTest={handleSaveTest}
            onDeleteTest={handleDeleteTest}
            onSaveMarks={handleSaveMarks}
            isQuickInputOpen={isQuickInputMarksOpen}
            onCloseQuickInput={() => setIsQuickInputMarksOpen(false)}
          />
        )}

        {activeTab === 'notes' && (
          <StudyNotesView
            notes={notes}
            settings={settings}
            batches={batches}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            isUploadOpen={isQuickUploadNotesOpen}
            onCloseUpload={() => setIsQuickUploadNotesOpen(false)}
          />
        )}

        {activeTab === 'batches' && (
          <BatchesView
            batches={batches}
            students={students}
            settings={settings}
            onOpenAddBatch={() => {
              setBatchToEdit(null);
              setIsBatchModalOpen(true);
            }}
            onEditBatch={handleEditBatch}
            onDeleteBatch={handleDeleteBatch}
            onViewStudent={handleViewStudent}
          />
        )}

        {activeTab === 'ledger' && (
          <FeeLedgerView
            payments={payments}
            students={students}
            batches={batches}
            settings={settings}
            onOpenRecordPayment={() => handleOpenRecordPayment()}
            onViewReceipt={handleViewReceipt}
            onDeletePayment={handleDeletePayment}
          />
        )}

        {activeTab === 'dues' && (
          <DueFeesView
            students={students}
            batches={batches}
            payments={payments}
            settings={settings}
            currentMonth={currentMonth}
            onRecordPayment={handleOpenRecordPayment}
            onViewStudent={handleViewStudent}
          />
        )}

        {activeTab === 'enquiries' && (
          <AdmissionEnquiriesView
            enquiries={enquiries}
            settings={settings}
            onUpdateStatus={handleUpdateEnquiryStatus}
            onDeleteEnquiry={handleDeleteEnquiry}
            onConvertToStudent={handleConvertToStudent}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={setSettings}
            onResetAllData={handleResetAllData}
            students={students}
            batches={batches}
            payments={payments}
            onImportAllData={handleImportAllData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-neutral-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <div>
            <span className="font-bold text-neutral-800">VANITA MATH CLASSES</span>
            <span className="mx-1.5 text-neutral-300">·</span>
            <span>Mathmatics tuition classes for 8th, 9th, 10th, +1 & +2</span>
            <span className="mx-1.5 text-neutral-300">·</span>
            <span>📍 #302, Phase-II, Vishal Nagar, Bathinda · 📞 98159-62612</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Session {settings.academicYear}</span>
            <span aria-hidden="true">·</span>
            <span>Admin Console (Vikas)</span>
            <span aria-hidden="true">·</span>
            <button 
              onClick={() => setActiveTab('settings')}
              className="hover:text-neutral-900 cursor-pointer"
            >
              Settings
            </button>
            <span aria-hidden="true">·</span>
            <button 
              onClick={handleLogout}
              className="hover:text-rose-600 font-semibold cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </footer>

      {/* Student Enrollment / Edit Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
        batches={batches}
        existingStudents={students}
        settings={settings}
      />

      {/* Student Detail View Modal */}
      <StudentDetailModal
        isOpen={isStudentDetailOpen}
        onClose={() => setIsStudentDetailOpen(false)}
        student={selectedStudentForDetail}
        batches={batches}
        payments={payments}
        settings={settings}
        currentMonth={currentMonth}
        onEditStudent={handleEditStudent}
        onRecordPayment={handleOpenRecordPayment}
        onViewReceipt={handleViewReceipt}
      />

      {/* Batch Course Modal */}
      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSave={handleSaveBatch}
        batchToEdit={batchToEdit}
        settings={settings}
      />

      {/* Fee Payment Recording Modal */}
      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onSavePayment={handleSavePayment}
        students={students}
        batches={batches}
        payments={payments}
        settings={settings}
        preselectedStudentId={preselectedStudentId}
        defaultMonth={currentMonth}
      />

      {/* Official Fee Receipt Print & Share Modal */}
      <FeeReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        payment={selectedPaymentForReceipt}
        student={receiptStudent}
        batches={batches}
        settings={settings}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg shadow-xl border border-neutral-700 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
