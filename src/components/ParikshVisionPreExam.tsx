import React, { useState } from 'react';
import {
  Clock,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Video,
  Mic,
  Wifi,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Shield,
  Layers,
} from 'lucide-react';
import { QuizDetail } from '../types';
import { CURRENT_STUDENT } from '../data/examData';

interface ParikshVisionPreExamProps {
  quiz: QuizDetail;
  onGoBackToCourse: () => void;
  onStartExam: () => void;
}

export const ParikshVisionPreExam: React.FC<ParikshVisionPreExamProps> = ({
  quiz,
  onGoBackToCourse,
  onStartExam,
}) => {
  const [hasAgreedToRules, setHasAgreedToRules] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back link */}
      <button
        onClick={onGoBackToCourse}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Course Curriculum</span>
      </button>

      {/* Main Pre-Exam Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Title Header */}
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-5 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
              {quiz.courseName}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-[11px] font-bold text-red-700 dark:text-red-300 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Forward-Only Navigation Enforced
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <Shield className="w-3 h-3" /> AI Proctoring Active
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {quiz.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Official proctored examination. Please review the mandatory assessment policies below before initiating your session.
          </p>
        </div>

        {/* Exam Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-400 text-[11px] block">Questions</span>
            <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              {quiz.totalQuestions} MCQs
            </span>
            <span className="text-[10px] text-zinc-400 block">Single choice correct</span>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-400 text-[11px] block">Time Limit</span>
            <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              {quiz.timeLimitMinutes} Mins
            </span>
            <span className="text-[10px] text-zinc-400 block">Strict countdown timer</span>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-400 text-[11px] block">Attempts Allowed</span>
            <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              {quiz.attemptsAllowed}
            </span>
            <span className="text-[10px] text-zinc-400 block">Single attempt policy</span>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-400 text-[11px] block">Grading Scheme</span>
            <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              +1.0 / -0.25
            </span>
            <span className="text-[10px] text-zinc-400 block">Negative marks apply</span>
          </div>
        </div>

        {/* Strict Examination Regulations (Prominent Card) */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3 bg-zinc-50/70 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            <span>Strict Assessment Rules & Forward-Only Policy</span>
          </div>

          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 shrink-0">1.</span>
              <span>
                <strong>Forward-Only Navigation:</strong> You cannot return to previous questions. Once you answer and click <strong>"Save & Next"</strong>, the question is permanently locked and disabled in the palette.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 shrink-0">2.</span>
              <span>
                <strong>Zero Tab-Switching Tolerance:</strong> Losing window focus or switching tabs triggers an immediate telemetry violation logged to the proctor audit ledger.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 shrink-0">3.</span>
              <span>
                <strong>Continuous Camera Monitoring:</strong> A floating, draggable <strong>"REC Monitoring"</strong> preview will remain in your exam room to verify facial framing and gaze alignment.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 shrink-0">4.</span>
              <span>
                <strong>Automatic Submission:</strong> When the 25-minute timer hits zero, all recorded answers will be automatically submitted and sealed.
              </span>
            </li>
          </ul>
        </div>

        {/* Device Verification Status */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2 text-xs">
          <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
            Peripheral & Environment Verification
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2 p-2 rounded bg-zinc-50 dark:bg-zinc-800/60">
              <Video className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Camera: <strong>Verified (99.4%)</strong></span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-zinc-50 dark:bg-zinc-800/60">
              <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Microphone: <strong>Operational</strong></span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-zinc-50 dark:bg-zinc-800/60">
              <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Network: <strong>12ms Latency</strong></span>
            </div>
          </div>
        </div>

        {/* Acknowledgment Checkbox & Start Button */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasAgreedToRules}
              onChange={(e) => setHasAgreedToRules(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
            />
            <span className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              I acknowledge that this examination enforces <strong>strict forward-only progression</strong> and AI proctoring. I understand that previous questions cannot be revisited once answered.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onGoBackToCourse}
              className="w-full sm:w-auto py-2.5 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel & Back to Course
            </button>

            <button
              onClick={onStartExam}
              disabled={!hasAgreedToRules}
              className="w-full sm:w-auto py-2.5 px-6 rounded-lg bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Start Proctored Exam Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
