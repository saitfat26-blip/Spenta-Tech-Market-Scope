import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
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
  LineChart
} from 'lucide-react';

interface UnitEconomicsSectionProps {
  currency: Currency;
  onOpenIntelligenceDashboard?: (scenario: FinancialScenario) => void;
}

export type FinancialScenario = 'conservative' | 'base' | 'aggressive';

export const UnitEconomicsSection: React.FC<UnitEconomicsSectionProps> = ({ 
  currency,
  onOpenIntelligenceDashboard 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'A' | 'B' | 'C'>('A');
  const [selectedTierId, setSelectedTierId] = useState<string>('tier-a2');
  const [scenario, setScenario] = useState<FinancialScenario>('base');

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

  // Recharts waterfall dataset for active tier & scenario
  const tierWaterfallData = [
    { name: 'Revenue', value: effectiveRevenue, percentage: 100, color: '#38BDF8', type: 'inflow' },
    { name: 'Direct COGS', value: effectiveCogs, percentage: effectiveCogsPercent, color: '#FB7185', type: 'cogs' },
    { name: 'Gross Profit', value: effectiveGrossProfit, percentage: effectiveGrossMarginPercent, color: '#818CF8', type: 'gross' },
    { name: 'Sales CAC', value: effectiveCac, percentage: currentScen.cacPercent, color: '#FBBF24', type: 'cac' },
    { name: 'Overheads', value: effectiveOverhead, percentage: currentScen.overheadPercent, color: '#F59E0B', type: 'overhead' },
    { name: 'Net Profit', value: effectiveNetProfit, percentage: effectiveNetMarginPercent, color: '#34D399', type: 'net' }
  ];

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

          {onOpenIntelligenceDashboard && (
            <div className="pt-2">
              <button
                onClick={() => onOpenIntelligenceDashboard(scenario)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 transition-all cursor-pointer shadow-lg"
              >
                <LineChart className="w-4 h-4 text-indigo-400" />
                <span>Launch D3.js 12-Quarter Projections Dashboard</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Financial Scenarios Toggle Banner */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 mb-8 max-w-4xl mx-auto backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white uppercase tracking-wider">FINANCIAL SCENARIOS:</span>
            </div>

            {/* 3-Way Scenario Switcher */}
            <div className="inline-flex p-1 rounded-lg bg-slate-900 border border-slate-800">
              <button
                onClick={() => setScenario('conservative')}
                className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  scenario === 'conservative'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Conservative</span>
              </button>

              <button
                onClick={() => setScenario('base')}
                className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  scenario === 'base'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Base (Audited)</span>
              </button>

              <button
                onClick={() => setScenario('aggressive')}
                className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  scenario === 'aggressive'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Aggressive</span>
              </button>
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
                    REVENUE & EXPENSE WATERFALL ALLOCATION ({scenario.toUpperCase()})
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
                    </span>
                  </div>
                  <span className="text-base font-mono font-bold text-sky-300">
                    {formatMoney(effectiveGrossProfit)}
                  </span>
                </div>

                {/* 4. Marketing CAC & Overheads */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Marketing & CAC ({currentScen.cacPercent}%):</span>
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
    </section>
  );
};
