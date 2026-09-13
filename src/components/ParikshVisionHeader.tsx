import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Menu,
  Sun,
  Moon,
  Bell,
  User,
  LogOut,
  ChevronDown,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';
import { CURRENT_STUDENT } from '../data/examData';

interface ParikshVisionHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
  onGoToDashboard: () => void;
  activeCourseCode?: string;
}

export const ParikshVisionHeader: React.FC<ParikshVisionHeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onToggleSidebar,
  onLogout,
  onGoToDashboard,
  activeCourseCode,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Sidebar Toggle & ParikshVision Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation drawer"
            className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={onGoToDashboard}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                ParikshVision
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium -mt-0.5">
                Assessment Platform
              </span>
            </div>
          </button>

          {activeCourseCode && (
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-3 border-l border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
              <span>Active Course:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                {activeCourseCode}
              </span>
            </div>
          )}
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden border border-zinc-300 dark:border-zinc-700 shrink-0">
                <img
                  src={CURRENT_STUDENT.avatarUrl}
                  alt={CURRENT_STUDENT.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {CURRENT_STUDENT.name}
                </span>
                <span className="text-[10px] text-zinc-400">{CURRENT_STUDENT.rollNumber}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:inline" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{CURRENT_STUDENT.name}</p>
                  <p className="text-[11px] text-zinc-500">Roll: {CURRENT_STUDENT.rollNumber}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    ● Biometrics Authenticated
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onGoToDashboard();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2.5 cursor-pointer text-zinc-700 dark:text-zinc-300"
                  >
                    <BookOpen className="w-4 h-4 text-zinc-400" />
                    <span>Course Dashboard</span>
                  </button>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2.5 cursor-pointer text-zinc-700 dark:text-zinc-300"
                  >
                    <Award className="w-4 h-4 text-zinc-400" />
                    <span>Performance & Grades</span>
                  </button>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
