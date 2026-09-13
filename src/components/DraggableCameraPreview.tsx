import React, { useState, useEffect, useRef } from 'react';
import { Camera, Minimize2, GripHorizontal, ShieldCheck } from 'lucide-react';
import { CandidateSession } from '../types';

interface DraggableCameraPreviewProps {
  candidate: CandidateSession;
  isMinimizedDefault?: boolean;
  onToggleMinimize?: (minimized: boolean) => void;
  isExamStarted?: boolean;
}

export const DraggableCameraPreview: React.FC<DraggableCameraPreviewProps> = ({
  candidate,
  isMinimizedDefault = false,
  onToggleMinimize,
  isExamStarted = true,
}) => {
  const [isMinimized, setIsMinimized] = useState(isMinimizedDefault);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    hasMoved: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize position to bottom right corner once mounted
  useEffect(() => {
    if (typeof window !== 'undefined' && position === null) {
      const isMobile = window.innerWidth < 640;
      const initialWidth = isMinimized ? 48 : isMobile ? 176 : 208;
      const initialHeight = isMinimized ? 48 : isMobile ? 110 : 130;
      setPosition({
        x: Math.max(16, window.innerWidth - initialWidth - (isMobile ? 12 : 24)),
        y: Math.max(70, window.innerHeight - initialHeight - (isMobile ? 16 : 28)),
      });
    }
  }, [isMinimized, position]);

  // Handle window resize to keep camera preview within viewport bounds
  useEffect(() => {
    const handleResize = () => {
      if (!position || !containerRef.current) return;
      const width = containerRef.current.offsetWidth || 180;
      const height = containerRef.current.offsetHeight || 120;
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const maxY = Math.max(64, window.innerHeight - height - 8);

      setPosition((prev) => {
        if (!prev) return prev;
        return {
          x: Math.min(Math.max(8, prev.x), maxX),
          y: Math.min(Math.max(64, prev.y), maxY),
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with left click or primary touch
    if (e.button !== 0) return;

    const currentPos = position || {
      x: window.innerWidth - (isMinimized ? 60 : 220),
      y: window.innerHeight - (isMinimized ? 60 : 150),
    };

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: currentPos.x,
      origY: currentPos.y,
      hasMoved: false,
    };

    setIsDragging(true);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragRef.current.hasMoved = true;
      }

      const width = containerRef.current?.offsetWidth || (isMinimized ? 48 : 200);
      const height = containerRef.current?.offsetHeight || (isMinimized ? 48 : 130);
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const maxY = Math.max(64, window.innerHeight - height - 8);

      const newX = Math.min(Math.max(8, dragRef.current.origX + dx), maxX);
      const newY = Math.min(Math.max(64, dragRef.current.origY + dy), maxY);

      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleToggle = (min: boolean) => {
    setIsMinimized(min);
    onToggleMinimize?.(min);
  };

  const style: React.CSSProperties = position
    ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
      }
    : {
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        touchAction: 'none',
      };

  return (
    <div
      ref={containerRef}
      style={style}
      className={`z-50 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} transition-shadow duration-150`}
      onPointerDown={handlePointerDown}
    >
      {isMinimized ? (
        /* MINIMIZED FLOATING ICON: Small, non-intrusive camera icon */
        <div className="relative group">
          <button
            type="button"
            onClick={(e) => {
              if (!dragRef.current.hasMoved) {
                e.stopPropagation();
                handleToggle(false);
              }
            }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#131b2e] hover:bg-[#1a243d] active:scale-95 text-white border-2 border-[#316bf3] shadow-2xl flex items-center justify-center cursor-pointer transition-all ring-2 ring-black/40"
            title="Click to expand Live Proctor Camera Feed (or drag to reposition)"
          >
            <Camera className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />

            {/* Recording Indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              {isExamStarted ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border border-white"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border border-white"></span>
              )}
            </span>
          </button>

          {/* Quick Hover Tooltip */}
          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center whitespace-nowrap bg-black/90 text-white text-[10px] font-semibold py-1 px-2 rounded shadow-lg border border-white/10 z-50">
            <span>
              {isExamStarted ? 'Camera Active (REC ON) • Click to Expand' : 'Camera Standby • REC starts with exam'}
            </span>
            <span className="text-[8.5px] text-[#7c839b]">Drag to move anywhere</span>
          </div>
        </div>
      ) : (
        /* EXPANDED DRAGGABLE CAMERA OVERLAY */
        <div
          className="w-44 sm:w-52 aspect-video bg-[#131b2e] rounded-xl shadow-2xl border-2 border-[#316bf3] relative overflow-hidden flex flex-col justify-between group ring-2 ring-black/30"
        >
          {/* Video Stream Candidate Self-View */}
          <img
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            alt="Candidate Self-View Video Feed"
            src={candidate.avatarUrl}
            draggable={false}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/75 pointer-events-none"></div>

          {/* Top Bar: Drag Grip, REC Badge, and Minimize/Hide Button */}
          <div className="relative z-10 p-1.5 flex items-center justify-between gap-1 text-[10px] text-white font-mono">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/10">
              {isExamStarted ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-[9.5px] font-bold text-red-400">REC</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-[9.5px] font-bold text-amber-300">REC STANDBY</span>
                </>
              )}
              <GripHorizontal className="w-3.5 h-3.5 text-slate-400 opacity-70 group-hover:opacity-100" />
            </div>

            {/* MINIMIZE / HIDE BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(true);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-black/75 hover:bg-black/95 active:scale-95 px-2 py-0.5 rounded-md text-white border border-white/20 flex items-center gap-1 cursor-pointer transition-colors text-[10px] font-bold"
              title="Minimize camera overlay into small floating icon"
            >
              <Minimize2 className="w-3 h-3 text-slate-200" />
              <span className="text-[9px] uppercase tracking-wider">Hide</span>
            </button>
          </div>

          {/* Center Hint (visible during drag) */}
          {isDragging && (
            <div className="relative z-10 self-center text-center text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded-full font-sans pointer-events-none">
              Repositioning...
            </div>
          )}

          {/* Bottom Telemetry Bar */}
          <div className="relative z-10 p-1.5 flex items-center justify-between text-[9px] text-emerald-400 font-mono">
            <div className="flex items-center gap-1 bg-black/50 px-1 py-0.5 rounded">
              <ShieldCheck className={`w-2.5 h-2.5 ${isExamStarted ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className={isExamStarted ? 'text-emerald-400' : 'text-amber-300'}>
                {isExamStarted ? 'Face: 99.4%' : 'REC Standby'}
              </span>
            </div>
            <span className="text-white/90 bg-black/50 px-1.5 py-0.5 rounded text-[8.5px] truncate max-w-[80px]">
              {candidate.name.split(' ')[0]} {candidate.name.split(' ')[1]?.[0]}.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
