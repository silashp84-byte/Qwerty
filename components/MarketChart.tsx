
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MarketData } from '../types';

interface MarketChartProps {
  data: MarketData[];
  status: 'BUY' | 'SELL' | 'NEUTRAL';
}

export const MarketChart: React.FC<MarketChartProps> = ({ data, status }) => {
  const chartColor = status === 'BUY' ? '#34d399' : status === 'SELL' ? '#f43f5e' : '#22d3ee';

  return (
    <div className="h-64 w-full bg-slate-900/50 rounded-xl border border-slate-800 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#475569" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            hide={true} 
            domain={['auto', 'auto']} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={chartColor} 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
