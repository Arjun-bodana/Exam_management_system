import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  BadgeAlert,
  Eraser,
  Bookmark,
  ChevronRight,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Activity,
  Type,
  HelpCircle,
  Keyboard,
  Lock,
  EyeOff,
  LayoutGrid,
  Maximize2,
  Minimize2,
  X,
  Video,
  Play,
  ArrowLeft,
} from 'lucide-react';
import { Question, QuestionStatus, IncidentType, CandidateSession } from '../types';
import { BiometricProctorStream } from './BiometricProctorStream';
import { ScreenRecorderControl } from './ScreenRecorderControl';
import { QuestionPalette } from './QuestionPalette';
import { SecurityViolationModal } from './SecurityViolationModal';
import { ExamGuidelinesModal } from './ExamGuidelinesModal';
import { DraggableCameraPreview } from './DraggableCameraPreview';

interface StudentExamRoomProps {
  candidate: CandidateSession;
  questions: Question[];
  onUpdateQuestions: (questions: Question[]) => void;
  onLogIncident: (incident: any) => void;
  onFinalSubmit: () => void;
  proctorBroadcastMessage?: string | null;
  onGoBack?: () => void;
  onGoBackToReadiness?: () => void;
}

export const StudentExamRoom: React.FC<StudentExamRoomProps> = ({
  candidate,
  questions,
  onUpdateQuestions,
  onLogIncident,
  onFinalSubmit,
  proctorBroadcastMessage,
  onGoBack,
  onGoBackToReadiness,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(25); // Default to question 25 as in prompt screenshot
  const [secondsRemaining, setSecondsRemaining] = useState(1 * 3600 + 42 * 60 + 15); // 01:42:15
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(() => new Set([25]));
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [blurCount, setBlurCount] = useState(candidate.tabSwitchCount || 1);
  const [webcamActive, setWebcamActive] = useState(candidate.webcamActive);
  const [micActive, setMicActive] = useState(candidate.micActive);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'synced' | 'saving'>('synced');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile-specific responsive states
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isMobileCameraMinimized, setIsMobileCameraMinimized] = useState(false);
  const [showMobileFloatingCamera, setShowMobileFloatingCamera] = useState(true);

  const currentQ = questions.find((q) => q.id === currentQuestionIndex) || questions[0];

  // Track visited questions to detect when candidate has reached/visited all questions
  useEffect(() => {
    setVisitedQuestions((prev) => new Set([...prev, currentQuestionIndex]));
  }, [currentQuestionIndex]);

  const isFinalQuestion = currentQuestionIndex === questions.length || currentQuestionIndex === 60;
  const hasReachedAllQuestions = visitedQuestions.size >= questions.length || isFinalQuestion;

  const handleStartExam = () => {
    setIsExamStarted(true);
    setWebcamActive(true);
    setMicActive(true);
    setToastMessage('Exam Started: Live REC Monitoring & Biometric AI Proctoring Active');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Live countdown timer - counts down ONLY after exam has started
  useEffect(() => {
    if (!isExamStarted) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamStarted]);

  const formatTimer = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // 2. Real Tab-Switching and Window Blur Detection (Page Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerTabSwitchIncident('Page Visibility API: Document visibility switched to hidden (tab change or minimized)');
      }
    };

    const handleWindowBlur = () => {
      triggerTabSwitchIncident('Window Blur Event: Candidate window lost focus or split-screen action detected');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [blurCount]);

  const triggerTabSwitchIncident = (reason: string) => {
    const newCount = blurCount + 1;
    setBlurCount(newCount);

    const nowUtc = new Date().toISOString().substring(11, 19) + ' UTC';
    const incident = {
      id: `SEC-VIOLATION-${Math.floor(10000 + Math.random() * 90000)}-E`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      timestamp: nowUtc,
      type: IncidentType.TAB_SWITCH,
      confidence: 99.8,
      details: reason,
      evidenceSnapshotUrl: candidate.avatarUrl,
      blurCount: newCount,
      reviewed: false,
    };

    onLogIncident(incident);
    setIsViolationModalOpen(true);
  };

  // Manual test trigger for tab switch
  const simulateTabSwitch = () => {
    triggerTabSwitchIncident('Manual Anti-Cheat Test: Simulated Tab Switch / Split-Screen Breach');
  };

  // 3. Question Actions
  const handleSelectOption = (optionId: string) => {
    if (!isExamStarted) {
      handleStartExam();
    }
    setAutoSaveStatus('saving');
    const updated = questions.map((q) => {
      if (q.id === currentQuestionIndex) {
        return {
          ...q,
          userSelectedOption: optionId,
          status: QuestionStatus.ANSWERED,
        };
      }
      return q;
    });
    onUpdateQuestions(updated);
    setTimeout(() => {
      setAutoSaveStatus('synced');
      setToastMessage(`Selected Option (${optionId}) for Q${currentQuestionIndex} — Saved`);
      setTimeout(() => setToastMessage(null), 2000);
    }, 300);
  };

  const handleClearResponse = () => {
    if (!isExamStarted) {
      handleStartExam();
    }
    setAutoSaveStatus('saving');
    const updated = questions.map((q) => {
      if (q.id === currentQuestionIndex) {
        return {
          ...q,
          userSelectedOption: undefined,
          status: QuestionStatus.NOT_ANSWERED,
        };
      }
      return q;
    });
    onUpdateQuestions(updated);
    setTimeout(() => {
      setAutoSaveStatus('synced');
      setToastMessage(`Cleared response for Question ${currentQuestionIndex}`);
      setTimeout(() => setToastMessage(null), 2000);
    }, 300);
  };

  const handleMarkForReviewAndNext = () => {
    if (!isExamStarted) {
      handleStartExam();
    }
    setAutoSaveStatus('saving');
    const updated = questions.map((q) => {
      if (q.id === currentQuestionIndex) {
        return {
          ...q,
          status: QuestionStatus.MARKED_FOR_REVIEW,
        };
      }
      return q;
    });
    onUpdateQuestions(updated);
    setTimeout(() => {
      setAutoSaveStatus('synced');
      setToastMessage(`Marked Q${currentQuestionIndex} for Review`);
      setTimeout(() => setToastMessage(null), 2000);
    }, 300);

    // Jump next or notify if on final question
    if (currentQuestionIndex < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setToastMessage('You have reached the final question. Review responses or click Submit.');
    }
  };

  const handleSaveAndNext = () => {
    if (!isExamStarted) {
      handleStartExam();
    }
    setAutoSaveStatus('saving');
    const updated = questions.map((q) => {
      if (q.id === currentQuestionIndex) {
        const isAnswered = !!q.userSelectedOption;
        return {
          ...q,
          status: isAnswered ? QuestionStatus.ANSWERED : QuestionStatus.NOT_ANSWERED,
        };
      }
      return q;
    });
    onUpdateQuestions(updated);
    setTimeout(() => setAutoSaveStatus('synced'), 300);

    // Jump next
    if (currentQuestionIndex < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setToastMessage('You have reached the final question. Review responses or click Submit.');
      onFinalSubmit();
    }
  };

  const handleFinalQuestionSubmit = () => {
    if (!isExamStarted) {
      handleStartExam();
    }
    setAutoSaveStatus('saving');
    const updated = questions.map((q) => {
      if (q.id === currentQuestionIndex) {
        const isAnswered = !!q.userSelectedOption;
        return {
          ...q,
          status: isAnswered ? QuestionStatus.ANSWERED : QuestionStatus.NOT_ANSWERED,
        };
      }
      return q;
    });
    onUpdateQuestions(updated);
    setTimeout(() => setAutoSaveStatus('synced'), 200);

    setToastMessage('You have reached the final question. Review responses or click Submit.');
    onFinalSubmit();
  };

  const handleNavigateForward = (targetId: number) => {
    if (targetId < currentQuestionIndex) {
      setToastMessage('Past questions are locked. Forward navigation only.');
      return;
    }
    if (targetId > questions.length) return;
    setCurrentQuestionIndex(targetId);
  };

  // Keyboard navigation shortcuts for high user-friendliness (Forward-Only)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is inside an input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        handleSaveAndNext();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSaveAndNext();
      } else if (e.key === 'ArrowLeft' || (e.altKey && (e.key === 'p' || e.key === 'P' || e.key === 'b' || e.key === 'B'))) {
        e.preventDefault();
        setToastMessage('Navigation locked: You cannot return to previous questions.');
      } else if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        handleMarkForReviewAndNext();
      } else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        handleClearResponse();
      } else if (!e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === '1' || e.key === 'a' || e.key === 'A') {
          handleSelectOption('A');
        } else if (e.key === '2' || e.key === 'b' || e.key === 'B') {
          handleSelectOption('B');
        } else if (e.key === '3' || e.key === 'c' || e.key === 'C') {
          handleSelectOption('C');
        } else if (e.key === '4' || e.key === 'd' || e.key === 'D') {
          handleSelectOption('D');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, questions]);

  const handleToggleSection = () => {
    if (currentQuestionIndex <= 20) {
      handleNavigateForward(25);
    } else {
      setToastMessage('Cannot return to Section A. Past questions are locked.');
    }
  };

  const answeredCount = questions.filter((q) => q.status === QuestionStatus.ANSWERED).length;
  const markedCount = questions.filter((q) => q.status === QuestionStatus.MARKED_FOR_REVIEW).length;
  const notVisitedCount = questions.filter((q) => q.status === QuestionStatus.NOT_VISITED).length;

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      {/* Security Violation Modal */}
      <SecurityViolationModal
        isOpen={isViolationModalOpen}
        onClose={() => setIsViolationModalOpen(false)}
        blurCount={blurCount}
        incidentRef="SEC-VIOLATION-04928-E"
        timestamp={new Date().toISOString().substring(11, 19) + ' UTC'}
        violationMessage="Tab switching, split-screen action, or loss of window focus detected"
      />

      {/* Student Exam Guidelines & Code of Conduct Modal */}
      <ExamGuidelinesModal
        isOpen={isGuidelinesModalOpen}
        onClose={() => setIsGuidelinesModalOpen(false)}
      />

      {/* Keyboard Shortcuts Helper Modal */}
      {showShortcutsHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-[#cbd5e1] max-w-md w-full p-5 text-[#0b1c30]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-[#316bf3]" />
                <h3 className="font-bold text-sm">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="py-3 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span>Save Response & Next Question</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">Alt + N</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-amber-50 border border-amber-200">
                <span className="font-semibold text-amber-900">Forward-Only Exam Rule</span>
                <span className="text-[11px] font-bold text-amber-800">Past Questions Locked</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span>Mark for Review & Next</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">Alt + M</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span>Clear Selection</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">Alt + C</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span>Select Option A / B / C / D</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">1 / 2 / 3 / 4</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcutsHelp(false)}
              className="w-full bg-[#316bf3] hover:bg-[#0051d5] text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Proctor Broadcast / Warning Toast */}
      {proctorBroadcastMessage && (
        <div className="sticky top-16 z-40 bg-[#ffdad6] border-b-2 border-[#ba1a1a] text-[#93000a] px-4 py-2.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-base text-[#ba1a1a]">campaign</span>
            <span>PROCTOR ANNOUNCEMENT:</span>
            <span className="font-medium text-[#0b1c30]">{proctorBroadcastMessage}</span>
          </div>
          <span className="text-[10px] bg-white/70 px-2 py-0.5 rounded uppercase font-bold font-mono">
            Direct High-Priority Feed
          </span>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-[#3f465c] animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#316bf3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Workspace Sub-Header & Live Institutional Telemetry Ribbon */}
      <section className="w-full bg-[#eff4ff] px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2.5 shadow-xs border-b border-[#dce9ff] flex flex-col xl:flex-row xl:items-center justify-between gap-2 sm:gap-3">
        {/* Candidate Identification Chipset & Back Option */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-2.5">
          {/* Back Option Button */}
          <button
            onClick={() => {
              if (isExamStarted) {
                setIsExitModalOpen(true);
              } else if (onGoBack) {
                onGoBack();
              } else if (onGoBackToReadiness) {
                onGoBackToReadiness();
              } else {
                setIsGuidelinesModalOpen(true);
              }
            }}
            id="examRoomSubHeaderBackButton"
            className="flex items-center gap-1 sm:gap-1.5 bg-white hover:bg-slate-100 text-[#0b1c30] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-[#c6c6cd] text-[10px] sm:text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer shrink-0 active:scale-95"
            title="Go back to previous screen or readiness check"
          >
            <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0051d5]" />
            <span>Back</span>
          </button>

          {/* Roll No Badge */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-white px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded border border-[#c6c6cd]/50 shadow-2xs">
            <span className="material-symbols-outlined text-[#0051d5] text-xs sm:text-base md:text-lg leading-none">badge</span>
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[9px] md:text-[10px] text-[#45464d] uppercase font-bold leading-tight">Roll No</span>
              <span className="text-[10px] sm:text-xs text-[#0b1c30] font-bold truncate leading-tight">{candidate.rollNumber}</span>
            </div>
          </div>

          {/* Candidate Badge */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-white px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded border border-[#c6c6cd]/50 shadow-2xs">
            <span className="material-symbols-outlined text-[#0051d5] text-xs sm:text-base md:text-lg leading-none">person</span>
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[9px] md:text-[10px] text-[#45464d] uppercase font-bold leading-tight">Candidate</span>
              <span className="text-[10px] sm:text-xs text-[#0b1c30] font-bold truncate max-w-[75px] sm:max-w-[120px] md:max-w-none leading-tight">{candidate.name}</span>
            </div>
          </div>

          {/* Paper Code Badge */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-[#c6c6cd]/50 shadow-2xs">
            <span className="material-symbols-outlined text-[#0051d5] text-xs sm:text-base md:text-lg leading-none">menu_book</span>
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[9px] md:text-[10px] text-[#45464d] uppercase font-bold leading-tight">Paper</span>
              <span className="text-[10px] sm:text-xs text-[#0b1c30] font-bold truncate leading-tight">{candidate.paperCode}</span>
            </div>
          </div>

          {/* Guidelines & Rules Button */}
          <button
            onClick={() => setIsGuidelinesModalOpen(true)}
            className="flex items-center gap-1 bg-white hover:bg-[#dce9ff] text-[#0051d5] px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 rounded text-[10px] sm:text-xs font-semibold transition-colors cursor-pointer border border-[#c6c6cd]/60 shrink-0"
            title="Read Exam Guidelines & Marking Scheme"
          >
            <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0051d5]" />
            <span className="hidden sm:inline">Guidelines</span>
            <span className="sm:hidden">Rules</span>
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            onClick={() => setShowShortcutsHelp(true)}
            className="hidden md:flex items-center gap-1 bg-white hover:bg-[#dce9ff] text-[#45464d] px-2 py-1 md:px-2.5 md:py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer border border-[#c6c6cd]/60 shrink-0"
            title="View Keyboard Navigation Shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5 text-slate-500" />
            <span>Shortcuts</span>
          </button>

          {/* Incident trigger badge */}
          <button
            onClick={() => setIsViolationModalOpen(true)}
            className="flex items-center gap-1 bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab] px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 rounded text-[10px] sm:text-xs font-semibold transition-colors cursor-pointer border border-[#ffb4ab] shrink-0"
          >
            <span className="material-symbols-outlined text-xs sm:text-sm md:text-base leading-none">crisis_alert</span>
            <span>Alerts ({blurCount})</span>
          </button>

          {/* Simulate Tab Switch Test Button */}
          <button
            onClick={simulateTabSwitch}
            className="flex items-center gap-1 bg-[#131b2e] hover:bg-[#213145] text-white px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 rounded text-[10px] sm:text-[11px] font-bold transition-all shadow-xs cursor-pointer shrink-0"
            title="Trigger Tab-Switch Security Breach Modal"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Test Tab-Switch</span>
            <span className="sm:hidden">Breach</span>
          </button>

          {/* Mobile Full Palette Opener Button */}
          <button
            onClick={() => setIsMobilePaletteOpen(true)}
            className="xl:hidden flex items-center gap-1 bg-[#316bf3] hover:bg-[#0051d5] text-white px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 rounded text-[10px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
            title="Open Question Palette & Submit Examination"
          >
            <LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Palette (60)</span>
          </button>
        </div>

        {/* Countdown Timer & System Latency Bar */}
        <div className="flex items-center justify-between xl:justify-end gap-1.5 sm:gap-3 w-full xl:w-auto pt-1 xl:pt-0 border-t xl:border-t-0 border-[#dce9ff]">
          <div className="hidden 2xl:flex items-center gap-2 text-right">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#45464d] uppercase font-bold">Client Latency</span>
              <span className="text-xs text-[#0051d5] font-semibold font-mono">11.8 ms (Stable)</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:hidden text-[10px] sm:text-[11px] text-[#45464d]">
            <span className="font-bold text-[#0b1c30]">Paper:</span>
            <span className="truncate max-w-[130px]">{candidate.paperCode}</span>
          </div>

          {/* REC Monitoring Status & Start Test Action */}
          {!isExamStarted ? (
            <button
              onClick={handleStartExam}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 md:px-3 md:py-1.5 rounded text-[10px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 animate-pulse"
              title="Click to Start Exam and turn ON REC monitoring"
            >
              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" />
              <span>Start Exam (REC ON)</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-mono">REC ● ON</span>
            </div>
          )}

          {/* High-Visibility Countdown Display (TCS iON Standard Box) */}
          <div className="flex items-center bg-[#131b2e] text-white px-1.5 py-0.5 sm:px-2.5 sm:py-1 md:px-3.5 rounded shadow-md gap-1.5 sm:gap-2 md:gap-3 border border-[#3f465c]/50 shrink-0 ml-auto xl:ml-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span
                className={`material-symbols-outlined ${
                  isExamStarted ? 'text-[#ba1a1a] animate-pulse' : 'text-amber-400'
                } text-xs sm:text-base md:text-lg leading-none`}
              >
                timer
              </span>
              <span className="text-[8.5px] sm:text-[10px] md:text-[11px] uppercase tracking-wider text-[#7c839b] font-bold">
                {isExamStarted ? 'Time Left' : 'Duration'}
              </span>
            </div>
            <span
              id="examTimer"
              className="text-xs sm:text-[15px] md:text-[18px] text-white font-mono font-bold tracking-normal sm:tracking-widest bg-[#000000]/60 px-1 sm:px-1.5 md:px-2 py-0.5 rounded border border-white/10"
            >
              {formatTimer(secondsRemaining)}
            </span>
            {!isExamStarted && (
              <span className="hidden sm:inline-block text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                Standby
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Live Question Status Summary Micro-Bar (Horizontally scrollable on phones) */}
      <section className="w-full bg-[#e5eeff] px-3 sm:px-4 lg:px-6 py-1.5 flex items-center justify-between gap-2 border-b border-[#dce9ff] overflow-x-auto text-xs whitespace-nowrap">
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-[11px] text-[#45464d] uppercase font-bold">Total:</span>
            <span className="text-xs text-[#0b1c30] font-bold">60 Qs</span>
          </div>
          <span className="text-[#c6c6cd]">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#316bf3]"></span>
            <span className="text-[11px] text-[#0b1c30] font-medium">
              Ans: <strong className="text-[#0b1c30] font-bold">{answeredCount}</strong>
            </span>
          </div>
          <span className="text-[#c6c6cd]">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f63a35]"></span>
            <span className="text-[11px] text-[#0b1c30] font-medium">
              Review: <strong className="text-[#0b1c30] font-bold">{markedCount}</strong>
            </span>
          </div>
          <span className="text-[#c6c6cd]">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#76777d]"></span>
            <span className="text-[11px] text-[#0b1c30] font-medium">
              Unvisited: <strong className="text-[#0b1c30] font-bold">{notVisitedCount}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 pl-2">
          <div className="hidden sm:flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded border border-[#cbdbf5] text-[10.5px]">
            <Lock className="w-3 h-3 text-[#0051d5]" />
            <span className="text-[#0b1c30] font-medium">Single-Student Private Feed</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#45464d] uppercase font-bold">Auto-Save:</span>
            <span className="text-[11px] text-[#0051d5] font-medium flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  autoSaveStatus === 'saving' ? 'bg-amber-500 animate-ping' : 'bg-[#0051d5] animate-pulse'
                }`}
              ></span>
              {autoSaveStatus === 'saving' ? 'Saving...' : 'Sync OK'}
            </span>
          </div>
        </div>
      </section>

      {/* MOBILE-ONLY Horizontal Quick-Jump Question Strip (1 to 60) */}
      <div className="lg:hidden w-full bg-white px-2 py-1.5 border-b border-[#e2e8f0] flex items-center gap-1.5 overflow-x-auto max-w-full">
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 shrink-0 pr-1">
          <Lock className="w-3 h-3 text-amber-700" />
          <span>Jump:</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {questions.map((q) => {
            const isCurrent = q.id === currentQuestionIndex;
            const isPastLocked = q.id < currentQuestionIndex;

            if (isPastLocked) {
              return (
                <button
                  key={q.id}
                  disabled={true}
                  className="w-7 h-7 rounded text-[11px] flex items-center justify-center border border-slate-200 bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed line-through shrink-0 select-none"
                  title={`Question ${q.id} is locked.`}
                >
                  {q.id}
                </button>
              );
            }

            let pillClass = 'bg-[#eff4ff] text-[#45464d] border-[#cbdbf5]';
            if (isCurrent) {
              pillClass = 'bg-black text-white font-extrabold ring-2 ring-[#316bf3] scale-105';
            } else if (q.status === QuestionStatus.ANSWERED) {
              pillClass = 'bg-[#316bf3] text-white font-bold';
            } else if (q.status === QuestionStatus.MARKED_FOR_REVIEW) {
              pillClass = 'bg-[#f63a35] text-white font-bold';
            } else if (q.status === QuestionStatus.NOT_ANSWERED) {
              pillClass = 'bg-[#d3e4fe] text-[#0b1c30] font-bold';
            }

            return (
              <button
                key={q.id}
                onClick={() => handleNavigateForward(q.id)}
                className={`w-7 h-7 rounded text-[11px] flex items-center justify-center border transition-all cursor-pointer shrink-0 ${pillClass}`}
                title={`Question ${q.id}`}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Structured Examination Core Split - Strict Mobile-First Flex Layout */}
      <main className="w-full max-w-full overflow-x-hidden px-2 sm:px-4 md:px-6 py-2 sm:py-4 flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
        {/* LEFT / TOP REGION: Question Stimulus, Options, Bottom Actions (flex-1 on lg) */}
        <div className="w-full lg:flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
          {/* Pre-Exam Ready / REC Standby Banner */}
          {!isExamStarted && (
            <div className="w-full bg-[#131b2e] text-white p-3.5 sm:p-4 rounded-lg shadow-md border-2 border-[#316bf3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#316bf3]/20 border border-[#316bf3]/40 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Video className="w-5 h-5 text-[#86a8ff]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold tracking-wide">
                      EXAMINATION READY • REC MONITORING ON STANDBY
                    </span>
                    <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                      REC OFF
                    </span>
                  </div>
                  <p className="text-[11px] text-[#dae2fd]/85 mt-0.5 leading-snug">
                    Continuous camera recording and biometric proctoring are on standby. Click <strong>Start Exam</strong> below to begin the countdown timer and turn <strong>ON</strong> live REC monitoring.
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartExam}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-md shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Exam & Turn REC ON</span>
              </button>
            </div>
          )}

          {/* Question Container Card */}
          <div className="w-full bg-white rounded-lg shadow-xs p-3 sm:p-4 md:p-6 flex flex-col gap-4 border border-[#e2e8f0] min-w-0">
            {/* Question Meta-Data Header with Font Sizer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 bg-[#eff4ff] -mx-3 -mt-3 sm:-mx-4 sm:-mt-4 md:-mx-6 md:-mt-6 p-3 sm:p-4 md:p-5 rounded-t-lg border-b border-[#dce9ff]">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="bg-[#000000] text-white text-xs px-2.5 py-1 rounded font-black uppercase tracking-wider shrink-0">
                  Question {currentQ.id}
                </span>
                <div className="flex flex-col min-w-0 truncate">
                  <span className="text-xs sm:text-sm md:text-[15px] text-[#0b1c30] font-bold leading-tight truncate">
                    {currentQ.section}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#45464d] truncate">{currentQ.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* User-Friendly Font Size Adjuster */}
                <div className="flex items-center bg-white rounded border border-[#cbdbf5] p-0.5 text-xs shadow-2xs">
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                      fontSize === 'normal' ? 'bg-[#316bf3] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Normal font size"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-1.5 py-0.5 rounded text-[12px] font-bold cursor-pointer ${
                      fontSize === 'large' ? 'bg-[#316bf3] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Large font size"
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`px-1.5 py-0.5 rounded text-[13px] font-black cursor-pointer ${
                      fontSize === 'xlarge' ? 'bg-[#316bf3] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Extra large font size"
                  >
                    A++
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                  <span className="bg-[#d3e4fe] px-2 py-0.5 sm:py-1 rounded text-[#0b1c30] font-semibold border border-[#cbdbf5]">
                    +<span className="text-[#0051d5] font-bold">{currentQ.correctMarks.toFixed(1)}</span>
                  </span>
                  <span className="bg-[#ffdad6] px-2 py-0.5 sm:py-1 rounded text-[#93000a] font-semibold border border-[#ffb4ab]">
                    -<span className="text-[#ba1a1a] font-bold">{currentQ.negativeMarks.toFixed(1)}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Problem Description Statement - Minimal 2-line standard MCQ without any dummy code block */}
            <div className="space-y-3 pt-1 min-w-0">
              <p
                className={`text-[#0b1c30] font-medium leading-relaxed break-words ${
                  fontSize === 'normal'
                    ? 'text-sm sm:text-[15px]'
                    : fontSize === 'large'
                    ? 'text-base sm:text-[17px]'
                    : 'text-lg sm:text-[19px]'
                }`}
              >
                {currentQ.prompt}
              </p>

              {currentQ.subPrompt && (
                <p
                  className={`text-[#45464d] font-normal leading-relaxed break-words ${
                    fontSize === 'normal' ? 'text-xs sm:text-sm' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                  }`}
                >
                  {currentQ.subPrompt}
                </p>
              )}
            </div>

            {/* 4 Structured Radio Option Choices */}
            <div className="space-y-2 pt-1" id="optionsContainer">
              {currentQ.options.map((opt) => {
                const isChecked = currentQ.userSelectedOption === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`group flex items-start gap-3 p-2.5 sm:p-3 rounded-md cursor-pointer transition-all border ${
                      isChecked
                        ? 'bg-[#dce9ff] border-[#0051d5] shadow-xs ring-1 ring-[#0051d5]/40'
                        : 'bg-[#eff4ff] hover:bg-[#e5eeff] border-[#dce9ff]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`exam_q${currentQ.id}`}
                      value={opt.id}
                      checked={isChecked}
                      onChange={() => handleSelectOption(opt.id)}
                      className="mt-0.5 sm:mt-1 w-4 h-4 text-[#0051d5] accent-[#0051d5] cursor-pointer shrink-0"
                    />
                    <div className="flex items-start gap-2 text-[#0b1c30] min-w-0">
                      <span
                        className={`text-xs font-bold shrink-0 ${
                          isChecked ? 'text-[#0051d5]' : 'text-[#45464d] group-hover:text-[#0051d5]'
                        }`}
                      >
                        ({opt.id})
                      </span>
                      <span
                        className={`leading-relaxed break-words ${
                          fontSize === 'normal'
                            ? 'text-xs sm:text-[13.5px]'
                            : fontSize === 'large'
                            ? 'text-sm sm:text-[15px]'
                            : 'text-base sm:text-[17px]'
                        } ${isChecked ? 'font-semibold' : ''}`}
                      >
                        {opt.text}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Forward-Only Navigation UI Feedback Alert Note */}
          <div className="w-full flex items-center gap-2 text-xs text-amber-900 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="font-semibold">
              Note: You cannot return to previous questions once you move forward.
            </span>
          </div>

          {/* High-Contrast Institutional Action Bar */}
          <div className="w-full bg-white p-2.5 sm:p-3.5 rounded-lg shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 border border-[#e2e8f0]">
            {/* Secondary Actions (Clear & Mark) */}
            <div className="grid grid-cols-2 sm:flex items-center gap-2">
              <button
                onClick={handleClearResponse}
                className="bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] text-xs font-semibold px-3 py-2.5 sm:py-2 rounded transition-colors flex items-center justify-center gap-1.5 border border-[#c6c6cd]/50 cursor-pointer min-h-[44px] sm:min-h-0"
              >
                <Eraser className="w-3.5 h-3.5 text-[#45464d] shrink-0" />
                <span className="truncate">Clear</span>
              </button>

              <button
                onClick={handleMarkForReviewAndNext}
                className="bg-[#dce9ff] hover:bg-[#cbdbf5] text-[#0b1c30] text-xs font-semibold px-3 py-2.5 sm:py-2 rounded transition-colors flex items-center justify-center gap-1.5 border border-[#cbdbf5] cursor-pointer min-h-[44px] sm:min-h-0"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#f63a35] fill-[#f63a35] shrink-0" />
                <span className="truncate">Mark Review & Next</span>
              </button>
            </div>

            {/* Primary Forward Navigation & Submit */}
            <div className="flex items-center gap-2 justify-end">
              {isFinalQuestion ? (
                <button
                  onClick={handleFinalQuestionSubmit}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 sm:px-6 py-2.5 sm:py-2 rounded shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] sm:min-h-0 ring-2 ring-emerald-500/50 animate-pulse"
                  title="Save Question 60 and Submit Examination"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Submit Exam</span>
                </button>
              ) : (
                <button
                  onClick={handleSaveAndNext}
                  className="w-full sm:w-auto bg-[#316bf3] hover:bg-[#0051d5] text-white text-xs font-bold px-4 sm:px-6 py-2.5 sm:py-2 rounded shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] sm:min-h-0"
                  title="Save response and proceed to next question (Forward Only)"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              )}

              {/* Extra Submit button when all questions have been reached or answered */}
              {hasReachedAllQuestions && !isFinalQuestion && (
                <button
                  onClick={onFinalSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 sm:px-4 py-2.5 sm:py-2 rounded shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] sm:min-h-0"
                  title="Submit Examination (All questions reached)"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">Submit Exam</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT / BOTTOM REGION: Live AI Proctor Feed & TCS iON Question Palette (Stacks neatly below on mobile, side-by-side on lg) */}
        <aside className="w-full lg:w-80 xl:w-96 flex flex-col gap-4 shrink-0 min-w-0">
          {/* Live Biometric Proctoring Stream */}
          <BiometricProctorStream
            onTriggerAnomaly={(type, details) => {
              const nowUtc = new Date().toISOString().substring(11, 19) + ' UTC';
              onLogIncident({
                id: `SEC-AI-${Math.floor(10000 + Math.random() * 90000)}`,
                candidateId: candidate.id,
                candidateName: candidate.name,
                timestamp: nowUtc,
                type,
                confidence: 96.5,
                details,
                evidenceSnapshotUrl: candidate.avatarUrl,
                reviewed: false,
              });
            }}
            webcamActive={webcamActive}
            micActive={micActive}
            setWebcamActive={setWebcamActive}
            setMicActive={setMicActive}
            isExamStarted={isExamStarted}
          />

          {/* Screen Recorder Control */}
          <ScreenRecorderControl />

          {/* TCS iON Standard Color-Coded Palette Matrix */}
          <QuestionPalette
            questions={questions}
            currentQuestionId={currentQuestionIndex}
            onSelectQuestion={(id) => handleNavigateForward(id)}
            onSubmitExam={onFinalSubmit}
            currentSection={currentQ.section}
            onToggleSection={handleToggleSection}
          />
        </aside>
      </main>

      {/* DRAGGABLE & COLLAPSIBLE LIVE REC PROCTORING CAMERA OVERLAY */}
      {showMobileFloatingCamera && (
        <DraggableCameraPreview
          candidate={candidate}
          isMinimizedDefault={false}
          isExamStarted={isExamStarted}
        />
      )}

      {/* EXIT / BACK NAVIGATION CONFIRMATION MODAL */}
      {isExitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-300 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0b1c30]">
                  Exit Exam Room or Go Back?
                </h3>
                <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                  Your exam session is in progress with live REC recording. All your responses ({answeredCount} answered so far) are securely preserved in the encrypted buffer.
                </p>
              </div>
            </div>

            <div className="bg-[#eff4ff] p-3 rounded-lg border border-[#d3e4fe] text-xs space-y-1 text-[#0b1c30]">
              <div className="font-bold text-[#0051d5]">Candidate: {candidate.name} ({candidate.rollNumber})</div>
              <div>Current Question: #{currentQuestionIndex} of {questions.length}</div>
              <div className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Responses auto-saved & encrypted locally</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => setIsExitModalOpen(false)}
                className="w-full bg-[#316bf3] hover:bg-[#0051d5] text-white text-xs font-bold py-2.5 px-4 rounded-md transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue Exam (Stay Here)</span>
              </button>
              <button
                onClick={() => {
                  setIsExitModalOpen(false);
                  if (onGoBackToReadiness) {
                    onGoBackToReadiness();
                  } else if (onGoBack) {
                    onGoBack();
                  }
                }}
                className="w-full bg-white hover:bg-slate-100 text-[#0b1c30] border border-[#c6c6cd] text-xs font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#0051d5]" />
                <span>Go Back to Camera / System Check</span>
              </button>
              <button
                onClick={() => {
                  setIsExitModalOpen(false);
                  setIsGuidelinesModalOpen(true);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-[#45464d] text-xs font-medium py-1.5 px-4 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>View Exam Rules & Instructions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE-ONLY SLIDE-UP QUESTION PALETTE DRAWER */}
      {isMobilePaletteOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-3.5 bg-[#131b2e] text-white border-b border-[#3f465c]/40 shrink-0">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#316bf3]" />
                <span className="text-sm font-bold">Question Palette (60 Questions)</span>
              </div>
              <button
                onClick={() => setIsMobilePaletteOpen(false)}
                className="p-1.5 rounded-md hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Palette Body */}
            <div className="p-3.5 overflow-y-auto flex-1">
              <QuestionPalette
                questions={questions}
                currentQuestionId={currentQuestionIndex}
                onSelectQuestion={(id) => {
                  handleNavigateForward(id);
                  setIsMobilePaletteOpen(false);
                }}
                onSubmitExam={() => {
                  setIsMobilePaletteOpen(false);
                  onFinalSubmit();
                }}
                currentSection={currentQ.section}
                onToggleSection={handleToggleSection}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
