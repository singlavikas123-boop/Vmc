import { Batch, Student, FeePayment, CenterSettings, WeeklyTest, StudentTestMark, StudyNote, AdmissionEnquiry } from '../types';

export const INITIAL_SETTINGS: CenterSettings = {
  centerName: 'Vanita Math Classes',
  tagline: 'Mathmatics tuition classes for 8th, 9th, 10th, +1 & +2',
  address: '#302, Phase-II, Vishal Nagar, Bathinda',
  phone: '98159-62612',
  email: 'singla_vikas123@yahhoo.com',
  facultyName: 'Vanita Rani Gupta (M.Sc, M.Phil, B.Ed, More than 17 years teaching experience)',
  upiId: '9815962612@upi',
  accountDetails: 'State Bank of India - Bathinda (Er. Vikas)',
  currency: 'INR',
  currencySymbol: '₹',
  receiptPrefix: 'VMC-2026-',
  academicYear: '2026-2027',
  termsAndConditions: '1. Monthly fee is payable by 10th of every month. 2. Weekly math tests on every Saturday/Sunday are compulsory. 3. Fees once deposited are non-refundable.',
  adminUsername: 'vikas',
};

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch-8',
    name: 'Class 8th - Mathematics Foundation & NTSE',
    subject: 'Mathematics',
    grade: '8th Class',
    instructor: 'Vanita Rani Gupta (M.Sc, M.Phil, B.Ed)',
    schedule: 'Tue, Thu, Sat · 3:30 PM - 4:45 PM',
    monthlyFee: 1800,
    capacity: 25,
    room: 'Hall A',
    colorTheme: 'indigo',
  },
  {
    id: 'batch-9',
    name: 'Class 9th - Comprehensive Mathematics (CBSE/ICSE)',
    subject: 'Mathematics',
    grade: '9th Class',
    instructor: 'Vanita Rani Gupta (M.Sc, M.Phil, B.Ed)',
    schedule: 'Mon, Wed, Fri · 3:30 PM - 4:45 PM',
    monthlyFee: 2000,
    capacity: 25,
    room: 'Hall A',
    colorTheme: 'cyan',
  },
  {
    id: 'batch-10',
    name: 'Class 10th - Board Target & Mathematics Mastery',
    subject: 'Mathematics',
    grade: '10th Class',
    instructor: 'Vanita Rani Gupta (M.Sc, M.Phil, B.Ed)',
    schedule: 'Mon, Wed, Fri · 5:00 PM - 6:30 PM',
    monthlyFee: 2500,
    capacity: 30,
    room: 'Hall B (Smart Classroom)',
    colorTheme: 'emerald',
  },
  {
    id: 'batch-11',
    name: 'Class +1 (11th) - Advanced Mathematics (Core & Calculus)',
    subject: 'Mathematics',
    grade: '+1 (11th) Mathematics',
    instructor: 'Vanita Rani Gupta (M.Sc, M.Phil, B.Ed)',
    schedule: 'Tue, Thu, Sat · 5:00 PM - 6:45 PM',
    monthlyFee: 3000,
    capacity: 25,
    room: 'Hall B',
    colorTheme: 'amber',
  },
  {
    id: 'batch-12',
    name: 'Class +2 (12th) - Board Excellence & Competitive Math',
    subject: 'Mathematics',
    grade: '+2 (12th) Mathematics',
    instructor: 'Vanita Rani Gupta (M.Sc, M.Phil, B.Ed)',
    schedule: 'Daily (Mon-Sat) · 6:45 PM - 8:15 PM',
    monthlyFee: 3500,
    capacity: 30,
    room: 'Hall B',
    colorTheme: 'purple',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-101',
    rollNo: 'VMC-101',
    name: 'Diya Singhal',
    phone: '9871100234',
    email: 'diya.singhal@gmail.com',
    password: 'vanita',
    guardianName: 'Vikas Singhal',
    guardianPhone: '9871100200',
    grade: '10th Class',
    schoolOrCollege: 'St. Xavier Senior Secondary School',
    admissionDate: '2026-04-10',
    batchIds: ['batch-10'],
    discountPercent: 0,
    status: 'active',
    notes: 'Aiming for 100/100 in Class 10 Board Mathematics. Excellent conceptual grasp.',
    avatarColor: '#0891b2',
  },
  {
    id: 'std-102',
    rollNo: 'VMC-102',
    name: 'Aarav Sharma',
    phone: '9823011223',
    email: 'aarav.math@gmail.com',
    password: 'vanita',
    guardianName: 'Ramesh Sharma',
    guardianPhone: '9823011200',
    grade: '+2 (12th) Mathematics',
    schoolOrCollege: 'Delhi Public School',
    admissionDate: '2026-04-05',
    batchIds: ['batch-12'],
    discountPercent: 10,
    status: 'active',
    notes: 'Merit scholarship holder (10% waiver). Preparing for JEE Advanced Mathematics.',
    avatarColor: '#4f46e5',
  },
  {
    id: 'std-103',
    rollNo: 'VMC-103',
    name: 'Rohan Deshmukh',
    phone: '9765432190',
    email: 'rohan.d@gmail.com',
    password: 'vanita',
    guardianName: 'Sanjay Deshmukh',
    guardianPhone: '9765432100',
    grade: '+1 (11th) Mathematics',
    schoolOrCollege: 'Modern Vidya Mandir',
    admissionDate: '2026-05-02',
    batchIds: ['batch-11'],
    discountPercent: 0,
    status: 'active',
    notes: 'Focusing on Trigonometry and Coordinate Geometry.',
    avatarColor: '#059669',
  },
  {
    id: 'std-104',
    rollNo: 'VMC-104',
    name: 'Ananya Iyer',
    phone: '9443218765',
    email: 'ananya.iyer@gmail.com',
    password: 'vanita',
    guardianName: 'R. K. Iyer',
    guardianPhone: '9443218700',
    grade: '+2 (12th) Mathematics',
    schoolOrCollege: 'National Public School',
    admissionDate: '2026-04-12',
    batchIds: ['batch-12'],
    discountPercent: 0,
    status: 'active',
    notes: 'Consistent weekly test performer. Very neat presentation.',
    avatarColor: '#d97706',
  },
  {
    id: 'std-105',
    rollNo: 'VMC-105',
    name: 'Kabir Verma',
    phone: '9811234567',
    email: 'kabir.v@gmail.com',
    password: 'vanita',
    guardianName: 'Harish Verma',
    guardianPhone: '9811234500',
    grade: '9th Class',
    schoolOrCollege: 'Bhavan Vidyalaya',
    admissionDate: '2026-04-20',
    batchIds: ['batch-9'],
    discountPercent: 0,
    status: 'active',
    notes: 'Good problem solving speed, needs occasional practice on Geometry proofs.',
    avatarColor: '#7c3aed',
  },
  {
    id: 'std-106',
    rollNo: 'VMC-106',
    name: 'Simran Kaur',
    phone: '9872233445',
    email: 'simran.kaur@gmail.com',
    password: 'vanita',
    guardianName: 'Gurmeet Singh',
    guardianPhone: '9872233400',
    grade: '8th Class',
    schoolOrCollege: 'Sacred Heart Convent',
    admissionDate: '2026-06-01',
    batchIds: ['batch-8'],
    discountPercent: 0,
    status: 'active',
    notes: 'Top scorer in 8th Class Algebra weekly tests.',
    avatarColor: '#e11d48',
  },
];

export const INITIAL_TESTS: WeeklyTest[] = [
  {
    id: 'test-1',
    title: 'Weekly Test 1: Real Numbers & Polynomials',
    testDate: '2026-09-06',
    grade: '10th Class',
    batchId: 'batch-10',
    maxMarks: 50,
    topic: 'Euclid Division, Fundamental Theorem of Arithmetic, Zeroes of Polynomials',
    durationMinutes: 60,
    description: 'Section A: 10 MCQs (10M), Section B: 5 Short Answer (15M), Section C: 5 Long Problems (25M)',
  },
  {
    id: 'test-2',
    title: 'Weekly Test 2: Quadratic Equations & Arithmetic Progressions',
    testDate: '2026-09-13',
    grade: '10th Class',
    batchId: 'batch-10',
    maxMarks: 50,
    topic: 'Quadratic Formula, Nature of Roots, nth Term & Sum of AP series',
    durationMinutes: 60,
    description: 'Word problems on speed/time and sums of AP sequences included.',
  },
  {
    id: 'test-3',
    title: 'Weekly Test 3: Limits, Continuity & Derivatives',
    testDate: '2026-09-14',
    grade: '+2 (12th) Mathematics',
    batchId: 'batch-12',
    maxMarks: 50,
    topic: 'Product Rule, Quotient Rule, Chain Rule, Logarithmic Differentiation',
    durationMinutes: 75,
    description: 'Board level questions and previous 5 years CBSE questions.',
  },
  {
    id: 'test-4',
    title: 'Weekly Test 1: Trigonometric Functions & Identities',
    testDate: '2026-09-10',
    grade: '+1 (11th) Mathematics',
    batchId: 'batch-11',
    maxMarks: 40,
    topic: 'Compound Angles, Double & Triple Angle Formulas, General Solutions',
    durationMinutes: 60,
    description: 'Strict proof-based questions on identities.',
  },
  {
    id: 'test-5',
    title: 'Weekly Test 1: Algebraic Expressions & Linear Equations',
    testDate: '2026-09-12',
    grade: '8th Class',
    batchId: 'batch-8',
    maxMarks: 30,
    topic: 'Variable isolation, Cross-multiplication, Word problems on age and numbers',
    durationMinutes: 45,
    description: 'Foundation building and step-by-step presentation test.',
  },
];

export const INITIAL_MARKS: StudentTestMark[] = [
  // Test 1 (10th Class)
  {
    id: 'mark-1',
    testId: 'test-1',
    studentId: 'std-101', // Diya Singhal
    marksObtained: 48,
    isPresent: true,
    remarks: 'Outstanding work! Full marks in Section A & C. Minor step omission in Q14.',
    updatedAt: '2026-09-07',
  },
  // Test 2 (10th Class)
  {
    id: 'mark-2',
    testId: 'test-2',
    studentId: 'std-101', // Diya Singhal
    marksObtained: 49,
    isPresent: true,
    remarks: 'Flawless solution of the quadratic discriminant and AP sum problem.',
    updatedAt: '2026-09-14',
  },
  // Test 3 (+2 Class)
  {
    id: 'mark-3',
    testId: 'test-3',
    studentId: 'std-102', // Aarav Sharma
    marksObtained: 46,
    isPresent: true,
    remarks: 'Very strong calculus application. Chain rule steps well presented.',
    updatedAt: '2026-09-15',
  },
  {
    id: 'mark-4',
    testId: 'test-3',
    studentId: 'std-104', // Ananya Iyer
    marksObtained: 47,
    isPresent: true,
    remarks: 'Excellent mastery over logarithmic differentiation.',
    updatedAt: '2026-09-15',
  },
  // Test 4 (+1 Class)
  {
    id: 'mark-5',
    testId: 'test-4',
    studentId: 'std-103', // Rohan Deshmukh
    marksObtained: 36,
    isPresent: true,
    remarks: 'Good attempt. Revise cos(A+B) and transformation formulas.',
    updatedAt: '2026-09-11',
  },
  // Test 5 (8th Class)
  {
    id: 'mark-6',
    testId: 'test-5',
    studentId: 'std-106', // Simran Kaur
    marksObtained: 29,
    isPresent: true,
    remarks: 'Top score in 8th standard! Clear algebraic logic.',
    updatedAt: '2026-09-13',
  },
];

export const INITIAL_NOTES: StudyNote[] = [
  {
    id: 'note-1',
    title: 'Class 10th Math: Complete Formula Sheet & Trigonometry Tables',
    grade: '10th Class',
    batchId: 'batch-10',
    topic: 'Trigonometry & Quadratic Equations',
    postedDate: '2026-09-15',
    content: `KEY MATHEMATICAL FORMULAS & THEOREMS:

1. Quadratic Equations:
   • Standard Form: ax² + bx + c = 0 (a ≠ 0)
   • Discriminant (D): D = b² - 4ac
   • Roots Formula: x = (-b ± √D) / (2a)
   • Nature of Roots:
     - If D > 0: Two distinct real roots
     - If D = 0: Two equal real roots (x = -b/2a)
     - If D < 0: No real roots

2. Arithmetic Progressions (AP):
   • nth Term: a_n = a + (n - 1)d
   • Sum of first n terms: S_n = (n/2) [2a + (n - 1)d] or S_n = (n/2) [a + l]

3. Trigonometric Ratios & Standard Angles:
   • sin²θ + cos²θ = 1
   • 1 + tan²θ = sec²θ
   • 1 + cot²θ = cosec²θ
   • sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2, sin 90° = 1
   • cos 30° = √3/2, cos 45° = 1/√2, cos 60° = 1/2, cos 90° = 0
   • tan 30° = 1/√3, tan 45° = 1, tan 60° = √3`,
    pdfAttachmentName: 'Class10_Math_Formula_CheatSheet_VanitaClasses.pdf',
    isImportant: true,
  },
  {
    id: 'note-2',
    title: 'Class +2 (12th) Math: Calculus & Standard Derivatives Reference',
    grade: '+2 (12th) Mathematics',
    batchId: 'batch-12',
    topic: 'Differential Calculus & Chain Rule',
    postedDate: '2026-09-12',
    content: `DIFFERENTIATION ESSENTIALS FOR BOARD & JEE:

1. Standard Derivatives:
   • d/dx(x^n) = n·x^(n-1)
   • d/dx(e^x) = e^x,  d/dx(a^x) = a^x · ln(a)
   • d/dx(ln x) = 1/x
   • d/dx(sin x) = cos x,  d/dx(cos x) = -sin x
   • d/dx(tan x) = sec²x,  d/dx(cot x) = -cosec²x
   • d/dx(sec x) = sec x · tan x,  d/dx(cosec x) = -cosec x · cot x

2. Rules of Differentiation:
   • Product Rule: (u·v)' = u'·v + u·v'
   • Quotient Rule: (u/v)' = (u'·v - u·v') / v²
   • Chain Rule: d/dx [f(g(x))] = f'(g(x)) · g'(x)

3. Logarithmic Differentiation:
   • Used when variable is in exponent: y = [f(x)]^[g(x)]
   • Take ln on both sides: ln y = g(x) · ln[f(x)]
   • Differentiate implicitly with respect to x`,
    pdfAttachmentName: 'Class12_Differentiation_Mastery_VanitaClasses.pdf',
    isImportant: true,
  },
  {
    id: 'note-3',
    title: 'Class +1 (11th) Math: Trigonometry Formulas & Transformation Rules',
    grade: '+1 (11th) Mathematics',
    batchId: 'batch-11',
    topic: 'Trigonometric Functions',
    postedDate: '2026-09-10',
    content: `TRIGONOMETRY TRANSFORMATION RULES:

• sin(A ± B) = sin A cos B ± cos A sin B
• cos(A + B) = cos A cos B - sin A sin B
• cos(A - B) = cos A cos B + sin A sin B
• tan(A + B) = (tan A + tan B) / (1 - tan A tan B)

Double & Half Angle:
• sin 2A = 2 sin A cos A = (2 tan A) / (1 + tan² A)
• cos 2A = cos² A - sin² A = 2 cos² A - 1 = 1 - 2 sin² A
• tan 2A = (2 tan A) / (1 - tan² A)

Product into Sum/Difference:
• 2 sin A cos B = sin(A+B) + sin(A-B)
• 2 cos A sin B = sin(A+B) - sin(A-B)
• 2 cos A cos B = cos(A+B) + cos(A-B)
• 2 sin A sin B = cos(A-B) - cos(A+B)`,
    pdfAttachmentName: 'Class11_Trigo_Mastery_Sheet.pdf',
    isImportant: false,
  },
  {
    id: 'note-4',
    title: 'Class 8th Math: Algebraic Identities & Mensuration Formulas',
    grade: '8th Class',
    batchId: 'batch-8',
    topic: 'Algebra & Mensuration',
    postedDate: '2026-09-08',
    content: `FOUNDATIONAL ALGEBRA & MENSURATION:

1. Standard Identities:
   • (a + b)² = a² + 2ab + b²
   • (a - b)² = a² - 2ab + b²
   • (a + b)(a - b) = a² - b²
   • (x + a)(x + b) = x² + (a + b)x + ab

2. Area Formulas:
   • Area of Triangle = 1/2 × base × height
   • Area of Trapezium = 1/2 × (sum of parallel sides) × height
   • Area of Rhombus = 1/2 × d1 × d2
   • Area of Circle = πr², Circumference = 2πr`,
    pdfAttachmentName: 'Class8_Math_Identities_VanitaClasses.pdf',
    isImportant: false,
  },
];

export const INITIAL_PAYMENTS: FeePayment[] = [
  {
    id: 'pay-1',
    receiptNo: 'VMC-2026-0041',
    studentId: 'std-101', // Diya Singhal (10th)
    batchId: 'batch-10',
    amount: 2500,
    expectedFee: 2500,
    discount: 0,
    month: 'September 2026',
    year: 2026,
    paymentDate: '2026-09-05',
    paymentMode: 'UPI',
    referenceNo: 'UPI/9928172901/SBI',
    notes: 'September tuition fee received via UPI. Receipt generated.',
    recordedBy: 'Admin (Vikas)',
  },
  {
    id: 'pay-2',
    receiptNo: 'VMC-2026-0035',
    studentId: 'std-101', // Diya Singhal (10th)
    batchId: 'batch-10',
    amount: 2500,
    expectedFee: 2500,
    discount: 0,
    month: 'August 2026',
    year: 2026,
    paymentDate: '2026-08-06',
    paymentMode: 'Cash',
    referenceNo: 'CASH-REC-06',
    notes: 'August fee cleared in cash at desk.',
    recordedBy: 'Vanita Mam',
  },
  {
    id: 'pay-3',
    receiptNo: 'VMC-2026-0042',
    studentId: 'std-102', // Aarav Sharma (+2)
    batchId: 'batch-12',
    amount: 3150, // 3500 - 10%
    expectedFee: 3500,
    discount: 350,
    month: 'September 2026',
    year: 2026,
    paymentDate: '2026-09-07',
    paymentMode: 'UPI',
    referenceNo: 'GPay/8819230192',
    notes: '10% merit scholarship applied.',
    recordedBy: 'Admin (Vikas)',
  },
  {
    id: 'pay-4',
    receiptNo: 'VMC-2026-0043',
    studentId: 'std-104', // Ananya Iyer (+2)
    batchId: 'batch-12',
    amount: 3500,
    expectedFee: 3500,
    discount: 0,
    month: 'September 2026',
    year: 2026,
    paymentDate: '2026-09-08',
    paymentMode: 'Bank Transfer',
    referenceNo: 'NEFT-SBIN2026090801',
    notes: 'September fees paid in full.',
    recordedBy: 'Admin (Vikas)',
  },
  {
    id: 'pay-5',
    receiptNo: 'VMC-2026-0044',
    studentId: 'std-106', // Simran Kaur (8th)
    batchId: 'batch-8',
    amount: 1800,
    expectedFee: 1800,
    discount: 0,
    month: 'September 2026',
    year: 2026,
    paymentDate: '2026-09-09',
    paymentMode: 'Cash',
    referenceNo: 'CASH-09',
    notes: 'Cleared on time.',
    recordedBy: 'Vanita Mam',
  },
];

export const INITIAL_ENQUIRIES: AdmissionEnquiry[] = [
  {
    id: 'enq-1',
    studentName: 'Amanpreet Singh',
    parentName: 'Gurpreet Singh',
    phone: '98144-55667',
    grade: '10th Class',
    schoolName: 'St. Xavier Senior Secondary School, Bathinda',
    board: 'CBSE',
    batchTiming: 'Evening (5:00 PM)',
    message: 'Looking for Class 10 Board preparation batch and weekly test series.',
    createdAt: '2026-09-22',
    status: 'new',
  },
  {
    id: 'enq-2',
    studentName: 'Navya Garg',
    parentName: 'Sanjay Garg',
    phone: '98722-33445',
    grade: '+1 (11th) Mathematics',
    schoolName: 'DAV Public School, Bathinda',
    board: 'CBSE',
    batchTiming: 'Evening (5:00 PM)',
    message: 'Enquiry for Class 11 Non-Medical Mathematics by Vanita Rani Gupta.',
    createdAt: '2026-09-23',
    status: 'contacted',
  },
];
