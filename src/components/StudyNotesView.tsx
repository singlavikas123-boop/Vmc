import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  FileText, 
  Download, 
  Bookmark, 
  Calendar, 
  Edit, 
  Trash2, 
  Search, 
  Check, 
  X,
  ExternalLink,
  Sparkles,
  Upload,
  FileCheck,
  FileSpreadsheet,
  HelpCircle,
  Eye,
  Paperclip,
  Copy,
  Layers,
  BookOpen
} from 'lucide-react';
import { StudyNote, CenterSettings, MathematicsGrade, Batch } from '../types';
import { formatDate } from '../utils/formatters';

interface StudyNotesViewProps {
  notes: StudyNote[];
  settings: CenterSettings;
  batches: Batch[];
  onSaveNote: (note: StudyNote) => void;
  onDeleteNote: (noteId: string) => void;
  isUploadOpen?: boolean;
  onCloseUpload?: () => void;
}

const MATHEMATICS_CLASSES: { grade: MathematicsGrade; label: string; short: string }[] = [
  { grade: '8th Class', label: '8th Class Mathematics', short: 'Class 8th' },
  { grade: '9th Class', label: '9th Class Mathematics', short: 'Class 9th' },
  { grade: '10th Class', label: '10th Class Mathematics', short: 'Class 10th' },
  { grade: '+1 (11th) Mathematics', label: '+1 (11th) Mathematics', short: '+1 (11th)' },
  { grade: '+2 (12th) Mathematics', label: '+2 (12th) Mathematics', short: '+2 (12th)' },
];

const SUGGESTED_TOPICS_BY_GRADE: Record<MathematicsGrade, string[]> = {
  '8th Class': [
    'Rational Numbers',
    'Linear Equations in One Variable',
    'Understanding Quadrilaterals',
    'Square & Square Roots',
    'Cube & Cube Roots',
    'Comparing Quantities & Percentage',
    'Algebraic Expressions & Identities',
    'Mensuration (Surface Area & Volume)',
    'Exponents and Powers',
    'Direct & Inverse Proportions',
    'Factorisation',
  ],
  '9th Class': [
    'Number Systems',
    'Polynomials',
    'Coordinate Geometry',
    'Linear Equations in Two Variables',
    'Introduction to Euclid Geometry',
    'Lines and Angles',
    'Triangles (Congruence & Inequalities)',
    'Quadrilaterals',
    'Circles & Theorems',
    'Heron Formula',
    'Surface Areas and Volumes',
    'Statistics & Probability',
  ],
  '10th Class': [
    'Real Numbers',
    'Polynomials',
    'Pair of Linear Equations in Two Variables',
    'Quadratic Equations & Discriminant',
    'Arithmetic Progressions (AP)',
    'Triangles & Similarity Theorems',
    'Coordinate Geometry (Distance & Section Formula)',
    'Introduction to Trigonometry',
    'Some Applications of Trigonometry (Heights & Distances)',
    'Circles (Tangents to a Circle)',
    'Areas Related to Circles',
    'Surface Areas and Volumes',
    'Statistics (Mean, Median, Mode)',
    'Probability',
  ],
  '+1 (11th) Mathematics': [
    'Sets and Their Representations',
    'Relations & Functions',
    'Trigonometric Functions & Formulas',
    'Principle of Mathematical Induction',
    'Complex Numbers & Quadratic Equations',
    'Linear Inequalities',
    'Permutations and Combinations',
    'Binomial Theorem',
    'Sequences and Series (AP & GP)',
    'Straight Lines',
    'Conic Sections (Circle, Parabola, Ellipse, Hyperbola)',
    'Introduction to Three-Dimensional Geometry',
    'Limits and Derivatives',
    'Mathematical Reasoning',
    'Statistics & Probability',
  ],
  '+2 (12th) Mathematics': [
    'Relations and Functions',
    'Inverse Trigonometric Functions',
    'Matrices (Multiplication, Transpose, Invertible)',
    'Determinants (Minors, Cofactors, Adjoint, Inverse)',
    'Continuity and Differentiability',
    'Applications of Derivatives (Rate of Change, Maxima & Minima)',
    'Integrals (Definite & Indefinite Integration)',
    'Applications of Integrals (Area under Curves)',
    'Differential Equations (Order, Degree, General Solution)',
    'Vector Algebra (Dot & Cross Product)',
    'Three Dimensional Geometry (Lines & Planes)',
    'Linear Programming Problems (LPP)',
    'Probability (Conditional Probability, Bayes Theorem)',
  ],
};

export const StudyNotesView: React.FC<StudyNotesViewProps> = ({
  notes,
  settings,
  batches,
  onSaveNote,
  onDeleteNote,
  isUploadOpen = false,
  onCloseUpload,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<StudyNote | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  // Form states for modal
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<MathematicsGrade>('10th Class');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [pdfDataUrl, setPdfDataUrl] = useState<string | undefined>(undefined);
  const [isImportant, setIsImportant] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle external trigger from top navbar
  useEffect(() => {
    if (isUploadOpen) {
      handleOpenAdd();
    }
  }, [isUploadOpen]);

  // Distinct topics available for currently selected grade
  const availableTopics = Array.from(
    new Set(
      notes
        .filter(n => selectedGrade === 'all' || n.grade === selectedGrade)
        .map(n => n.topic.trim())
        .filter(Boolean)
    )
  );

  const filteredNotes = notes.filter(n => {
    const matchesGrade = selectedGrade === 'all' || n.grade === selectedGrade;
    const matchesTopic = selectedTopic === 'all' || n.topic.toLowerCase() === selectedTopic.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      n.title.toLowerCase().includes(q) || 
      n.topic.toLowerCase().includes(q) || 
      n.content.toLowerCase().includes(q);
    return matchesGrade && matchesTopic && matchesSearch;
  });

  const handleOpenAdd = (defaultGrade?: MathematicsGrade) => {
    setNoteToEdit(null);
    setTitle('');
    const targetGrade = defaultGrade || (selectedGrade !== 'all' ? (selectedGrade as MathematicsGrade) : '10th Class');
    setGrade(targetGrade);
    setTopic('');
    setContent('');
    setPdfName('');
    setPdfDataUrl(undefined);
    setIsImportant(false);
    setUploadFeedback('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (n: StudyNote) => {
    setNoteToEdit(n);
    setTitle(n.title);
    setGrade(n.grade);
    setTopic(n.topic);
    setContent(n.content);
    setPdfName(n.pdfAttachmentName || '');
    setPdfDataUrl(n.pdfAttachmentUrl);
    setIsImportant(!!n.isImportant);
    setUploadFeedback('');
    setIsModalOpen(true);
  };

  const handleCloneNote = (n: StudyNote) => {
    // Open as brand new note, not editing the original
    setNoteToEdit(null);
    setTitle(`${n.title} (Copy)`);
    setGrade(n.grade);
    setTopic(n.topic);
    setContent(n.content);
    setPdfName(n.pdfAttachmentName || '');
    setPdfDataUrl(n.pdfAttachmentUrl);
    setIsImportant(!!n.isImportant);
    setUploadFeedback('Note cloned into new upload. Choose class/topic and click Save to post.');
    setIsModalOpen(true);
  };

  // File Upload Handler (PDF, Word, Images, Text)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB. Please choose a smaller PDF or document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPdfDataUrl(result);
      setPdfName(file.name);
      setUploadFeedback(`✓ File "${file.name}" (${(file.size / 1024).toFixed(1)} KB) attached successfully!`);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset Template Helper
  const handleApplyTemplate = (type: 'trig' | 'calculus' | 'quad' | 'conic') => {
    if (type === 'trig') {
      setTitle('Trigonometry Master Formula Sheet');
      setGrade('10th Class');
      setTopic('Trigonometric Ratios & Standard Identities');
      setContent(
        `# TRIGONOMETRY MASTER FORMULAS (CLASS 10)\n\n` +
        `1. Fundamental Identities:\n` +
        `   • sin²θ + cos²θ = 1\n` +
        `   • 1 + tan²θ = sec²θ\n` +
        `   • 1 + cot²θ = cosec²θ\n\n` +
        `2. Quotient Relations:\n` +
        `   • tanθ = sinθ / cosθ\n` +
        `   • cotθ = cosθ / sinθ\n\n` +
        `3. Values at Standard Angles (0°, 30°, 45°, 60°, 90°):\n` +
        `   • sin: 0, 1/2, 1/√2, √3/2, 1\n` +
        `   • cos: 1, √3/2, 1/√2, 1/2, 0\n` +
        `   • tan: 0, 1/√3, 1, √3, Not Defined`
      );
      setIsImportant(true);
    } else if (type === 'calculus') {
      setTitle('Calculus Differentiation & Integration Cheat Sheet');
      setGrade('+2 (12th) Mathematics');
      setTopic('Calculus (Differential & Integral)');
      setContent(
        `# CALCULUS SUMMARY (+2 / 12th MATHS)\n\n` +
        `1. Standard Derivatives:\n` +
        `   • d/dx(xⁿ) = n·xⁿ⁻¹\n` +
        `   • d/dx(eˣ) = eˣ\n` +
        `   • d/dx(ln|x|) = 1/x\n` +
        `   • d/dx(sin x) = cos x\n` +
        `   • d/dx(tan x) = sec² x\n\n` +
        `2. Standard Integrals:\n` +
        `   • ∫ xⁿ dx = (xⁿ⁺¹)/(n+1) + C (n ≠ -1)\n` +
        `   • ∫ (1/x) dx = ln|x| + C\n` +
        `   • ∫ eˣ dx = eˣ + C\n` +
        `   • ∫ sec²x dx = tan x + C\n` +
        `   • ∫ 1/(a² + x²) dx = (1/a)·tan⁻¹(x/a) + C`
      );
      setIsImportant(true);
    } else if (type === 'quad') {
      setTitle('Quadratic Equations & Roots Summary');
      setGrade('10th Class');
      setTopic('Quadratic Equations & Discriminant');
      setContent(
        `# QUADRATIC EQUATIONS (ax² + bx + c = 0)\n\n` +
        `1. Discriminant: D = b² - 4ac\n` +
        `   • D > 0: Two distinct real roots\n` +
        `   • D = 0: Two equal real roots (-b/2a)\n` +
        `   • D < 0: No real roots (Complex roots)\n\n` +
        `2. Quadratic Formula: x = (-b ± √D) / 2a\n\n` +
        `3. Relations Between Roots (α, β):\n` +
        `   • Sum of roots: α + β = -b/a\n` +
        `   • Product of roots: α·β = c/a`
      );
      setIsImportant(true);
    } else if (type === 'conic') {
      setTitle('Conic Sections & Straight Lines Formula Bank');
      setGrade('+1 (11th) Mathematics');
      setTopic('Conic Sections & Analytical Geometry');
      setContent(
        `# CONIC SECTIONS (+1 / 11th)\n\n` +
        `1. Circle: (x - h)² + (y - k)² = r²\n` +
        `2. Parabola: y² = 4ax (Focus at (a, 0), Directrix x = -a)\n` +
        `3. Ellipse: x²/a² + y²/b² = 1 (a > b)\n` +
        `   • Eccentricity: e = √(1 - b²/a²)\n` +
        `   • Foci: (±ae, 0)\n` +
        `4. Hyperbola: x²/a² - y²/b² = 1\n` +
        `   • Eccentricity: e = √(1 + b²/a²)`
      );
      setIsImportant(true);
    }
  };

  const handleSave = (forceNew: boolean = false) => {
    if (!title.trim()) {
      alert('Please enter a note title.');
      return;
    }
    if (!content.trim() && !pdfDataUrl) {
      alert('Please enter note text or attach a PDF/document.');
      return;
    }

    // Always generate guaranteed unique ID when creating new or forcing new
    const finalId = (noteToEdit && !forceNew) 
      ? noteToEdit.id 
      : `note-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const noteData: StudyNote = {
      id: finalId,
      title: title.trim(),
      grade,
      topic: topic.trim() || 'General Mathematics',
      postedDate: (noteToEdit && !forceNew) ? noteToEdit.postedDate : new Date().toISOString().slice(0, 10),
      content: content.trim() || `Uploaded document: ${pdfName || 'Mathematics Study File'}`,
      pdfAttachmentName: pdfName.trim() || undefined,
      pdfAttachmentUrl: pdfDataUrl,
      isImportant,
    };

    onSaveNote(noteData);
    setIsModalOpen(false);
    setNoteToEdit(null);
    if (onCloseUpload) onCloseUpload();
  };

  const handleDownload = (note: StudyNote) => {
    if (note.pdfAttachmentUrl) {
      const a = document.createElement('a');
      a.href = note.pdfAttachmentUrl;
      a.download = note.pdfAttachmentName || `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      a.target = '_blank';
      a.click();
    } else {
      const fileTitle = note.pdfAttachmentName || `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      const blob = new Blob(
        [`VANITA MATH CLASSES - BATHINDA\nTitle: ${note.title}\nClass: ${note.grade}\nTopic: ${note.topic}\nDate: ${note.postedDate}\n\n${note.content}`], 
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileTitle.endsWith('.pdf') ? fileTitle.replace('.pdf', '.txt') : fileTitle;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>Study Repository</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-bold text-red-700">{notes.length} Total Uploaded Notes & Formula Sheets</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 mt-1">
            Mathematics Notes & Formula Bank
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Faculty: <strong className="text-neutral-900">Vanita Rani Gupta</strong> · Upload individual notes for each class & topic
          </p>
        </div>

        {/* Prominent Upload & Add Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleOpenAdd()}
            style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md hover:bg-red-700 active:bg-red-800 hover:scale-[1.02]"
            title="Upload PDF notes or create formula sheets"
          >
            <Upload className="w-4 h-4 text-white" />
            <span style={{ color: '#ffffff', fontWeight: 800 }}>+ Upload Notes / PDF</span>
          </button>
        </div>
      </div>

      {/* 1. CLASS-BY-CLASS SELECTOR TABS - ALWAYS VISIBLE TEXT & EXPLICIT STYLING */}
      <div className="p-1.5 bg-neutral-200/80 rounded-xl border border-neutral-300 flex items-center gap-1.5 overflow-x-auto shadow-2xs">
        <button
          onClick={() => { setSelectedGrade('all'); setSelectedTopic('all'); }}
          style={{
            backgroundColor: selectedGrade === 'all' ? '#18181b' : '#ffffff',
            color: selectedGrade === 'all' ? '#ffffff' : '#1f2937',
            borderColor: selectedGrade === 'all' ? '#09090b' : '#d1d5db',
          }}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-lg font-bold text-xs sm:text-sm cursor-pointer transition-all whitespace-nowrap border ${
            selectedGrade === 'all' ? 'shadow-md ring-2 ring-neutral-800' : 'hover:bg-neutral-50'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" style={{ color: selectedGrade === 'all' ? '#fbbf24' : '#dc2626' }} />
          <span style={{ color: selectedGrade === 'all' ? '#ffffff' : '#1f2937', fontWeight: 800 }}>All Classes</span>
          <span 
            className="text-[11px] font-mono px-1.5 py-0.2 rounded-full font-black"
            style={{
              backgroundColor: selectedGrade === 'all' ? '#f59e0b' : '#e5e7eb',
              color: selectedGrade === 'all' ? '#451a03' : '#374151',
            }}
          >
            {notes.length}
          </span>
        </button>

        {MATHEMATICS_CLASSES.map(c => {
          const isActive = selectedGrade === c.grade;
          const count = notes.filter(n => n.grade === c.grade).length;
          return (
            <button
              key={c.grade}
              onClick={() => { setSelectedGrade(c.grade); setSelectedTopic('all'); }}
              style={{
                backgroundColor: isActive ? '#18181b' : '#ffffff',
                color: isActive ? '#ffffff' : '#1f2937',
                borderColor: isActive ? '#09090b' : '#d1d5db',
              }}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg font-bold text-xs sm:text-sm cursor-pointer transition-all whitespace-nowrap border ${
                isActive ? 'shadow-md ring-2 ring-neutral-800' : 'hover:bg-neutral-50'
              }`}
            >
              <span style={{ color: isActive ? '#ffffff' : '#1f2937', fontWeight: 800 }}>{c.short}</span>
              <span 
                className="text-[11px] font-mono px-1.5 py-0.2 rounded-full font-black"
                style={{
                  backgroundColor: isActive ? '#f59e0b' : '#e5e7eb',
                  color: isActive ? '#451a03' : '#374151',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. TOPIC FILTER PILLS (IF MULTIPLE TOPICS EXIST FOR THIS CLASS) */}
      {availableTopics.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-neutral-500 font-bold shrink-0">Topics:</span>
          <button
            onClick={() => setSelectedTopic('all')}
            style={{
              backgroundColor: selectedTopic === 'all' ? '#dc2626' : '#ffffff',
              color: selectedTopic === 'all' ? '#ffffff' : '#374151',
              borderColor: selectedTopic === 'all' ? '#b91c1c' : '#d1d5db',
            }}
            className={`px-3 py-1 rounded-full font-bold border cursor-pointer transition-all whitespace-nowrap ${
              selectedTopic === 'all' ? 'shadow-xs' : 'hover:bg-neutral-100'
            }`}
          >
            All Topics
          </button>
          {availableTopics.map(t => {
            const isTActive = selectedTopic.toLowerCase() === t.toLowerCase();
            return (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                style={{
                  backgroundColor: isTActive ? '#dc2626' : '#ffffff',
                  color: isTActive ? '#ffffff' : '#374151',
                  borderColor: isTActive ? '#b91c1c' : '#d1d5db',
                }}
                className={`px-3 py-1 rounded-full font-bold border cursor-pointer transition-all whitespace-nowrap ${
                  isTActive ? 'shadow-xs' : 'hover:bg-neutral-100'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}

      {/* Search and Grade Info banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes by title, topic formula, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-neutral-50/50"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleOpenAdd(selectedGrade !== 'all' ? (selectedGrade as MathematicsGrade) : undefined)}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              Upload for {selectedGrade === 'all' ? 'Any Class' : selectedGrade}
            </span>
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400 mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            No Study Notes Found {selectedGrade !== 'all' ? `for ${selectedGrade}` : ''}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 mb-4">
            Upload PDF notes or save formula sheets for your students. Each class and topic is stored separately without overwriting!
          </p>
          <button
            onClick={() => handleOpenAdd(selectedGrade !== 'all' ? (selectedGrade as MathematicsGrade) : undefined)}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
          >
            + Upload Notes for {selectedGrade === 'all' ? 'This Class' : selectedGrade}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map(n => {
            const isExpanded = expandedNoteId === n.id;

            return (
              <div
                key={n.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between ${
                  n.isImportant ? 'border-amber-400 ring-1 ring-amber-300/60' : 'border-neutral-200'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-900 border border-red-200">
                        {n.grade}
                      </span>
                      {n.isImportant && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1">
                          <Bookmark className="w-3 h-3 text-amber-600 fill-amber-600" />
                          <span>Important Formula Sheet</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(n.postedDate)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 mt-2.5">
                    {n.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                      Topic: {n.topic}
                    </span>
                  </div>

                  {/* Attached PDF/file badge if present */}
                  {n.pdfAttachmentName && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold border border-red-200">
                      <Paperclip className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="truncate max-w-xs">{n.pdfAttachmentName}</span>
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="mt-3 p-3 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-xs overflow-hidden leading-relaxed">
                    <p className={isExpanded ? '' : 'line-clamp-4'}>
                      {n.content}
                    </p>
                    {n.content.length > 200 && (
                      <button
                        type="button"
                        onClick={() => setExpandedNoteId(isExpanded ? null : n.id)}
                        className="text-amber-400 hover:text-amber-300 text-[11px] font-bold mt-1.5 cursor-pointer block"
                      >
                        {isExpanded ? '▲ Show Less' : '▼ Read Full Note'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(n)}
                      className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-lg transition-colors cursor-pointer"
                      title="Edit this note"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCloneNote(n)}
                      className="p-1.5 text-neutral-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="Duplicate / Clone to another class without overwriting"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete note "${n.title}"?`)) {
                          onDeleteNote(n.id);
                        }
                      }}
                      className="p-1.5 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDownload(n)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download / Open</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* UPLOAD & POST NOTES MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-neutral-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-600 text-white rounded-xl shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    {noteToEdit ? 'Edit Mathematics Note' : 'Upload New Mathematics Note / PDF'}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    {noteToEdit 
                      ? 'Update this note, or choose "Save as New Note" to avoid overwriting.' 
                      : 'Each note is saved individually per class and topic.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseUpload) onCloseUpload();
                }}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(false);
              }} 
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {/* Quick Template Buttons */}
              <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Quick Pre-loaded Formula Templates:</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('trig')}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-amber-50 text-neutral-800 font-semibold rounded-lg border border-neutral-300 cursor-pointer"
                  >
                    10th Trigonometry
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('calculus')}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-amber-50 text-neutral-800 font-semibold rounded-lg border border-neutral-300 cursor-pointer"
                  >
                    +2 Calculus
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('quad')}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-amber-50 text-neutral-800 font-semibold rounded-lg border border-neutral-300 cursor-pointer"
                  >
                    10th Quadratics
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('conic')}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-amber-50 text-neutral-800 font-semibold rounded-lg border border-neutral-300 cursor-pointer"
                  >
                    +1 Conic Sections
                  </button>
                </div>
              </div>

              {/* Class & Topic Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Select Class / Grade <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value as MathematicsGrade)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-white"
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
                    Topic / Chapter Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quadratic Equations, Calculus..."
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-white"
                  />
                </div>
              </div>

              {/* Quick Topic suggestions for selected grade */}
              {SUGGESTED_TOPICS_BY_GRADE[grade] && (
                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-bold text-neutral-600 block mb-1.5">
                    Click any standard syllabus topic for {grade}:
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                    {SUGGESTED_TOPICS_BY_GRADE[grade].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTopic(t);
                          if (!title) setTitle(`${t} - Study Notes & Formulas`);
                        }}
                        className={`text-[11px] px-2 py-0.5 rounded-md border font-medium cursor-pointer transition-colors ${
                          topic === t 
                            ? 'bg-red-600 text-white border-red-700 font-bold' 
                            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Title of Notes / Document <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 8 - Trigonometry Complete Formula Sheet"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-white"
                />
              </div>

              {/* Real File Upload Section */}
              <div className="p-4 bg-red-50/50 border-2 border-dashed border-red-300 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-800">
                    Attach PDF or Document File
                  </label>
                  <span className="text-[11px] text-neutral-500 font-mono">PDF, DOC, DOCX, TXT, PNG</span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-800 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-red-600" />
                    <span>Choose File from Computer</span>
                  </button>

                  {pdfName ? (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-800 font-medium truncate">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[180px] font-bold text-emerald-800">{pdfName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfName('');
                          setPdfDataUrl(undefined);
                          setUploadFeedback('');
                        }}
                        className="text-neutral-400 hover:text-rose-600 ml-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-500 italic">No file selected</span>
                  )}
                </div>

                {uploadFeedback && (
                  <p className="text-xs font-semibold text-emerald-700 animate-fade-in">
                    {uploadFeedback}
                  </p>
                )}
              </div>

              {/* Note Content / Formulas */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Formulas, Key Points or Note Content
                  </label>
                  <span className="text-[10px] text-neutral-500">Supports text & formulas</span>
                </div>
                <textarea
                  rows={6}
                  required={!pdfDataUrl}
                  placeholder="Type or paste formulas, theorems, and important questions here..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={isImportant}
                  onChange={e => setIsImportant(e.target.checked)}
                  className="rounded border-neutral-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="isImportant" className="text-xs font-bold text-neutral-800 cursor-pointer flex items-center gap-1">
                  <span>Mark as High-Priority / Important Exam Formula Sheet</span>
                  <Bookmark className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onCloseUpload) onCloseUpload();
                  }}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg cursor-pointer text-center"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  {noteToEdit && (
                    <button
                      type="button"
                      onClick={() => handleSave(true)}
                      className="px-3.5 py-2 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg cursor-pointer flex items-center gap-1"
                      title="Saves as a brand new note without replacing the existing one"
                    >
                      <Copy className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Save as New Note</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{noteToEdit ? 'Save Changes' : 'Post Mathematics Note'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
