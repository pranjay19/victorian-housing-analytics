import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { BarChart3, TrendingUp, Layers, RotateCcw } from 'lucide-react';
import { formatCompactAUD, formatAUD } from '../utils/formatters';

// Custom Tooltip Component for Recharts
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl space-y-1 z-50 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <span className="font-bold text-white text-sm font-sans">{data.suburb}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
            {data.property_count} {data.property_count === 1 ? 'Property' : 'Properties'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Average Price:</span>
          <span className="font-extrabold text-cyan-400 font-mono text-sm">
            {formatAUD(data.average_price)}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 pt-1">
          Ranking: <span className="text-slate-300 font-semibold">Top Tier Suburb</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function SuburbChart({ data = [] }) {
  const [layout, setLayout] = useState('horizontal'); // 'horizontal' | 'vertical'

  if (!data || data.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
        No suburb price data matches current filter criteria.
      </div>
    );
  }

  // Display top 10 suburbs for clean visualization focus
  const chartData = data.slice(0, 10);

  // Gradient colors for top suburbs
  const barGradients = [
    '#06b6d4', '#0891b2', '#0e7490', '#3b82f6', '#2563eb',
    '#1d4ed8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3'
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Top 10 Most Expensive Suburbs
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-normal">
                By Average AUD Price
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparative benchmark visualization of premium Victorian real estate
            </p>
          </div>
        </div>

        {/* Orientation Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setLayout('horizontal')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              layout === 'horizontal' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vertical Bars
          </button>
          <button
            onClick={() => setLayout('vertical')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              layout === 'vertical' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Horizontal Bars
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {layout === 'horizontal' ? (
            <BarChart data={chartData} margin={{ top: 15, right: 10, left: 10, bottom: 25 }}>
              <XAxis 
                dataKey="suburb" 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis 
                tickFormatter={formatCompactAUD}
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30, 41, 59, 0.4)' }} />
              <Bar 
                dataKey="average_price" 
                radius={[6, 6, 0, 0]} 
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={barGradients[index % barGradients.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 30, left: 80, bottom: 10 }}>
              <XAxis 
                type="number"
                tickFormatter={formatCompactAUD}
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                type="category"
                dataKey="suburb"
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30, 41, 59, 0.4)' }} />
              <Bar 
                dataKey="average_price" 
                radius={[0, 6, 6, 0]} 
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={barGradients[index % barGradients.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

    </div>
  );
}
