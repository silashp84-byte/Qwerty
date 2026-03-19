
import React from 'react';

interface GeminiEyesProps {
  isAnalyzing: boolean;
  status: 'BUY' | 'SELL' | 'NEUTRAL';
}

export const GeminiEyes: React.FC<GeminiEyesProps> = ({ isAnalyzing, status }) => {
  const colorClass = status === 'BUY' ? 'text-emerald-400' : status === 'SELL' ? 'text-rose-500' : 'text-cyan-400';
  const glowClass = status === 'BUY' ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : status === 'SELL' ? 'drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]';

  return (
    <div className="relative flex justify-center items-center w-full h-40 py-4">
      <div className={`flex space-x-10 ${isAnalyzing ? 'scale-105' : 'scale-100'} transition-all duration-700 ease-in-out`}>
        {/* Left Eye */}
        <div className="relative">
          <svg className={`w-20 h-20 ${colorClass} ${glowClass} transition-colors duration-500`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="8" fill="currentColor" className={isAnalyzing ? 'animate-pulse' : ''} />
            {isAnalyzing && (
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
        </div>
        
        {/* Right Eye */}
        <div className="relative">
          <svg className={`w-20 h-20 ${colorClass} ${glowClass} transition-colors duration-500`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="8" fill="currentColor" className={isAnalyzing ? 'animate-pulse' : ''} />
            {isAnalyzing && (
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3">
                <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="10s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
