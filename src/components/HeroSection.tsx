import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Currency, USD_TO_BDT_RATE } from '../types';
import { Spatial3DCanvas } from './Spatial3DCanvas';
import { 
  ArrowDown, 
  Presentation, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Lock, 
  Cpu, 
  Globe, 
  FileSpreadsheet,
  Mail,
  Compass,
  Target,
  ArrowRight,
  Zap,
  Calculator
} from 'lucide-react';

interface HeroSectionProps {
  currency: Currency;
  onOpenPitchDeck: () => void;
  onOpenDataRoom: () => void;
  onOpenContact?: (interest?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currency,
  onOpenPitchDeck,
  onOpenDataRoom,
  onOpenContact
}) => {
  const [activeNavId, setActiveNavId] = useState<string | null>(null);

  const heroNavPills = [
    {
      id: 'gtm-roi',
      title: 'GTM & ROI',
      subtitle: '450% Client Return Proof',
      icon: TrendingUp,
      sectionId: 'case-studies',
      color: 'text-emerald-400',
      borderHover: 'hover:border-emerald-400/80 hover:bg-emerald-950/30',
      tagColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
    },
    {
      id: 'strategy-planning',
      title: 'STRATEGY & PLANNING',
      subtitle: 'Seed SAFE $500k @ $4.5M Cap',
      icon: Compass,
      sectionId: 'investment-terms',
      color: 'text-cyan-400',
      borderHover: 'hover:border-cyan-400/80 hover:bg-cyan-950/30',
      tagColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
    },
    {
      id: 'omni-vertical-xr',
      title: 'OMNI-VERTICAL SMART XR',
      subtitle: 'Spatial WebXR & Nanite Twins',
      icon: Layers,
      sectionId: 'dual-engines',
      color: 'text-purple-400',
      borderHover: 'hover:border-purple-400/80 hover:bg-purple-950/30',
      tagColor: 'bg-purple-950/80 text-purple-300 border-purple-500/40'
    },
    {
      id: 'market-scope',
      title: 'MARKET SCOPE',
      subtitle: '$667.3B TAM Hardware Shift',
      icon: Globe,
      sectionId: 'market-shift',
      color: 'text-sky-400',
      borderHover: 'hover:border-sky-400/80 hover:bg-sky-950/30',
      tagColor: 'bg-sky-950/80 text-sky-300 border-sky-500/40'
    },
    {
      id: 'ir-fusion-model',
      title: 'IR4/5 READY FUSION MODEL',
      subtitle: '6-Layer Neural Stack L1–L6',
      icon: Cpu,
      sectionId: 'fusion-stack',
      color: 'text-amber-400',
      borderHover: 'hover:border-amber-400/80 hover:bg-amber-950/30',
      tagColor: 'bg-amber-950/80 text-amber-300 border-amber-500/40'
    },
    {
      id: 'profit-margin',
      title: 'PROFIT MARGIN PREDICTION',
      subtitle: '32.5%–45% Gross Margin Model',
      icon: FileSpreadsheet,
      sectionId: 'unit-economics',
      color: 'text-teal-400',
      borderHover: 'hover:border-teal-400/80 hover:bg-teal-950/30',
      tagColor: 'bg-teal-950/80 text-teal-300 border-teal-500/40'
    }
  ];

  const handleInteractiveJump = (navId: string, sectionId: string) => {
    setActiveNavId(navId);
    setTimeout(() => setActiveNavId(null), 1200);

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]', 'transition-all', 'duration-700');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]');
      }, 3000);
    }
  };

  return (
    <section id="hero" className="relative pt-28 pb-20 overflow-hidden bg-grid-pattern">
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-purple-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-emerald-600/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 6-Card Interactive Nav Hub in 2 Columns with CRT Scanline Overlay */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-3xl mb-8 p-3 rounded-2xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-xl shadow-2xl overflow-hidden hud-corner group/hub"
        >
          {/* CRT Scanlines and Beam FX */}
          <div className="crt-scanlines absolute inset-0 opacity-40 rounded-2xl pointer-events-none" />
          <div className="crt-beam rounded-2xl" />

          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between px-1 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                EXECUTIVE DILIGENCE DISPATCH MATRIX // 6 MODULAR TRACKS
              </span>
              <span className="text-slate-400 hidden sm:inline">Click to jump to detailed section</span>
            </div>

            {/* Responsive 2-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {heroNavPills.map((pill) => {
                const Icon = pill.icon;
                const isFlash = activeNavId === pill.id;

                return (
                  <button
                    key={pill.id}
                    onClick={() => handleInteractiveJump(pill.id, pill.sectionId)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer relative overflow-hidden group hover:scale-[1.015] active:scale-[0.98] ${
                      isFlash
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-400'
                        : `bg-slate-900/80 border-slate-800/90 text-slate-200 ${pill.borderHover}`
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                        isFlash ? 'bg-slate-950 text-cyan-300' : 'bg-slate-950/90 border border-slate-800 ' + pill.color
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[11px] font-mono font-bold tracking-tight truncate ${
                          isFlash ? 'text-slate-950' : 'text-white group-hover:text-cyan-300'
                        }`}>
                          {pill.title}
                        </div>
                        <div className={`text-[10px] font-mono truncate ${
                          isFlash ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {pill.subtitle}
                        </div>
                      </div>
                    </div>

                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1 ${
                      isFlash ? 'text-slate-950' : 'text-slate-500 group-hover:text-cyan-400'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Main Grid: Headline + 3D Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column (7 cols) with Motion Slide-up */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
                Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Immersive Reality Solutions</span> for Enterprise
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-sans max-w-2xl">
                Spenta accelerates <strong className="text-white font-semibold">Global Digital Transformation</strong> via our proprietary <strong className="text-white font-semibold">Omni Vertical Fusion Model</strong>. Fusing spatial reality with document intelligence to deliver unmatched client <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-bold font-mono animate-value-pulse shadow-sm shadow-emerald-500/20">450% ROI</span> and expanding <span className="inline-block px-2 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 font-bold font-mono animate-value-pulse shadow-sm shadow-cyan-500/20">32.5%–45% Profit Margins</span> across global enterprise markets.
              </p>
            </div>

            {/* Core Metrics Ribbon - High Density Pattern */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              
              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg hud-corner hover:border-cyan-500/40 transition-all">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Financial Projection</div>
                <div className="text-2xl font-black font-mono text-white tracking-tight">$667.3B</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">2033 Market TAM • 41.1% CAGR</div>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg hud-corner hover:border-emerald-500/40 transition-all">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Verified Client ROI</div>
                <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">450%</div>
                <div className="text-[10px] text-slate-300 font-mono mt-0.5">Prime Bank PrimeOCR Case Study</div>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg hud-corner hover:border-sky-500/40 transition-all">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Gross Profit Margin</div>
                <div className="text-2xl font-black font-mono text-sky-300 tracking-tight">32.5% – 45%</div>
                <div className="text-[10px] text-slate-300 font-mono mt-0.5">Full Cost Absorption</div>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg hud-corner hover:border-purple-500/40 transition-all">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Net Profit Margin</div>
                <div className="text-2xl font-black font-mono text-purple-300 tracking-tight">13.5% – 25%</div>
                <div className="text-[10px] text-slate-300 font-mono mt-0.5">Dual-Shore GTM Alpha</div>
              </div>

            </div>

            {/* High Density 6-Layer Architecture Mini Strip */}
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                  6-LAYER FUSION ARCHITECTURE TELEMETRY
                </span>
                <span className="text-[10px] font-mono text-cyan-400">STATUS: OPTIMAL</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                <div className="bg-slate-950 border border-slate-800 rounded p-2 flex flex-col justify-between h-16">
                  <span className="text-[8px] text-cyan-400 font-mono">L1</span>
                  <span className="text-[9px] font-bold text-white uppercase tracking-tight">Sensing</span>
                  <div className="w-full h-1 bg-cyan-500/20 rounded overflow-hidden"><div className="w-full h-full bg-cyan-400"></div></div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded p-2 flex flex-col justify-between h-16">
                  <span className="text-[8px] text-indigo-400 font-mono">L2</span>
                  <span className="text-[9px] font-bold text-white uppercase tracking-tight">Sync</span>
                  <div className="w-full h-1 bg-indigo-500/20 rounded overflow-hidden"><div className="w-4/5 h-full bg-indigo-400"></div></div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded p-2 flex flex-col justify-between h-16">
                  <span className="text-[8px] text-blue-400 font-mono">L3</span>
                  <span className="text-[9px] font-bold text-white uppercase tracking-tight">Vision AI</span>
                  <div className="w-full h-1 bg-blue-500/20 rounded overflow-hidden"><div className="w-full h-full bg-blue-400"></div></div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded p-2 flex flex-col justify-between h-16">
                  <span className="text-[8px] text-purple-400 font-mono">L4</span>
                  <span className="text-[9px] font-bold text-white uppercase tracking-tight">XR Render</span>
                  <div className="w-full h-1 bg-purple-500/20 rounded overflow-hidden"><div className="w-3/4 h-full bg-purple-400"></div></div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded p-2 flex flex-col justify-between h-16">
                  <span className="text-[8px] text-pink-400 font-mono">L5</span>
                  <span className="text-[9px] font-bold text-white uppercase tracking-tight">Spatial</span>
                  <div className="w-full h-1 bg-pink-500/20 rounded overflow-hidden"><div className="w-2/3 h-full bg-pink-400"></div></div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded p-2 flex flex-col justify-between h-16">
                  <span className="text-[8px] text-emerald-400 font-mono">L6</span>
                  <span className="text-[9px] font-bold text-white uppercase tracking-tight">Action</span>
                  <div className="w-full h-1 bg-emerald-500/20 rounded overflow-hidden"><div className="w-full h-full bg-emerald-400"></div></div>
                </div>
              </div>
            </div>

            {/* Spenta Action & Diligence CTAs - Evenly Gapped 4-Column Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              <a
                href="#unit-economics"
                id="hero-explore-economics-btn"
                className="px-3.5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold text-xs font-mono shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-center group"
              >
                <Calculator className="w-4 h-4 shrink-0 text-slate-950" />
                <span className="truncate">9-TIER UNIT ECONOMICS</span>
                <ArrowDown className="w-3.5 h-3.5 shrink-0 group-hover:translate-y-0.5 transition-transform" />
              </a>

              {onOpenContact && (
                <button
                  onClick={() => onOpenContact('Seed Round SAFE Allocation ($500k @ $4.5M Cap)')}
                  id="hero-inquire-btn"
                  className="px-3.5 py-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-200 border border-cyan-500/50 font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer text-center group shadow-sm hover:border-cyan-400"
                >
                  <Mail className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span className="truncate">GTM & EXECUTION BRIEF</span>
                </button>
              )}

              <button
                onClick={onOpenPitchDeck}
                id="hero-open-pitch-deck-btn"
                className="px-3.5 py-3 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-200 border border-indigo-500/50 font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer text-center group shadow-sm hover:border-indigo-400"
              >
                <Presentation className="w-4 h-4 shrink-0 text-indigo-400" />
                <span className="truncate">PITCH DECK & STRATEGY</span>
              </button>

              <button
                onClick={onOpenDataRoom}
                id="hero-open-data-room-btn"
                className="px-3.5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/50 font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer text-center group shadow-sm hover:border-emerald-400"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="truncate">INSTITUTIONAL DATA ROOM</span>
              </button>
            </div>

            {/* Enterprise Verticals Supported & Solution Architecture Focus Points */}
            <div className="p-4 rounded-xl bg-slate-950/85 border border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  ENTERPRISE VERTICALS SUPPORTED & SOLUTION ARCHITECTURE
                </span>
                <span className="text-[10px] font-mono text-slate-400">DELAWARE C-CORP // 24/7 DUAL-SHORE</span>
              </div>

              {/* 4 Supported Verticals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1 hover:border-cyan-500/40 transition-colors">
                  <div className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span className="truncate">Banking & FinTech AI</span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    PrimeOCR Air-Gapped (-97% Latency)
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1 hover:border-emerald-500/40 transition-colors">
                  <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="truncate">Pharma & BioTech</span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    VR Cleanroom SOPs (Samsung)
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1 hover:border-purple-500/40 transition-colors">
                  <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    <span className="truncate">Smart SCADA & Twin</span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    IoT Spatial Mesh & Unreal Nanite
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1 hover:border-sky-500/40 transition-colors">
                  <div className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                    <span className="truncate">EdTech & Medical</span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    WebXR 3D Anatomy (12 Colleges)
                  </div>
                </div>
              </div>

              {/* Compliance & Security Row */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SOC 2 Type II Certified</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Air-Gapped Zero Cloud Egress</span>
                  </span>
                </div>
                <div className="text-cyan-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Seed SAFE Round: $500k @ $4.5M Cap</span>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column (5 cols) -> Interactive 3D Spatial Canvas with Motion */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              
              {/* Header Label */}
              <div className="absolute -top-3 left-4 z-20 bg-cyan-950 border border-cyan-500/50 text-cyan-300 px-3 py-0.5 rounded-full text-[11px] font-mono tracking-wider shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>SPENTA SPATIAL TWIN & PHYSICAL AI ENGINE</span>
              </div>

              {/* 3D Canvas */}
              <Spatial3DCanvas />

              {/* Technical Spec Callout under canvas */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-cyan-400 font-bold">spenta-omni-fusion.v2.6</span>
                <span className="text-slate-400 text-[11px]">Unreal Nanite • LLaMA 3.2 Vision • WebXR Wasm</span>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
