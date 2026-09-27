import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, Download, Filter, FileSpreadsheet } from 'lucide-react';
import { exportToCSV, exportToJSON } from '../utils/formatters';

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  priceTier,
  setPriceTier,
  sortBy,
  setSortBy,
  totalItems,
  filteredItemsCount,
  filteredData
}) {
  const tiers = [
    { id: 'ALL', label: 'All Suburbs' },
    { id: 'ULTRA', label: '>$2.5M AUD' },
    { id: 'PREMIUM', label: '$2.0M - $2.5M' },
    { id: 'HIGH_VALUE', label: '<$2.0M AUD' }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-3.5">
      
      {/* Top Row: Search Input & Sort Selector */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search suburb name (e.g. Toorak, Brighton)..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Controls & Export Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end flex-wrap">
          
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400 font-medium hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="PRICE_DESC" className="bg-slate-900 text-slate-100">Price (High to Low)</option>
              <option value="PRICE_ASC" className="bg-slate-900 text-slate-100">Price (Low to High)</option>
              <option value="VOLUME_DESC" className="bg-slate-900 text-slate-100">Volume (High to Low)</option>
              <option value="NAME_ASC" className="bg-slate-900 text-slate-100">Suburb Name (A-Z)</option>
            </select>
          </div>

          {/* Export Dropdown / Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => exportToCSV(filteredData)}
              title="Download CSV report"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => exportToJSON(filteredData)}
              title="Download JSON data"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>JSON</span>
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Row: Filter Tier Chips & Items Counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
        
        {/* Tier Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-cyan-400" />
            Tiers:
          </span>
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setPriceTier(tier.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                priceTier === tier.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        {/* Counter Pill */}
        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-cyan-400 font-bold">{filteredItemsCount}</span> of <span className="text-slate-300">{totalItems}</span> suburbs
        </div>

      </div>

    </div>
  );
}
