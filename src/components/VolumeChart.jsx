import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, PieChart } from 'lucide-react';
import { formatInteger, formatAUD } from '../utils/formatters';

const VolumeTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950 border border-slate-700/80 p-3 rounded-xl shadow-2xl space-y-1 z-50">
        <div className="font-bold text-white text-xs font-sans">{data.suburb}</div>
        <div className="text-xs text-cyan-400 font-mono font-semibold">
          {data.property_count} {data.property_count === 1 ? 'Sampled Property' : 'Sampled Properties'}
        </div>
        <div className="text-[10px] text-slate-400">
          Avg Value: {formatAUD(data.average_price)}
        </div>
      </div>
    );
  }
  return null;
};

export default function VolumeChart({ data = [] }) {
  if (!data || data.length === 0) return null;

  // Sort data by property count descending for clean volume overview
  const volumeSorted = [...data].sort((a, b) => b.property_count - a.property_count);

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Property Sample Volume Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Sample density per suburb across the Victorian dataset
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={volumeSorted} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="suburb" 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              angle={-20}
              textAnchor="end"
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<VolumeTooltip />} />
            <Area 
              type="monotone" 
              dataKey="property_count" 
              stroke="#818cf8" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorVolume)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
