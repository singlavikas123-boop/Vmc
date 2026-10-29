import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Receipt, 
  AlertCircle, 
  Settings, 
  Plus, 
  CreditCard, 
  LayoutDashboard,
  Menu,
  X,
  Award,
  BookOpen,
  LogOut,
  Sparkles,
  Edit3,
  Upload,
  CheckCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { CenterSettings } from '../types';

export type TabType = 
  | 'dashboard' 
  | 'students' 
  | 'tests' 
  | 'notes' 
  | 'batches' 
  | 'ledger' 
  | 'dues' 
  | 'enquiries'
  | 'settings';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  settings: CenterSettings;
  onOpenRecordPayment: () => void;
  onOpenAddStudent: () => void;
  onOpenScheduleTest?: () => void;
  onOpenInputMarks?: () => void;
  onOpenPostNotes?: () => void;
  onOpenCreateBatch?: () => void;
  onLogout: () => void;
  dueCount: number;
  enquiryCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onOpenRecordPayment,
  onOpenAddStudent,
  onOpenScheduleTest,
  onOpenInputMarks,
  onOpenPostNotes,
  onOpenCreateBatch,
  onLogout,
  dueCount,
  enquiryCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students' as TabType, label: 'Students', icon: Users },
    { id: 'tests' as TabType, label: 'Weekly Tests', icon: Award },
    { id: 'notes' as TabType, label: 'Math Notes', icon: BookOpen },
    { id: 'batches' as TabType, label: 'Batches', icon: GraduationCap },
    { id: 'ledger' as TabType, label: 'Fee Ledger', icon: Receipt },
    { 
      id: 'dues' as TabType, 
      label: 'Due Fees', 
      icon: AlertCircle,
      badge: dueCount > 0 ? dueCount : undefined,
    },
    { 
      id: 'enquiries' as TabType, 
      label: 'Enquiries', 
      icon: Sparkles,
      badge: enquiryCount > 0 ? enquiryCount : undefined,
    },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (id: TabType) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      {/* Top Banner Bar: Large Letters "VANITA MATH CLASSES" with VMC Logo */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-2 px-3 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Logo & Brand Name in LARGE bold letters */}
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/vmc-logo.svg"
                alt="VMC Logo"
                className="h-7 sm:h-9 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase font-serif leading-none text-white drop-shadow-xs">
                VANITA MATH CLASSES
              </h1>
              <p className="text-[10px] sm:text-xs text-rose-100 font-medium tracking-wide">
                Mathmatics tuition classes for 8th, 9th, 10th, +1 & +2 · Faculty: Vanita Rani Gupta (M.Sc, M.Phil, B.Ed, 17+ yrs exp)
              </p>
            </div>
          </div>

          {/* Quick Action Buttons in Top Banner - ALL ESSENTIAL ACTIONS ALWAYS VISIBLE */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={onOpenRecordPayment}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 rounded-lg shadow-sm transition-all cursor-pointer ring-1 ring-emerald-500"
              title="Record student fee payment"
            >
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              <span>+ Record Fee</span>
            </button>

            <button
              onClick={onOpenAddStudent}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-900 bg-white hover:bg-rose-50 active:bg-neutral-100 rounded-lg shadow-sm transition-all cursor-pointer"
              title="Enroll a new student"
            >
              <Plus className="w-3.5 h-3.5 shrink-0 text-red-600" />
              <span>+ Add Student</span>
            </button>

            <button
              onClick={onOpenInputMarks || (() => setActiveTab('tests'))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-200 active:bg-amber-400 rounded-lg shadow-sm transition-all cursor-pointer"
              title="Input student weekly test marks"
            >
              <Edit3 className="w-3.5 h-3.5 shrink-0 text-amber-900" />
              <span>✍️ Input Marks</span>
            </button>

            <button
              onClick={onOpenPostNotes || (() => setActiveTab('notes'))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-950 bg-sky-300 hover:bg-sky-200 active:bg-sky-400 rounded-lg shadow-sm transition-all cursor-pointer"
              title="Upload class study notes / PDF"
            >
              <Upload className="w-3.5 h-3.5 shrink-0 text-sky-900" />
              <span>📤 Upload Notes</span>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-1"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Strip - HIGH CONTRAST, GUARANTEED VISIBLE TEXT IN BOTH ACTIVE AND INACTIVE STATES */}
      <div className="bg-neutral-100/90 border-b border-neutral-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between py-1.5">
            {/* Nav Tabs Container */}
            <nav className="flex items-center gap-2 overflow-x-auto lg:flex-wrap py-1 w-full lg:w-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    style={{
                      backgroundColor: isActive ? '#18181b' : '#ffffff',
                      color: isActive ? '#ffffff' : '#1f2937',
                      borderColor: isActive ? '#09090b' : '#d1d5db',
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                      isActive
                        ? 'shadow-md ring-2 ring-neutral-800'
                        : 'hover:bg-neutral-50 hover:text-neutral-950 shadow-2xs'
                    }`}
                  >
                    <Icon
                      className="w-4 h-4 shrink-0"
                      style={{ color: isActive ? '#facc15' : '#4b5563' }}
                    />
                    <span
                      style={{
                        color: isActive ? '#ffffff' : '#1f2937',
                        fontWeight: isActive ? 800 : 600,
                      }}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 ring-2 ring-neutral-900" />
                    )}
                    {item.badge !== undefined && (
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded-full font-black"
                        style={{
                          backgroundColor: isActive ? '#facc15' : '#dc2626',
                          color: isActive ? '#18181b' : '#ffffff',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Session info on desktop */}
            <div className="hidden xl:flex items-center gap-3 text-xs font-medium text-neutral-600 shrink-0 pl-4 border-l border-neutral-300">
              <span className="font-mono bg-white border border-neutral-300 px-2 py-0.5 rounded text-neutral-800 font-semibold shadow-2xs">
                Session {settings.academicYear}
              </span>
              <span className="text-neutral-400">|</span>
              <span className="text-neutral-900 font-bold">Admin: Vikas</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
