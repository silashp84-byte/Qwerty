
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeminiEyes } from './components/GeminiEyes';
import { MarketChart } from './components/MarketChart';
import { TradingSignal, MarketData, MarketType } from './types';
import { getMarketAnalysis } from './services/geminiService';
import { Bell, ShieldAlert, TrendingUp, Target, Zap, Clock, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<MarketType>(MarketType.CRYPTO);
  const [currentSignal, setCurrentSignal] = useState<TradingSignal | null>(null);
  const [history, setHistory] = useState<TradingSignal[]>([]);
  const [chartData, setChartData] = useState<MarketData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [countdown, setCountdown] = useState(90);

  const fetchSignal = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const signal = await getMarketAnalysis(activeMarket);
      setCurrentSignal(signal);
      setHistory(prev => [signal, ...prev].slice(0, 10));
      
      const base = parseFloat(signal.price.replace(/[^0-9.]/g, '')) || 50000;
      setChartData(Array.from({ length: 20 }, (_, i) => ({
        time: `${i}:00`,
        price: Number((base + (Math.random() - 0.5) * (base * 0.02)).toFixed(2))
      })));
      
      setCountdown(90);
      try {
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
      } catch (e) {}
    } catch (error) {
      console.error("Analysis Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [activeMarket]);

  useEffect(() => { fetchSignal(); }, [fetchSignal]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev <= 1 ? (fetchSignal(), 90) : prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchSignal]);

  const statusStyles = {
    BUY: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/50', dot: 'bg-emerald-500' },
    SELL: { color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/50', dot: 'bg-rose-500' },
    NEUTRAL: { color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/50', dot: 'bg-cyan-500' }
  };

  const currentStyle = statusStyles[currentSignal?.direction || 'NEUTRAL'];

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-950 flex flex-col font-inter relative overflow-hidden text-slate-200">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <header className="p-5 flex justify-between items-center z-10 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-900/20">
            <Zap className="text-white w-4 h-4 fill-current" />
          </div>
          <h1 className="font-orbitron font-bold text-base tracking-widest">GEMINI VISION</h1>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-white/5">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span className="text-xs font-orbitron font-bold text-cyan-400">{countdown}s</span>
        </div>
      </header>

      <main className="flex-1 p-5 space-y-6 overflow-y-auto pb-32">
        <div className="space-y-3">
          <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl border border-white/5">
            {Object.values(MarketType).map(m => (
              <button
                key={m}
                onClick={() => setActiveMarket(m)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeMarket === m ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-2 bg-cyan-500/5 py-1.5 rounded-lg border border-cyan-500/10">
            <Target className="w-3 h-3 text-cyan-500" />
            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">1000pt Target Strategy</span>
          </div>
        </div>

        <div className="relative py-4">
          <GeminiEyes isAnalyzing={isAnalyzing} status={currentSignal?.direction || 'NEUTRAL'} />
          <div className="absolute bottom-0 w-full text-center">
            <p className={`text-[10px] font-orbitron uppercase tracking-[0.2em] ${isAnalyzing ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`}>
              {isAnalyzing ? 'Scanning Patterns' : 'Vision Calibrated'}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentSignal && (
            <motion.div
              key={currentSignal.timestamp}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-5 rounded-2xl border-2 ${currentStyle.bg} shadow-xl space-y-4`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{currentSignal.market}</span>
                  <h2 className={`text-4xl font-orbitron font-bold ${currentStyle.color}`}>{currentSignal.direction}</h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confidence</span>
                  <div className={`text-xl font-orbitron font-bold ${currentStyle.color}`}>{currentSignal.confidence}%</div>
                </div>
              </div>

              <p className="text-sm text-slate-400 italic leading-snug">"{currentSignal.reasoning}"</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-500 uppercase block mb-1">Target / Lot</span>
                  <div className="flex justify-between items-baseline">
                    <span className="font-orbitron text-emerald-400 text-sm">{currentSignal.targetPrice}</span>
                    <span className="font-orbitron text-cyan-400 text-[10px]">{currentSignal.lotSize}</span>
                  </div>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-500 uppercase block mb-1">Entry / Exit</span>
                  <div className="flex justify-between items-baseline">
                    <span className="font-orbitron text-white text-xs">{currentSignal.entryTime}</span>
                    <span className="font-orbitron text-white/50 text-[10px]">{currentSignal.exitTime}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
              <ShieldAlert className="w-3 h-3 mr-2 text-rose-500" />
              Recent Triggers
            </h3>
          </div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className="bg-slate-900/40 border border-white/5 p-3 rounded-xl flex justify-between items-center group hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${statusStyles[h.direction].dot}`} />
                  <div>
                    <div className="font-bold text-xs">
                      <span className="text-cyan-400">{h.market}</span> • {h.direction} <span className="text-slate-600 font-normal">@</span> {h.price}
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">
                      {h.timestamp} • Target: {h.targetPrice} • Lot: {h.lotSize}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-slate-400 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 z-30 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
        <button 
          onClick={fetchSignal}
          disabled={isAnalyzing}
          className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-orbitron py-4 rounded-2xl shadow-2xl shadow-cyan-900/20 flex items-center justify-center space-x-3 transition-all active:scale-[0.98]"
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-sm tracking-widest">CALIBRATING...</span>
            </div>
          ) : (
            <>
              <Target className="w-5 h-5" />
              <span className="text-sm tracking-widest">SCAN MARKET</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default App;
