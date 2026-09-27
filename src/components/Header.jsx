import React from 'react';
import { Network, RefreshCw, Cpu, Database, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Header({ 
  onOpenArchitecture, 
  onRefresh, 
  isRefreshing, 
  isFallback, 
  latency, 
  lastUpdated 
}) {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Titles */}
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 shadow-inner">
              <Database className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                  Victorian Housing Market Analytics
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  AWS Data Engineering Portfolio
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-400 font-medium">
                  Built by <span className="text-cyan-300 font-semibold">Pranjay</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-slate-400" />
                  Athena + PySpark Medallion Architecture
                </span>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            
            {/* API Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              {isFallback ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-medium">Cached Demo Data</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-slate-300 font-mono">Live API Gateway</span>
                  {latency && <span className="text-slate-500 font-mono">({latency}ms)</span>}
                </>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh housing metrics from AWS API Gateway"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>

            {/* Pipeline Architecture Modal Trigger */}
            <button
              onClick={onOpenArchitecture}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-md hover:shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer border border-cyan-400/30"
            >
              <Network className="w-4 h-4 stroke-[2.5]" />
              <span>Pipeline Architecture</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
