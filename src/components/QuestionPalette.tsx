import React, { useState } from 'react';
import { Lock, Bookmark, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import { Question, QuestionStatus } from '../types';

interface QuestionPaletteProps {
  questions: Question[];
  currentQuestionId: number;
  onSelectQuestion: (id: number) => void;
  onSubmitExam: () => void;
  currentSection: string;
  onToggleSection: () => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentQuestionId,
  onSelectQuestion,
  onSubmitExam,
  currentSection,
  onToggleSection,
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'ANSWERED' | 'MARKED' | 'NOT_VISITED'>('ALL');

  // Compute counts dynamically
  const answeredCount = questions.filter((q) => q.status === QuestionStatus.ANSWERED).length;
  const markedReviewCount = questions.filter((q) => q.status === QuestionStatus.MARKED_FOR_REVIEW).length;
  const notAnsweredCount = questions.filter((q) => q.status === QuestionStatus.NOT_ANSWERED).length;
  const notVisitedCount = questions.filter((q) => q.status === QuestionStatus.NOT_VISITED).length;

  const filteredQuestions = questions.filter((q) => {
    if (filterMode === 'ANSWERED') return q.status === QuestionStatus.ANSWERED;
    if (filterMode === 'MARKED') return q.status === QuestionStatus.MARKED_FOR_REVIEW;
    if (filterMode === 'NOT_VISITED') return q.status === QuestionStatus.NOT_VISITED || q.status === QuestionStatus.NOT_ANSWERED;
    return true;
  });

  return (
    <div className="w-full bg-white rounded-lg shadow-xs p-4 flex flex-col gap-3 border border-[#e2e8f0]">
      {/* Palette Header & Legend */}
      <div className="flex flex-col gap-2 pb-1 border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#0b1c30]">Question Palette</span>
          <span className="text-[11px] text-[#45464d] uppercase font-bold tracking-wider">
            {currentSection.includes('Section A') ? 'Sec A (1-20)' : 'Sec B (21-60)'}
          </span>
        </div>

        {/* TCS iON Legend Indicator Grid - Clickable for quick filtering */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[#45464d] text-[11px] bg-[#eff4ff] p-2 rounded-md border border-[#d3e4fe]">
          <button
            onClick={() => setFilterMode(filterMode === 'ANSWERED' ? 'ALL' : 'ANSWERED')}
            className={`flex items-center gap-1.5 p-1 rounded transition-all text-left cursor-pointer ${
              filterMode === 'ANSWERED' ? 'bg-white shadow-xs ring-1 ring-[#316bf3]' : 'hover:bg-white/60'
            }`}
          >
            <span className="w-4 h-4 rounded-xs bg-[#316bf3] flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
              {answeredCount}
            </span>
            <span className="truncate font-medium text-slate-800">Answered</span>
          </button>

          <button
            onClick={() => setFilterMode(filterMode === 'NOT_VISITED' ? 'ALL' : 'NOT_VISITED')}
            className={`flex items-center gap-1.5 p-1 rounded transition-all text-left cursor-pointer ${
              filterMode === 'NOT_VISITED' ? 'bg-white shadow-xs ring-1 ring-slate-400' : 'hover:bg-white/60'
            }`}
          >
            <span className="w-4 h-4 rounded-xs bg-[#d3e4fe] flex items-center justify-center text-[#0b1c30] text-[10px] font-bold">
              {notAnsweredCount}
            </span>
            <span className="truncate font-medium text-slate-800">Not Answered</span>
          </button>

          <button
            onClick={() => setFilterMode(filterMode === 'MARKED' ? 'ALL' : 'MARKED')}
            className={`flex items-center gap-1.5 p-1 rounded transition-all text-left cursor-pointer ${
              filterMode === 'MARKED' ? 'bg-white shadow-xs ring-1 ring-[#f63a35]' : 'hover:bg-white/60'
            }`}
          >
            <span className="w-4 h-4 rounded-xs bg-[#f63a35] flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
              {markedReviewCount}
            </span>
            <span className="truncate font-medium text-slate-800">Marked Review</span>
          </button>

          <button
            onClick={() => setFilterMode('ALL')}
            className={`flex items-center gap-1.5 p-1 rounded transition-all text-left cursor-pointer ${
              filterMode === 'ALL' ? 'bg-white shadow-xs ring-1 ring-blue-500' : 'hover:bg-white/60'
            }`}
          >
            <span className="w-4 h-4 rounded-xs bg-[#e5eeff] flex items-center justify-center text-[#76777d] text-[10px] font-bold border border-[#c6c6cd]">
              {notVisitedCount}
            </span>
            <span className="truncate font-medium text-slate-800">Not Visited</span>
          </button>
        </div>

        {/* Filter Chip Filter Bar */}
        <div className="flex items-center justify-between gap-1 text-[10px] pt-1">
          <div className="flex items-center gap-1 text-slate-500 font-semibold">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                filterMode === 'ALL' ? 'bg-[#000000] text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All (60)
            </button>
            <button
              onClick={() => setFilterMode('ANSWERED')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                filterMode === 'ANSWERED' ? 'bg-[#316bf3] text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ans ({answeredCount})
            </button>
            <button
              onClick={() => setFilterMode('MARKED')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                filterMode === 'MARKED' ? 'bg-[#f63a35] text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Marked ({markedReviewCount})
            </button>
          </div>
        </div>

        {/* Forward-Only Locked Policy Alert */}
        <div className="flex items-center gap-1.5 text-[10.5px] text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200 leading-tight">
          <Lock className="w-3 h-3 text-amber-700 shrink-0" />
          <span>Past questions (&lt; #{currentQuestionId}) are locked. Only current &amp; forward questions are accessible.</span>
        </div>
      </div>

      {/* 60-Question Interactive Cell Matrix */}
      <div className="max-h-64 overflow-y-auto pr-1">
        {filteredQuestions.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No questions match the "{filterMode}" filter.
          </div>
        ) : (
          <div className="grid grid-cols-6 sm:grid-cols-8 xl:grid-cols-6 gap-1.5">
            {filteredQuestions.map((q) => {
              const isCurrent = q.id === currentQuestionId;
              const isPastLocked = q.id < currentQuestionId;

              if (isPastLocked) {
                return (
                  <button
                    key={q.id}
                    disabled={true}
                    aria-disabled="true"
                    className="h-8 rounded-xs text-[11px] flex items-center justify-center border border-slate-200 bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed line-through relative select-none"
                    title={`Question ${q.id} is locked. You cannot return to previous questions.`}
                  >
                    <span>{q.id}</span>
                  </button>
                );
              }

              let btnClass = 'bg-[#e5eeff] text-[#45464d] hover:bg-[#dce9ff] border border-[#c6c6cd]/60 cursor-pointer';

              if (isCurrent) {
                btnClass = 'bg-[#000000] text-white font-extrabold shadow-md scale-105 ring-2 ring-[#316bf3] cursor-default';
              } else if (q.status === QuestionStatus.ANSWERED) {
                btnClass = 'bg-[#316bf3] text-white hover:bg-[#0051d5] font-bold shadow-xs cursor-pointer';
              } else if (q.status === QuestionStatus.MARKED_FOR_REVIEW) {
                btnClass = 'bg-[#f63a35] text-white hover:bg-[#ba1a1a] font-bold shadow-xs relative cursor-pointer';
              } else if (q.status === QuestionStatus.NOT_ANSWERED) {
                btnClass = 'bg-[#d3e4fe] text-[#0b1c30] hover:bg-[#cbdbf5] font-bold cursor-pointer';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => onSelectQuestion(q.id)}
                  className={`h-8 rounded-xs text-[11px] flex items-center justify-center transition-all ${btnClass}`}
                  title={`Question ${q.id} (${q.status})`}
                >
                  <span>{q.id}</span>
                  {q.status === QuestionStatus.MARKED_FOR_REVIEW && !isCurrent && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white shadow-xs"></span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Section Switcher */}
      <div className="pt-1 flex items-center justify-between bg-[#eff4ff] p-2 rounded-md border border-[#d3e4fe]">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#45464d] uppercase font-bold">Current Section</span>
          <span className="text-xs text-[#0b1c30] font-bold truncate max-w-[140px] sm:max-w-none">
            {currentSection}
          </span>
        </div>
        <button
          onClick={onToggleSection}
          disabled={currentQuestionId > 20}
          className={`text-[11px] px-2.5 py-1 rounded font-bold uppercase transition-colors shrink-0 ${
            currentQuestionId > 20
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
              : 'bg-[#d3e4fe] hover:bg-[#cbdbf5] text-[#0051d5] cursor-pointer'
          }`}
          title={currentQuestionId > 20 ? 'Sec A is locked (Past Questions)' : 'Switch to Sec B'}
        >
          {currentQuestionId > 20 ? 'Sec A Locked' : 'Switch to Sec B'}
        </button>
      </div>

      {/* Final Submit Examination Button */}
      <div className="pt-1">
        <button
          onClick={onSubmitExam}
          className="w-full bg-[#000000] hover:bg-[#213145] text-white text-[13px] py-2.5 px-4 rounded-md shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wider font-bold cursor-pointer min-h-[44px]"
        >
          <Lock className="w-4 h-4" />
          <span>Submit Examination</span>
        </button>
        <span className="block text-center text-[10px] text-[#45464d] pt-1.5 leading-tight">
          Double-confirmation prompt. Answers auto-saved in local buffer.
        </span>
      </div>
    </div>
  );
};
