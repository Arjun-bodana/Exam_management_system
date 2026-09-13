import React, { useState, useEffect } from 'react';
import {
  Clock,
  Flag,
  CheckCircle2,
  Lock,
  Sun,
  Moon,
  Video,
  VideoOff,
  AlertTriangle,
  ArrowRight,
  Shield,
  LayoutGrid,
  X,
  RotateCcw,
  Eye,
  GripHorizontal,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { Question, QuizDetail, QuestionStatus, CandidateSession } from '../types';
import { CURRENT_STUDENT } from '../data/examData';
import { DraggableCameraPreview } from './DraggableCameraPreview';

interface ParikshVisionExamRoomProps {
  quiz: QuizDetail;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onBackToDashboard: () => void;
}

export const ParikshVisionExamRoom: React.FC<ParikshVisionExamRoomProps> = ({
  quiz,
  darkMode,
  onToggleDarkMode,
  onBackToDashboard,
}) => {
  // Questions array initialized
  const [questions, setQuestions] = useState<Question[]>(() =>
    quiz.questions.map((q) => ({ ...q, status: QuestionStatus.NOT_VISITED }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Palette drawer & UI state
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [warningToast, setWarningToast] = useState<string | null>(null);

  // 25-minute timer
  const [secondsRemaining, setSecondsRemaining] = useState(quiz.timeLimitMinutes * 60);

  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Countdown timer effect
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Tab switch / window blur proctoring detector
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted) {
        setTabSwitchCount((prev) => prev + 1);
        setWarningToast(
          'Security Telemetry: Tab switch / window focus loss recorded by ParikshVision AI Proctor.'
        );
        setTimeout(() => setWarningToast(null), 5000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSubmitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Option selection
  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  // Clear current option
  const handleClearResponse = () => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  // Toggle review flag
  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  // Save & Next (Forward-Only Progression)
  const handleSaveAndNext = () => {
    // Update question status in memory
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx === currentIndex) {
          return {
            ...q,
            userSelectedOption: selectedAnswers[q.id],
            status: selectedAnswers[q.id]
              ? QuestionStatus.ANSWERED
              : QuestionStatus.NOT_ANSWERED,
          };
        }
        return q;
      })
    );

    if (isLastQuestion) {
      setShowSubmitModal(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Final submit
  const handleSubmitExam = () => {
    setShowSubmitModal(false);
    setIsSubmitted(true);
  };

  // Score computation
  const correctCount = questions.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctOption ? acc + 1 : acc;
  }, 0);
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  // 1. SUBMITTED ATTEMPT VIEW
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 transition-colors">
        <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Examination Successfully Submitted
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {quiz.title} • {quiz.courseName}
              </p>
            </div>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden text-xs divide-y divide-zinc-100 dark:divide-zinc-800">
            <div className="grid grid-cols-2 p-3 bg-zinc-50 dark:bg-zinc-800/60 font-medium">
              <span className="text-zinc-500">Candidate</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {CURRENT_STUDENT.name} ({CURRENT_STUDENT.rollNumber})
              </span>
            </div>
            <div className="grid grid-cols-2 p-3">
              <span className="text-zinc-500">Status</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Completed & Cryptographically Sealed
              </span>
            </div>
            <div className="grid grid-cols-2 p-3">
              <span className="text-zinc-500">Questions Answered</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {Object.keys(selectedAnswers).length} of {totalQuestions}
              </span>
            </div>
            <div className="grid grid-cols-2 p-3">
              <span className="text-zinc-500">Proctoring Telemetry</span>
              <span className="text-zinc-800 dark:text-zinc-200">
                {tabSwitchCount === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Clean session (0 focus lost)
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">
                    {tabSwitchCount} tab switch/focus warning(s) logged
                  </span>
                )}
              </span>
            </div>
            <div className="grid grid-cols-2 p-3 bg-zinc-50 dark:bg-zinc-800/60 font-semibold text-sm">
              <span>Score Evaluation</span>
              <span className="text-zinc-900 dark:text-white font-bold">
                {correctCount}.00 / {totalQuestions}.00 ({scorePercent}%)
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onBackToDashboard}
              className="py-2.5 px-5 rounded-lg bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              Return to Course Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors relative">
      {/* 1. DISTRACTION-FREE TOP BAR (No sidebars!) */}
      <header className="sticky top-0 z-30 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Brand & Quiz title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold truncate text-zinc-900 dark:text-zinc-100 leading-tight">
                {quiz.title}
              </span>
              <span className="text-[10px] text-zinc-400">
                Forward-Only Progression • Q{currentIndex + 1} of {totalQuestions}
              </span>
            </div>
          </div>

          {/* Center: Countdown Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-mono text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Time Left:</span>
            <span
              className={`font-bold ${
                secondsRemaining < 120
                  ? 'text-red-600 dark:text-red-400 animate-pulse'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {formatTime(secondsRemaining)}
            </span>
          </div>

          {/* Right: Palette Toggle & Dark/Light Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Palette</span>
              <span className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.2 rounded text-[11px]">
                {currentIndex + 1}/{totalQuestions}
              </span>
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. THE FLOATING, DRAGGABLE, COLLAPSIBLE "REC MONITORING" CAMERA PREVIEW */}
      <DraggableCameraPreview candidate={CURRENT_STUDENT} isExamStarted={true} />

      {/* Proctoring Warning Toast (if user blurs/switches tab) */}
      {warningToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-zinc-900 text-white border border-amber-500/60 shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-top duration-200 max-w-md">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{warningToast}</span>
        </div>
      )}

      {/* 3. MAIN DISTRACTION-FREE MCQ CANVAS */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Question Metadata Bar */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Question {currentIndex + 1}
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-500">
                {selectedAnswers[currentQuestion.id] ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Response Selected
                  </span>
                ) : (
                  'Not yet answered'
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-zinc-500">
                Marks: +{currentQuestion.correctMarks.toFixed(2)} / -{currentQuestion.negativeMarks.toFixed(2)}
              </span>
              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  flaggedQuestions[currentQuestion.id]
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>
          </div>

          {/* Question Content Box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              {currentQuestion.section}
            </span>

            {/* Clean 2-line prompt (no massive code blocks!) */}
            <p className="text-sm sm:text-base font-normal text-zinc-900 dark:text-zinc-100 leading-relaxed">
              {currentQuestion.prompt}
            </p>

            {/* 4 Clean Monochrome MCQ Radio Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                return (
                  <label
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full flex items-start gap-3 p-3.5 rounded-lg border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs ring-1 ring-zinc-900 dark:ring-white'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-zinc-900 bg-zinc-900 dark:border-white dark:bg-white'
                            : 'border-zinc-400 dark:border-zinc-600'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-900" />
                        )}
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm leading-relaxed">
                      <span className="font-bold mr-2">{option.id}.</span>
                      <span>{option.text}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. FORWARD-ONLY NAVIGATION ACTION BAR */}
        <div className="pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800 mt-6">
          <div className="flex flex-col items-start gap-1 text-xs">
            <button
              onClick={handleClearResponse}
              disabled={!selectedAnswers[currentQuestion.id]}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Clear selected response
            </button>
            <span className="text-[11px] text-zinc-400">
              Forward-only mode active: responses are locked once you advance.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleSaveAndNext}
              className="w-full sm:w-auto min-w-36 py-2.5 px-6 rounded-lg bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isLastQuestion ? 'Review & Submit Exam' : 'Save & Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* 5. STRICT FORWARD-ONLY QUESTION PALETTE (PAST QUESTIONS LOCKED/DISABLED) */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsPaletteOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
          />

          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 h-full p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Question Palette
                  </h3>
                </div>
                <button
                  onClick={() => setIsPaletteOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Forward-only Notice Banner */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 leading-tight">
                <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>
                  Past questions (&lt; Q{currentIndex + 1}) are permanently locked.
                </span>
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-500 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-zinc-900 dark:bg-white" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800" />
                  <span>Not answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded ring-2 ring-zinc-900 dark:ring-white" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <Lock className="w-2 h-2 text-zinc-500" />
                  </div>
                  <span>Locked Past</span>
                </div>
              </div>

              {/* Question Cells Matrix (Past questions are locked/disabled) */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isPastLocked = idx < currentIndex;
                  const isAnswered = !!selectedAnswers[q.id];
                  const isFlagged = !!flaggedQuestions[q.id];

                  if (isPastLocked) {
                    return (
                      <button
                        key={q.id}
                        disabled={true}
                        className="relative h-10 rounded-lg text-xs font-semibold flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-800 cursor-not-allowed line-through opacity-50"
                        title={`Question ${idx + 1} is locked. Previous questions cannot be revisited.`}
                      >
                        <span>{idx + 1}</span>
                        <Lock className="w-2.5 h-2.5 absolute bottom-1 text-zinc-400" />
                      </button>
                    );
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPaletteOpen(false);
                      }}
                      className={`relative h-10 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-2 border-zinc-900 dark:border-white font-bold bg-zinc-50 dark:bg-zinc-800'
                          : isAnswered
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                          : 'border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {isFlagged && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Finish Attempt */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => {
                  setIsPaletteOpen(false);
                  setShowSubmitModal(true);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition-colors cursor-pointer"
              >
                Submit all and finish...
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUBMISSION CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowSubmitModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-2xs"
          />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Submit Examination?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Once submitted, your answers will be committed to the institutional ledger and cannot be modified.
            </p>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Questions:</span>
                <span className="font-bold">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Answered:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {Object.keys(selectedAnswers).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Unanswered:</span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  {totalQuestions - Object.keys(selectedAnswers).length}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="py-2 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Return to Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="py-2 px-5 rounded-lg bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold cursor-pointer"
              >
                Confirm & Seal Attempt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
