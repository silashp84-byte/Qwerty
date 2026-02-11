
import React from 'react';

interface GeminiEyesProps {
  isAnalyzing: boolean;
  status: 'BUY' | 'SELL' | 'NEUTRAL';
}

export const GeminiEyes: React.FC<GeminiEyesProps> = ({ isAnalyzing, status }) => {
  const colorClass = status === 'BUY' ? 'text-emerald-400' : status === 'SELL' ? 'text-rose-500' : 'text-cyan-400';
  const glowClass = status === 'BUY' ? 'drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]' : status === 'SELL' ? 'drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]';

  return (
    <div className="relative flex justify-center items-center w-full h-48 py-8">
      <div className={`flex space-x-12 ${isAnalyzing ? 'animate-pulse' : ''} transition-all duration-500`}>
        {/* Left Eye */}
        <div className="relative">
          <svg className={`w-24 h-24 ${colorClass} ${glowClass}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="10" fill="currentColor">
              <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
            </circle>
            {isAnalyzing && (
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
        </div>
        
        {/* Right Eye */}
        <div className="relative">
          <svg className={`w-24 h-24 ${colorClass} ${glowClass}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="10" fill="currentColor">
              <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
            </circle>
            {isAnalyzing && (
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="4s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
        </div>
      </div>
      
      {/* Scanner Beam Overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 scanner-line pointer-events-none"></div>
      )}
    </div>
  );
};
