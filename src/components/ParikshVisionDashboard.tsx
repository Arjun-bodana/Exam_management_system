import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  HelpCircle,
  Clock,
  Shield,
  ArrowRight,
  Folder,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Course, QuizDetail } from '../types';
import { PARIKSHVISION_COURSES, PARIKSHVISION_QUIZZES } from '../data/examData';

interface ParikshVisionDashboardProps {
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onSelectQuiz: (quizId: string) => void;
}

export const ParikshVisionDashboard: React.FC<ParikshVisionDashboardProps> = ({
  selectedCourseId,
  onSelectCourse,
  onSelectQuiz,
}) => {
  // Find selected course or default to first
  const activeCourse =
    PARIKSHVISION_COURSES.find((c) => c.id === selectedCourseId) || PARIKSHVISION_COURSES[0];

  // Collapsible accordion state for course topics
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({
    'gen-announcements': true,
    'topic-1': true,
    'dbms-assessments': true,
  });

  const toggleTopic = (topicId: string) => {
    setOpenTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Course Selector Tabs (Pill Bar for quick switching) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
          Courses:
        </span>
        {PARIKSHVISION_COURSES.map((course) => {
          const isSelected = course.id === activeCourse.id;
          return (
            <button
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{course.code}</span>
              <span className="opacity-70 font-normal hidden sm:inline">({course.shortname})</span>
            </button>
          );
        })}
      </div>

      {/* Selected Course Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs font-bold">
                {activeCourse.code}
              </span>
              <span className="text-xs text-zinc-400">• {activeCourse.category}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {activeCourse.fullName}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
              {activeCourse.summary}
            </p>
          </div>

          <div className="sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-zinc-100 dark:border-zinc-800 pt-3 sm:pt-0 sm:pl-6">
            <span className="text-xs text-zinc-400 block">Instructor</span>
            <span className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {activeCourse.instructor}
            </span>
            <div className="mt-2 flex items-center sm:justify-end gap-2 text-xs">
              <span className="text-zinc-500">Progress:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{activeCourse.progress}%</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-zinc-900 dark:bg-zinc-100 h-full rounded-full transition-all duration-300"
            style={{ width: `${activeCourse.progress}%` }}
          />
        </div>
      </div>

      {/* Course Content Accordions (Progressive Disclosure) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Curriculum & Examination Modules
          </h3>
          <span className="text-xs text-zinc-400">Click headers to expand/collapse</span>
        </div>

        {activeCourse.topics.map((topic) => {
          const isOpen = openTopics[topic.id] ?? false;
          return (
            <div
              key={topic.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs transition-colors"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                    <Folder className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {topic.title}
                    </h4>
                    {topic.summary && (
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                        {topic.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="text-xs hidden sm:inline">
                    {topic.items.length} item{topic.items.length === 1 ? '' : 's'}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="border-t border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {topic.items.map((item) => {
                    // Check if item is a Quiz
                    if (item.type === 'quiz' && item.quizId) {
                      return (
                        <div
                          key={item.id}
                          className="p-4 sm:p-5 bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shrink-0 mt-0.5">
                              <FileCheck className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                  {item.title}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                                  Forward-Only Enforced
                                </span>
                                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                                  <Shield className="w-2.5 h-2.5" /> AI Proctored
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                  {item.description}
                                </p>
                              )}
                              {item.dueDate && (
                                <p className="text-[11px] text-zinc-400">
                                  Timeline: {item.dueDate}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => onSelectQuiz(item.quizId!)}
                            className="self-start sm:self-center px-4 py-2 rounded-lg bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
                          >
                            <span>Launch Exam Brief</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    }

                    // Standard Lecture Materials / Files / Announcements
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 sm:px-5 flex items-center justify-between text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                          <div>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                              {item.title}
                            </span>
                            {item.dueDate && (
                              <span className="text-[10px] text-zinc-400 block">
                                {item.dueDate}
                              </span>
                            )}
                          </div>
                        </div>

                        {item.fileSize && (
                          <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                            {item.fileSize}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
