import React from 'react';
import { AlertOctagon, RefreshCw, Database, Terminal, ShieldAlert } from 'lucide-react';

export default function ErrorFallback({ errorMsg, onRetry, onLoadMock }) {
  return (
    <div className="my-8 max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-6 text-slate-200">
      
      {/* Icon & Title */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
          <AlertOctagon className="w-8 h-8 stroke-[2]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            AWS API Gateway Endpoint Unreachable
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
              Graceful Fallback Mode
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            An issue occurred while fetching real-time Athena metrics from API Gateway.
          </p>
        </div>
      </div>

      {/* Error Message Snippet */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto">
        <span className="text-slate-500">Log output:</span> {errorMsg || 'Failed to fetch data from API Gateway'}
      </div>

      {/* Technical Recruiter Info */}
      <div className="space-y-2 text-xs text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
        <p className="font-bold text-slate-200 flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-cyan-400" />
          Technical Troubleshooting Checklist:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-400">
          <li>Verify CORS permissions on AWS API Gateway stage <code className="text-cyan-300 font-mono">prod/housing</code></li>
          <li>Check Amazon Athena execution state in Sydney region (<code className="text-cyan-300 font-mono">ap-southeast-2</code>)</li>
          <li>Or load our local pre-compiled Athena S3 Gold sample dataset to preview full UI interactivity</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 transition-all shadow-md cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry AWS API Request
        </button>

        <button
          onClick={onLoadMock}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-all border border-slate-700 cursor-pointer"
        >
          <Database className="w-4 h-4 text-emerald-400" />
          Explore Offline Mock Dataset
        </button>
      </div>

    </div>
  );
}
