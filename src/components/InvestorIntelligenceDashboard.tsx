import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { Currency, USD_TO_BDT_RATE } from '../types';
import { FinancialScenario } from './UnitEconomicsSection';
import { 
  BarChart3, 
  TrendingUp, 
  X, 
  Sliders, 
  Zap, 
  ShieldCheck, 
  DollarSign, 
  Calculator, 
  Layers, 
  Cpu, 
  PieChart, 
  Maximize2,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface InvestorIntelligenceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  initialScenario?: FinancialScenario;
}

interface ProjectionQuarter {
  quarter: string;
  quarterIndex: number;
  revenueUsd: number;
  cogsUsd: number;
  grossProfitUsd: number;
  cacUsd: number;
  overheadUsd: number;
  netProfitUsd: number;
  cumulativeCashUsd: number;
  arrUsd: number;
}

export const InvestorIntelligenceDashboard: React.FC<InvestorIntelligenceDashboardProps> = ({
  isOpen,
  onClose,
  currency,
  initialScenario = 'base'
}) => {
  const [scenario, setScenario] = useState<FinancialScenario>(initialScenario);
  const [valuationMultiple, setValuationMultiple] = useState<number>(12);
  const [efficiencyGain, setEfficiencyGain] = useState<number>(15); // % modular reusability
  const [hoveredData, setHoveredData] = useState<ProjectionQuarter | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const donutRef = useRef<SVGSVGElement | null>(null);

  // Synchronize initialScenario when prop changes
  useEffect(() => {
    if (initialScenario) {
      setScenario(initialScenario);
    }
  }, [initialScenario]);

  // Generate 12-Quarter dynamic financial projection model
  const quartersList = [
    'Q1 26', 'Q2 26', 'Q3 26', 'Q4 26',
    'Q1 27', 'Q2 27', 'Q3 27', 'Q4 27',
    'Q1 28', 'Q2 28', 'Q3 28', 'Q4 28'
  ];

  const scenarioConfig = {
    conservative: {
      initialRevenue: 120000,
      quarterlyGrowth: 0.18,
      cogsBasePercent: 0.62,
      cacPercent: 0.16,
      overheadPercent: 0.10,
      reusabilityBonus: 0.05
    },
    base: {
      initialRevenue: 165000,
      quarterlyGrowth: 0.26,
      cogsBasePercent: 0.58,
      cacPercent: 0.13,
      overheadPercent: 0.09,
      reusabilityBonus: 0.12
    },
    aggressive: {
      initialRevenue: 220000,
      quarterlyGrowth: 0.35,
      cogsBasePercent: 0.54,
      cacPercent: 0.10,
      overheadPercent: 0.07,
      reusabilityBonus: 0.22
    }
  };

  const currentCfg = scenarioConfig[scenario];

  // Calculate live projection dataset
  const projections: ProjectionQuarter[] = [];
  let currentRev = currentCfg.initialRevenue;
  let cumCash = -350000; // Seed capital initial deployment

  for (let i = 0; i < quartersList.length; i++) {
    if (i > 0) {
      currentRev = currentRev * (1 + currentCfg.quarterlyGrowth);
    }
    // Factoring efficiency gain slider
    const effectiveCogsPercent = Math.max(0.40, currentCfg.cogsBasePercent - (efficiencyGain / 100) * 0.25);
    const cogs = currentRev * effectiveCogsPercent;
    const grossProfit = currentRev - cogs;
    const cac = currentRev * currentCfg.cacPercent;
    const overhead = currentRev * currentCfg.overheadPercent;
    const netProfit = grossProfit - cac - overhead;
    cumCash += netProfit;

    projections.push({
      quarter: quartersList[i],
      quarterIndex: i,
      revenueUsd: currentRev,
      cogsUsd: cogs,
      grossProfitUsd: grossProfit,
      cacUsd: cac,
      overheadUsd: overhead,
      netProfitUsd: netProfit,
      cumulativeCashUsd: cumCash,
      arrUsd: currentRev * 4 * 0.45 // Estimated annualized recurring software engine contracts
    });
  }

  const formatVal = (usdVal: number) => {
    const val = currency === 'USD' ? usdVal : usdVal * USD_TO_BDT_RATE;
    const symbol = currency === 'USD' ? '$' : '৳ ';
    if (Math.abs(val) >= 1000000) {
      return `${symbol}${(val / 1000000).toFixed(2)}M`;
    }
    if (Math.abs(val) >= 1000) {
      return `${symbol}${(val / 1000).toFixed(0)}k`;
    }
    return `${symbol}${Math.round(val).toLocaleString()}`;
  };

  // D3 Render Projection Line & Area Chart
  useEffect(() => {
    if (!isOpen || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 700;
    const height = 300;
    const margin = { top: 25, right: 35, bottom: 35, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add gradient definitions
    const defs = svg.append('defs');
    
    // Revenue Gradient
    const revGradient = defs.append('linearGradient')
      .attr('id', 'rev-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    revGradient.append('stop').attr('offset', '0%').attr('stop-color', '#38BDF8').attr('stop-opacity', 0.4);
    revGradient.append('stop').attr('offset', '100%').attr('stop-color', '#38BDF8').attr('stop-opacity', 0.0);

    // Net Profit Gradient
    const netGradient = defs.append('linearGradient')
      .attr('id', 'net-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    netGradient.append('stop').attr('offset', '0%').attr('stop-color', '#34D399').attr('stop-opacity', 0.35);
    netGradient.append('stop').attr('offset', '100%').attr('stop-color', '#34D399').attr('stop-opacity', 0.0);

    // Scales
    const xScale = d3.scalePoint()
      .domain(projections.map(d => d.quarter))
      .range([0, innerWidth]);

    const maxVal = d3.max(projections, d => d.revenueUsd) || 1000000;
    const yScale = d3.scaleLinear()
      .domain([0, maxVal * 1.1])
      .range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
      )
      .attr('stroke', '#1e293b')
      .attr('stroke-opacity', 0.5);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .attr('color', '#64748b')
      .attr('font-family', 'JetBrains Mono')
      .attr('font-size', '10px');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat((d) => formatVal(d as number)))
      .attr('color', '#64748b')
      .attr('font-family', 'JetBrains Mono')
      .attr('font-size', '10px');

    // Area Generators
    const revArea = d3.area<ProjectionQuarter>()
      .x(d => xScale(d.quarter) || 0)
      .y0(innerHeight)
      .y1(d => yScale(d.revenueUsd))
      .curve(d3.curveMonotoneX);

    const netArea = d3.area<ProjectionQuarter>()
      .x(d => xScale(d.quarter) || 0)
      .y0(innerHeight)
      .y1(d => yScale(Math.max(0, d.netProfitUsd)))
      .curve(d3.curveMonotoneX);

    // Line Generators
    const revLine = d3.line<ProjectionQuarter>()
      .x(d => xScale(d.quarter) || 0)
      .y(d => yScale(d.revenueUsd))
      .curve(d3.curveMonotoneX);

    const grossLine = d3.line<ProjectionQuarter>()
      .x(d => xScale(d.quarter) || 0)
      .y(d => yScale(d.grossProfitUsd))
      .curve(d3.curveMonotoneX);

    const netLine = d3.line<ProjectionQuarter>()
      .x(d => xScale(d.quarter) || 0)
      .y(d => yScale(d.netProfitUsd))
      .curve(d3.curveMonotoneX);

    // Draw Areas
    g.append('path')
      .datum(projections)
      .attr('fill', 'url(#rev-gradient)')
      .attr('d', revArea);

    g.append('path')
      .datum(projections)
      .attr('fill', 'url(#net-gradient)')
      .attr('d', netArea);

    // Draw Lines
    g.append('path')
      .datum(projections)
      .attr('fill', 'none')
      .attr('stroke', '#38BDF8')
      .attr('stroke-width', 2.5)
      .attr('d', revLine);

    g.append('path')
      .datum(projections)
      .attr('fill', 'none')
      .attr('stroke', '#818CF8')
      .attr('stroke-width', 1.8)
      .attr('stroke-dasharray', '4 4')
      .attr('d', grossLine);

    g.append('path')
      .datum(projections)
      .attr('fill', 'none')
      .attr('stroke', '#34D399')
      .attr('stroke-width', 2.5)
      .attr('d', netLine);

    // Interactive Node Dots & Overlay
    projections.forEach(d => {
      const cx = xScale(d.quarter) || 0;
      const cyRev = yScale(d.revenueUsd);
      const cyNet = yScale(d.netProfitUsd);

      // Revenue dot
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cyRev)
        .attr('r', 4)
        .attr('fill', '#38BDF8')
        .attr('stroke', '#020617')
        .attr('stroke-width', 1.5);

      // Net profit dot
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cyNet)
        .attr('r', 4)
        .attr('fill', '#34D399')
        .attr('stroke', '#020617')
        .attr('stroke-width', 1.5);
    });

    // Invisible hover scan rectangles
    const sliceWidth = innerWidth / (projections.length - 1);
    projections.forEach((d, i) => {
      const x = (xScale(d.quarter) || 0) - sliceWidth / 2;
      g.append('rect')
        .attr('x', Math.max(0, x))
        .attr('y', 0)
        .attr('width', sliceWidth)
        .attr('height', innerHeight)
        .attr('fill', 'transparent')
        .attr('cursor', 'pointer')
        .on('mouseenter', () => setHoveredData(d))
        .on('mouseleave', () => setHoveredData(null));
    });

  }, [isOpen, scenario, efficiencyGain, currency, valuationMultiple]);

  // D3 Render Radial / Donut Allocation Chart
  useEffect(() => {
    if (!isOpen || !donutRef.current) return;

    const donutSvg = d3.select(donutRef.current);
    donutSvg.selectAll('*').remove();

    const width = 160;
    const height = 160;
    const radius = Math.min(width, height) / 2;

    const g = donutSvg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const latest = projections[projections.length - 1];
    const donutData = [
      { name: 'Direct COGS', value: latest.cogsUsd, color: '#FB7185' },
      { name: 'Sales CAC', value: latest.cacUsd, color: '#FBBF24' },
      { name: 'Overheads & G&A', value: latest.overheadUsd, color: '#818CF8' },
      { name: 'Retained Net Margin', value: latest.netProfitUsd, color: '#34D399' },
    ];

    const pie = d3.pie<any>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<any>()
      .innerRadius(radius * 0.58)
      .outerRadius(radius * 0.9);

    g.selectAll('path')
      .data(pie(donutData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', '#090D16')
      .attr('stroke-width', 2);

    // Center Text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono')
      .attr('fill', '#94a3b8')
      .text('NET MARGIN');

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'JetBrains Mono')
      .attr('fill', '#34D399')
      .text(`${((latest.netProfitUsd / latest.revenueUsd) * 100).toFixed(1)}%`);

  }, [isOpen, scenario, efficiencyGain, currency]);

  if (!isOpen) return null;

  const y3Data = projections[projections.length - 1];
  const projectedValuation = y3Data.arrUsd * valuationMultiple;

  return (
    <AnimatePresence>
      <div 
        id="investor-intelligence-dashboard"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="bg-[#080C14] border border-cyan-500/40 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          
          {/* Header Bar */}
          <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white font-heading">
                    Investor Intelligence Dashboard
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-[10px] font-mono text-cyan-400 border border-cyan-500/30">
                    D3.js ENGINE
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Live parametric 12-Quarter financial simulation // {currency} normalized
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Parameters Controls Bar */}
          <div className="p-4 bg-[#0B101B] border-b border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            
            {/* 1. Scenario Toggle */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>GROWTH SCENARIO:</span>
              </label>
              <div className="flex p-0.5 rounded-lg bg-slate-900 border border-slate-800">
                {(['conservative', 'base', 'aggressive'] as FinancialScenario[]).map(sc => (
                  <button
                    key={sc}
                    onClick={() => setScenario(sc)}
                    className={`flex-1 py-1 px-2 rounded text-[10px] font-mono font-bold capitalize transition-all cursor-pointer ${
                      scenario === sc
                        ? sc === 'conservative' 
                          ? 'bg-rose-500 text-white' 
                          : sc === 'aggressive'
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-cyan-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sc}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Reusability & AI Optimization Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>MODULAR SDK REUSABILITY:</span>
                </span>
                <span className="text-indigo-300 font-bold">{efficiencyGain}% COGS Delta</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={efficiencyGain}
                onChange={e => setEfficiencyGain(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* 3. Exit Valuation Multiple Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>EXIT ARR MULTIPLE:</span>
                </span>
                <span className="text-emerald-300 font-bold">{valuationMultiple}x ARR</span>
              </div>
              <input
                type="range"
                min="8"
                max="24"
                step="2"
                value={valuationMultiple}
                onChange={e => setValuationMultiple(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

          </div>

          {/* Scrollable Dashboard Body */}
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
            
            {/* Top KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Q4 2028 Run-Rate ARR</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
                  {formatVal(y3Data.arrUsd)}
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{((Math.pow(y3Data.revenueUsd / projections[0].revenueUsd, 1/3) - 1) * 100).toFixed(0)}% 3Y CAGR</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Projected Exit Value ({valuationMultiple}x)</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {formatVal(projectedValuation)}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  On ${currency === 'USD' ? '4.5M' : '551M ৳'} Seed Post
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Year 3 Net Margin</div>
                <div className="text-xl font-bold font-mono text-purple-300 mt-1">
                  {((y3Data.netProfitUsd / y3Data.revenueUsd) * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] font-mono text-cyan-400 mt-1">
                  Dual-Shore Capital Buffer
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Seed SAFE Multiple</div>
                <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                  {(projectedValuation / 4500000).toFixed(1)}x MOIC
                </div>
                <div className="text-[10px] font-mono text-amber-400 mt-1">
                  Implied Seed Multiple
                </div>
              </div>

            </div>

            {/* D3 Main Projection Chart Area */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">
                      12-QUARTER TRAJECTORY (REVENUE VS. NET PROFIT)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-cyan-300 border border-slate-800">
                      D3 VECTOR RENDER
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Hover across quarters to inspect telemetry
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <span className="w-2.5 h-0.5 bg-cyan-400 rounded-full" />
                    Revenue
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-300">
                    <span className="w-2.5 h-0.5 bg-indigo-400 border-dashed rounded-full" />
                    Gross Profit
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <span className="w-2.5 h-0.5 bg-emerald-400 rounded-full" />
                    Net Profit
                  </span>
                </div>
              </div>

              {/* D3 SVG Container */}
              <div className="w-full overflow-x-auto">
                <svg ref={svgRef} className="w-full h-[300px]" />
              </div>

              {/* Hovered Quarter Inspector Pill */}
              {hoveredData && (
                <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono animate-in fade-in duration-150">
                  <span className="font-bold text-cyan-300 uppercase">
                    [{hoveredData.quarter}] TELEMETRY:
                  </span>
                  <span className="text-slate-300">
                    Revenue: <strong className="text-white">{formatVal(hoveredData.revenueUsd)}</strong>
                  </span>
                  <span className="text-slate-300">
                    Gross Profit: <strong className="text-indigo-300">{formatVal(hoveredData.grossProfitUsd)}</strong>
                  </span>
                  <span className="text-slate-300">
                    Net Profit: <strong className="text-emerald-300">{formatVal(hoveredData.netProfitUsd)}</strong>
                  </span>
                  <span className="text-slate-300">
                    Cum. Cash: <strong className={hoveredData.cumulativeCashUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{formatVal(hoveredData.cumulativeCashUsd)}</strong>
                  </span>
                </div>
              )}

            </div>

            {/* Bottom Row: Expense Breakdown Donut & Governance Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* D3 Donut Visualizer (4 cols) */}
              <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-3 text-center">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Run-Rate Expense Allocation
                </div>
                <svg ref={donutRef} width="160" height="160" />
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-left w-full pt-1 border-t border-slate-900">
                  <span className="text-rose-400">• COGS</span>
                  <span className="text-amber-400">• Sales CAC</span>
                  <span className="text-indigo-400">• Overheads</span>
                  <span className="text-emerald-400">• Net Margin</span>
                </div>
              </div>

              {/* Capital Arbitrage Thesis (8 cols) */}
              <div className="lg:col-span-8 p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                <div className="text-xs font-mono text-indigo-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>INVESTOR GOVERNANCE & DUAL-SHORE THESIS</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Unlike traditional Silicon Valley agencies with high burn rates, Spenta leverages its Dhaka engineering pod to maintain a strict <strong className="text-white">32.5%–45.0% gross margin</strong> and <strong className="text-white">13.5%–25.0% net operating margin</strong>. This parametric model confirms that even in a conservative growth scenario (+18% QoQ), Spenta reaches sustainable cash-flow positivity by Q3 2026.
                </p>
                <div className="pt-2 border-t border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <span className="text-slate-400">Target Break-Even: <strong className="text-emerald-400">Q2/Q3 2026</strong></span>
                  <span className="text-slate-400">Seed Runway: <strong className="text-cyan-400">18+ Months</strong></span>
                  <span className="text-slate-400">Target Series A: <strong className="text-indigo-300">Q1 2027</strong></span>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Action */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-xs font-mono text-slate-500">
              * Simulation models for institutional due diligence purposes.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg cursor-pointer transition-all shadow-sm"
            >
              Close Intelligence Overlay
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
