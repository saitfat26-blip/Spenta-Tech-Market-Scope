import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { CASE_STUDIES } from '../data/mockData';
import { Currency, USD_TO_BDT_RATE } from '../types';
import { CopyShareButton } from './CopyShareButton';
import { 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  Building2, 
  Calculator, 
  ShieldCheck, 
  Clock, 
  Users, 
  DollarSign,
  Activity,
  Layers,
  BarChart3,
  LineChart as LineChartIcon
} from 'lucide-react';

interface CaseStudiesSectionProps {
  currency: Currency;
}

// 3-Year Audited Quarterly Longitudinal Data for Recharts Multi-Series Visualizer
const longitudinalPerformanceData = [
  { quarter: 'Q1 Y1', roi: 110, conversionUplift: 6.5, costAvoidanceM: 0.8, timeReductionPct: 45 },
  { quarter: 'Q2 Y1', roi: 165, conversionUplift: 11.2, costAvoidanceM: 1.9, timeReductionPct: 62 },
  { quarter: 'Q3 Y1', roi: 220, conversionUplift: 15.8, costAvoidanceM: 3.1, timeReductionPct: 78 },
  { quarter: 'Q4 Y1', roi: 275, conversionUplift: 19.4, costAvoidanceM: 4.6, timeReductionPct: 86 },
  { quarter: 'Q1 Y2', roi: 320, conversionUplift: 22.0, costAvoidanceM: 6.2, timeReductionPct: 91 },
  { quarter: 'Q2 Y2', roi: 360, conversionUplift: 24.1, costAvoidanceM: 7.9, timeReductionPct: 94 },
  { quarter: 'Q3 Y2', roi: 395, conversionUplift: 25.8, costAvoidanceM: 9.3, timeReductionPct: 96 },
  { quarter: 'Q4 Y2', roi: 420, conversionUplift: 26.9, costAvoidanceM: 10.4, timeReductionPct: 97 },
  { quarter: 'Q1 Y3', roi: 435, conversionUplift: 27.4, costAvoidanceM: 11.1, timeReductionPct: 97 },
  { quarter: 'Q2 Y3', roi: 442, conversionUplift: 27.8, costAvoidanceM: 11.7, timeReductionPct: 97.2 },
  { quarter: 'Q3 Y3', roi: 448, conversionUplift: 28.0, costAvoidanceM: 12.1, timeReductionPct: 97.4 },
  { quarter: 'Q4 Y3', roi: 450, conversionUplift: 28.2, costAvoidanceM: 12.4, timeReductionPct: 97.5 }
];

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({ currency }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('prime-bank');
  const [activeChartMetric, setActiveChartMetric] = useState<'all' | 'roi' | 'conversion' | 'savings'>('all');

  // ROI Calculator State
  const [monthlyCases, setMonthlyCases] = useState<number>(4500);
  const [currentMinutesPerCase, setCurrentMinutesPerCase] = useState<number>(18);
  const [hourlyWage, setHourlyWage] = useState<number>(currency === 'USD' ? 22 : 350);

  const filterCategories = [
    { id: 'all', label: 'All Deployments' },
    { id: 'banking', label: 'Banking & IDP' },
    { id: 'pharma', label: 'Pharma & Cleanroom' },
    { id: 'retail', label: 'Spatial Retail & AR' },
    { id: 'healthcare', label: 'Healthcare Twins' },
  ];

  const filteredCases = CASE_STUDIES.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'banking') return item.id === 'prime-bank';
    if (activeFilter === 'pharma') return item.id === 'samsung-biologics';
    if (activeFilter === 'retail') return item.id === 'isho-webar';
    if (activeFilter === 'healthcare') return item.id === 'apollo-hospital';
    return true;
  });

  const activeCase = CASE_STUDIES.find(c => c.id === selectedCaseId) || CASE_STUDIES[0];

  // Calculate simulated ROI
  const oldHours = (monthlyCases * currentMinutesPerCase) / 60;
  const newHours = (monthlyCases * 0.5) / 60;
  const hoursSavedPerMonth = Math.max(0, oldHours - newHours);
  const monthlyCostSavings = hoursSavedPerMonth * hourlyWage;
  const annualCostSavings = monthlyCostSavings * 12;

  const formatCurrency = (val: number) => {
    if (currency === 'USD') {
      return `$${Math.round(val).toLocaleString()}`;
    } else {
      return `${Math.round(val).toLocaleString()} ৳`;
    }
  };

  // Custom Recharts Dark Tooltip
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-700 p-3 rounded-lg shadow-2xl text-xs font-mono backdrop-blur-md hud-corner">
          <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between gap-4">
            <span>TIMELINE: {label}</span>
            <span className="text-[9px] text-slate-500">AUDITED DATA</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white font-mono">
                {entry.name.includes('Cost Avoidance')
                  ? `$${entry.value}M`
                  : `${entry.value}%`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section id="case-studies" className="py-20 relative bg-[#05070B] overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-cyan-600/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion Entrance */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>TRACTION & PROVEN OPERATIONAL ROI</span>
            </div>
            <CopyShareButton sectionId="case-studies" sectionTitle="Case Studies & ROI" variant="pill" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            Cross-Domain Enterprise Case Studies
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Audit-tested deployments across Tier-1 banking, global biopharmaceuticals, national retail chains, and leading medical institutions.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8">
          {filterCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Case Studies Grid with Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {filteredCases.map((cs, idx) => {
            const isSelected = selectedCaseId === cs.id;
            return (
              <motion.div
                key={cs.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setSelectedCaseId(cs.id)}
                className={`service-card-3d p-5 rounded-xl cursor-pointer transition-all flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-400 shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-400/40'
                    : 'bg-slate-950 border-slate-800 hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {cs.industry}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {cs.tag}
                    </span>
                  </div>

                  {/* Client & Headline */}
                  <div>
                    <h3 className="text-lg font-bold font-heading text-white group-hover:text-emerald-300 transition-colors">
                      {cs.client}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">
                      {cs.headline}
                    </p>
                  </div>

                  {/* Highlight Metrics (2x2 Grid) */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {cs.metrics.slice(0, 2).map(m => (
                      <div key={m.label} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        <div className="text-base font-black font-mono text-emerald-400">{m.value}</div>
                        <div className="text-[9px] font-mono text-slate-400 mt-0.5 leading-tight uppercase">{m.label}</div>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{cs.techStack[0]} • {cs.techStack[1]}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    Details <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Recharts-Based Multi-Series Line Chart: 3-Year Audited Trajectory */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 p-6 sm:p-7 rounded-xl mb-12 relative overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold mb-1">
                <LineChartIcon className="w-3 h-3 text-emerald-400" />
                <span>AUDITED LONGITUDINAL ENTERPRISE METRICS</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                3-Year Multi-Series Impact Curve: 450% ROI & 28% Conversion Uplift
              </h3>
            </div>

            {/* Quick Chart Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveChartMetric('all')}
                className={`px-2.5 py-1 rounded transition-all ${
                  activeChartMetric === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Series
              </button>
              <button
                onClick={() => setActiveChartMetric('roi')}
                className={`px-2.5 py-1 rounded transition-all ${
                  activeChartMetric === 'roi'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                450% 3-Yr ROI
              </button>
              <button
                onClick={() => setActiveChartMetric('conversion')}
                className={`px-2.5 py-1 rounded transition-all ${
                  activeChartMetric === 'conversion'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                28% Uplift
              </button>
              <button
                onClick={() => setActiveChartMetric('savings')}
                className={`px-2.5 py-1 rounded transition-all ${
                  activeChartMetric === 'savings'
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                $12.4M Saved
              </button>
            </div>
          </div>

          {/* 4 Summary Stat Badges Above Chart */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">3-Year Cumulative ROI</div>
              <div className="text-xl font-black font-mono text-emerald-400">+450.0%</div>
              <div className="text-[9px] font-mono text-slate-500">Tier-1 Institutional Deployments</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Conversion Uplift</div>
              <div className="text-xl font-black font-mono text-cyan-300">+28.2%</div>
              <div className="text-[9px] font-mono text-slate-500">Spatial WebAR & 3D Configurator</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Operating Cost Avoidance</div>
              <div className="text-xl font-black font-mono text-indigo-300">$12.4M USD</div>
              <div className="text-[9px] font-mono text-slate-500">Cleanroom & KYC Workflow Hours</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Processing Latency Cut</div>
              <div className="text-xl font-black font-mono text-amber-300">-97.5%</div>
              <div className="text-[9px] font-mono text-slate-500">20 mins down to &lt;30 seconds</div>
            </div>
          </div>

          {/* Recharts Multi-Series Line & Area Visualization Container */}
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={longitudinalPerformanceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis 
                  dataKey="quarter" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  fontFamily="JetBrains Mono"
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  fontFamily="JetBrains Mono"
                  domain={[0, 480]}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                />

                {(activeChartMetric === 'all' || activeChartMetric === 'roi') && (
                  <Area
                    type="monotone"
                    dataKey="roi"
                    name="Cumulative ROI (%)"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#roiGradient)"
                    dot={{ fill: '#10B981', r: 3 }}
                    activeDot={{ r: 6, fill: '#34D399', stroke: '#064e3b', strokeWidth: 2 }}
                  />
                )}

                {(activeChartMetric === 'all' || activeChartMetric === 'conversion') && (
                  <Line
                    type="monotone"
                    dataKey="conversionUplift"
                    name="Conversion Uplift (%)"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={{ fill: '#06B6D4', r: 3 }}
                    activeDot={{ r: 5, fill: '#38BDF8' }}
                  />
                )}

                {(activeChartMetric === 'all' || activeChartMetric === 'savings') && (
                  <Area
                    type="monotone"
                    dataKey="costAvoidanceM"
                    name="Cost Avoidance ($M)"
                    stroke="#818CF8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#savingsGradient)"
                    dot={{ fill: '#818CF8', r: 3 }}
                  />
                )}

                {activeChartMetric === 'all' && (
                  <Line
                    type="monotone"
                    dataKey="timeReductionPct"
                    name="Processing Time Cut (%)"
                    stroke="#FBBF24"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Interactive ROI Simulator Widget with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/50 border border-slate-800 p-6 sm:p-8 rounded-xl relative overflow-hidden"
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Inputs (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/40 text-[10px] font-mono text-indigo-300 font-bold">
                  <Calculator className="w-3 h-3" />
                  <span>INTERACTIVE ENTERPRISE ROI SIMULATOR</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                  Simulate Your Annual Operational Savings
                </h3>
                <p className="text-xs text-slate-300">
                  Based on audited Prime Bank PrimeOCR & Samsung Biologics cleanroom deployment metrics.
                </p>
              </div>

              {/* Slider 1: Monthly Case Volume */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Monthly Document/Transaction Volume</span>
                  <span className="text-cyan-400 font-bold">{monthlyCases.toLocaleString()} cases/mo</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="30000"
                  step="500"
                  value={monthlyCases}
                  onChange={(e) => setMonthlyCases(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>500 cases</span>
                  <span>15,000 cases</span>
                  <span>30,000 cases</span>
                </div>
              </div>

              {/* Slider 2: Current Manual Processing Time */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Current Manual Human Handling Time</span>
                  <span className="text-purple-300 font-bold">{currentMinutesPerCase} mins / case</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="1"
                  value={currentMinutesPerCase}
                  onChange={(e) => setCurrentMinutesPerCase(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>5 mins</span>
                  <span>20 mins (Baseline)</span>
                  <span>45 mins</span>
                </div>
              </div>

              {/* Slider 3: Hourly Labor Cost */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Average Blended Hourly Staff Compensation</span>
                  <span className="text-emerald-400 font-bold">
                    {currency === 'USD' ? `$${hourlyWage}/hr` : `${hourlyWage} ৳/hr`}
                  </span>
                </div>
                <input
                  type="range"
                  min={currency === 'USD' ? 10 : 150}
                  max={currency === 'USD' ? 80 : 1200}
                  step={currency === 'USD' ? 2 : 25}
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

            </div>

            {/* Right Output Box (6 cols) */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-7 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-5 shadow-2xl">
                
                <div className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span>PROJECTED ENTERPRISE GAINS</span>
                  <span className="text-emerald-400 font-bold">90% WORKLOAD CUT</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-mono text-slate-400">Monthly Hours Saved</div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300 mt-1">
                      {Math.round(hoursSavedPerMonth).toLocaleString()} hrs
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Automated via PrimeOCR</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-mono text-slate-400">Velocity Improvement</div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">
                      {Math.round((currentMinutesPerCase / 0.5) * 10) / 10}x
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Under 30s per record</div>
                  </div>
                </div>

                {/* Annual Total Financial Impact */}
                <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-center space-y-1">
                  <div className="text-xs font-mono text-slate-300 uppercase">
                    Estimated Annual Operating Savings
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">
                    {formatCurrency(annualCostSavings)}
                  </div>
                  <div className="text-xs font-mono text-emerald-400/80 pt-0.5">
                    Payback period on standard Model C Enterprise setup: &lt; 4.5 months
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href="#investment-terms"
                    className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                  >
                    <span>View Institutional Cap Table & SAFE Round Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
