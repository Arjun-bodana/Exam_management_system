import React, { useState, useEffect } from 'react';
import { PARIKSHVISION_COURSES, PARIKSHVISION_QUIZZES, CURRENT_STUDENT } from './data/examData';
import { ParikshVisionLogin } from './components/ParikshVisionLogin';
import { ParikshVisionHeader } from './components/ParikshVisionHeader';
import { ParikshVisionSidebar } from './components/ParikshVisionSidebar';
import { ParikshVisionDashboard } from './components/ParikshVisionDashboard';
import { ParikshVisionPreExam } from './components/ParikshVisionPreExam';
import { ParikshVisionExamRoom } from './components/ParikshVisionExamRoom';

type AppStep = 'login' | 'dashboard' | 'pre-exam' | 'exam';

export default function App() {
  // Progressive Disclosure Step State
  const [currentStep, setCurrentStep] = useState<AppStep>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('CS547');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('quiz-cs547-01');

  // Layout & Theme State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('parikshvision_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Dark mode effect sync
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('parikshvision_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('parikshvision_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const activeCourse =
    PARIKSHVISION_COURSES.find((c) => c.id === selectedCourseId) || PARIKSHVISION_COURSES[0];
  const activeQuiz =
    PARIKSHVISION_QUIZZES[selectedQuizId] || PARIKSHVISION_QUIZZES['quiz-cs547-01'];

  // Navigation handlers
  const handleLoginSuccess = () => {
    setCurrentStep('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentStep('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentStep('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setCurrentStep('pre-exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExam = () => {
    setCurrentStep('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCourse = () => {
    setCurrentStep('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full max-w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased overflow-x-hidden transition-colors flex flex-col font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900">
      {/* STEP 1: LOGIN SCREEN (No header or sidebar) */}
      {currentStep === 'login' && (
        <ParikshVisionLogin
          onLoginSuccess={handleLoginSuccess}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}

      {/* STEP 4: EXAM ROOM (Distraction-free zone, sidebars completely hidden) */}
      {currentStep === 'exam' && (
        <ParikshVisionExamRoom
          quiz={activeQuiz}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onBackToDashboard={handleBackToCourse}
        />
      )}

      {/* STEPS 2 & 3: PARIKSHVISION DASHBOARD & PRE-EXAM BRIEFING */}
      {currentStep !== 'login' && currentStep !== 'exam' && (
        <>
          {/* Header */}
          <ParikshVisionHeader
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onLogout={handleLogout}
            onGoToDashboard={handleBackToCourse}
            activeCourseCode={activeCourse.code}
          />

          {/* Quick Step Bar */}
          <div className="bg-zinc-100 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800 text-[11px] px-4 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Step:</span>
              <button
                onClick={handleLogout}
                className="hover:underline cursor-pointer"
              >
                1. Sign In
              </button>
              <span>/</span>
              <button
                onClick={handleBackToCourse}
                className={`cursor-pointer hover:underline ${
                  currentStep === 'dashboard'
                    ? 'font-bold text-zinc-900 dark:text-zinc-100'
                    : ''
                }`}
              >
                2. Courses & Curriculum
              </button>
              <span>/</span>
              <button
                onClick={() => handleSelectQuiz(selectedQuizId)}
                className={`cursor-pointer hover:underline ${
                  currentStep === 'pre-exam'
                    ? 'font-bold text-zinc-900 dark:text-zinc-100'
                    : ''
                }`}
              >
                3. Pre-Exam Briefing
              </button>
              <span>/</span>
              <button
                onClick={handleStartExam}
                className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer"
              >
                4. Exam Room →
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[11px]">
              <span>Candidate: {CURRENT_STUDENT.name}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Node Connected
              </span>
            </div>
          </div>

          {/* Main Layout Container (Sidebar + Content) */}
          <div className="flex-1 flex flex-col lg:flex-row w-full max-w-full">
            {/* Collapsible Left Sidebar */}
            <ParikshVisionSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              selectedCourseId={selectedCourseId}
              onSelectCourse={handleSelectCourse}
              onGoToDashboard={handleBackToCourse}
              activeStep={currentStep}
            />

            {/* Content Area */}
            <main className="flex-1 min-w-0 overflow-x-hidden">
              {currentStep === 'dashboard' && (
                <ParikshVisionDashboard
                  selectedCourseId={selectedCourseId}
                  onSelectCourse={handleSelectCourse}
                  onSelectQuiz={handleSelectQuiz}
                />
              )}

              {currentStep === 'pre-exam' && (
                <ParikshVisionPreExam
                  quiz={activeQuiz}
                  onGoBackToCourse={handleBackToCourse}
                  onStartExam={handleStartExam}
                />
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}
