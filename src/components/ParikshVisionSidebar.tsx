import React from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Calendar,
  Award,
  ChevronRight,
  Shield,
  Layers,
  X,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { Course } from '../types';
import { PARIKSHVISION_COURSES } from '../data/examData';

interface ParikshVisionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onGoToDashboard: () => void;
  activeStep: string;
}

export const ParikshVisionSidebar: React.FC<ParikshVisionSidebarProps> = ({
  isOpen,
  onClose,
  selectedCourseId,
  onSelectCourse,
  onGoToDashboard,
  activeStep,
}) => {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-2xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-14 left-0 z-40 lg:z-10 w-64 lg:w-64 h-[calc(100vh-3.5rem)] bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-200 ease-in-out overflow-y-auto flex flex-col justify-between p-3 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Close button on mobile */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Navigation
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Quick Links */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onGoToDashboard();
                onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
                activeStep === 'dashboard'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="flex-1">Dashboard</span>
            </button>
          </div>

          {/* Enrolled Courses Section */}
          <div className="space-y-1 pt-2">
            <div className="px-3 pb-1 flex items-center justify-between text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              <span>My Courses ({PARIKSHVISION_COURSES.length})</span>
            </div>

            {PARIKSHVISION_COURSES.map((course) => {
              const isSelected = selectedCourseId === course.id && activeStep !== 'dashboard';
              return (
                <button
                  key={course.id}
                  onClick={() => {
                    onSelectCourse(course.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-semibold shadow-2xs'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-zinc-900 dark:bg-white'
                          : 'bg-zinc-400 dark:bg-zinc-600'
                      }`}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold truncate leading-tight">
                        {course.code}
                      </span>
                      <span className="text-[10px] text-zinc-400 truncate">
                        {course.shortname}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    {course.progress}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Secure Node Status */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-[11px] space-y-1 text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center justify-between font-semibold text-zinc-800 dark:text-zinc-200">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ParikshVision Engine
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">ONLINE</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight">
              Biometric & Proctor telemetry active.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
