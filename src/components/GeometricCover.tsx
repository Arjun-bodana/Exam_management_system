import React from 'react';

interface GeometricCoverProps {
  pattern: 'triangles' | 'circles' | 'hexagons' | 'stripes' | 'grid';
  className?: string;
}

export const GeometricCover: React.FC<GeometricCoverProps> = ({ pattern, className = 'h-28 w-full' }) => {
  return (
    <div className={`relative overflow-hidden bg-zinc-200 dark:bg-zinc-800 ${className}`}>
      {pattern === 'triangles' && (
        <svg
          className="w-full h-full opacity-60 dark:opacity-40"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 400 150"
        >
          <polygon points="0,0 100,150 200,0" fill="#94a3b8" />
          <polygon points="100,150 200,0 300,150" fill="#64748b" />
          <polygon points="200,0 300,150 400,0" fill="#cbd5e1" />
          <polygon points="0,150 100,150 50,75" fill="#cbd5e1" opacity="0.5" />
          <polygon points="300,150 400,150 350,75" fill="#475569" opacity="0.4" />
        </svg>
      )}

      {pattern === 'circles' && (
        <svg
          className="w-full h-full opacity-60 dark:opacity-40"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 400 150"
        >
          <circle cx="80" cy="75" r="70" fill="none" stroke="#64748b" strokeWidth="16" />
          <circle cx="160" cy="75" r="70" fill="none" stroke="#94a3b8" strokeWidth="16" />
          <circle cx="240" cy="75" r="70" fill="none" stroke="#475569" strokeWidth="16" />
          <circle cx="320" cy="75" r="70" fill="none" stroke="#cbd5e1" strokeWidth="16" />
        </svg>
      )}

      {pattern === 'hexagons' && (
        <svg
          className="w-full h-full opacity-50 dark:opacity-30"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 400 150"
        >
          <polygon points="60,20 100,20 120,55 100,90 60,90 40,55" fill="#64748b" />
          <polygon points="140,20 180,20 200,55 180,90 140,90 120,55" fill="#94a3b8" />
          <polygon points="220,20 260,20 280,55 260,90 220,90 200,55" fill="#cbd5e1" />
          <polygon points="300,20 340,20 360,55 340,90 300,90 280,55" fill="#475569" />
          <polygon points="100,75 140,75 160,110 140,145 100,145 80,110" fill="#475569" opacity="0.6" />
          <polygon points="180,75 220,75 240,110 220,145 180,145 160,110" fill="#64748b" opacity="0.6" />
          <polygon points="260,75 300,75 320,110 300,145 260,145 240,110" fill="#94a3b8" opacity="0.6" />
        </svg>
      )}

      {pattern === 'stripes' && (
        <svg
          className="w-full h-full opacity-40 dark:opacity-30"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 400 150"
        >
          <line x1="0" y1="0" x2="400" y2="150" stroke="#64748b" strokeWidth="8" />
          <line x1="-50" y1="0" x2="350" y2="150" stroke="#94a3b8" strokeWidth="8" />
          <line x1="50" y1="0" x2="450" y2="150" stroke="#cbd5e1" strokeWidth="8" />
          <line x1="-100" y1="0" x2="300" y2="150" stroke="#475569" strokeWidth="8" />
          <line x1="100" y1="0" x2="500" y2="150" stroke="#64748b" strokeWidth="8" />
        </svg>
      )}

      {pattern === 'grid' && (
        <svg
          className="w-full h-full opacity-40 dark:opacity-30"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 400 150"
        >
          <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      )}

      {/* Subtle overlay gradient to match Moodle's flat header aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
};
