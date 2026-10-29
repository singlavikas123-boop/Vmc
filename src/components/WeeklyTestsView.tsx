import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Edit, 
  Trash2, 
  Users, 
  Search, 
  Filter, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Check, 
  X,
  Edit3,
  Percent,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { WeeklyTest, StudentTestMark, Student, Batch, CenterSettings, MathematicsGrade } from '../types';
import { formatDate } from '../utils/formatters';

interface WeeklyTestsViewProps {
  tests: WeeklyTest[];
  marks: StudentTestMark[];
  students: Student[];
  batches: Batch[];
  settings: CenterSettings;
  onSaveTest: (test: WeeklyTest) => void;
  onDeleteTest: (testId: string) => void;
  onSaveMarks: (updatedMarks: StudentTestMark[]) => void;
  isQuickInputOpen?: boolean;
  onCloseQuickInput?: () => void;
}

export const WeeklyTestsView: React.FC<WeeklyTestsViewProps> = ({
  tests,
  marks,
  students,
  batches,
  settings,
  onSaveTest,
  onDeleteTest,
  onSaveMarks,
  isQuickInputOpen = false,
  onCloseQuickInput,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Test Modal state
  const [isCreateTestOpen, setIsCreateTestOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<WeeklyTest | null>(null);

  // Grading Sheet Modal state
  const [gradingTest, setGradingTest] = useState<WeeklyTest | null>(null);
  const [showAllStudentsInGrading, setShowAllStudentsInGrading] = useState(false);
  const [currentGradingMarks, setCurrentGradingMarks] = useState<
    Record<string, { marksObtained: number; marksInputRaw?: string; isPresent: boolean; remarks: string }>
  >({});
  const [gradingSuccessMessage, setGradingSuccessMessage] = useState('');

  // Handle external trigger to open marks input
  useEffect(() => {
    if (isQuickInputOpen) {
      if (tests.length > 0) {
        handleOpenGrading(tests[0]);
      } else {
        // If no test exists, prompt to create test
        setIsCreateTestOpen(true);
      }
    }
  }, [isQuickInputOpen, tests]);

  // Filter tests
  const filteredTests = tests.filter(test => {
    const matchesGrade = selectedGrade === 'all' || test.grade === selectedGrade;
    const q = searchQuery.toLowerCase();
    const matchesSearch = test.title.toLowerCase().includes(q) || test.topic.toLowerCase().includes(q);
    return matchesGrade && matchesSearch;
  });

  // Open grading modal for a test
  const handleOpenGrading = (test: WeeklyTest) => {
    setGradingTest(test);
    setGradingSuccessMessage('');
    setShowAllStudentsInGrading(false);

    // Initial sheet: populate from existing marks or defaults
    const initialSheet: Record<string, { marksObtained: number; marksInputRaw?: string; isPresent: boolean; remarks: string }> = {};
    students.forEach(st => {
      const existing = marks.find(m => m.testId === test.id && m.studentId === st.id);
      if (existing) {
        initialSheet[st.id] = {
          marksObtained: existing.marksObtained,
          marksInputRaw: String(existing.marksObtained),
          isPresent: existing.isPresent,
          remarks: existing.remarks || '',
        };
      } else {
        initialSheet[st.id] = {
          marksObtained: 0,
          marksInputRaw: '0',
          isPresent: true,
          remarks: '',
        };
      }
    });
    setCurrentGradingMarks(initialSheet);
  };

  // Change active test in grading modal
  const handleSwitchGradingTest = (testId: string) => {
    const t = tests.find(x => x.id === testId);
    if (t) {
      handleOpenGrading(t);
    }
  };

  // Save grading sheet
  const handleSaveGradingSheet = () => {
    if (!gradingTest) return;
    const updatedList: StudentTestMark[] = [];

    // Filter students who are included in this grading
    const targetStudents = showAllStudentsInGrading 
      ? students 
      : students.filter(s => matchStudentToTest(s, gradingTest)).length > 0
        ? students.filter(s => matchStudentToTest(s, gradingTest))
        : students;

    targetStudents.forEach(st => {
      const data = currentGradingMarks[st.id];
      if (data) {
        const existing = marks.find(m => m.testId === gradingTest.id && m.studentId === st.id);
        updatedList.push({
          id: existing ? existing.id : `mark-${Date.now()}-${st.id}`,
          testId: gradingTest.id,
          studentId: st.id,
          marksObtained: Number(data.marksObtained) || 0,
          isPresent: data.isPresent,
          remarks: data.remarks.trim(),
          updatedAt: new Date().toISOString().slice(0, 10),
        });
      }
    });

    onSaveMarks(updatedList);
    setGradingSuccessMessage(`Marks saved successfully for ${gradingTest.title}!`);
    setTimeout(() => {
      setGradingTest(null);
      if (onCloseQuickInput) onCloseQuickInput();
    }, 1000);
  };

  // Quick fill helper
  const handleQuickFillMarks = (percentage: number) => {
    if (!gradingTest) return;
    const marksToFill = Math.round((gradingTest.maxMarks * percentage) / 100);
    setCurrentGradingMarks(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        if (updated[id].isPresent) {
          updated[id] = {
            ...updated[id],
            marksObtained: marksToFill,
            marksInputRaw: String(marksToFill),
          };
        }
      });
      return updated;
    });
  };

  const handleMarkAllAttendance = (present: boolean) => {
    setCurrentGradingMarks(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        updated[id] = {
          ...updated[id],
          isPresent: present,
        };
      });
      return updated;
    });
  };

  // Helper to match students to a test flexibly
  const matchStudentToTest = (student: Student, test: WeeklyTest) => {
    if (student.grade === test.grade) return true;
    if (test.batchId && student.batchIds?.includes(test.batchId)) return true;
    const sNorm = student.grade.toLowerCase().replace(/[^0-9a-z]/g, '');
    const tNorm = test.grade.toLowerCase().replace(/[^0-9a-z]/g, '');
    return sNorm.includes(tNorm) || tNorm.includes(sNorm);
  };

  // Determine students to render in grading modal
  const eligibleStudents = gradingTest
    ? showAllStudentsInGrading
      ? students
      : students.filter(s => matchStudentToTest(s, gradingTest)).length > 0
        ? students.filter(s => matchStudentToTest(s, gradingTest))
        : students
    : [];

  return (
    <div className="space-y-6">
      {/* Header with Dual Prominent Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>Academic Performance Tracker</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{tests.length} Weekly Tests Conducted</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Weekly Tests & Marks Management
          </h1>
        </div>

        {/* Both Action Buttons ALWAYS visible */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              if (tests.length > 0) {
                handleOpenGrading(tests[0]);
              } else {
                alert('Please schedule a weekly test first before entering marks.');
                setEditingTest(null);
                setIsCreateTestOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            title="Open grading sheet to input student test marks"
          >
            <Edit3 className="w-4 h-4" />
            <span>✍️ Input Weekly Test Marks</span>
          </button>

          <button
            onClick={() => {
              setEditingTest(null);
              setIsCreateTestOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            title="Create and schedule a new weekly test"
          >
            <Plus className="w-4 h-4" />
            <span>+ Schedule Weekly Test</span>
          </button>
        </div>
      </div>

      {/* Filter strip */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row gap-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search test by title or topic (e.g. Quadratic, Calculus, Trigonometry)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-neutral-50/50"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-white font-medium"
          >
            <option value="all">All Classes (8th, 9th, 10th, +1, +2)</option>
            <option value="8th Class">Class 8th Mathematics</option>
            <option value="9th Class">Class 9th Mathematics</option>
            <option value="10th Class">Class 10th Mathematics</option>
            <option value="+1 (11th) Mathematics">+1 (11th) Mathematics</option>
            <option value="+2 (12th) Mathematics">+2 (12th) Mathematics</option>
          </select>
        </div>
      </div>

      {/* Quick Enter Marks Banner */}
      {tests.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Latest Test: {tests[0].title} ({tests[0].grade})
              </h3>
              <p className="text-xs text-emerald-800">
                Topic: {tests[0].topic} · Max Marks: {tests[0].maxMarks} · Date: {formatDate(tests[0].testDate)}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenGrading(tests[0])}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Enter Marks for Latest Test</span>
          </button>
        </div>
      )}

      {/* Test Cards Grid */}
      {filteredTests.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400 mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900">No Weekly Tests Found</h3>
          <p className="text-xs text-neutral-500 mt-1 mb-4">
            Schedule a test or adjust your filter query to track weekly performance.
          </p>
          <button
            onClick={() => {
              setEditingTest(null);
              setIsCreateTestOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
          >
            + Schedule First Weekly Test
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTests.map(test => {
            const testMarks = marks.filter(m => m.testId === test.id);
            const classStudents = students.filter(s => s.grade === test.grade);
            const gradedCount = testMarks.length;
            const avgMarks = testMarks.length > 0 
              ? Math.round(testMarks.reduce((acc, m) => acc + (m.isPresent ? m.marksObtained : 0), 0) / testMarks.length)
              : 0;
            const highestMarks = testMarks.length > 0 
              ? Math.max(...testMarks.map(m => m.isPresent ? m.marksObtained : 0))
              : 0;

            return (
              <div 
                key={test.id}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                      {test.grade}
                    </span>
                    <span className="text-xs font-mono text-neutral-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(test.testDate)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 mt-2 line-clamp-1">
                    {test.title}
                  </h3>
                  <p className="text-xs font-medium text-neutral-600 mt-0.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Topic: {test.topic}</span>
                  </p>

                  {/* Test Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                    <div>
                      <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Max</span>
                      <span className="text-sm font-bold font-mono text-neutral-900">{test.maxMarks}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Highest</span>
                      <span className="text-sm font-bold font-mono text-emerald-600">{highestMarks}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Avg</span>
                      <span className="text-sm font-bold font-mono text-neutral-900">{avgMarks}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5" />
                      {gradedCount} / {classStudents.length} Students Graded
                    </span>
                    <span className="font-mono text-[11px] text-neutral-400">Passing: {test.passingMarks}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTest(test);
                        setIsCreateTestOpen(true);
                      }}
                      className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/60 rounded-lg transition-colors cursor-pointer"
                      title="Edit Test Details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${test.title}"?`)) {
                          onDeleteTest(test.id);
                        }
                      }}
                      className="p-1.5 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Test"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenGrading(test)}
                    className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Enter Marks</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT TEST MODAL */}
      <CreateTestModal
        isOpen={isCreateTestOpen}
        onClose={() => {
          setIsCreateTestOpen(false);
          setEditingTest(null);
        }}
        onSave={newTest => {
          onSaveTest(newTest);
          setIsCreateTestOpen(false);
          setEditingTest(null);
          // Automatically open grading modal for the newly scheduled test!
          setTimeout(() => handleOpenGrading(newTest), 200);
        }}
        testToEdit={editingTest}
        batches={batches}
      />

      {/* FULL-FEATURED GRADING SHEET MODAL */}
      {gradingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-neutral-200 overflow-hidden max-h-[92vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/90">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                    Grading Sheet: {gradingTest.title}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    {gradingTest.grade} · Topic: {gradingTest.topic} · Max Marks: <strong>{gradingTest.maxMarks}</strong> (Pass: {gradingTest.passingMarks})
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setGradingTest(null);
                  if (onCloseQuickInput) onCloseQuickInput();
                }}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Test Selector Dropdown inside Modal */}
            <div className="px-6 py-2.5 bg-neutral-100 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-700">Switch Test:</span>
                <select
                  value={gradingTest.id}
                  onChange={e => handleSwitchGradingTest(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-neutral-300 rounded font-semibold text-neutral-900 text-xs focus:ring-2 focus:ring-emerald-500/20"
                >
                  {tests.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.grade} · Max: {t.maxMarks})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick batch fill controls */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-neutral-500 font-medium">Quick Actions:</span>
                <button
                  type="button"
                  onClick={() => handleMarkAllAttendance(true)}
                  className="px-2 py-0.5 bg-white border border-neutral-300 rounded font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillMarks(100)}
                  className="px-2 py-0.5 bg-emerald-100 border border-emerald-300 rounded font-bold text-emerald-800 hover:bg-emerald-200 cursor-pointer"
                >
                  Fill 100%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillMarks(80)}
                  className="px-2 py-0.5 bg-teal-100 border border-teal-300 rounded font-bold text-teal-800 hover:bg-teal-200 cursor-pointer"
                >
                  Fill 80%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillMarks(0)}
                  className="px-2 py-0.5 bg-neutral-200 border border-neutral-300 rounded font-semibold text-neutral-700 hover:bg-neutral-300 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Success notification banner */}
            {gradingSuccessMessage && (
              <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{gradingSuccessMessage}</span>
              </div>
            )}

            {/* Grading Table */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1">
              {eligibleStudents.length === 0 ? (
                <div className="text-center py-8 bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                  <Users className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-neutral-800">
                    No students currently assigned to {gradingTest.grade}.
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    You can switch to show all enrolled students to input marks for any student attending this test.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAllStudentsInGrading(true)}
                    className="mt-3 px-4 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 cursor-pointer"
                  >
                    Show All Enrolled Students ({students.length})
                  </button>
                </div>
              ) : (
                <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-neutral-100 border-b border-neutral-200 font-bold text-neutral-800">
                        <th className="py-2.5 px-3">Student & Roll No</th>
                        <th className="py-2.5 px-3 text-center">Attendance</th>
                        <th className="py-2.5 px-3">Marks (/{gradingTest.maxMarks})</th>
                        <th className="py-2.5 px-3">Performance</th>
                        <th className="py-2.5 px-3">Teacher Remarks & Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {eligibleStudents.map(student => {
                        const rowData = currentGradingMarks[student.id] || { 
                          marksObtained: 0, 
                          marksInputRaw: '0', 
                          isPresent: true, 
                          remarks: '' 
                        };

                        const marksValue = rowData.marksInputRaw !== undefined 
                          ? rowData.marksInputRaw 
                          : String(rowData.marksObtained);

                        const percentage = rowData.isPresent && gradingTest.maxMarks > 0
                          ? Math.round((Number(rowData.marksObtained) / gradingTest.maxMarks) * 100)
                          : 0;

                        const isPassed = rowData.marksObtained >= (gradingTest.passingMarks ?? 20);

                        return (
                          <tr key={student.id} className="hover:bg-neutral-50/80 transition-colors">
                            <td className="py-2.5 px-3">
                              <span className="font-bold text-neutral-900 block">{student.name}</span>
                              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                                <span>{student.rollNo}</span>
                                {showAllStudentsInGrading && (
                                  <span className="px-1.5 py-0.2 bg-neutral-100 rounded text-[10px] text-neutral-700">
                                    {student.grade}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentGradingMarks(prev => ({
                                    ...prev,
                                    [student.id]: {
                                      ...rowData,
                                      isPresent: !rowData.isPresent,
                                    },
                                  }));
                                }}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                                  rowData.isPresent 
                                    ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200' 
                                    : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                                }`}
                              >
                                {rowData.isPresent ? '✓ Present' : '✗ Absent'}
                              </button>
                            </td>

                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  disabled={!rowData.isPresent}
                                  value={rowData.isPresent ? marksValue : ''}
                                  placeholder={rowData.isPresent ? '0' : 'Absent'}
                                  onChange={e => {
                                    const valStr = e.target.value.replace(/[^0-9]/g, '');
                                    const numVal = valStr === '' ? 0 : Math.min(gradingTest.maxMarks, Number(valStr));
                                    setCurrentGradingMarks(prev => ({
                                      ...prev,
                                      [student.id]: {
                                        ...rowData,
                                        marksObtained: numVal,
                                        marksInputRaw: valStr,
                                      },
                                    }));
                                  }}
                                  className="w-20 px-2.5 py-1.5 border border-neutral-300 rounded-lg font-mono font-black text-center text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                                />
                                <span className="text-xs text-neutral-500 font-mono">
                                  / {gradingTest.maxMarks}
                                </span>
                              </div>
                            </td>

                            <td className="py-2.5 px-3">
                              {rowData.isPresent ? (
                                <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                                  isPassed 
                                    ? percentage >= 80 
                                      ? 'bg-emerald-100 text-emerald-800' 
                                      : 'bg-indigo-100 text-indigo-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {percentage}% {isPassed ? '· Pass' : '· Needs Work'}
                                </span>
                              ) : (
                                <span className="text-xs text-neutral-400 italic">Absent</span>
                              )}
                            </td>

                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                placeholder="e.g. Excellent work / Focus on Calculus..."
                                value={rowData.remarks}
                                onChange={e => {
                                  setCurrentGradingMarks(prev => ({
                                    ...prev,
                                    [student.id]: {
                                      ...rowData,
                                      remarks: e.target.value,
                                    },
                                  }));
                                }}
                                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Toggle to show all enrolled students */}
              <div className="pt-2 flex items-center justify-between text-xs text-neutral-500">
                <span>
                  Showing {eligibleStudents.length} students {showAllStudentsInGrading ? '(All enrolled)' : `(Class: ${gradingTest.grade})`}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllStudentsInGrading(!showAllStudentsInGrading)}
                  className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
                >
                  {showAllStudentsInGrading ? 'Filter by Test Grade Only' : '+ Show Students from Other Grades'}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3">
              <span className="text-xs text-neutral-500 font-medium">
                Entered marks will appear immediately on student portal accounts.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGradingTest(null);
                    if (onCloseQuickInput) onCloseQuickInput();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveGradingSheet}
                  className="px-5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5 hover:scale-[1.02]"
                >
                  <Check className="w-4 h-4" />
                  <span>Save All Marks ({eligibleStudents.length} Students)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal for creating/scheduling a weekly test
interface CreateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (test: WeeklyTest) => void;
  testToEdit: WeeklyTest | null;
  batches: Batch[];
}

const CreateTestModal: React.FC<CreateTestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  testToEdit,
  batches,
}) => {
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<MathematicsGrade>('10th Class');
  const [batchId, setBatchId] = useState('');
  const [topic, setTopic] = useState('');
  const [testDate, setTestDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(50);
  const [passingMarks, setPassingMarks] = useState(20);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (testToEdit) {
      setTitle(testToEdit.title);
      setGrade(testToEdit.grade);
      setBatchId(testToEdit.batchId || '');
      setTopic(testToEdit.topic);
      setTestDate(testToEdit.testDate);
      setMaxMarks(testToEdit.maxMarks);
      setPassingMarks(testToEdit.passingMarks || 20);
      setDescription(testToEdit.description || '');
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setTitle('Weekly Mathematics Test');
      setGrade('10th Class');
      setBatchId('');
      setTopic('');
      setTestDate(today);
      setMaxMarks(50);
      setPassingMarks(20);
      setDescription('');
    }
  }, [testToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !topic.trim() || !testDate) {
      alert('Please fill all required test fields');
      return;
    }

    const testData: WeeklyTest = {
      id: testToEdit ? testToEdit.id : `test-${Date.now()}`,
      title: title.trim(),
      grade,
      batchId: batchId || '',
      topic: topic.trim(),
      testDate,
      maxMarks: Number(maxMarks) || 50,
      passingMarks: Number(passingMarks) || 20,
      description: description.trim() || undefined,
      isGraded: testToEdit ? testToEdit.isGraded : false,
    };

    onSave(testData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-neutral-900">
              {testToEdit ? 'Edit Weekly Test' : 'Schedule New Weekly Test'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Test Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Weekly Test 5 - Quadratic Equations"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Class / Grade <span className="text-rose-500">*</span>
              </label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value as MathematicsGrade)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-white"
              >
                <option value="8th Class">Class 8th Mathematics</option>
                <option value="9th Class">Class 9th Mathematics</option>
                <option value="10th Class">Class 10th Mathematics</option>
                <option value="+1 (11th) Mathematics">+1 (11th) Mathematics</option>
                <option value="+2 (12th) Mathematics">+2 (12th) Mathematics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Test Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={testDate}
                onChange={e => setTestDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Syllabus / Topic <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NCERT Chapter 4 + RD Sharma Advanced Problems"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Maximum Marks
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={maxMarks}
                onChange={e => setMaxMarks(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Passing Marks
              </label>
              <input
                type="number"
                min="0"
                max={maxMarks}
                value={passingMarks}
                onChange={e => setPassingMarks(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Instructions or Remarks (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Bring scientific calculator for +1/+2 or graph paper"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-sm cursor-pointer"
            >
              {testToEdit ? 'Save Changes' : 'Schedule Test & Open Grading'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
