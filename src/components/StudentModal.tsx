import React, { useState, useEffect } from 'react';
import { X, Check, Calculator, Key } from 'lucide-react';
import { Student, Batch, CenterSettings, MathematicsGrade } from '../types';
import { formatCurrency } from '../utils/formatters';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  studentToEdit?: Student | null;
  batches: Batch[];
  existingStudents: Student[];
  settings: CenterSettings;
}

const AVATAR_COLORS = [
  '#4f46e5', '#0891b2', '#059669', '#d97706', '#7c3aed', 
  '#e11d48', '#2563eb', '#0d9488', '#ea580c', '#475569'
];

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
  batches,
  existingStudents,
  settings,
}) => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('vanita');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [grade, setGrade] = useState<MathematicsGrade>('10th Class');
  const [schoolOrCollege, setSchoolOrCollege] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [status, setStatus] = useState<'active' | 'inactive' | 'alumni'>('active');
  const [notes, setNotes] = useState('');
  const [avatarColor, setAvatarColor] = useState('#4f46e5');

  // Auto-generate roll number if adding new
  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setRollNo(studentToEdit.rollNo);
      setPhone(studentToEdit.phone);
      setEmail(studentToEdit.email || '');
      setPassword(studentToEdit.password || 'vanita');
      setGuardianName(studentToEdit.guardianName);
      setGuardianPhone(studentToEdit.guardianPhone);
      setGrade(studentToEdit.grade);
      setSchoolOrCollege(studentToEdit.schoolOrCollege || '');
      setAdmissionDate(studentToEdit.admissionDate || new Date().toISOString().slice(0, 10));
      setSelectedBatchIds(studentToEdit.batchIds || []);
      setDiscountPercent(studentToEdit.discountPercent || 0);
      setStatus(studentToEdit.status || 'active');
      setNotes(studentToEdit.notes || '');
      setAvatarColor(studentToEdit.avatarColor || '#4f46e5');
    } else {
      const nextNum = existingStudents.length + 107;
      setRollNo(`VMC-${nextNum}`);
      setName('');
      setPhone('');
      setEmail('');
      setPassword('vanita');
      setGuardianName('');
      setGuardianPhone('');
      setGrade('10th Class');
      setSchoolOrCollege('');
      setAdmissionDate(new Date().toISOString().slice(0, 10));
      setSelectedBatchIds(batches.length > 0 ? [batches[0].id] : []);
      setDiscountPercent(0);
      setStatus('active');
      setNotes('');
      setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
    }
  }, [studentToEdit, isOpen, existingStudents.length, batches]);

  if (!isOpen) return null;

  // Calculate live fee
  const rawBatchTotal = selectedBatchIds.reduce((sum, bId) => {
    const b = batches.find(x => x.id === bId);
    return sum + (b?.monthlyFee || 0);
  }, 0);

  const finalMonthlyFee = discountPercent > 0 
    ? Math.max(0, Math.round(rawBatchTotal - (rawBatchTotal * discountPercent) / 100))
    : rawBatchTotal;

  const handleToggleBatch = (batchId: string) => {
    setSelectedBatchIds(prev => 
      prev.includes(batchId) ? prev.filter(id => id !== batchId) : [...prev, batchId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim()) {
      alert('Please provide student name and roll number');
      return;
    }

    const studentData: Student = {
      id: studentToEdit ? studentToEdit.id : `std-${Date.now()}`,
      rollNo: rollNo.trim(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password: password.trim() || 'vanita',
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
      grade,
      schoolOrCollege: schoolOrCollege.trim(),
      admissionDate,
      batchIds: selectedBatchIds,
      discountPercent: Number(discountPercent) || 0,
      status,
      notes: notes.trim(),
      avatarColor,
    };

    onSave(studentData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-neutral-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {studentToEdit ? 'Edit Student Profile' : 'Enroll New Mathematics Student'}
            </h2>
            <p className="text-xs text-neutral-500">
              Vanita Math Classes · Admission, contacts, and batch allocation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          {/* Section 1: Basic Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Diya Singhal"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Roll Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. VMC-101"
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                className="w-full px-3 py-2 font-mono font-semibold border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Class / Grade (Mathematics) <span className="text-rose-500">*</span>
              </label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value as MathematicsGrade)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-medium"
              >
                <option value="8th Class">Class 8th Mathematics</option>
                <option value="9th Class">Class 9th Mathematics</option>
                <option value="10th Class">Class 10th Mathematics</option>
                <option value="+1 (11th) Mathematics">+1 (11th) Mathematics</option>
                <option value="+2 (12th) Mathematics">+2 (12th) Mathematics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Student Mobile / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Portal Login Password
              </label>
              <input
                type="text"
                placeholder="Default: vanita"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          {/* Section 2: Guardian Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Parent / Guardian Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vikas Singhal"
                value={guardianName}
                onChange={e => setGuardianName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Parent Phone (For WhatsApp Reminders) <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit phone"
                value={guardianPhone}
                onChange={e => setGuardianPhone(e.target.value)}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          {/* Section 3: School & Admission Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                School / College Name
              </label>
              <input
                type="text"
                placeholder="e.g. St. Xavier School / DPS"
                value={schoolOrCollege}
                onChange={e => setSchoolOrCollege(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Admission Date
              </label>
              <input
                type="date"
                value={admissionDate}
                onChange={e => setAdmissionDate(e.target.value)}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          {/* Section 4: Batch Selection & Live Calculation */}
          <div className="border-t border-neutral-200 pt-4">
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Assigned Mathematics Batch Courses
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {batches.map(batch => {
                const isSelected = selectedBatchIds.includes(batch.id);
                return (
                  <button
                    key={batch.id}
                    type="button"
                    onClick={() => handleToggleBatch(batch.id)}
                    className={`p-3 rounded-lg border text-left flex items-start justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-neutral-900">{batch.name}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{batch.schedule}</div>
                    </div>
                    <span className="font-mono font-bold text-xs text-neutral-900 tabular-nums">
                      {formatCurrency(batch.monthlyFee, settings.currencySymbol)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Fee Calculator Box */}
            <div className="mt-3 p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Calculator className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-600">Scholarship / Discount:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={e => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-16 px-2 py-1 font-mono text-xs border border-neutral-300 rounded bg-white font-semibold text-center"
                  />
                  <span className="text-xs font-medium text-neutral-500">%</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-neutral-500 uppercase font-semibold block">Calculated Monthly Fee</span>
                <span className="text-base font-bold font-mono text-neutral-900 tabular-nums">
                  {formatCurrency(finalMonthlyFee, settings.currencySymbol)}/mo
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Academic Notes & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-neutral-200 pt-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Faculty Notes / Academic Goal
              </label>
              <input
                type="text"
                placeholder="e.g. Target 100/100 in Board Math, Focus on Calculus"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Enrollment Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                <option value="active">Active Enrolled</option>
                <option value="inactive">Inactive / On Leave</option>
                <option value="alumni">Alumni / Completed</option>
              </select>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{studentToEdit ? 'Save Changes' : 'Confirm Enrollment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
