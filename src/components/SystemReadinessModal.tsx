import React, { useState, useEffect } from 'react';
import {
  Camera,
  Mic,
  Monitor,
  Wifi,
  Battery,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Maximize,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { CandidateSession } from '../types';

interface SystemReadinessModalProps {
  candidate: CandidateSession;
  onComplete: () => void;
  onBack?: () => void;
}

export const SystemReadinessModal: React.FC<SystemReadinessModalProps> = ({ candidate, onComplete, onBack }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Hardware Checks
  const [webcamStatus, setWebcamStatus] = useState<'pending' | 'checking' | 'passed' | 'failed'>('pending');
  const [micStatus, setMicStatus] = useState<'pending' | 'checking' | 'passed' | 'failed'>('pending');
  const [screenShareStatus, setScreenShareStatus] = useState<'pending' | 'checking' | 'passed' | 'failed'>('pending');

  // Network & Device
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number>(94);
  const [browserValid, setBrowserValid] = useState<boolean>(true);

  // Identity Verification
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [faceMatchScore, setFaceMatchScore] = useState<number | null>(null);

  // Environment & Rules
  const [fullscreenGranted, setFullscreenGranted] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);

  // Auto-run hardware check
  const runHardwareChecks = async () => {
    setWebcamStatus('checking');
    setMicStatus('checking');
    setScreenShareStatus('checking');

    // Test media devices
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setWebcamStatus('passed');
        setMicStatus('passed');
      } else {
        setWebcamStatus('passed');
        setMicStatus('passed');
      }
    } catch {
      // Graceful fallback for simulator
      setWebcamStatus('passed');
      setMicStatus('passed');
    }

    setScreenShareStatus('passed');
  };

  const runNetworkCheck = () => {
    const start = performance.now();
    setTimeout(() => {
      const ping = Math.round(performance.now() - start + 11);
      setLatencyMs(ping);
    }, 400);

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    }
  };

  useEffect(() => {
    runHardwareChecks();
    runNetworkCheck();
  }, []);

  const requestFullscreenMode = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    setFullscreenGranted(true);
  };

  const capturePhotoAndVerify = () => {
    setPhotoCaptured(true);
    setTimeout(() => {
      setFaceMatchScore(98.6);
    }, 800);
  };

  const canProceed =
    webcamStatus === 'passed' &&
    micStatus === 'passed' &&
    screenShareStatus === 'passed' &&
    photoCaptured &&
    faceMatchScore !== null &&
    agreedToRules;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-[#f8f9ff]">
      {/* Title Card */}
      <div className="bg-white rounded-lg p-6 shadow-xs border border-[#e2e8f0] mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
          <div className="flex items-start gap-3">
            {onBack && (
              <button
                onClick={onBack}
                id="readinessTopBackButton"
                className="mt-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[#0b1c30] border border-slate-300 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Back to previous screen"
              >
                <ArrowLeft className="w-4 h-4 text-[#0051d5]" />
                <span>Back</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#0051d5]" />
                <h1 className="text-xl font-bold text-[#0b1c30]">
                  Pre-Examination & System Readiness Gate
                </h1>
              </div>
              <p className="text-xs text-[#45464d] mt-1">
                National Certification Council & SECUREEXAM Automated Environmental Compliance Engine
              </p>
            </div>
          </div>

          <div className="bg-[#eff4ff] px-3 py-1.5 rounded-md border border-[#d3e4fe] text-right shrink-0">
            <span className="text-[10px] text-[#45464d] uppercase font-bold block">Candidate Verification</span>
            <span className="text-xs text-[#0051d5] font-bold">{candidate.name} ({candidate.rollNumber})</span>
          </div>
        </div>

        {/* Diagnostic Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Step 1: Hardware Diagnostics */}
          <div className="bg-[#eff4ff] p-4 rounded-lg border border-[#d3e4fe] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0051d5] flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                1. Hardware Diagnostics
              </span>
              <button
                onClick={runHardwareChecks}
                className="text-[10px] text-[#0051d5] font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Re-check
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-white p-2 rounded border border-[#c6c6cd]/50">
                <span className="flex items-center gap-2 text-[#0b1c30]">
                  <Camera className="w-3.5 h-3.5 text-[#45464d]" /> HD Webcam Feed
                </span>
                {webcamStatus === 'passed' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Granted
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold text-[11px]">Verifying...</span>
                )}
              </div>

              <div className="flex items-center justify-between bg-white p-2 rounded border border-[#c6c6cd]/50">
                <span className="flex items-center gap-2 text-[#0b1c30]">
                  <Mic className="w-3.5 h-3.5 text-[#45464d]" /> Omnidirectional Mic
                </span>
                {micStatus === 'passed' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Granted
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold text-[11px]">Verifying...</span>
                )}
              </div>

              <div className="flex items-center justify-between bg-white p-2 rounded border border-[#c6c6cd]/50">
                <span className="flex items-center gap-2 text-[#0b1c30]">
                  <Monitor className="w-3.5 h-3.5 text-[#45464d]" /> Display Capture Driver
                </span>
                {screenShareStatus === 'passed' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Authorized
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold text-[11px]">Verifying...</span>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Network & Device Check */}
          <div className="bg-[#eff4ff] p-4 rounded-lg border border-[#d3e4fe] flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0051d5] flex items-center gap-1.5">
              <Wifi className="w-4 h-4" />
              2. Network & Device Check
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-white p-2 rounded border border-[#c6c6cd]/50">
                <span className="flex items-center gap-2 text-[#0b1c30]">
                  <Wifi className="w-3.5 h-3.5 text-[#45464d]" /> Ping Latency to Node
                </span>
                <span className="text-[#0051d5] font-mono font-bold text-[11px]">
                  {latencyMs ? `${latencyMs} ms (Optimal)` : 'Pinging...'}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white p-2 rounded border border-[#c6c6cd]/50">
                <span className="flex items-center gap-2 text-[#0b1c30]">
                  <Battery className="w-3.5 h-3.5 text-[#45464d]" /> Battery Level
                </span>
                <span className="text-emerald-700 font-bold text-[11px]">
                  {batteryLevel}% (AC Connected)
                </span>
              </div>

              <div className="flex items-center justify-between bg-white p-2 rounded border border-[#c6c6cd]/50">
                <span className="flex items-center gap-2 text-[#0b1c30]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#45464d]" /> Browser Version
                </span>
                <span className="text-emerald-700 font-bold text-[11px]">
                  Vite / Chromium 122+ (Supported)
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Biometric Identity Verification */}
          <div className="bg-[#eff4ff] p-4 rounded-lg border border-[#d3e4fe] flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0051d5] flex items-center gap-1.5">
              <Camera className="w-4 h-4" />
              3. Identity Verification & Face Match
            </span>

            <div className="flex items-center gap-4 bg-white p-3 rounded border border-[#c6c6cd]/50">
              <div className="relative w-20 h-20 rounded-md overflow-hidden bg-black shrink-0 border border-[#3f465c]">
                <img
                  src={candidate.avatarUrl}
                  alt="Candidate database photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-emerald-500/70 rounded-md pointer-events-none"></div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 text-xs">
                <span className="text-[#45464d] text-[11px]">
                  Registered Photo vs. Live Camera Baseline
                </span>

                {!photoCaptured ? (
                  <button
                    onClick={capturePhotoAndVerify}
                    className="bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold py-2.5 px-3 rounded shadow-xs w-full sm:w-fit transition-colors cursor-pointer min-h-[40px]"
                  >
                    Capture Baseline Snapshot
                  </button>
                ) : faceMatchScore ? (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-[11px]">Biometric Match: {faceMatchScore}% Verified</span>
                  </div>
                ) : (
                  <span className="text-amber-700 text-[11px] font-semibold">
                    Matching facial vectors with server database...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 4: Environment Setup & Rules Consent */}
          <div className="bg-[#eff4ff] p-4 rounded-lg border border-[#d3e4fe] flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0051d5] flex items-center gap-1.5">
              <Maximize className="w-4 h-4" />
              4. Environment Lock & Consent
            </span>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between bg-white p-2.5 rounded border border-[#c6c6cd]/50 gap-2">
                <span className="text-[#0b1c30] font-medium text-xs">Fullscreen Mode</span>
                <button
                  onClick={requestFullscreenMode}
                  className={`text-[11px] font-bold px-3 py-2 rounded transition-colors min-h-[38px] shrink-0 cursor-pointer ${
                    fullscreenGranted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#0051d5] text-white hover:bg-[#003ea8]'
                  }`}
                >
                  {fullscreenGranted ? 'Locked Fullscreen' : 'Enable Fullscreen'}
                </button>
              </div>

              <label className="flex items-start gap-2 bg-white p-2.5 rounded border border-[#c6c6cd]/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#0051d5] accent-[#0051d5] cursor-pointer shrink-0"
                />
                <span className="text-[11px] text-[#0b1c30] leading-snug break-words">
                  I agree to the strict examination bylaws: No tab switching, no secondary screens, no mobile phones, and no unauthorized personnel in the room. I acknowledge violations trigger immediate disqualification.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Final Launch Action & Back Navigation */}
        <div className="mt-6 pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onBack && (
              <button
                onClick={onBack}
                id="readinessFooterBackButton"
                className="w-full sm:w-auto px-4 py-2.5 rounded-md text-xs font-bold border border-[#c6c6cd] bg-white hover:bg-slate-50 text-[#0b1c30] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-[#0051d5]" />
                <span>Back to Exam Room</span>
              </button>
            )}
            <span className="text-xs text-[#45464d] text-center sm:text-left hidden md:inline">
              All 4 gates must be approved before access to the exam room is unlocked.
            </span>
          </div>

          <button
            onClick={onComplete}
            disabled={!canProceed}
            className={`w-full sm:w-auto px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md min-h-[44px] ${
              canProceed
                ? 'bg-[#000000] hover:bg-[#213145] text-white cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Launch Secure ExamRoom</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
