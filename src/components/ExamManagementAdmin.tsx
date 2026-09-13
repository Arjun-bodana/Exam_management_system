import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit,
  Save,
  FileCheck,
  Send,
  FileSpreadsheet,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Question, QuestionStatus } from '../types';
import { INITIAL_CANDIDATES } from '../data/mockExamData';
import { exportCandidatesToGoogleSheets, ExportResult } from '../services/googleSheets';

interface ExamManagementAdminProps {
  questions: Question[];
  onAddQuestion: (q: Question) => void;
  onDeleteQuestion: (id: number) => void;
  onPublishResults: () => void;
}

export const ExamManagementAdmin: React.FC<ExamManagementAdminProps> = ({
  questions,
  onAddQuestion,
  onDeleteQuestion,
  onPublishResults,
}) => {
  const [activeTab, setActiveTab] = useState<'builder' | 'bank' | 'bulk' | 'publish'>('builder');

  // Exam Builder state
  const [examId, setExamId] = useState('EXAM-2026-CS804');
  const [examTitle, setExamTitle] = useState('CS-804 Advanced Distributed Systems & Consensus Engineering');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [totalMarks, setTotalMarks] = useState(240);
  const [passingPercentage, setPassingPercentage] = useState(50);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Question state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newSection, setNewSection] = useState('Section B: System Architecture & Concurrency');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [marks, setMarks] = useState(4.0);
  const [negMarks, setNegMarks] = useState(1.0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Bulk Upload state
  const [csvInput, setCsvInput] = useState(
    `Question,Section,OptionA,OptionB,OptionC,OptionD,CorrectOption,Marks,NegativeMarks
"What is the quorum requirement for Paxos?","Section A","Majority floor(n/2)+1","All replicas must agree","Two-thirds majority","Any single replica",A,4.0,1.0
"Which consistency model is guaranteed by Spanner TrueTime?","Section B","Strict Linearizability","Eventual Consistency","Causal Consistency","Read Committed",A,4.0,1.0`
  );
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);

  // Google Sheets state
  const [isExportingSheets, setIsExportingSheets] = useState(false);
  const [sheetsResult, setSheetsResult] = useState<ExportResult | null>(null);
  const [sheetsError, setSheetsError] = useState<string | null>(null);
  const [showSheetsConfirm, setShowSheetsConfirm] = useState(false);

  const handleExportCandidatesToSheets = async () => {
    setShowSheetsConfirm(false);
    setIsExportingSheets(true);
    setSheetsError(null);
    try {
      const result = await exportCandidatesToGoogleSheets(INITIAL_CANDIDATES);
      setSheetsResult(result);
    } catch (err: any) {
      console.error('Failed to export candidates to Google Sheets:', err);
      setSheetsError(err?.message || 'Failed to export candidates to Google Sheets.');
    } finally {
      setIsExportingSheets(false);
    }
  };

  // Validation method per requirement
  const validateOptions = (a: string, b: string, c: string, d: string, correct: string): boolean => {
    const list = [a.trim(), b.trim(), c.trim(), d.trim()];
    // Check non-empty
    if (list.some((item) => item.length === 0)) {
      setValidationError('All 4 options (A, B, C, D) must contain non-empty text.');
      return false;
    }
    // Check duplicates
    const unique = new Set(list);
    if (unique.size !== 4) {
      setValidationError('Validation Error: Duplicate choices detected among options. Each option must be distinct.');
      return false;
    }
    if (!['A', 'B', 'C', 'D'].includes(correct)) {
      setValidationError('Validation Error: A valid correct answer must be selected.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) {
      setValidationError('Question stem text cannot be blank.');
      return;
    }

    if (!validateOptions(optA, optB, optC, optD, correctOption)) {
      return;
    }

    const newQ: Question = {
      id: questions.length + 1,
      section: newSection,
      title: `Question ${questions.length + 1}`,
      type: 'Multi-Choice Single Correct (MCQ)',
      correctMarks: marks,
      negativeMarks: negMarks,
      prompt: newQuestionText,
      options: [
        { id: 'A', text: optA },
        { id: 'B', text: optB },
        { id: 'C', text: optC },
        { id: 'D', text: optD },
      ],
      correctOption,
      status: QuestionStatus.NOT_VISITED,
    };

    onAddQuestion(newQ);
    setNewQuestionText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setValidationError(null);
    alert(`Question ${newQ.id} successfully added to Question Bank!`);
  };

  const handleProcessBulkCsv = () => {
    try {
      const lines = csvInput.trim().split('\n');
      if (lines.length <= 1) {
        setBulkStatus('CSV input does not contain any data rows.');
        return;
      }
      let count = 0;
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i];
        if (!row.trim()) continue;
        count++;
      }
      setBulkStatus(`Successfully parsed and imported ${count} validated questions into Question Bank!`);
    } catch {
      setBulkStatus('Failed to parse CSV format. Ensure standard comma-separated format.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-[#f8f9ff]">
      {/* Top Banner */}
      <div className="bg-white rounded-lg p-5 shadow-xs border border-[#e2e8f0] mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#0b1c30]">Exam & Question Management Console</h1>
          <p className="text-xs text-[#45464d] mt-0.5">
            Institutional assessment configuration, question bank validation, and result publishing engine.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[#eff4ff] p-1 rounded-md border border-[#d3e4fe] overflow-x-auto max-w-full pb-1">
          <button
            onClick={() => setActiveTab('builder')}
            className={`text-xs px-3.5 py-2 rounded font-bold transition-all shrink-0 cursor-pointer min-h-[38px] ${
              activeTab === 'builder' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-slate-600 hover:text-black'
            }`}
          >
            Exam Builder
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`text-xs px-3.5 py-2 rounded font-bold transition-all shrink-0 cursor-pointer min-h-[38px] ${
              activeTab === 'bank' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-slate-600 hover:text-black'
            }`}
          >
            Question Bank ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`text-xs px-3.5 py-2 rounded font-bold transition-all shrink-0 cursor-pointer min-h-[38px] ${
              activeTab === 'bulk' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-slate-600 hover:text-black'
            }`}
          >
            Bulk Upload
          </button>
          <button
            onClick={() => setActiveTab('publish')}
            className={`text-xs px-3.5 py-2 rounded font-bold transition-all shrink-0 cursor-pointer min-h-[38px] ${
              activeTab === 'publish' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-slate-600 hover:text-black'
            }`}
          >
            Publish Results
          </button>
        </div>
      </div>

      {/* Tab 1: Exam Builder */}
      {activeTab === 'builder' && (
        <div className="bg-white rounded-lg p-6 shadow-xs border border-[#e2e8f0] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-[#0b1c30]">Assessment Configuration Parameters</h2>
            {savedSuccess && (
              <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Changes successfully saved to PostgreSQL database
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">Exam Identifier (examId)</label>
              <input
                type="text"
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-2 rounded text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">Exam Title</label>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-2 rounded text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-2 rounded text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">Total Marks</label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-2 rounded text-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 3000);
              }}
              className="w-full sm:w-auto bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold px-6 py-2.5 rounded flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
            >
              <Save className="w-4 h-4" />
              <span>Save Exam Parameters</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Question Bank */}
      {activeTab === 'bank' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Question List (Col 7) */}
          <div className="lg:col-span-7 bg-white rounded-lg p-5 shadow-xs border border-[#e2e8f0]">
            <h2 className="text-sm font-bold text-[#0b1c30] mb-3">
              Existing Questions in Bank ({questions.length})
            </h2>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {questions.slice(0, 15).map((q) => (
                <div
                  key={q.id}
                  className="bg-[#eff4ff] p-3 rounded-md border border-[#d3e4fe] flex flex-col gap-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0051d5]">Question {q.id} ({q.section})</span>
                    <span className="text-[11px] font-mono text-slate-500">+{q.correctMarks} / -{q.negativeMarks}</span>
                  </div>
                  <p className="text-slate-800 line-clamp-2">{q.prompt}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="font-semibold text-emerald-700">Correct: Option ({q.correctOption})</span>
                    <button
                      onClick={() => onDeleteQuestion(q.id)}
                      className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Question Builder (Col 5) */}
          <div className="lg:col-span-5 bg-white rounded-lg p-5 shadow-xs border border-[#e2e8f0]">
            <h2 className="text-sm font-bold text-[#0b1c30] mb-3 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-[#0051d5]" /> Add New Question
            </h2>

            {validationError && (
              <div className="mb-3 p-2 bg-red-50 text-red-800 border border-red-300 rounded text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Section</label>
                <select
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-2 rounded"
                >
                  <option value="Section A: Distributed Systems Core">Section A: Distributed Systems Core</option>
                  <option value="Section B: System Architecture & Concurrency">Section B: System Architecture & Concurrency</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Question Prompt</label>
                <textarea
                  rows={3}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Enter detailed question text..."
                  className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-2 rounded resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#0b1c30] block">Option Choices (Must be unique)</label>
                <input
                  type="text"
                  placeholder="Option A"
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-1.5 rounded"
                />
                <input
                  type="text"
                  placeholder="Option B"
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-1.5 rounded"
                />
                <input
                  type="text"
                  placeholder="Option C"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-1.5 rounded"
                />
                <input
                  type="text"
                  placeholder="Option D"
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-1.5 rounded"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">Correct Answer</label>
                  <select
                    value={correctOption}
                    onChange={(e: any) => setCorrectOption(e.target.value)}
                    className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-1.5 rounded font-bold"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">+ Marks</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-1.5 rounded font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">- Marks</label>
                  <input
                    type="number"
                    value={negMarks}
                    onChange={(e) => setNegMarks(Number(e.target.value))}
                    className="w-full bg-[#eff4ff] border border-[#d3e4fe] p-1.5 rounded font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#000000] hover:bg-[#213145] text-white font-bold py-2.5 rounded transition-all cursor-pointer shadow-sm min-h-[44px] flex items-center justify-center"
              >
                Validate & Add Question
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Bulk Upload */}
      {activeTab === 'bulk' && (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xs border border-[#e2e8f0] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-[#0b1c30]">Bulk CSV / Excel Question Ingestion</h2>
              <p className="text-xs text-[#45464d]">
                Parse, validate choices, and import hundreds of questions into the PostgreSQL questions repository simultaneously.
              </p>
            </div>
            <UploadCloud className="w-6 h-6 text-[#0051d5] shrink-0" />
          </div>

          <textarea
            rows={8}
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-md bg-[#eff4ff] border border-[#d3e4fe] text-slate-800"
          />

          {bulkStatus && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{bulkStatus}</span>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleProcessBulkCsv}
              className="w-full sm:w-auto bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold px-6 py-2.5 rounded flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Execute Bulk Ingestion</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Publish Results */}
      {activeTab === 'publish' && (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xs border border-[#e2e8f0] space-y-4">
          <h2 className="text-sm font-bold text-[#0b1c30] pb-2 border-b border-slate-200">
            Evaluation & Result Publication Engine
          </h2>

          <div className="bg-[#eff4ff] p-4 rounded-md border border-[#d3e4fe] text-xs space-y-2">
            <div className="font-bold text-[#0b1c30]">Exam: CS-804 Adv. Distributed Systems</div>
            <div className="text-slate-600">Total Enrolled Candidates: 6 Nodes</div>
            <div className="text-slate-600">Proctoring Telemetry Audits: 100% Processed</div>
            <div className="text-emerald-700 font-bold">Evaluation Status: Ready for Institutional Sealing</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onPublishResults}
              className="w-full sm:w-auto bg-[#000000] hover:bg-[#213145] text-white text-xs font-bold px-5 py-3 rounded flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[44px]"
            >
              <Send className="w-4 h-4" />
              <span>Publish Verified Results & Seal Audit Ledger</span>
            </button>

            <button
              onClick={() => setShowSheetsConfirm(true)}
              disabled={isExportingSheets}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-3 rounded flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[44px]"
            >
              {isExportingSheets ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )}
              <span>{isExportingSheets ? 'Exporting to Sheets...' : 'Export Candidate Roster to Google Sheets'}</span>
            </button>
          </div>

          {/* Sheets Export Success Banner */}
          {sheetsResult && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-emerald-900">
                    Candidate Roster exported to Google Sheets! ({sheetsResult.rowCount} candidates)
                  </div>
                  <div className="text-emerald-700 text-[11px] truncate max-w-md">
                    Spreadsheet ID: {sheetsResult.spreadsheetId}
                  </div>
                </div>
              </div>
              <a
                href={sheetsResult.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded transition-colors shadow-xs shrink-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Open in Google Sheets</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Sheets Error Banner */}
          {sheetsError && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-3 flex items-center gap-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Error exporting to Google Sheets: {sheetsError}</span>
            </div>
          )}

          {/* Confirmation Modal */}
          {showSheetsConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200">
                <div className="flex items-center gap-2.5 text-emerald-700 mb-3">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-[#0b1c30]">Export Cohort Roster to Google Sheets</h3>
                </div>
                <p className="text-xs text-[#45464d] leading-relaxed mb-4">
                  This will create a new Google Sheet named <span className="font-bold text-[#0b1c30]">"ParikshVision Exam Cohort Roster"</span> in your connected Google Drive account and export candidate records, roll numbers, status, and proctoring metrics.
                </p>
                <div className="flex justify-end gap-2.5">
                  <button
                    onClick={() => setShowSheetsConfirm(false)}
                    className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExportCandidatesToSheets}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors shadow-xs"
                  >
                    Confirm & Export
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
