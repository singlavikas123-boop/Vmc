export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Card';

export type StudentStatus = 'active' | 'inactive' | 'alumni';

export type MathematicsGrade = 
  | '8th Class' 
  | '9th Class' 
  | '10th Class' 
  | '+1 (11th) Mathematics' 
  | '+2 (12th) Mathematics';

export interface Batch {
  id: string;
  name: string;
  subject: string; // strictly "Mathematics"
  grade: MathematicsGrade;
  instructor: string;
  schedule: string;
  monthlyFee: number;
  capacity: number;
  room?: string;
  colorTheme?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  phone: string;
  email?: string;
  password?: string; // For student portal login
  guardianName: string;
  guardianPhone: string;
  grade: MathematicsGrade;
  schoolOrCollege?: string;
  admissionDate: string;
  batchIds: string[];
  discountPercent: number; // e.g. 10 for 10%
  status: StudentStatus;
  notes?: string;
  avatarColor?: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  batchId?: string;
  amount: number;
  expectedFee: number;
  discount: number;
  month: string; // e.g. "September 2026"
  year: number;
  paymentDate: string; // YYYY-MM-DD
  paymentMode: PaymentMode;
  referenceNo?: string;
  notes?: string;
  recordedBy?: string;
}

export interface CenterSettings {
  centerName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  facultyName?: string;
  upiId: string;
  accountDetails?: string;
  currency: string;
  currencySymbol: string;
  receiptPrefix: string;
  academicYear: string;
  termsAndConditions: string;
  adminUsername?: string;
}

export interface WeeklyTest {
  id: string;
  title: string;
  testDate: string;
  grade: MathematicsGrade;
  batchId?: string;
  maxMarks: number;
  passingMarks?: number;
  topic: string; // e.g., "Calculus: Differentiation & Applications", "Trigonometry", "Quadratic Equations"
  durationMinutes?: number;
  description?: string;
  isGraded?: boolean;
}

export interface StudentTestMark {
  id: string;
  testId: string;
  studentId: string;
  marksObtained: number;
  isPresent: boolean;
  remarks?: string;
  updatedAt: string;
}

export interface StudyNote {
  id: string;
  title: string;
  grade: MathematicsGrade;
  batchId?: string;
  topic: string;
  postedDate: string;
  content: string; // formula summary, notes, sample solutions
  pdfAttachmentName?: string;
  pdfAttachmentUrl?: string; // Data URL or file URL
  fileSize?: string;
  fileType?: string;
  isImportant?: boolean;
}

export interface AdmissionEnquiry {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  grade: MathematicsGrade;
  schoolName?: string;
  board?: string; // CBSE, ICSE, PSEB, etc.
  batchTiming?: string;
  message?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'enrolled';
}

export interface AuthSession {
  role: 'admin' | 'student';
  username: string;
  studentId?: string;
}
