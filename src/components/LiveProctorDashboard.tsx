import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Send,
  Radio,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Bell,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from 'lucide-react';
import { CandidateSession, CandidateStatus, MalpracticeIncident, IncidentType } from '../types';

interface LiveProctorDashboardProps {
  candidates: CandidateSession[];
  incidents: MalpracticeIncident[];
  onTriggerWarning: (candidateId: string, message: string) => void;
  onTerminateCandidate: (candidateId: string) => void;
  onBroadcastMessage: (message: string) => void;
}

export const LiveProctorDashboard: React.FC<LiveProctorDashboardProps> = ({
  candidates,
  incidents,
  onTriggerWarning,
  onTerminateCandidate,
  onBroadcastMessage,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<MalpracticeIncident | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateSession | null>(candidates[0] || null);
  const [broadcastInput, setBroadcastInput] = useState('');
  const [warningInput, setWarningInput] = useState('WARNING: Ensure gaze remains directed squarely at the exam terminal.');
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'HIGH' | 'ATTENTION' | 'NORMAL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSection, setMobileSection] = useState<'terminals' | 'alerts'>('terminals');

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterRisk === 'HIGH') return c.riskScore >= 70;
    if (filterRisk === 'ATTENTION') return c.riskScore >= 30 && c.riskScore < 70;
    if (filterRisk === 'NORMAL') return c.riskScore < 30;
    return true;
  });

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastInput.trim()) return;
    onBroadcastMessage(broadcastInput);
    setBroadcastInput('');
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) {
      return (
        <span className="bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-black px-2 py-0.5 rounded border border-[#ffb4ab]">
          HIGH RISK ({score})
        </span>
      );
    }
    if (score >= 30) {
      return (
        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded border border-amber-300">
          ATTENTION ({score})
        </span>
      );
    }
    return (
      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-300">
        NORMAL ({score})
      </span>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] p-4 lg:p-6 flex flex-col gap-5">
      {/* Evidence Viewer Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full p-5 border border-slate-300 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>Malpractice Snapshot Evidence</span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="aspect-video w-full rounded-md overflow-hidden bg-black relative border border-slate-700">
              <img
                src={selectedIncident.evidenceSnapshotUrl}
                alt="Evidence snapshot"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                INCIDENT ID: {selectedIncident.id}
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                {selectedIncident.timestamp} | CONF: {selectedIncident.confidence}%
              </div>
            </div>

            <div className="bg-[#eff4ff] p-3 rounded text-xs space-y-1 border border-[#d3e4fe]">
              <div className="font-bold text-[#0b1c30]">
                Candidate: {selectedIncident.candidateName}
              </div>
              <div className="text-red-700 font-semibold">
                Violation Type: {selectedIncident.type}
              </div>
              <div className="text-[#45464d]">{selectedIncident.details}</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  onTriggerWarning(
                    selectedIncident.candidateId,
                    `Official Caution regarding incident ${selectedIncident.id} (${selectedIncident.type}). Please refocus on your exam.`
                  );
                  setSelectedIncident(null);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded"
              >
                Issue Formal Warning
              </button>
              <button
                onClick={() => setSelectedIncident(null)}
                className="bg-slate-800 hover:bg-black text-white text-xs font-bold px-4 py-1.5 rounded"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner: Metrics & Global Broadcast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white p-4 rounded-lg shadow-xs border border-[#e2e8f0]">
        <div className="lg:col-span-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-[#316bf3] flex items-center justify-center text-white shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-[#0b1c30]">Live Examiner Oversight Console</h1>
            <div className="text-xs text-[#45464d] flex items-center gap-2">
              <span>Paper: CS-804 Adv. Distributed Systems</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">{candidates.length} Active Nodes</span>
            </div>
          </div>
        </div>

        {/* Global Broadcast Form */}
        <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-2">
          <form onSubmit={handleBroadcast} className="flex-1 w-full flex items-center gap-2">
            <input
              type="text"
              placeholder="Send global broadcast message to all active candidate terminals (e.g. '5 minutes remaining')..."
              value={broadcastInput}
              onChange={(e) => setBroadcastInput(e.target.value)}
              className="flex-1 bg-[#eff4ff] border border-[#d3e4fe] text-xs rounded-md px-3 py-2 text-[#0b1c30] placeholder-[#76777d] focus:outline-hidden focus:ring-1 focus:ring-[#0051d5]"
            />
            <button
              type="submit"
              className="bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast</span>
            </button>
          </form>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-[#e2e8f0] shadow-2xs">
        <div className="flex items-center gap-2 flex-1 w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search candidate name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs text-[#0b1c30] bg-transparent focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          <span className="text-xs font-bold text-slate-500 shrink-0">Filter:</span>
          <button
            onClick={() => setFilterRisk('ALL')}
            className={`text-xs px-3 py-1.5 rounded-md font-bold transition-colors shrink-0 cursor-pointer min-h-[36px] ${
              filterRisk === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({candidates.length})
          </button>
          <button
            onClick={() => setFilterRisk('HIGH')}
            className={`text-xs px-3 py-1.5 rounded-md font-bold transition-colors shrink-0 cursor-pointer min-h-[36px] ${
              filterRisk === 'HIGH' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            High Risk
          </button>
          <button
            onClick={() => setFilterRisk('ATTENTION')}
            className={`text-xs px-3 py-1.5 rounded-md font-bold transition-colors shrink-0 cursor-pointer min-h-[36px] ${
              filterRisk === 'ATTENTION' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Attention
          </button>
          <button
            onClick={() => setFilterRisk('NORMAL')}
            className={`text-xs px-3 py-1.5 rounded-md font-bold transition-colors shrink-0 cursor-pointer min-h-[36px] ${
              filterRisk === 'NORMAL' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Normal
          </button>
        </div>
      </div>

      {/* Mobile-Only Segmented View Switcher (xl:hidden) */}
      <div className="xl:hidden flex items-center bg-slate-200/70 p-1 rounded-lg gap-1 text-xs font-bold">
        <button
          onClick={() => setMobileSection('terminals')}
          className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
            mobileSection === 'terminals' ? 'bg-white text-[#0051d5] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Terminals ({filteredCandidates.length})</span>
        </button>
        <button
          onClick={() => setMobileSection('alerts')}
          className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
            mobileSection === 'alerts' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Alerts & Actions ({incidents.length})</span>
        </button>
      </div>

      {/* Main 12-Column Split: Candidate Grid (Col 8) + Live Incident Stream & Controls (Col 4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Candidate Video Grid (Col 8) */}
        <div className={`xl:col-span-8 flex flex-col gap-4 ${mobileSection === 'alerts' ? 'hidden xl:flex' : 'flex'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.map((cand) => {
              const isSelected = selectedCandidate?.id === cand.id;
              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  className={`bg-white rounded-lg shadow-xs border overflow-hidden transition-all cursor-pointer flex flex-col ${
                    isSelected
                      ? 'border-[#0051d5] ring-2 ring-[#0051d5]/30'
                      : 'border-[#e2e8f0] hover:border-slate-400'
                  }`}
                >
                  {/* Candidate Feed Header */}
                  <div className="p-2.5 bg-[#eff4ff] flex items-center justify-between border-b border-[#dce9ff] gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#0b1c30] truncate">{cand.name}</span>
                      <span className="text-[10px] text-[#45464d] font-mono">{cand.rollNumber}</span>
                    </div>
                    <div className="shrink-0">
                      {getRiskBadge(cand.riskScore)}
                    </div>
                  </div>

                  {/* Video Box */}
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img
                      src={cand.avatarUrl}
                      alt={cand.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Telemetry pill */}
                    <div className="absolute top-1.5 left-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[9.5px] text-white flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span>LIVE</span>
                    </div>

                    <div className="absolute bottom-1.5 inset-x-1.5 bg-black/75 px-1.5 py-0.5 rounded text-[9px] text-white flex items-center justify-between font-mono">
                      <span>GAZE: {cand.gazeDeviation}</span>
                      <span>BLUR: {cand.tabSwitchCount}/3</span>
                    </div>
                  </div>

                  {/* Status footer */}
                  <div className="p-2 text-xs flex items-center justify-between bg-white">
                    <span className="text-[11px] text-[#45464d]">
                      Q: <strong>{cand.currentQuestion}/60</strong> ({cand.answeredCount} ans)
                    </span>
                    <div className="flex items-center gap-1.5">
                      {cand.webcamActive ? (
                        <Video className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <VideoOff className="w-3.5 h-3.5 text-red-600" />
                      )}
                      {cand.micActive ? (
                        <Mic className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <MicOff className="w-3.5 h-3.5 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Candidate Controls & Live Incident Alert Stream (Col 4) */}
        <div className={`xl:col-span-4 flex flex-col gap-4 ${mobileSection === 'terminals' ? 'hidden xl:flex' : 'flex'}`}>
          {/* Selected Candidate Quick Controls */}
          {selectedCandidate && (
            <div className="bg-white rounded-lg p-4 shadow-xs border border-[#e2e8f0] flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {selectedCandidate.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0b1c30] truncate">{selectedCandidate.name}</div>
                    <div className="text-[10px] text-[#45464d]">{selectedCandidate.rollNumber}</div>
                  </div>
                </div>
                <div className="shrink-0">
                  {getRiskBadge(selectedCandidate.riskScore)}
                </div>
              </div>

              {/* Direct Warning Box */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#45464d]">Issue Real-Time Toast Warning</label>
                <textarea
                  rows={2}
                  value={warningInput}
                  onChange={(e) => setWarningInput(e.target.value)}
                  className="text-xs p-2 rounded bg-[#eff4ff] border border-[#d3e4fe] text-[#0b1c30] focus:ring-1 focus:ring-[#0051d5] focus:outline-hidden resize-none"
                />
                <div className="flex items-center gap-2 flex-col sm:flex-row">
                  <button
                    onClick={() => onTriggerWarning(selectedCandidate.id, warningInput)}
                    className="w-full sm:flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Send Warning Toast</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Terminate exam session for ${selectedCandidate.name}? This action disqualifies the candidate immediately.`)) {
                        onTerminateCandidate(selectedCandidate.id);
                      }
                    }}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded transition-colors cursor-pointer min-h-[44px]"
                  >
                    Disqualify
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Incident Alert Stream */}
          <div className="bg-white rounded-lg p-4 shadow-xs border border-[#e2e8f0] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0b1c30]">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Malpractice Incident Alert Stream</span>
              </div>
              <span className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {incidents.length} Alerts
              </span>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {incidents.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No telemetry security violations recorded yet.
                </div>
              ) : (
                incidents.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className="bg-[#eff4ff] hover:bg-[#dce9ff] p-2.5 rounded-md border border-[#d3e4fe] cursor-pointer transition-colors flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {inc.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{inc.timestamp}</span>
                    </div>

                    <div className="text-xs font-medium text-[#0b1c30]">
                      {inc.candidateName}
                    </div>

                    <div className="text-[11px] text-[#45464d] line-clamp-2 leading-tight">
                      {inc.details}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-blue-700 font-bold">Conf: {inc.confidence}%</span>
                      <span className="text-slate-600 font-semibold flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#0051d5]" /> View snapshot
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
