import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  UserCheck, 
  Trash2, 
  Calendar,
  CheckCircle,
  Clock,
  School,
  BookOpen
} from 'lucide-react';
import { AdmissionEnquiry, Student, CenterSettings } from '../types';
import { formatDate } from '../utils/formatters';

interface AdmissionEnquiriesViewProps {
  enquiries: AdmissionEnquiry[];
  settings: CenterSettings;
  onUpdateStatus: (enquiryId: string, status: 'new' | 'contacted' | 'enrolled') => void;
  onDeleteEnquiry: (enquiryId: string) => void;
  onConvertToStudent: (enquiry: AdmissionEnquiry) => void;
}

export const AdmissionEnquiriesView: React.FC<AdmissionEnquiriesViewProps> = ({
  enquiries,
  settings,
  onUpdateStatus,
  onDeleteEnquiry,
  onConvertToStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredEnquiries = enquiries.filter(enq => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      enq.studentName.toLowerCase().includes(q) ||
      enq.parentName.toLowerCase().includes(q) ||
      enq.phone.includes(q) ||
      enq.grade.toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'all' || enq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>Vanita Math Classes Admissions</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{enquiries.length} Inquiries Received</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            New Admission Enquiries
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1.5 rounded-lg border border-amber-300">
            {enquiries.filter(e => e.status === 'new').length} New Enquiries Pending Follow-up
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row gap-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, parent name, mobile number, or class..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-neutral-50/50"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white font-medium"
          >
            <option value="all">All Statuses ({enquiries.length})</option>
            <option value="new">New ({enquiries.filter(e => e.status === 'new').length})</option>
            <option value="contacted">Contacted ({enquiries.filter(e => e.status === 'contacted').length})</option>
            <option value="enrolled">Enrolled / Admitted ({enquiries.filter(e => e.status === 'enrolled').length})</option>
          </select>
        </div>
      </div>

      {/* Enquiries Grid */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center max-w-md mx-auto">
          <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-neutral-900">No Enquiries Found</h3>
          <p className="text-xs text-neutral-500 mt-1">
            New prospective students and parents who submit the home page enquiry form will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEnquiries.map(enq => {
            const isNew = enq.status === 'new';

            return (
              <div
                key={enq.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-2xs hover:shadow-sm transition-all p-5 flex flex-col justify-between ${
                  isNew ? 'border-amber-300 ring-2 ring-amber-300/40 bg-amber-50/10' : 'border-neutral-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                      {enq.grade}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      enq.status === 'new'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : enq.status === 'contacted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {enq.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 mt-2">
                    {enq.studentName}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-neutral-600">
                    <p className="flex items-center gap-1.5">
                      <span className="font-semibold text-neutral-800">Parent:</span> {enq.parentName}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-mono font-bold text-neutral-900">{enq.phone}</span>
                    </p>
                    {enq.schoolName && (
                      <p className="flex items-center gap-1.5 text-neutral-500">
                        <School className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{enq.schoolName} ({enq.board || 'CBSE'})</span>
                      </p>
                    )}
                    {enq.batchTiming && (
                      <p className="flex items-center gap-1.5 text-neutral-500">
                        <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>Timing: {enq.batchTiming}</span>
                      </p>
                    )}
                  </div>

                  {enq.message && (
                    <div className="mt-3 p-2.5 bg-neutral-50 rounded-lg border border-neutral-100 text-xs text-neutral-700 italic">
                      "{enq.message}"
                    </div>
                  )}

                  <div className="mt-2 text-[10px] text-neutral-400 font-mono">
                    Received on: {formatDate(enq.createdAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${enq.phone}`}
                      className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>Call</span>
                    </a>

                    <a
                      href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${enq.parentName}, this is Er. Vikas from Vanita Math Classes, Bathinda regarding ${enq.studentName}'s admission enquiry for ${enq.grade}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-700" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    {enq.status !== 'enrolled' && (
                      <button
                        onClick={() => onConvertToStudent(enq)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Enroll as Student</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Remove enquiry for ${enq.studentName}?`)) {
                          onDeleteEnquiry(enq.id);
                        }
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
