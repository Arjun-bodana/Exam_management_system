import React from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Keyboard,
  Shield,
  HelpCircle,
  Clock,
  Sparkles,
  Eye,
} from 'lucide-react';

interface ExamGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamGuidelinesModal: React.FC<ExamGuidelinesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-[#cbd5e1] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#0b1c30]">
        {/* Header */}
        <div className="bg-[#131b2e] text-white px-6 py-4 flex items-center justify-between border-b border-[#3f465c]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#316bf3] flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Candidate Exam Guidelines & Rules
              </h2>
              <p className="text-xs text-[#b4c5ff]">
                ParikshVision Secure Examination Code of Conduct
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Guidelines"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Reassurance Banner */}
          <div className="bg-[#eff4ff] border border-[#d3e4fe] p-3.5 rounded-lg flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#0051d5] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#0051d5] block">Student Privacy & Single-Feed Security</span>
              <p className="text-[#334155] leading-relaxed">
                You are in your isolated student examination room. You can only see your own video preview. 
                Other students cannot see you, and you cannot see any other candidate. Your video is streamed exclusively to the certified institutional proctor.
              </p>
            </div>
          </div>

          {/* Marking Scheme */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Marking Scheme</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-800 block text-sm">+4.0 Marks</span>
                <span className="text-emerald-700">For each correct answer selected</span>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <span className="font-bold text-red-800 block text-sm">-1.0 Mark</span>
                <span className="text-red-700">For each wrong answer (negative marking)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block text-sm">0.0 Marks</span>
                <span className="text-slate-600">For unattempted / skipped questions</span>
              </div>
            </div>
          </div>

          {/* Anti-Cheating & Integrity Policies */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Exam Integrity & Tab Rules</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  <strong>Tab Switching & Window Blur:</strong> Do NOT switch tabs, minimize your browser, or open any other application. The Page Visibility API automatically records every focus loss. <strong>3 violations</strong> will trigger an institutional review lock.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  <strong>Webcam Framing:</strong> Ensure your face is centered and clearly lit. Looking away repeatedly or having a second person in frame will trigger an AI gaze deviation alert.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  <strong>Continuous Screen Recording:</strong> Screen capture runs locally in the background for tamper-proof evidentiary audit.
                </span>
              </li>
            </ul>
          </div>

          {/* Helpful Navigation & Keyboard Shortcuts */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-[#0051d5]" />
              <span>Friendly Keyboard Shortcuts</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <span className="text-slate-600">Save & Next</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-[10px]">Alt + N</kbd>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <span className="text-slate-600">Previous</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-[10px]">Alt + P</kbd>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <span className="text-slate-600">Mark for Review</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-[10px]">Alt + M</kbd>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <span className="text-slate-600">Clear Answer</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-[10px]">Alt + C</kbd>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <span className="text-slate-600">Select Option</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-[10px]">1 / 2 / 3 / 4</kbd>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <span className="text-slate-600">Filter Palette</span>
                <span className="text-[10px] text-blue-700 font-semibold">Chips on right</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#eff4ff] px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#dce9ff]">
          <span className="text-xs text-slate-500 text-center sm:text-left">
            Auto-save is active after every choice.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#316bf3] hover:bg-[#0051d5] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs min-h-[44px] flex items-center justify-center"
          >
            I Understand & Return to Exam
          </button>
        </div>
      </div>
    </div>
  );
};
