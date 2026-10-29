import React, { useState } from 'react';
import { 
  Plus, 
  Users, 
  Calendar, 
  UserCheck, 
  Edit, 
  Trash2, 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  CreditCard
} from 'lucide-react';
import { Batch, Student, CenterSettings } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BatchesViewProps {
  batches: Batch[];
  students: Student[];
  settings: CenterSettings;
  onOpenAddBatch: () => void;
  onEditBatch: (batch: Batch) => void;
  onDeleteBatch: (batchId: string) => void;
  onViewStudent: (student: Student) => void;
}

export const BatchesView: React.FC<BatchesViewProps> = ({
  batches,
  students,
  settings,
  onOpenAddBatch,
  onEditBatch,
  onDeleteBatch,
  onViewStudent,
}) => {
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedBatchId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>Course Catalog</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{batches.length} Active Batches</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Batches & Courses
          </h1>
        </div>

        <button
          onClick={onOpenAddBatch}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Batch</span>
        </button>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {batches.map(batch => {
          const enrolledStudents = students.filter(s => s.batchIds.includes(batch.id) && s.status === 'active');
          const isExpanded = expandedBatchId === batch.id;
          const occupancyPercent = batch.capacity > 0 ? Math.round((enrolledStudents.length / batch.capacity) * 100) : 0;
          const monthlyRevenue = enrolledStudents.length * batch.monthlyFee;

          return (
            <div 
              key={batch.id} 
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 transition-shadow flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-medium text-indigo-600">
                      {batch.subject} · {batch.grade}
                    </span>
                    <h2 className="text-base font-bold text-neutral-900 mt-0.5 leading-snug">
                      {batch.name}
                    </h2>
                  </div>
                  <span className="text-sm font-bold font-mono text-neutral-900 tabular-nums shrink-0">
                    {formatCurrency(batch.monthlyFee, settings.currencySymbol)}
                    <span className="text-xs font-normal text-neutral-500">/mo</span>
                  </span>
                </div>

                {/* Faculty and Room */}
                <div className="mt-3 space-y-1.5 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>Faculty: <strong className="text-neutral-800">{batch.instructor}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="font-mono text-neutral-700">{batch.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{batch.room || 'Main Lecture Hall'}</span>
                  </div>
                </div>

                {/* Capacity progress */}
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                    <span>Enrolled Strength</span>
                    <span className="font-mono font-semibold text-neutral-900">
                      {enrolledStudents.length} / {batch.capacity} ({occupancyPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        occupancyPercent >= 90 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(100, occupancyPercent)}%` }}
                    />
                  </div>
                </div>

                {/* Monthly projection */}
                <div className="mt-3 py-2 px-3 bg-neutral-50 rounded-lg flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Monthly Projection:</span>
                  <span className="font-mono font-bold text-neutral-900 tabular-nums">
                    {formatCurrency(monthlyRevenue, settings.currencySymbol)}
                  </span>
                </div>
              </div>

              {/* Enrolled Students list collapsible */}
              {isExpanded && (
                <div className="border-t border-neutral-200 bg-neutral-50/70 p-4 max-h-48 overflow-y-auto">
                  <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                    Enrolled Students ({enrolledStudents.length})
                  </h4>
                  {enrolledStudents.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic">No active students in this batch yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {enrolledStudents.map(st => (
                        <div 
                          key={st.id} 
                          className="flex items-center justify-between text-xs py-1 px-2 bg-white rounded border border-neutral-200"
                        >
                          <button
                            onClick={() => onViewStudent(st)}
                            className="font-medium text-neutral-800 hover:text-indigo-600 text-left truncate cursor-pointer"
                          >
                            {st.name} ({st.rollNo})
                          </button>
                          <span className="font-mono text-neutral-500 text-[11px]">
                            {st.phone}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Footer actions */}
              <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleExpand(batch.id)}
                  className="text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide' : 'View'} Students ({enrolledStudents.length})</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditBatch(batch)}
                    className="p-1.5 text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg cursor-pointer transition-colors"
                    title="Edit Batch"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteBatch(batch.id)}
                    className="p-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer transition-colors"
                    title="Delete Batch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
