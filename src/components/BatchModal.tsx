import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Batch, CenterSettings, MathematicsGrade } from '../types';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (batch: Batch) => void;
  batchToEdit?: Batch | null;
  settings: CenterSettings;
}

export const BatchModal: React.FC<BatchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  batchToEdit,
  settings,
}) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState<MathematicsGrade>('10th Class');
  const [instructor, setInstructor] = useState('Er. Vikas');
  const [schedule, setSchedule] = useState('Mon, Wed, Fri · 4:00 PM - 5:30 PM');
  const [monthlyFee, setMonthlyFee] = useState<number>(2500);
  const [capacity, setCapacity] = useState<number>(25);
  const [room, setRoom] = useState('Room 101');

  useEffect(() => {
    if (batchToEdit) {
      setName(batchToEdit.name);
      setSubject(batchToEdit.subject);
      setGrade(batchToEdit.grade);
      setInstructor(batchToEdit.instructor);
      setSchedule(batchToEdit.schedule);
      setMonthlyFee(batchToEdit.monthlyFee);
      setCapacity(batchToEdit.capacity);
      setRoom(batchToEdit.room || 'Room 101');
    } else {
      setName('');
      setSubject('Mathematics');
      setGrade('10th Class');
      setInstructor('Er. Vikas');
      setSchedule('Mon, Wed, Fri · 4:00 PM - 5:30 PM');
      setMonthlyFee(2500);
      setCapacity(25);
      setRoom('Room 101');
    }
  }, [batchToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) {
      alert('Please fill in batch name and subject');
      return;
    }

    const batchData: Batch = {
      id: batchToEdit ? batchToEdit.id : `batch-${Date.now()}`,
      name: name.trim(),
      subject: subject.trim(),
      grade,
      instructor: instructor.trim() || 'Er. Vikas',
      schedule: schedule.trim(),
      monthlyFee: Number(monthlyFee) || 0,
      capacity: Number(capacity) || 20,
      room: room.trim(),
    };

    onSave(batchData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {batchToEdit ? 'Edit Mathematics Batch' : 'Create New Mathematics Batch'}
            </h2>
            <p className="text-xs text-neutral-500">
              Vanita Math Classes · Configure grade, schedule, faculty, and monthly fee rate
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Batch Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Class 10 - Board Mathematics Champions"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                readOnly
                value={subject}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-100 text-neutral-600 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Class / Grade <span className="text-rose-500">*</span>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Faculty / Teacher Name
              </label>
              <input
                type="text"
                placeholder="e.g. Er. Vikas / Vanita Mam"
                value={instructor}
                onChange={e => setInstructor(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Classroom / Room No
              </label>
              <input
                type="text"
                placeholder="e.g. Hall 1, Room 204"
                value={room}
                onChange={e => setRoom(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Class Days & Timing Schedule
            </label>
            <input
              type="text"
              placeholder="e.g. Mon, Wed, Fri · 4:00 PM - 5:30 PM"
              value={schedule}
              onChange={e => setSchedule(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Monthly Tuition Fee ({settings.currencySymbol}) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="100"
                value={monthlyFee}
                onChange={e => setMonthlyFee(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Max Student Capacity
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={capacity}
                onChange={e => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-3">
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
              <span>{batchToEdit ? 'Save Changes' : 'Create Batch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
