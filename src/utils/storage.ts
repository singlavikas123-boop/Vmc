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
} from '../types';
import { 
  INITIAL_BATCHES, 
  INITIAL_STUDENTS, 
  INITIAL_PAYMENTS, 
  INITIAL_SETTINGS, 
  INITIAL_TESTS, 
  INITIAL_MARKS, 
  INITIAL_NOTES,
  INITIAL_ENQUIRIES 
} from '../data/initialData';

const STORAGE_KEYS = {
  BATCHES: 'vmc_batches_v2',
  STUDENTS: 'vmc_students_v2',
  PAYMENTS: 'vmc_payments_v2',
  SETTINGS: 'vmc_settings_v3',
  TESTS: 'vmc_tests_v2',
  MARKS: 'vmc_marks_v2',
  NOTES: 'vmc_notes_v2',
  SESSION: 'vmc_session_v2',
  ENQUIRIES: 'vmc_enquiries_v1',
};

export function loadBatches(): Batch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BATCHES);
    if (!raw) return INITIAL_BATCHES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_BATCHES;
  }
}

export function saveBatches(batches: Batch[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  } catch (err) {
    console.error('Failed to save batches', err);
  }
}

export function loadStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) return INITIAL_STUDENTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to save students', err);
  }
}

export function loadPayments(): FeePayment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!raw) return INITIAL_PAYMENTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_PAYMENTS;
  }
}

export function savePayments(payments: FeePayment[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  } catch (err) {
    console.error('Failed to save payments', err);
  }
}

export function loadSettings(): CenterSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS) || localStorage.getItem('vmc_settings_v2');
    if (!raw) return INITIAL_SETTINGS;
    const parsed = JSON.parse(raw);
    // If previous settings had old address, phone, email, or tagline, overwrite with the new requested values
    return {
      ...INITIAL_SETTINGS,
      ...parsed,
      address: INITIAL_SETTINGS.address,
      phone: INITIAL_SETTINGS.phone,
      email: INITIAL_SETTINGS.email,
      tagline: INITIAL_SETTINGS.tagline,
      facultyName: INITIAL_SETTINGS.facultyName,
    };
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: CenterSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

export function loadEnquiries(): AdmissionEnquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    if (!raw) return INITIAL_ENQUIRIES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_ENQUIRIES;
  }
}

export function saveEnquiries(enquiries: AdmissionEnquiry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  } catch (err) {
    console.error('Failed to save enquiries', err);
  }
}

export function loadTests(): WeeklyTest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TESTS);
    if (!raw) return INITIAL_TESTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_TESTS;
  }
}

export function saveTests(tests: WeeklyTest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
  } catch (err) {
    console.error('Failed to save tests', err);
  }
}

export function loadMarks(): StudentTestMark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MARKS);
    if (!raw) return INITIAL_MARKS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_MARKS;
  }
}

export function saveMarks(marks: StudentTestMark[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(marks));
  } catch (err) {
    console.error('Failed to save marks', err);
  }
}

export function loadNotes(): StudyNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!raw) return INITIAL_NOTES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTES;
  }
}

export function saveNotes(notes: StudyNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes', err);
  }
}

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession | null): void {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  } catch (err) {
    console.error('Failed to save session', err);
  }
}

export function resetAllData() {
  localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_BATCHES));
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(INITIAL_TESTS));
  localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(INITIAL_MARKS));
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
  return {
    batches: INITIAL_BATCHES,
    students: INITIAL_STUDENTS,
    payments: INITIAL_PAYMENTS,
    settings: INITIAL_SETTINGS,
    tests: INITIAL_TESTS,
    marks: INITIAL_MARKS,
    notes: INITIAL_NOTES,
  };
}

export function generateNextReceiptNumber(settings: CenterSettings, existingPayments: FeePayment[]): string {
  const prefix = settings.receiptPrefix || 'VMC-2026-';
  const currentCount = existingPayments.length + 101;
  return `${prefix}${String(currentCount).padStart(4, '0')}`;
}

export function getStudentMonthlyTotal(student: Student, batches: Batch[]): number {
  const studentBatches = batches.filter(b => student.batchIds?.includes(b.id));
  const rawSum = studentBatches.reduce((acc, b) => acc + (b.monthlyFee || 0), 0);
  if (student.discountPercent > 0) {
    const discount = (rawSum * student.discountPercent) / 100;
    return Math.max(0, Math.round(rawSum - discount));
  }
  return rawSum;
}
