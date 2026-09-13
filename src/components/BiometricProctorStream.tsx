import React, { useRef, useState, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  ShieldCheck,
  CheckCircle2,
  Minimize2,
  Maximize2,
  FlipHorizontal,
  ChevronDown,
  ChevronUp,
  Lock,
  EyeOff,
} from 'lucide-react';
import { IncidentType } from '../types';

interface BiometricProctorStreamProps {
  onTriggerAnomaly: (type: IncidentType, details: string) => void;
  webcamActive: boolean;
  micActive: boolean;
  setWebcamActive: (active: boolean) => void;
  setMicActive: (active: boolean) => void;
  isExamStarted?: boolean;
}

export const BiometricProctorStream: React.FC<BiometricProctorStreamProps> = ({
  onTriggerAnomaly,
  webcamActive,
  micActive,
  setWebcamActive,
  setMicActive,
  isExamStarted = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [usingRealCamera, setUsingRealCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [micLevelDb, setMicLevelDb] = useState(-32);
  const [faceConfidence, setFaceConfidence] = useState(99.4);
  const [gazeDeviation, setGazeDeviation] = useState('0.02° DEV');
  const [activeAnomaly, setActiveAnomaly] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [showTestTriggers, setShowTestTriggers] = useState(false);

  // Live audio meter fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (micActive) {
        setMicLevelDb(-30 - Math.floor(Math.random() * 8));
      } else {
        setMicLevelDb(-99);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [micActive]);

  // Handle hardware webcam toggle
  const toggleRealCamera = async () => {
    if (usingRealCamera) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setUsingRealCamera(false);
      return;
    }

    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360 },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setUsingRealCamera(true);
      setWebcamActive(true);
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access not permitted or unavailable. Fallback AI video feed active.');
      setUsingRealCamera(false);
    }
  };

  const handleSimulateIncident = (type: IncidentType) => {
    let details = '';
    if (type === IncidentType.PHONE_DETECTED) {
      details = 'YOLOv8 Object Detection: Handheld mobile smartphone detected in right quadrant (Conf 96.2%).';
      setActiveAnomaly('PHONE DETECTED (YOLO)');
    } else if (type === IncidentType.MULTIPLE_PERSONS) {
      details = 'MediaPipe Biometric: Multiple distinct face geometries identified in visual boundary (Count = 2).';
      setActiveAnomaly('MULTIPLE PERSONS IN FRAME');
    } else if (type === IncidentType.FACE_MISSING) {
      details = 'Face bounding box lost: Candidate completely vacated the examination perimeter.';
      setActiveAnomaly('CANDIDATE ABSENT / NO FACE');
      setFaceConfidence(0.0);
    } else if (type === IncidentType.UNUSUAL_HEAD_MOVEMENT) {
      details = 'Gaze deviation threshold breached: Yaw > 42° sustained for 4.8 seconds.';
      setActiveAnomaly('EXTREME GAZE DEVIATION');
      setGazeDeviation('42.8° DEV');
    } else if (type === IncidentType.HARDWARE_DISCONNECT) {
      details = 'Webcam or microphone peripheral stream terminated or interrupted.';
      setActiveAnomaly('PERIPHERAL STREAM FAILURE');
      setWebcamActive(false);
    }

    onTriggerAnomaly(type, details);

    setTimeout(() => {
      setActiveAnomaly(null);
      setFaceConfidence(99.4);
      setGazeDeviation('0.02° DEV');
    }, 4000);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-xs p-3.5 flex flex-col gap-2 border border-[#e2e8f0]">
      {/* Header with clear self-view notice */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs text-[#0b1c30] font-bold">My Camera Feed (Self-View)</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Mirror toggle */}
          {!isMinimized && (
            <button
              onClick={() => setIsMirrored(!isMirrored)}
              className="text-[#45464d] hover:text-[#0051d5] p-1 rounded hover:bg-slate-100 transition-colors"
              title={isMirrored ? 'Disable Mirroring' : 'Enable Mirroring'}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Minimize / Expand Toggle to make experience comfortable */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-[#45464d] hover:text-[#0051d5] p-1 rounded hover:bg-slate-100 transition-colors flex items-center gap-1 text-[11px] font-medium"
            title={isMinimized ? 'Expand Self-View Video' : 'Minimize Video to reduce exam distraction'}
          >
            {isMinimized ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Minimize</span>
              </>
            )}
          </button>

          {/* Real camera toggle */}
          <button
            onClick={toggleRealCamera}
            className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
              usingRealCamera
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-[#eff4ff] text-[#0051d5] border-[#d3e4fe] hover:bg-[#dce9ff]'
            }`}
          >
            {usingRealCamera ? 'Hardware Cam' : 'Use Cam'}
          </button>
        </div>
      </div>

      {/* Reassurance banner for student privacy */}
      <div className="bg-[#f0fdf4] border border-emerald-200/80 rounded px-2.5 py-1 flex items-center justify-between text-[10.5px] text-emerald-900 font-medium">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>Private Stream: Only visible to you & invigilator</span>
        </div>
        <span className="text-emerald-700 font-semibold">Other candidates hidden</span>
      </div>

      {cameraError && (
        <div className="text-[10px] bg-amber-50 text-amber-800 p-1.5 rounded border border-amber-200">
          {cameraError}
        </div>
      )}

      {/* Minimized View Pill (Less anxiety, still actively recording when exam is started) */}
      {isMinimized ? (
        <div className="bg-[#131b2e] rounded-md p-3 text-white flex items-center justify-between border border-[#3f465c]/40">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isExamStarted ? 'bg-[#ba1a1a] animate-pulse' : 'bg-amber-400'
              }`}
            ></span>
            <div>
              <span className="text-xs font-bold block">
                {isExamStarted ? 'Camera Proctoring Active in Background' : 'Proctoring Camera on Standby'}
              </span>
              <span className="text-[10px] text-[#7c839b]">
                {isExamStarted
                  ? `Face Conf: ${faceConfidence.toFixed(1)}% | Audio: ${micLevelDb} dB | Stable`
                  : 'Recording turns ON automatically once exam begins'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-xs bg-[#316bf3] hover:bg-[#0051d5] px-2.5 py-1 rounded font-semibold text-white transition-colors"
          >
            Show Video
          </button>
        </div>
      ) : (
        /* Full 16:9 Proctoring Video Shell */
        <div className="relative w-full aspect-video bg-[#131b2e] rounded-md overflow-hidden shadow-inner flex items-center justify-center border border-[#3f465c]/40">
          {/* Real video if active */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''} ${
              usingRealCamera ? 'block' : 'hidden'
            }`}
          />

          {/* Fallback Image matching student self-view */}
          {!usingRealCamera && (
            <img
              className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''}`}
              alt="Proctoring video feed of candidate Arjun Bodana"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGiaP_OofAlwIWcctK6Vzl3jz9Z9KsQgMPuzufKg0VRhi_8epuH96RGpB2wRP83ZKVEV0yIggQ945M7bNcIPL2yZDO-0bHwkdaAfcydPQ5m3ZGVdniLk-KeudeH2KMBdVvc8wjx_zr6TA6eIpKSN9tXnj7s2XkiKb4MPhoFs41URUnmfog7Y3KlAaJqVSM-f0YQzBhsdYVGbnUg5NcGPwtTlbCMDJvfKWV-JJyXEDejRTR6p-Rw6g"
            />
          )}

          {/* Live Telemetry Overlays inside Video Stream */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-[#000000]/70 backdrop-blur-xs px-2 py-1 rounded">
            {isExamStarted ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                <span className="text-white text-[10px] tracking-wider font-bold">REC ● LIVE</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-amber-300 text-[10px] tracking-wider font-bold">REC: STANDBY (OFF)</span>
              </>
            )}
          </div>

          <div className="absolute top-2 right-2 bg-[#000000]/70 backdrop-blur-xs px-2 py-1 rounded">
            <span className="text-[#b4c5ff] text-[10px] font-semibold">
              {isExamStarted ? `GAZE: ${gazeDeviation}` : 'STANDBY • Awaiting Exam Start'}
            </span>
          </div>

          {activeAnomaly && (
            <div className="absolute inset-0 bg-[#ba1a1a]/40 backdrop-blur-xs flex items-center justify-center p-2 text-center animate-pulse">
              <div className="bg-[#93000a] text-white px-3 py-1.5 rounded text-xs font-black tracking-wider uppercase shadow-lg border border-white/50">
                ⚠️ {activeAnomaly}
              </div>
            </div>
          )}

          {/* Micro Sensor Data Footer */}
          <div className="absolute bottom-0 inset-x-0 bg-[#000000]/80 px-2.5 py-1 text-white flex items-center justify-between font-mono text-[9.5px]">
            <span>
              MIC: {isExamStarted ? (micActive ? `ACTIVE (${micLevelDb} dB)` : 'MUTED') : 'STANDBY (OFF)'}
            </span>
            <span>FACE CONF: {isExamStarted ? `${faceConfidence.toFixed(1)}%` : 'READY (100%)'}</span>
            <span className={isExamStarted ? 'text-emerald-400' : 'text-amber-300'}>
              {isExamStarted ? 'STATUS: REC LIVE' : 'STATUS: READY'}
            </span>
          </div>
        </div>
      )}

      {/* Sensor health row */}
      <div className="flex items-center justify-between pt-0.5 text-[11px]">
        <span className="text-[#45464d] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Continuous Biometric AI Active</span>
        </span>
        <span className="text-[#0051d5] font-semibold">Audio & Video In-Sync</span>
      </div>

      {/* Discrete collapsible test scenario trigger for demonstration */}
      <div className="pt-1 border-t border-slate-100">
        <button
          onClick={() => setShowTestTriggers(!showTestTriggers)}
          className="w-full text-[10px] font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-between py-1 transition-colors cursor-pointer"
        >
          <span>Camera & Sensor Diagnostics (Tester Controls)</span>
          {showTestTriggers ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showTestTriggers && (
          <div className="bg-[#eff4ff] p-2 rounded-md border border-[#d3e4fe] mt-1 animate-in fade-in duration-150">
            <div className="text-[9px] text-slate-500 mb-1.5">
              Simulate candidate behavior to test AI alert triggers:
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <button
                onClick={() => handleSimulateIncident(IncidentType.PHONE_DETECTED)}
                className="bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 py-1 px-1.5 rounded border border-[#c6c6cd] transition-colors truncate font-medium text-left cursor-pointer"
              >
                📱 Phone In Frame
              </button>
              <button
                onClick={() => handleSimulateIncident(IncidentType.MULTIPLE_PERSONS)}
                className="bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 py-1 px-1.5 rounded border border-[#c6c6cd] transition-colors truncate font-medium text-left cursor-pointer"
              >
                👥 Second Face In Frame
              </button>
              <button
                onClick={() => handleSimulateIncident(IncidentType.FACE_MISSING)}
                className="bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 py-1 px-1.5 rounded border border-[#c6c6cd] transition-colors truncate font-medium text-left cursor-pointer"
              >
                👤 Face Absent
              </button>
              <button
                onClick={() => handleSimulateIncident(IncidentType.UNUSUAL_HEAD_MOVEMENT)}
                className="bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 py-1 px-1.5 rounded border border-[#c6c6cd] transition-colors truncate font-medium text-left cursor-pointer"
              >
                👀 Looking Away
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

