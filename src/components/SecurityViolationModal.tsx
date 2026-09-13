import React from 'react';
import { ShieldAlert, ArrowRight, Activity, Eye, Lock } from 'lucide-react';

interface SecurityViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  blurCount: number;
  incidentRef?: string;
  timestamp?: string;
  violationMessage?: string;
}

export const SecurityViolationModal: React.FC<SecurityViolationModalProps> = ({
  isOpen,
  onClose,
  blurCount = 1,
  incidentRef = 'SEC-VIOLATION-04928-E',
  timestamp = '10:17:42 UTC',
  violationMessage = 'Tab switching, split-screen action, or loss of window focus detected',
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="proctorModal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/80 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl bg-white rounded-lg shadow-2xl p-4 sm:p-6 flex flex-col gap-3.5 sm:gap-4 border border-[#c6c6cd] max-h-[90vh] overflow-y-auto">
        {/* Banner Alert Header */}
        <div className="flex items-center gap-3 bg-[#ffdad6]/80 border border-[#ffdad6] p-3 rounded-md">
          <div className="p-2 bg-[#ba1a1a] text-white rounded-md shrink-0">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-[15px] font-bold text-[#93000a] uppercase tracking-wider truncate">
              Proctor Telemetry Security Breach
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#ba1a1a] font-semibold tracking-wider truncate">
              INCIDENT REF: {incidentRef}
            </span>
          </div>
        </div>

        {/* Breach Description Body */}
        <div className="space-y-2 bg-[#eff4ff] border border-[#d3e4fe] p-3.5 sm:p-4 rounded-md">
          <p className="text-xs sm:text-[14px] text-[#0b1c30] font-medium leading-relaxed break-words">
            <span className="text-[#ba1a1a] font-bold underline mr-1">
              WARNING {blurCount} OF 3:
            </span>
            {violationMessage} at timestamp{' '}
            <span className="font-mono bg-[#e5eeff] px-1.5 py-0.5 rounded text-[#0b1c30] font-semibold text-xs border border-[#c6c6cd]/50">
              {timestamp}
            </span>.
          </p>
          <p className="text-[11px] sm:text-[12px] text-[#45464d] leading-normal break-words">
            Your active desktop session, peripheral inputs, and biometric gaze vectors are continuously mirrored to the
            Institutional Proctoring Console. Further infractions will trigger immediate automated exam disqualification
            and forfeiture of marks.
          </p>
        </div>

        {/* 3 Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#d3e4fe]/40 p-2.5 rounded-md border border-[#c6c6cd]/40">
          <div className="flex sm:flex-col items-center justify-between sm:justify-center p-2 text-center bg-white/70 rounded">
            <div className="flex items-center gap-1 text-[10px] text-[#45464d] uppercase font-bold">
              <Activity className="w-3 h-3 text-[#ba1a1a]" />
              <span>Window Blur</span>
            </div>
            <span className="text-base sm:text-[18px] text-[#ba1a1a] font-black tracking-tight mt-0.5">
              0{blurCount} / 03
            </span>
          </div>

          <div className="flex sm:flex-col items-center justify-between sm:justify-center p-2 text-center bg-white rounded shadow-xs border border-[#316bf3]/20">
            <div className="flex items-center gap-1 text-[10px] text-[#45464d] uppercase font-bold">
              <Eye className="w-3 h-3 text-[#0051d5]" />
              <span>Face Vector</span>
            </div>
            <span className="text-xs sm:text-[12px] text-[#0051d5] font-extrabold tracking-tight mt-0.5">
              LOCKED (99.4%)
            </span>
          </div>

          <div className="flex sm:flex-col items-center justify-between sm:justify-center p-2 text-center bg-white/70 rounded">
            <div className="flex items-center gap-1 text-[10px] text-[#45464d] uppercase font-bold">
              <Lock className="w-3 h-3 text-[#0b1c30]" />
              <span>Lock Status</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#0b1c30] font-bold tracking-tight mt-0.5">
              HARDWARE ISOLATED
            </span>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-[10px] sm:text-[11px] text-[#45464d] flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping shrink-0"></span>
            <span>Audit trail synchronizing to secure node...</span>
          </span>

          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#000000] hover:bg-[#213145] text-white text-xs font-bold px-5 py-3 sm:py-2.5 rounded shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            <span>Acknowledge & Return to Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
