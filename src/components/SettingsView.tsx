import React, { useState } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Building2, 
  CreditCard, 
  Check, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { CenterSettings, Student, Batch, FeePayment } from '../types';
import { exportCsv } from '../utils/formatters';

interface SettingsViewProps {
  settings: CenterSettings;
  onSaveSettings: (newSettings: CenterSettings) => void;
  onResetAllData: () => void;
  students: Student[];
  batches: Batch[];
  payments: FeePayment[];
  onImportAllData: (data: { settings?: CenterSettings; batches?: Batch[]; students?: Student[]; payments?: FeePayment[] }) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetAllData,
  students,
  batches,
  payments,
  onImportAllData,
}) => {
  const [formData, setFormData] = useState<CenterSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportFullBackup = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      settings: formData,
      batches,
      students,
      payments,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coaching_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.students && parsed.batches) {
          onImportAllData(parsed);
          alert('Data backup imported successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <span>System Configuration</span>
          <span aria-hidden="true">·</span>
          <span>Center Profile & Preferences</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
          Institute Settings & Data Management
        </h1>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Coaching Center Identity */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-neutral-900">Coaching Institute Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Coaching Institute / Academy Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.centerName}
                onChange={e => setFormData({ ...formData, centerName: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. Premier IIT-JEE & Medical Coaching"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Official Center Address (printed on receipts) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Contact Phone / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Financial & Receipts Config */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-neutral-900">Payment & Receipt Configuration</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                UPI ID (for instant parent payment reminders)
              </label>
              <input
                type="text"
                placeholder="e.g. apexacademy@upi"
                value={formData.upiId}
                onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Bank Account Details (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank - A/C: 5020..., IFSC: HDFC0001"
                value={formData.accountDetails || ''}
                onChange={e => setFormData({ ...formData, accountDetails: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Currency Symbol
              </label>
              <select
                value={formData.currencySymbol}
                onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-mono"
              >
                <option value="₹">₹ (Indian Rupee - INR)</option>
                <option value="$">$ (US Dollar - USD)</option>
                <option value="€">€ (Euro - EUR)</option>
                <option value="£">£ (British Pound - GBP)</option>
                <option value="AED ">AED (UAE Dirham)</option>
                <option value="Tk ">Tk (BDT)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Receipt Number Prefix
              </label>
              <input
                type="text"
                value={formData.receiptPrefix}
                onChange={e => setFormData({ ...formData, receiptPrefix: e.target.value })}
                className="w-full px-3 py-2 font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Academic Session / Year
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Receipt Terms & Conditions (printed at the bottom)
              </label>
              <textarea
                rows={2}
                value={formData.termsAndConditions}
                onChange={e => setFormData({ ...formData, termsAndConditions: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3">
          {isSaved && (
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Settings updated successfully
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Section 3: Data Backup & Management */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <FileText className="w-5 h-5 text-neutral-700" />
          <h2 className="text-base font-bold text-neutral-900">Database Backup & Recovery</h2>
        </div>

        <p className="text-xs text-neutral-600">
          Your student records, batch schedules, and fee receipts are stored securely in your browser's persistent storage. You can download a complete JSON backup or export Excel-friendly CSVs anytime.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportFullBackup}
            className="flex items-center justify-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Download Full Backup (JSON)</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-800 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Restore From JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {/* Danger Zone: Reset to sample demo data */}
        <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-neutral-800 block">Reset Demo Sample Data</span>
            <span className="text-[11px] text-neutral-500 block">
              Restore the initial 8 students, 5 batches, and realistic fee payment records.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reset all data back to the sample demo dataset? Any custom records will be overwritten.')) {
                onResetAllData();
              }
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
