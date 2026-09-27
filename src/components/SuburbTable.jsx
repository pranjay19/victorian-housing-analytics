import React, { useState } from 'react';
import { 
  ArrowUpDown, ChevronLeft, ChevronRight, Award, Building, 
  DollarSign, TrendingUp, Info
} from 'lucide-react';
import { formatAUD, formatInteger } from '../utils/formatters';

export default function SuburbTable({ 
  data = [], 
  sortBy, 
  setSortBy,
  maxPriceInDataset = 4525000 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl text-center text-slate-400 text-sm">
        No suburb records available matching search query.
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const handleHeaderSort = (field) => {
    if (field === 'PRICE') {
      setSortBy(prev => prev === 'PRICE_DESC' ? 'PRICE_ASC' : 'PRICE_DESC');
    } else if (field === 'VOLUME') {
      setSortBy(prev => prev === 'VOLUME_DESC' ? 'VOLUME_ASC' : 'VOLUME_DESC');
    } else if (field === 'NAME') {
      setSortBy(prev => prev === 'NAME_ASC' ? 'NAME_DESC' : 'NAME_ASC');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-0">
      
      {/* Table Header / Title Bar */}
      <div className="p-4 sm:px-6 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-sans">
            Detailed Suburb Market Registry
          </h3>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {data.length} Suburbs Total
          </span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Page {currentPage} of {totalPages || 1}
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6 w-16 text-center">Rank</th>
              <th 
                onClick={() => handleHeaderSort('NAME')}
                className="py-3 px-4 sm:px-6 cursor-pointer hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Suburb Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </div>
              </th>
              <th 
                onClick={() => handleHeaderSort('PRICE')}
                className="py-3 px-4 sm:px-6 cursor-pointer hover:text-white transition-colors group text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Average Price (AUD)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </div>
              </th>
              <th className="py-3 px-4 sm:px-6 hidden md:table-cell w-48">
                Relative Market Value
              </th>
              <th 
                onClick={() => handleHeaderSort('VOLUME')}
                className="py-3 px-4 sm:px-6 cursor-pointer hover:text-white transition-colors group text-center w-36"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Sample Count</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-sans">
            {paginatedData.map((item, idx) => {
              const globalIndex = startIndex + idx + 1;
              const pricePercent = Math.min(100, Math.max(5, (item.average_price / (maxPriceInDataset || 1)) * 100));

              // Rank Badging
              let rankBadge = <span className="text-slate-500 font-mono text-xs">#{globalIndex}</span>;
              if (globalIndex === 1) {
                rankBadge = (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-sm">
                    🥇
                  </span>
                );
              } else if (globalIndex === 2) {
                rankBadge = (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-200 border border-slate-400/40 text-xs font-bold shadow-sm">
                    🥈
                  </span>
                );
              } else if (globalIndex === 3) {
                rankBadge = (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/30 text-amber-400 border border-amber-600/40 text-xs font-bold shadow-sm">
                    🥉
                  </span>
                );
              }

              return (
                <tr 
                  key={item.suburb}
                  className="hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 sm:px-6 text-center font-mono">
                    {rankBadge}
                  </td>

                  {/* Suburb Name */}
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-white group-hover:text-cyan-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <span>{item.suburb}</span>
                      {item.average_price >= 2500000 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-mono">
                          Ultra
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Average Price */}
                  <td className="py-3.5 px-4 sm:px-6 text-right font-extrabold font-mono text-cyan-400 text-sm">
                    {formatAUD(item.average_price)}
                  </td>

                  {/* Relative Price Bar */}
                  <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell">
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 p-0.5">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${pricePercent}%` }}
                      />
                    </div>
                  </td>

                  {/* Sample Count */}
                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono text-xs font-semibold">
                      {item.property_count} {item.property_count === 1 ? 'prop' : 'props'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Bar */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="text-white font-bold">{startIndex + 1}</span> to <span className="text-white font-bold">{Math.min(startIndex + pageSize, data.length)}</span> of <span className="text-white font-bold">{data.length}</span> suburbs
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-2 font-mono text-slate-300">
            {currentPage} / {totalPages || 1}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
