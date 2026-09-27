import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  fetchHousingData, FALLBACK_DATA 
} from './services/api';
import Header from './components/Header';
import ArchitectureModal from './components/ArchitectureModal';
import KpiCards from './components/KpiCards';
import FilterBar from './components/FilterBar';
import SuburbChart from './components/SuburbChart';
import VolumeChart from './components/VolumeChart';
import SuburbTable from './components/SuburbTable';
import SkeletonLoader from './components/SkeletonLoader';
import ErrorFallback from './components/ErrorFallback';
import { 
  Building2, Database, ShieldCheck, Cpu, Code2, 
  ExternalLink, Layers, ArrowUpRight, BarChart2, PieChart
} from 'lucide-react';

export default function App() {
  // State management
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [latency, setLatency] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Modal State
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // Interactive Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [priceTier, setPriceTier] = useState('ALL'); // 'ALL' | 'ULTRA' | 'PREMIUM' | 'HIGH_VALUE'
  const [sortBy, setSortBy] = useState('PRICE_DESC'); // 'PRICE_DESC' | 'PRICE_ASC' | 'VOLUME_DESC' | 'NAME_ASC'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'charts' | 'table'

  // Data Loading Function
  const loadData = useCallback(async (showFullLoader = false) => {
    if (showFullLoader) setIsLoading(true);
    setIsRefreshing(true);
    setError(null);

    const res = await fetchHousingData();

    setData(res.data);
    setIsFallback(res.isFallback);
    setLatency(res.latency);
    setLastUpdated(res.timestamp);

    if (res.error && res.data.length === 0) {
      setError(res.error);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  // Initial Fetch
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Handle Mock Fallback manually
  const handleLoadMock = () => {
    setData(FALLBACK_DATA);
    setIsFallback(true);
    setError(null);
    setIsLoading(false);
  };

  // Filter & Sort Pipeline
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data
      .filter((item) => {
        // Suburb Name Search Filter
        const matchesSearch = item.suburb
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim());

        // Price Tier Filter
        let matchesTier = true;
        if (priceTier === 'ULTRA') {
          matchesTier = item.average_price >= 2500000;
        } else if (priceTier === 'PREMIUM') {
          matchesTier = item.average_price >= 2000000 && item.average_price < 2500000;
        } else if (priceTier === 'HIGH_VALUE') {
          matchesTier = item.average_price < 2000000;
        }

        return matchesSearch && matchesTier;
      })
      .sort((a, b) => {
        if (sortBy === 'PRICE_DESC') return b.average_price - a.average_price;
        if (sortBy === 'PRICE_ASC') return a.average_price - b.average_price;
        if (sortBy === 'VOLUME_DESC') return b.property_count - a.property_count;
        if (sortBy === 'NAME_ASC') return a.suburb.localeCompare(b.suburb);
        return 0;
      });
  }, [data, searchTerm, priceTier, sortBy]);

  // Max price in dataset for relative bar calculation
  const maxPrice = useMemo(() => {
    if (!data || data.length === 0) return 4525000;
    return Math.max(...data.map((d) => d.average_price));
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-white">
      
      {/* Sticky Navigation Header */}
      <Header
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onRefresh={() => loadData(false)}
        isRefreshing={isRefreshing}
        isFallback={isFallback}
        latency={latency}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Error Fallback Banner if API failed completely */}
        {error && !data.length ? (
          <ErrorFallback
            errorMsg={error}
            onRetry={() => loadData(true)}
            onLoadMock={handleLoadMock}
          />
        ) : isLoading ? (
          /* Skeleton Loader Phase */
          <SkeletonLoader />
        ) : (
          /* Loaded Dashboard Content */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            
            {/* KPI Summary Cards */}
            <KpiCards data={data} />

            {/* Filter & Search Bar */}
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              priceTier={priceTier}
              setPriceTier={setPriceTier}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalItems={data.length}
              filteredItemsCount={filteredData.length}
              filteredData={filteredData}
            />

            {/* Visual Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Primary Bar Chart (2 cols) */}
              <div className="lg:col-span-2">
                <SuburbChart data={filteredData} />
              </div>

              {/* Volume Distribution Chart (1 col) */}
              <div className="lg:col-span-1">
                <VolumeChart data={filteredData} />
              </div>

            </div>

            {/* Detailed Sortable Data Table */}
            <SuburbTable
              data={filteredData}
              sortBy={sortBy}
              setSortBy={setSortBy}
              maxPriceInDataset={maxPrice}
            />

          </motion.div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 bg-slate-950 border-t border-slate-900 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Victorian Housing Market Analytics Dashboard</p>
              <p className="text-[11px] text-slate-400">
                Designed & Developed by <span className="text-cyan-300 font-semibold">Pranjay</span> • AWS Data Engineering Portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap justify-center">
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pipeline Architecture Spec</span>
            </button>
            <span>•</span>
            <span className="font-mono text-slate-400">AWS Region: ap-southeast-2</span>
            <span>•</span>
            <span className="text-slate-400">WCAG 2.1 AAA Compliant</span>
          </div>
        </div>
      </footer>

      {/* Architecture Spec Modal Drawer */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

    </div>
  );
}
