import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Server, Database, Cpu, ArrowRight, Layers, FileCode, Zap, 
  CheckCircle, ShieldCheck, DollarSign, Terminal, HardDrive
} from 'lucide-react';

const ARCHITECTURE_STEPS = [
  {
    id: 's3-bronze',
    name: 'S3 Bronze (Raw)',
    tech: 'Amazon S3',
    category: 'Storage',
    badge: 'Raw Data Layer',
    color: 'border-amber-500/40 text-amber-400 bg-amber-950/30',
    icon: HardDrive,
    description: 'Ingests raw Victorian housing market transaction records directly from web scrapers and external market feeds.',
    details: [
      'Stores raw CSV/JSON files with unvalidated schemas',
      'Immutable audit trail retained with Versioning & Lifecycle rules',
      'Automated S3 Event notifications trigger downstream ETL pipelines'
    ],
    codeSnippet: 's3://melbourne-housing-data-bronze-ap-southeast-2/raw/2026/09/'
  },
  {
    id: 'glue-etl-1',
    name: 'AWS Glue ETL #1',
    tech: 'PySpark 3.4',
    category: 'Compute',
    badge: 'Cleansing Pipeline',
    color: 'border-blue-500/40 text-blue-400 bg-blue-950/30',
    icon: Cpu,
    description: 'Serverless Spark job for data validation, schema enforcement, null-handling, and price parsing into numeric float formats.',
    details: [
      'Deduplicates property records across suburbs',
      'Parses AUD currency strings into normalized numeric float fields',
      'Optimizes partition layout by suburb and transaction year'
    ],
    codeSnippet: `df_cleansed = raw_df.withColumn("average_price", regexp_replace("price", "[\\\\$,]", "").cast("double"))`
  },
  {
    id: 's3-silver',
    name: 'S3 Silver (Cleansed)',
    tech: 'Apache Parquet',
    category: 'Storage',
    badge: 'Validated Data',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30',
    icon: Database,
    description: 'Cleansed, structured housing data stored in Snappy-compressed Apache Parquet format for fast columnar scans.',
    details: [
      'High compression ratio (~75% storage savings vs raw CSV)',
      'Optimized column projection for fast data analytics queries',
      'Registered with AWS Glue Data Catalog schema registry'
    ],
    codeSnippet: 's3://melbourne-housing-data-silver-ap-southeast-2/parquet/cleansed_housing/'
  },
  {
    id: 'glue-etl-2',
    name: 'AWS Glue Aggregations',
    tech: 'PySpark SQL',
    category: 'Compute',
    badge: 'Aggregations',
    color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/30',
    icon: Cpu,
    description: 'Calculates suburb-level metrics including average price, median market values, and sample property volume counts.',
    details: [
      'Executes SQL `GROUP BY suburb` transformations',
      'Computes statistical distribution metrics across Victoria',
      'Outputs curated metrics ready for executive dashboards'
    ],
    codeSnippet: `agg_df = silver_df.groupBy("suburb").agg(avg("price").alias("average_price"), count("id").alias("property_count"))`
  },
  {
    id: 's3-gold',
    name: 'S3 Gold (Analytics)',
    tech: 'Gold Data Mart',
    category: 'Storage',
    badge: 'Curated Layer',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30',
    icon: Layers,
    description: 'Final curated data layer optimized specifically for Athena BI analytics and low-latency API queries.',
    details: [
      'Pre-computed suburb aggregates for sub-second query latency',
      'Strict schema validation enforced by Glue Data Catalog',
      'Partitioned by region and property count tiers'
    ],
    codeSnippet: 's3://melbourne-housing-data-gold-ap-southeast-2/gold/suburb_aggregates/'
  },
  {
    id: 'athena',
    name: 'Amazon Athena',
    tech: 'Presto / Trino SQL',
    category: 'Query Engine',
    badge: 'Serverless SQL',
    color: 'border-purple-500/40 text-purple-400 bg-purple-950/30',
    icon: Zap,
    description: 'Serverless interactive query service analyzing gold Parquet files directly using standard ANSI SQL.',
    details: [
      'Zero server maintenance or persistent database costs',
      'Billed strictly per aggregate query scan volume (< 1MB per request)',
      'Executes query: `SELECT suburb, round(avg_price, 2), property_count ORDER BY avg_price DESC`'
    ],
    codeSnippet: `SELECT suburb, round(avg(price), 2) AS average_price, count(*) AS property_count FROM gold_housing GROUP BY suburb;`
  },
  {
    id: 'lambda',
    name: 'AWS Lambda',
    tech: 'Python 3.12 Boto3',
    category: 'Serverless API',
    badge: 'Microservice',
    color: 'border-pink-500/40 text-pink-400 bg-pink-950/30',
    icon: Server,
    description: 'Event-driven Lambda function executing the Athena query, parsing result sets, and returning JSON to API Gateway.',
    details: [
      'Uses Boto3 client to execute Athena start_query_execution',
      'Formats results into JSON payload array',
      'Implements CORS response headers and 60s memory caching'
    ],
    codeSnippet: `def lambda_handler(event, context):\n    response = athena_client.get_query_results(QueryExecutionId=qid)\n    return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps(data)}`
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    tech: 'REST Endpoint',
    category: 'Gateway',
    badge: 'AP-Southeast-2',
    color: 'border-cyan-400/50 text-cyan-300 bg-cyan-950/40',
    icon: Zap,
    description: 'Managed HTTP API endpoint deployed in Sydney (ap-southeast-2) with throttling, API key support, and low latency.',
    details: [
      'Endpoint: https://6annl8u42a.execute-api.ap-southeast-2.amazonaws.com/prod/housing',
      'Rate-limited & protected against burst attacks',
      'Delivers sub-150ms responses to regional clients'
    ],
    codeSnippet: 'GET /prod/housing HTTP/1.1\nHost: 6annl8u42a.execute-api.ap-southeast-2.amazonaws.com'
  },
  {
    id: 'react-fe',
    name: 'React Dashboard',
    tech: 'Vite + Tailwind',
    category: 'Frontend',
    badge: 'Presentation',
    color: 'border-teal-400/50 text-teal-300 bg-teal-950/40',
    icon: Terminal,
    description: 'This interactive React UI rendering housing market insights with WCAG compliance, Recharts, and instant visual filters.',
    details: [
      'Asynchronous fetch with skeleton shimmer states',
      'Interactive filtering, CSV export, and responsive Recharts visuals',
      'Hosted with zero downtime and fast CDN distribution'
    ],
    codeSnippet: 'const { data } = useHousingMetrics();'
  }
];

export default function ArchitectureModal({ isOpen, onClose }) {
  const [selectedNode, setSelectedNode] = useState(ARCHITECTURE_STEPS[5]); // Default Athena
  const [activeTab, setActiveTab] = useState('diagram'); // 'diagram' | 'highlights'

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        
        {/* Backdrop click */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Main Modal Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          
          {/* Header */}
          <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  AWS Serverless Medallion Data Pipeline
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">End-to-End Flow</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Engineering architecture overview for technical recruiters & hiring managers
                </p>
              </div>
            </div>

            {/* Actions & Close */}
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('diagram')}
                  className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'diagram' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
                >
                  Pipeline Flow
                </button>
                <button
                  onClick={() => setActiveTab('highlights')}
                  className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'highlights' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
                >
                  Key Highlights
                </button>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
            
            {activeTab === 'diagram' ? (
              <>
                {/* Horizontal Architecture Flow Cards */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      Medallion Data Lineage (Click any stage for inspect view)
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">Sydney Region (ap-southeast-2)</span>
                  </div>

                  {/* Flow Nodes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
                    {ARCHITECTURE_STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isSelected = selectedNode.id === step.id;
                      return (
                        <div key={step.id} className="relative flex flex-col items-center">
                          <button
                            onClick={() => setSelectedNode(step)}
                            className={`w-full p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-full min-h-[105px] ${
                              isSelected 
                                ? `${step.color} ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.02]` 
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500">0{idx + 1}</span>
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`} />
                            </div>
                            <div>
                              <p className="text-xs font-bold leading-tight text-white">{step.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{step.tech}</p>
                            </div>
                            <span className="mt-2 text-[9px] px-1.5 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-800 font-mono truncate w-fit">
                              {step.category}
                            </span>
                          </button>
                          
                          {/* Connector Arrow for Desktop */}
                          {idx < ARCHITECTURE_STEPS.length - 1 && (
                            <ArrowRight className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 z-10 pointer-events-none" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Node Detail Inspector */}
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${selectedNode.color}`}>
                        {selectedNode.badge}
                      </span>
                      <h4 className="text-lg font-bold text-white font-sans">{selectedNode.name}</h4>
                      <span className="text-xs text-slate-400 font-mono">({selectedNode.tech})</span>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selectedNode.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Key Specifications:</p>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {selectedNode.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Code Snippet / Config Preview */}
                  <div className="w-full lg:w-96 rounded-lg bg-slate-900 p-3.5 border border-slate-800 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                        Implementation Snippet
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Python / Spark / SQL</span>
                    </div>
                    <pre className="text-[11px] font-mono bg-slate-950 p-3 rounded-md text-cyan-300 overflow-x-auto whitespace-pre-wrap break-all border border-slate-850 flex-1">
                      {selectedNode.codeSnippet}
                    </pre>
                  </div>
                </div>

              </>
            ) : (
              /* Highlights & Recruiter Technical Summary */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    Medallion Architecture (Bronze → Silver → Gold)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Decouples data ingestion from business transformation. Raw data is stored immutably in S3 Bronze, cleansed & standardized into S3 Silver Parquet format, and aggregated into S3 Gold for fast executive reporting.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <DollarSign className="w-4 h-4" />
                    Cost Efficiency & Serverless Design
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Zero idle infrastructure cost. AWS Athena queries only scan compressed Snappy Parquet files in S3 Gold (&lt; 1MB scanned per API request), resulting in fractions of a cent per month operational cost.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <Zap className="w-4 h-4" />
                    Serverless API Microservice
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    API Gateway triggers an AWS Lambda Python handler that orchestrates Athena query execution, formats JSON responses, and enforces strict HTTP CORS security headers for frontend client apps.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Cpu className="w-4 h-4" />
                    Scale & Distributed Computing
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    AWS Glue PySpark jobs execute distributed batch transformations, allowing the pipeline to scale seamlessly from thousands to millions of housing transaction records without code changes.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Live Endpoint: <code className="text-cyan-400">https://6annl8u42a.execute-api.ap-southeast-2.amazonaws.com/prod/housing</code>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors"
            >
              Close Drawer
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
