import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  ComposedChart,
  Line,
  Area
} from 'recharts';
import { FINANCIAL_TIERS } from '../data/mockData';
import { Currency, FinancialTier, USD_TO_BDT_RATE } from '../types';
import { CopyShareButton } from './CopyShareButton';
import { 
  Calculator, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Clock, 
  BarChart3, 
  AlertTriangle,
  Sliders,
  Zap,
  LineChart,
  ArrowDownToLine,
  GitCompare,
  Info,
  Download,
  ShieldAlert,
  Loader2,
  X,
  Activity,
  Volume2,
  VolumeX,
  FileSpreadsheet,
  Cpu
} from 'lucide-react';

interface UnitEconomicsSectionProps {
  currency: Currency;
  onOpenIntelligenceDashboard?: (scenario: FinancialScenario) => void;
}

export type FinancialScenario = 'conservative' | 'base' | 'aggressive';

// Helper component for Insight Badge
const InsightBadge: React.FC<{ trend: 'up' | 'down' | 'neutral', message: string }> = ({ trend, message }) => {
  return (
    <div className="relative group inline-block ml-2 align-middle">
      <div className={`p-0.5 rounded-full border cursor-help ${
        trend === 'up' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' :
        trend === 'down' ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' :
        'border-amber-500/50 text-amber-400 bg-amber-500/10'
      }`}>
        <Info className="w-3 h-3" />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-slate-800 border border-slate-700 text-xs text-slate-200 p-2 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
        {message}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-b border-r border-slate-700 transform rotate-45 -mt-1" />
      </div>
    </div>
  );
};

export interface AnomalyRisk {
  id: string;
  title: string;
  metric: string;
  severity: 'low' | 'medium' | 'high';
  sparkline: number[];
  context: string;
  mitigation: string;
  history: string;
}

const SPARKLINE_DATA: Record<FinancialScenario, AnomalyRisk[]> = {
  aggressive: [
    {
      id: 'a1', title: 'CAC Outbound Spike', metric: '14.2% -> 18.5%', severity: 'high',
      sparkline: [12, 13, 12, 14, 15, 17, 18, 18.5],
      context: 'Aggressive volume requires scaling paid outbound channels which historically see diminishing returns.',
      mitigation: 'Shift 20% of outbound budget to organic creator partnerships.',
      history: 'Last 30 days show a steady climb in CPL across primary ad networks.'
    },
    {
      id: 'a2', title: 'Server Compute Load', metric: '82% Cap', severity: 'medium',
      sparkline: [50, 55, 60, 58, 65, 75, 80, 82],
      context: 'High user concurrency driving physical AI inference engines close to provisioned capacity.',
      mitigation: 'Implement dynamic auto-scaling clusters for non-peak hours.',
      history: 'Spikes correlate directly with new product drops.'
    },
    {
      id: 'a3', title: 'Onboarding Churn', metric: '4.1% Drop', severity: 'low',
      sparkline: [2, 2.5, 3, 3.2, 3.5, 3.8, 4.0, 4.1],
      context: 'Rapid influx of new users experiencing friction in the XR setup process.',
      mitigation: 'Deploy updated guided tutorial module (v2.1).',
      history: 'Stable but slowly trending upward.'
    }
  ],
  base: [
    {
      id: 'b1', title: 'COGS Macro Drift', metric: '+1.5% Var', severity: 'medium',
      sparkline: [0, 0.2, 0.5, 0.4, 0.8, 1.2, 1.4, 1.5],
      context: 'Supplier pricing for tier-2 cloud components fluctuating above baseline.',
      mitigation: 'Lock in 12-month reserved instances for critical path compute.',
      history: 'Historically cycles every 3-4 months based on energy costs.'
    },
    {
      id: 'b2', title: 'Talent Retention', metric: '94% Safe', severity: 'low',
      sparkline: [98, 97, 97, 96, 95, 96, 95, 94],
      context: 'Engineering talent market remains highly competitive in key hubs.',
      mitigation: 'Roll out updated equity refresh program.',
      history: 'Slight dip expected post-bonus season.'
    }
  ],
  conservative: [
    {
      id: 'c1', title: 'Overhead Drag', metric: '18% -> 22%', severity: 'high',
      sparkline: [18, 18.5, 19, 19.5, 20.5, 21, 21.5, 22],
      context: 'Fixed team costs are eating into margins due to lower projected top-line revenue.',
      mitigation: 'Pause non-critical external contractor spending.',
      history: 'Directly inversely correlated to top-line volume.'
    },
    {
      id: 'c2', title: 'Feature Stagnation', metric: 'Velocity -15%', severity: 'medium',
      sparkline: [100, 95, 98, 92, 90, 88, 86, 85],
      context: 'Conservative R&D spend slowing down time-to-market for auxiliary features.',
      mitigation: 'Reprioritize backlog to focus solely on high-impact core UX.',
      history: 'Steady decline as budget tightening takes effect.'
    }
  ]
};

const Sparkline: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  // Scaled to 40x16
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 40},${16 - ((d - min) / range) * 16}`).join(' ');

  return (
    <svg width="40" height="16" className="overflow-visible stroke-current shrink-0" style={{ color }}>
      <polyline points={points} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const UnitEconomicsSection: React.FC<UnitEconomicsSectionProps> = ({ 
  currency,
  onOpenIntelligenceDashboard 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'A' | 'B' | 'C'>('A');
  const [selectedTierId, setSelectedTierId] = useState<string>('tier-a2');
  const [scenario, setScenario] = useState<FinancialScenario>('base');
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [compareScenario, setCompareScenario] = useState<FinancialScenario>('conservative');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [activeAnomaly, setActiveAnomaly] = useState<AnomalyRisk | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [anomalyViewMode, setAnomalyViewMode] = useState<'live' | 'projected'>('live');

  React.useEffect(() => {
    if (!audioEnabled) return;
    const hasHighSeverity = SPARKLINE_DATA[scenario].some(a => a.severity === 'high');
    if (hasHighSeverity) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
        // ignore audio context errors
      }
    }
  }, [scenario, audioEnabled]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setActiveAnomaly(prev => prev ? null : SPARKLINE_DATA[scenario][0]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scenario]);

  const categoryTiers = FINANCIAL_TIERS.filter(t => t.category === selectedCategory);
  const activeTier = FINANCIAL_TIERS.find(t => t.id === selectedTierId) || categoryTiers[0];

  const formatMoney = (usdVal: number) => {
    if (currency === 'USD') {
      return `$${Math.round(usdVal).toLocaleString()}`;
    } else {
      const bdtVal = Math.round(usdVal * USD_TO_BDT_RATE);
      return `${bdtVal.toLocaleString()} ৳`;
    }
  };

  const handleExportCSV = () => {
    const data = SPARKLINE_DATA[scenario];
    const csvContent = [
      ['Risk ID', 'Title', 'Metric', 'Severity', 'Context', 'Mitigation', 'Historical Trend'],
      ...data.map(d => [d.id, d.title, d.metric, d.severity, d.context, d.mitigation, d.history])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Anomaly_Watch_Export_${scenario}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = () => {
    setIsGeneratingReport(true);
    // Simulate PDF generation delay
    setTimeout(() => {
      setIsGeneratingReport(false);
      // Create a dummy blob to trigger download
      const blob = new Blob(['Simulated PDF Content: Master SSOT'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Spenta_Master_SSOT_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 2500);
  };


  // Scenario Multipliers & Projections
  const scenarioConfig = {
    conservative: {
      name: 'Conservative',
      badge: 'Downside Stress-Test',
      description: 'Stress-tests lengthened sales cycles (+25% CAC), engineering buffers (+10% COGS), and 10% overhead reserve.',
      revenueMult: 1.0,
      cogsMult: 1.10, // 10% higher COGS
      cacPercent: 16.0,
      overheadPercent: 10.0,
      color: '#FB7185'
    },
    base: {
      name: 'Base Model',
      badge: 'Audited Dual-Shore Baseline',
      description: 'Audited baseline with fully absorbed cross-functional labor, GPU cloud compute, 12%–15% sales CAC, and 8%–10% reserves.',
      revenueMult: 1.0,
      cogsMult: 1.0,
      cacPercent: activeTier.cacPercent,
      overheadPercent: activeTier.overheadPercent,
      color: '#38BDF8'
    },
    aggressive: {
      name: 'Aggressive Growth',
      badge: 'Scale Economies & Modular SDKs',
      description: 'Factors modular WebXR & IDP code reusability (-22% direct labor hours) and inbound agency partnership referrals (9% CAC).',
      revenueMult: 1.15,
      cogsMult: 0.78, // 22% lower COGS via reusable assets
      cacPercent: 9.0,
      overheadPercent: 7.0,
      color: '#34D399'
    }
  };

  const currentScen = scenarioConfig[scenario];

  // Dynamic calculated financials based on active scenario
  const effectiveRevenue = activeTier.baselineUsd * currentScen.revenueMult;
  const rawCogs = (activeTier.baselineUsd * (activeTier.cogsPercent / 100)) * currentScen.cogsMult;
  const effectiveCogs = Math.min(rawCogs, effectiveRevenue * 0.75);
  const effectiveCogsPercent = Number(((effectiveCogs / effectiveRevenue) * 100).toFixed(1));

  const effectiveGrossProfit = effectiveRevenue - effectiveCogs;
  const effectiveGrossMarginPercent = Number(((effectiveGrossProfit / effectiveRevenue) * 100).toFixed(1));

  const effectiveCac = effectiveRevenue * (currentScen.cacPercent / 100);
  const effectiveOverhead = effectiveRevenue * (currentScen.overheadPercent / 100);

  const effectiveNetProfit = effectiveGrossProfit - effectiveCac - effectiveOverhead;
  const effectiveNetMarginPercent = Number(((effectiveNetProfit / effectiveRevenue) * 100).toFixed(1));

  // Dynamic calculated financials for compare scenario
  const compScen = scenarioConfig[compareScenario];
  const compRevenue = activeTier.baselineUsd * compScen.revenueMult;
  const compRawCogs = (activeTier.baselineUsd * (activeTier.cogsPercent / 100)) * compScen.cogsMult;
  const compCogs = Math.min(compRawCogs, compRevenue * 0.75);
  const compCogsPercent = Number(((compCogs / compRevenue) * 100).toFixed(1));
  const compGrossProfit = compRevenue - compCogs;
  const compGrossMarginPercent = Number(((compGrossProfit / compRevenue) * 100).toFixed(1));
  const compCac = compRevenue * (compScen.cacPercent / 100);
  const compOverhead = compRevenue * (compScen.overheadPercent / 100);
  const compNetProfit = compGrossProfit - compCac - compOverhead;
  const compNetMarginPercent = Number(((compNetProfit / compRevenue) * 100).toFixed(1));

  // Recharts waterfall dataset for active tier & scenario
  const tierWaterfallData = [
    { name: 'Revenue', value: effectiveRevenue, percentage: 100, color: '#38BDF8', type: 'inflow' },
    { name: 'Direct COGS', value: effectiveCogs, percentage: effectiveCogsPercent, color: '#FB7185', type: 'cogs' },
    { name: 'Gross Profit', value: effectiveGrossProfit, percentage: effectiveGrossMarginPercent, color: '#818CF8', type: 'gross' },
    { name: 'Sales CAC', value: effectiveCac, percentage: currentScen.cacPercent, color: '#FBBF24', type: 'cac' },
    { name: 'Overheads', value: effectiveOverhead, percentage: currentScen.overheadPercent, color: '#F59E0B', type: 'overhead' },
    { name: 'Net Profit', value: effectiveNetProfit, percentage: effectiveNetMarginPercent, color: '#34D399', type: 'net' }
  ];

  const handleExportData = () => {
    const exportPayload = {
      scenario: currentScen.name,
      currency,
      tier: {
        id: activeTier.id,
        title: activeTier.name,
        category: activeTier.category,
      },
      economics: {
        effectiveRevenue,
        effectiveCogs,
        effectiveCogsPercent,
        effectiveGrossProfit,
        effectiveGrossMarginPercent,
        effectiveCac,
        effectiveOverhead,
        effectiveNetProfit,
        effectiveNetMarginPercent
      },
      waterfall: tierWaterfallData
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unit_economics_${activeTier.id}_${scenario}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="unit-economics" className="py-20 relative bg-[#070A10] border-t border-b border-slate-800/80">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-600/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span>AUDIT-READY FINANCIAL MODELS // USD & BDT DUAL-SHORE</span>
            </div>
            <CopyShareButton sectionId="unit-economics" sectionTitle="Unit Economics" variant="pill" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            Recalibrated 9-Tier Unit Economics
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Structured explicitly to satisfy institutional investor criteria: <strong className="text-white">Gross Margin ≤ 45.0%</strong> and <strong className="text-white">Net Operating Margin ≤ 25.0%</strong> after fully absorbing multidisciplinary team compensation, GPU compute, 12%–15% sales CAC, and 8%–10% lumpsum overheads.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {onOpenIntelligenceDashboard && (
              <button
                onClick={() => onOpenIntelligenceDashboard(scenario)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 transition-all cursor-pointer shadow-lg"
              >
                <LineChart className="w-4 h-4 text-indigo-400" />
                <span>Launch D3.js 12-Quarter Projections Dashboard</span>
              </button>
            )}
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-lg"
            >
              <ArrowDownToLine className="w-4 h-4 text-slate-400" />
              <span>Export JSON Contract</span>
            </button>
            <button
              onClick={handleDownloadReport}
              disabled={isGeneratingReport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-900/30 hover:bg-cyan-800/40 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/50 transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingReport ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Full Report</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Financial Scenarios Toggle Banner */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 mb-8 max-w-4xl mx-auto backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white uppercase tracking-wider">FINANCIAL SCENARIOS:</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Compare Mode Toggle */}
              <button
                onClick={() => setIsCompareMode(!isCompareMode)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all border ${
                  isCompareMode 
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' 
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                Compare Scenarios
              </button>

              {/* 3-Way Scenario Switcher (Primary) */}
              <div className="inline-flex p-1 rounded-lg bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setScenario('conservative')}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    scenario === 'conservative'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isCompareMode ? 'Model A (Cons)' : <><AlertTriangle className="w-3 h-3" /><span>Conservative</span></>}
                </button>

                <button
                  onClick={() => setScenario('base')}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    scenario === 'base'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isCompareMode ? 'Model A (Base)' : <><CheckCircle2 className="w-3 h-3" /><span>Base Target</span></>}
                </button>

                <button
                  onClick={() => setScenario('aggressive')}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    scenario === 'aggressive'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isCompareMode ? 'Model A (Aggr)' : <><TrendingUp className="w-3 h-3" /><span>Aggressive</span></>}
                </button>
              </div>

              {/* Compare Mode Secondary Switcher */}
              {isCompareMode && (
                <>
                  <span className="text-slate-500 text-xs font-mono font-bold">vs</span>
                  <div className="inline-flex p-1 rounded-lg bg-slate-900 border border-slate-800">
                    <button
                      onClick={() => setCompareScenario('conservative')}
                      className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        compareScenario === 'conservative'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-sm'
                          : 'text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      Model B (Cons)
                    </button>
                    <button
                      onClick={() => setCompareScenario('base')}
                      className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        compareScenario === 'base'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-sm'
                          : 'text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      Model B (Base)
                    </button>
                    <button
                      onClick={() => setCompareScenario('aggressive')}
                      className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        compareScenario === 'aggressive'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-sm'
                          : 'text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      Model B (Aggr)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Scenario description callout */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-300 gap-2">
            <span className="text-slate-400">
              <strong className="text-cyan-300">{currentScen.name} [{currentScen.badge}]: </strong>
              {currentScen.description}
            </span>
            <span className="text-cyan-400 shrink-0 font-bold">
              Net Margin: {effectiveNetMarginPercent}%
            </span>
          </div>
        </div>

        {/* Anomaly Watch Widget */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 mb-8 max-w-4xl mx-auto backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Anomaly Watch // Risk Factors</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-slate-900 border border-slate-700 rounded-md p-0.5">
                <button
                  onClick={() => setAnomalyViewMode('live')}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-sm transition-all ${
                    anomalyViewMode === 'live' 
                      ? 'bg-amber-500/20 text-amber-400 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Live View
                </button>
                <button
                  onClick={() => setAnomalyViewMode('projected')}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-sm transition-all ${
                    anomalyViewMode === 'projected' 
                      ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Projected Risk View
                </button>
              </div>

              <div className="w-px h-4 bg-slate-700"></div>

              <button 
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-1.5 rounded-md border transition-all ${
                  audioEnabled 
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                }`}
                title="Toggle High-Severity Audio Ping"
              >
                {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-[10px] font-mono font-bold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
            {SPARKLINE_DATA[scenario].map(anomaly => {
              // Adjust data for projected view based on scenario
              const sparklineData = anomalyViewMode === 'projected' 
                ? anomaly.sparkline.map(v => scenario === 'aggressive' ? v * 1.3 : scenario === 'conservative' ? v * 0.8 : v * 1.1)
                : anomaly.sparkline;
              
              return (
              <div 
                key={anomaly.id} 
                onClick={() => setActiveAnomaly(anomaly)}
                className="min-w-[220px] p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 hover:bg-slate-800/80 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{anomaly.title}</span>
                  <span className={`w-2 h-2 rounded-full shadow-sm mt-0.5 ${
                    anomaly.severity === 'high' ? 'bg-rose-500 shadow-rose-500/50' : 
                    anomaly.severity === 'medium' ? 'bg-amber-500 shadow-amber-500/50' : 
                    'bg-emerald-500 shadow-emerald-500/50'
                  }`} />
                </div>
                <div className="flex items-end justify-between">
                  <span className={`text-[11px] font-mono font-bold ${
                    anomaly.severity === 'high' ? 'text-rose-400' : 
                    anomaly.severity === 'medium' ? 'text-amber-400' : 
                    'text-emerald-400'
                  }`}>{anomaly.metric}</span>
                  <Sparkline 
                    data={sparklineData} 
                    color={
                      anomaly.severity === 'high' ? '#f43f5e' : 
                      anomaly.severity === 'medium' ? '#f59e0b' : 
                      '#10b981'
                    } 
                  />
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Model Category Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-lg bg-slate-900 border border-slate-800 backdrop-blur-xl">
            
            <button
              onClick={() => {
                setSelectedCategory('A');
                setSelectedTierId('tier-a2');
              }}
              className={`px-4 py-2 rounded-md font-mono font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === 'A'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>MODEL A: MICRO ($800–$5k)</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('B');
                setSelectedTierId('tier-b2');
              }}
              className={`px-4 py-2 rounded-md font-mono font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === 'B'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>MODEL B: MID-MARKET ($5k–$30k)</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('C');
                setSelectedTierId('tier-c2');
              }}
              className={`px-4 py-2 rounded-md font-mono font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === 'C'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>MODEL C: ENTERPRISE ($40k–$100k+)</span>
            </button>

          </div>
        </div>

        {/* Sub-Tier Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categoryTiers.map(t => {
            const isSelected = activeTier.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTierId(t.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all border flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-white border-cyan-400 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{t.code}: {t.name}</span>
                <span className="text-cyan-400">({currency === 'USD' ? t.rangeUsd : t.rangeBdt})</span>
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Waterfall & Team Allocation Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-12">
          
          {/* Left: Interactive Financial Waterfall Breakdown (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    {activeTier.code} // {activeTier.name} [{scenario.toUpperCase()} PROJECTION]
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
                    Financial Waterfall Distribution
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Scenario Revenue</div>
                  <div className="text-2xl font-black font-mono text-white">
                    {formatMoney(effectiveRevenue)}
                  </div>
                </div>
              </div>

              {/* Interactive Recharts Waterfall Bar Visualization */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <BarChart3 className="w-3.5 h-3.5" />
                    REVENUE & EXPENSE WATERFALL ALLOCATION ({isCompareMode ? 'COMPARISON' : scenario.toUpperCase()})
                  </span>
                  <span>{currency} Normalized</span>
                </div>
                <div className="h-48 sm:h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tierWaterfallData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontFamily="JetBrains Mono" />
                      <YAxis stroke="#64748b" fontSize={10} fontFamily="JetBrains Mono" />
                      <Tooltip 
                        formatter={(value: any, name: any, item: any) => [
                          currency === 'USD' ? `$${Math.round(Number(value)).toLocaleString()}` : `${Math.round(Number(value) * USD_TO_BDT_RATE).toLocaleString()} ৳`,
                          `${item.payload.percentage}% Allocation`
                        ]}
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {tierWaterfallData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Compare Mode Delta Table overlay */}
              {isCompareMode && (
                <div className="mt-4 p-4 rounded-lg bg-indigo-950/20 border border-indigo-500/30">
                  <div className="text-xs font-mono font-bold text-indigo-300 mb-3 flex items-center gap-2">
                    <GitCompare className="w-4 h-4" />
                    SCENARIO VARIANCE ANALYSIS (Model A vs Model B)
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] font-mono border-b border-indigo-500/20 pb-2 mb-2 text-slate-400 font-bold uppercase">
                    <div>Metric</div>
                    <div className="text-right text-slate-300">Model A</div>
                    <div className="text-right text-slate-300">Model B</div>
                    <div className="text-right text-indigo-300">Delta</div>
                  </div>
                  
                  <div className="space-y-2 text-[11px] font-mono">
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <div className="text-slate-300">Gross Margin</div>
                      <div className="text-right">{effectiveGrossMarginPercent}%</div>
                      <div className="text-right">{compGrossMarginPercent}%</div>
                      <div className={`text-right font-bold ${effectiveGrossMarginPercent - compGrossMarginPercent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {effectiveGrossMarginPercent - compGrossMarginPercent > 0 ? '+' : ''}{(effectiveGrossMarginPercent - compGrossMarginPercent).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <div className="text-slate-300">Net Profit</div>
                      <div className="text-right">{formatMoney(effectiveNetProfit)}</div>
                      <div className="text-right">{formatMoney(compNetProfit)}</div>
                      <div className={`text-right font-bold ${effectiveNetProfit - compNetProfit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {effectiveNetProfit - compNetProfit > 0 ? '+' : ''}{formatMoney(effectiveNetProfit - compNetProfit)}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 items-center">
                      <div className="text-slate-300">CAC Load</div>
                      <div className="text-right">{formatMoney(effectiveCac)}</div>
                      <div className="text-right">{formatMoney(compCac)}</div>
                      <div className={`text-right font-bold ${effectiveCac - compCac < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {effectiveCac - compCac > 0 ? '+' : ''}{formatMoney(effectiveCac - compCac)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Waterfall Steps */}
              <div className="space-y-3">
                
                {/* 1. Contract Revenue */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white">100% Contract Revenue ({scenario} scenario)</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-cyan-300">
                    {formatMoney(effectiveRevenue)}
                  </span>
                </div>

                {/* 2. Direct COGS */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">Direct Factory Cost (COGS - {effectiveCogsPercent}%)</span>
                    <span className="text-rose-400 font-semibold">
                      - {formatMoney(effectiveCogs)}
                    </span>
                  </div>
                  
                  {/* Sub-breakdowns */}
                  <div className="pl-3 border-l-2 border-slate-800 space-y-1 text-[11px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>• Multidisciplinary Engineering Labor:</span>
                      <span className="text-slate-300">{formatMoney(activeTier.costBreakdownUsd.engineeringLabor * currentScen.cogsMult)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 3D Spatial & UI/UX Design:</span>
                      <span className="text-slate-300">{formatMoney(activeTier.costBreakdownUsd.spatialDesignLabor * currentScen.cogsMult)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• GPU Cloud Compute & Token Staging:</span>
                      <span className="text-slate-300">{formatMoney(activeTier.costBreakdownUsd.cloudCompute)}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Gross Profit */}
                <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-mono font-bold text-sky-200">
                      Gross Profit (Gross Margin: {effectiveGrossMarginPercent}%)
                      <InsightBadge 
                        trend={effectiveGrossMarginPercent > activeTier.grossMarginPercent ? 'up' : effectiveGrossMarginPercent < activeTier.grossMarginPercent ? 'down' : 'neutral'} 
                        message={scenario === 'aggressive' ? 'Higher margins driven by modular WebXR code reusability lowering COGS.' : scenario === 'conservative' ? 'Conservative pricing impacts top-line margins heavily.' : 'Baseline optimized to safely stay under 45%.'} 
                      />
                    </span>
                  </div>
                  <span className="text-base font-mono font-bold text-sky-300">
                    {formatMoney(effectiveGrossProfit)}
                  </span>
                </div>

                {/* 4. Marketing CAC & Overheads */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Marketing & CAC ({currentScen.cacPercent}%):
                      <InsightBadge 
                        trend={currentScen.cacPercent < 15 ? 'up' : 'neutral'} 
                        message={scenario === 'aggressive' ? 'Decreased CAC due to inbound partner referrals.' : scenario === 'conservative' ? 'Standard cold-outreach acquisition cost.' : 'Base 15% CAC assumptions.'} 
                      />
                    </span>
                    <span className="text-amber-400 font-semibold">
                      - {formatMoney(effectiveCac)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Lumpsum G&A & Reserves ({currentScen.overheadPercent}%):</span>
                    <span className="text-amber-400 font-semibold">
                      - {formatMoney(effectiveOverhead)}
                    </span>
                  </div>
                </div>

                {/* 5. Net Operating Profit */}
                <div className="p-3.5 rounded-lg bg-gradient-to-r from-emerald-950/60 to-teal-950/40 border border-emerald-500/50 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <div className="text-xs font-mono font-bold text-emerald-300">
                        NET OPERATING PROFIT (NET MARGIN: {effectiveNetMarginPercent}%)
                        <InsightBadge 
                          trend={effectiveNetMarginPercent > activeTier.netMarginPercent ? 'up' : effectiveNetMarginPercent < activeTier.netMarginPercent ? 'down' : 'neutral'} 
                          message={scenario === 'aggressive' ? 'Compounding effects of lower COGS and lower CAC yield highly scalable net margins.' : scenario === 'conservative' ? 'Buffer built in to absorb unexpected market conditions.' : 'Capped safely under 25% for stability.'} 
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {scenario === 'conservative' ? 'Downside Stress-Tested' : scenario === 'aggressive' ? 'Scale & Modular Reusability' : 'Audited Baseline (Ceiling ≤ 25.0%)'}
                      </div>
                    </div>
                  </div>
                  <span className="text-lg font-mono font-extrabold text-emerald-300">
                    {formatMoney(effectiveNetProfit)}
                  </span>
                </div>

              </div>

            </div>
          </motion.div>

          {/* Right: Team Allocation Pod & Turnaround (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 space-y-5"
          >
            
            {/* Team Pod Card */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                <Users className="w-4 h-4" />
                <span>
                  {selectedCategory === 'A' ? '4-PERSON AGILE POD ALLOCATION' : 'MULTIDISCIPLINARY DELIVERY TEAM'}
                </span>
              </div>

              <h4 className="font-heading font-bold text-lg text-white">
                Embedded QA & Rapid Turnaround
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedCategory === 'A' 
                  ? 'The 4-person pod (Full-Stack+QA, AR/VR Specialist, AI/ML Engineer, and UI/UX Designer) eliminates standalone QA management overhead by embedding continuous testing directly into developer sprints.'
                  : 'Enterprise delivery combines a Lead Enterprise Architect (San Jose / Australia) with senior backend, WebXR, DevOps, and compliance specialists in Dhaka.'}
              </p>

              <div className="space-y-2 pt-2">
                {activeTier.teamAllocation.map(member => (
                  <div key={member} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{member}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Timeline: <strong>{activeTier.deliveryTimeline}</strong></span>
                </span>
                <span className="text-cyan-400 font-semibold">
                  {activeTier.billableHours ? `${activeTier.billableHours} Billable Hours` : 'Milestone Sprints'}
                </span>
              </div>
            </div>

            {/* Why Spenta Avoids Commodity Trap */}
            <div className="p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
              <div className="text-xs font-mono text-indigo-300 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>INVESTOR GOVERNANCE GUARANTEE</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Commodity IT shops underprice direct labor and fail to allocate 12%–15% CAC and 8%–10% reserves, succumbing to 1%–5% margin traps. Spenta’s dual-shore model maintains a strict <strong>32.5%–45.0% gross margin</strong> and <strong>13.5%–25.0% net margin</strong> across all 9 commercial tiers.
              </p>
            </div>

          </motion.div>

        </div>

      </div>

      <AnimatePresence>
        {activeAnomaly && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 z-50 backdrop-blur-sm cursor-pointer" 
              onClick={() => setActiveAnomaly(null)} 
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-slate-950 border-l border-slate-800 z-[60] shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                      activeAnomaly.severity === 'high' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50' : 
                      activeAnomaly.severity === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    }`}>
                      {activeAnomaly.severity} Severity
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Live Telemetry
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white">{activeAnomaly.title}</h3>
                </div>
                <button 
                  onClick={() => setActiveAnomaly(null)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
                  <div className="text-xs font-mono text-slate-400">CURRENT METRIC DRIFT</div>
                  <div className={`text-2xl font-mono font-extrabold ${
                      activeAnomaly.severity === 'high' ? 'text-rose-400' : 
                      activeAnomaly.severity === 'medium' ? 'text-amber-400' : 
                      'text-emerald-400'
                  }`}>
                    {activeAnomaly.metric}
                  </div>
                  <div className="mt-2 h-40 w-full border-t border-b border-slate-800/50 py-4">
                    {/* Recharts Correlation Graph */}
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={activeAnomaly.sparkline.map((val, i) => ({
                        time: `T-${7-i}`,
                        variance: anomalyViewMode === 'projected' ? val * (scenario === 'aggressive' ? 1.3 : 1.1) : val,
                        growth: 100 - (val * (activeAnomaly.severity === 'high' ? 1.5 : 0.8)) + (i * 2)
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                        <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px', fontFamily: 'monospace' }}
                          itemStyle={{ color: '#e2e8f0' }}
                        />
                        <Area yAxisId="right" type="monotone" dataKey="growth" name="Dual-Engine Growth" fill="#0ea5e9" fillOpacity={0.1} stroke="#0ea5e9" strokeWidth={2} />
                        <Line yAxisId="left" type="monotone" dataKey="variance" name="Market Variance" stroke={
                          activeAnomaly.severity === 'high' ? '#f43f5e' : 
                          activeAnomaly.severity === 'medium' ? '#f59e0b' : '#10b981'
                        } strokeWidth={3} dot={{ r: 3, fill: '#0f172a' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 text-right mt-1">
                    {anomalyViewMode === 'projected' ? 'PROJECTED 30-DAY CORRELATION MODEL' : 'HISTORICAL 30-DAY CORRELATION MODEL'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-slate-300">DEEP-DIVE CONTEXT</h4>
                    <p className="text-sm text-slate-400 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                      {activeAnomaly.context}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      AI MITIGATION STRATEGY
                    </h4>
                    <div className="text-sm text-slate-300 leading-relaxed bg-cyan-950/20 p-4 rounded-lg border border-cyan-500/30 flex flex-col gap-3">
                      <p className="font-semibold text-cyan-100">Recommended Operational Shift:</p>
                      <p className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                        <span>{activeAnomaly.mitigation}</span>
                      </p>
                      <div className="h-px w-full bg-cyan-500/20 my-1" />
                      <p className="font-semibold text-cyan-100">Automated Remediation Steps:</p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs">
                        <li>Trigger proactive alerts to finance ops team.</li>
                        <li>Recalculate subsequent quarter's baseline projections.</li>
                        <li>Deploy targeted A/B tests for variance correction.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-slate-300">HISTORICAL TREND</h4>
                    <p className="text-sm text-slate-400 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                      {activeAnomaly.history}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setActiveAnomaly(null)}
                  className="w-full mt-4 py-3 bg-cyan-900/20 hover:bg-cyan-900/40 border border-cyan-500/30 hover:border-cyan-500/50 rounded-xl text-cyan-400 font-bold text-sm transition-all shadow-lg"
                >
                  Acknowledge & Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};
