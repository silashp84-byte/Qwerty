
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GeminiEyes } from './components/GeminiEyes';
import { MarketChart } from './components/MarketChart';
import { TradingSignal, MarketData, MarketType } from './types';
import { getMarketAnalysis } from './services/geminiService';
import { Bell, ShieldAlert, TrendingUp, TrendingDown, Target, Zap, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<MarketType>(MarketType.CRYPTO);
  const [currentSignal, setCurrentSignal] = useState<TradingSignal | null>(null);
  const [history, setHistory] = useState<TradingSignal[]>([]);
  const [chartData, setChartData] = useState<MarketData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [countdown, setCountdown] = useState(90);
  const lastUpdateRef = useRef<number>(Date.now());

  const generateMockChartData = (basePrice: number) => {
    const data: MarketData[] = [];
    let current = basePrice;
    for (let i = 0; i < 20; i++) {
      current = current + (Math.random() - 0.5) * (basePrice * 0.02);
      data.push({
        time: `${i}:00`,
        price: Number(current.toFixed(2))
      });
    }
    return data;
  };

  const fetchSignal = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const signal = await getMarketAnalysis(activeMarket);
      setCurrentSignal(signal);
      setHistory(prev => [signal, ...prev].slice(0, 10));
      
      const base = parseFloat(signal.price.replace(/[^0-9.]/g, '')) || 50000;
      setChartData(generateMockChartData(base));
      
      // Reset timer
      setCountdown(90);
      lastUpdateRef.current = Date.now();
      
      // Play a subtle notification sound (if allowed)
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.2;
        audio.play().catch(() => {});
      } catch (e) {}

    } catch (error) {
      console.error("Analysis Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [activeMarket]);

  // Initial load
  useEffect(() => {
    fetchSignal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchSignal();
          return 90;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchSignal]);

  const getStatusColor = (direction: string) => {
    if (direction === 'BUY') return 'text-emerald-400';
    if (direction === 'SELL') return 'text-rose-500';
    return 'text-cyan-400';
  };

  const getStatusBg = (direction: string) => {
    if (direction === 'BUY') return 'bg-emerald-500/10 border-emerald-500/50';
    if (direction === 'SELL') return 'bg-rose-500/10 border-rose-500/50';
    return 'bg-cyan-500/10 border-cyan-500/50';
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-950 flex flex-col font-inter relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-cyan-500/10 blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <h1 className="font-orbitron font-bold text-lg tracking-wider text-white">GEMINI VISION</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Next Scan</span>
            <div className="flex items-center text-cyan-400 font-orbitron font-bold text-sm">
              <Clock className="w-3 h-3 mr-1" />
              {countdown}s
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        {/* Market Selector */}
        <div className="flex space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {Object.values(MarketType).map(m => (
            <button
              key={m}
              onClick={() => setActiveMarket(m)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeMarket === m 
                  ? 'bg-slate-800 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Gemini Vision Component */}
        <div className="relative">
          <GeminiEyes 
            isAnalyzing={isAnalyzing} 
            status={currentSignal?.direction || 'NEUTRAL'} 
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center">
            {isAnalyzing ? (
              <p className="text-cyan-400 font-orbitron animate-pulse text-xs uppercase tracking-widest">
                Analyzing Market Patterns...
              </p>
            ) : (
              <p className="text-slate-500 font-orbitron text-[10px] uppercase tracking-widest">
                Vision Calibration Complete
              </p>
            )}
          </div>
        </div>

        {/* Current Signal Alert */}
        {currentSignal && (
          <div className={`p-5 rounded-2xl border-2 transition-all duration-500 ${getStatusBg(currentSignal.direction)} shadow-2xl`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Trigger</span>
                <h2 className={`text-4xl font-orbitron font-bold ${getStatusColor(currentSignal.direction)}`}>
                  {currentSignal.direction}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                <div className={`text-xl font-orbitron font-bold ${getStatusColor(currentSignal.direction)}`}>
                  {currentSignal.confidence}%
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed italic mb-4">
              "{currentSignal.reasoning}"
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">RSI</span>
                <span className="font-orbitron text-white text-xs">{currentSignal.indicators.rsi}</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">MACD</span>
                <span className="font-orbitron text-white text-xs truncate">{currentSignal.indicators.macd}</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Price</span>
                <span className="font-orbitron text-white text-xs">{currentSignal.price}</span>
              </div>
            </div>
          </div>
        )}

        {/* Visual Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-cyan-500" />
              Live Prediction
            </h3>
            <span className="text-[10px] text-slate-600">Real-time simulation</span>
          </div>
          <MarketChart data={chartData} status={currentSignal?.direction || 'NEUTRAL'} />
        </div>

        {/* Signal History */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
            <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />
            Recent Triggers
          </h3>
          <div className="space-y-2">
            {history.length > 0 ? history.map((h, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${h.direction === 'BUY' ? 'bg-emerald-500' : h.direction === 'SELL' ? 'bg-rose-500' : 'bg-cyan-500'} animate-pulse`}></div>
                  <div>
                    <div className="font-bold text-sm text-white">{h.direction} <span className="text-slate-600 font-normal">at</span> {h.price}</div>
                    <div className="text-[10px] text-slate-500">{h.timestamp} • {h.indicators.trend}</div>
                  </div>
                </div>
                <div className={`font-orbitron text-xs ${getStatusColor(h.direction)}`}>
                  {h.confidence}%
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-600 text-sm border-2 border-dashed border-slate-900 rounded-xl">
                No history data available yet.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button / Quick Control */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full px-6 z-20">
        <button 
          onClick={fetchSignal}
          disabled={isAnalyzing}
          className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-orbitron py-4 rounded-2xl shadow-[0_10px_30px_rgba(6,182,212,0.3)] flex items-center justify-center space-x-3 transition-all active:scale-95"
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Calibrating Vision...</span>
            </div>
          ) : (
            <>
              <Target className="w-5 h-5" />
              <span>SCAN MARKET NOW</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Nav Simulation */}
      <div className="fixed bottom-0 left-0 w-full h-20 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900 flex justify-around items-center px-4 pointer-events-none">
        <div className="flex flex-col items-center text-cyan-500">
          <Zap className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-bold">Signals</span>
        </div>
        <div className="flex flex-col items-center text-slate-600">
          <TrendingUp className="w-6 h-6" />
          <span className="text-[10px] mt-1">Charts</span>
        </div>
        <div className="flex flex-col items-center text-slate-600">
          <Bell className="w-6 h-6" />
          <span className="text-[10px] mt-1">Alerts</span>
        </div>
      </div>
    </div>
  );
};

export default App;
