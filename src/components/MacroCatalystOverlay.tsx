import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketPulseCanvas } from './MarketPulseCanvas';
import { 
  Activity, 
  X, 
  TrendingUp, 
  Glasses, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface MacroCatalystOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MacroCatalystOverlay: React.FC<MacroCatalystOverlayProps> = ({ isOpen, onClose }) => {
  const [activeSpeed, setActiveSpeed] = useState<number>(1.0);
  const [activeHardwareFocus, setActiveHardwareFocus] = useState<string>('all');

  if (!isOpen) return null;

  const hardwareCatalysts = [
    {
      id: 'meta-essilor',
      brand: 'Meta & EssilorLuxottica',
      device: 'Ray-Ban Meta + Orion AR',
      shipments: '7.2M+ Units (2025/26)',
      marketImpact: 'Everyday RGB camera & audio ingest organ for continuous multimodal Physical AI.',
      spentaSynergy: 'Direct WebXR streaming & localized vision reasoning without proprietary app store lock-in.',
      cagr: '+68.4%'
    },
    {
      id: 'android-xr',
      brand: 'Android XR Alliance',
      device: 'Samsung Galaxy XR & XREAL AURA',
      shipments: 'Open OEM Ecosystem Launch',
      marketImpact: 'Standardized spatial OS opening enterprise manufacturing and logistics to spatial applications.',
      spentaSynergy: '6-Layer Fusion Architecture compiles directly to WebXR Wasm & Android XR OpenXR runtimes.',
      cagr: '+54.2%'
    },
    {
      id: 'apple-vision',
      brand: 'Apple Spatial Ecosystem',
      device: 'Apple Vision Pro + M4 Architecture',
      shipments: 'Enterprise Tier-1 Benchmark',
      marketImpact: 'Micro-OLED spatial fidelity establishing institutional standard for cleanrooms, healthcare & simulation.',
      spentaSynergy: 'Procedural Unreal Engine 5 Nanite Digital Twins streaming with sub-16ms latency.',
      cagr: '+41.9%'
    },
    {
      id: 'nvidia-qualcomm',
      brand: 'NVIDIA Isaac & Qualcomm Spaces',
      device: 'Snapdragon XR2+ Gen 2 & Jetson Orin',
      shipments: '120k+ Industrial Robotics Nodes',
      marketImpact: 'Edge AI compute enabling zero-cloud data sovereignty on factory floors.',
      spentaSynergy: 'Self-hosted air-gapped PrimeOCR & LLaMA 3.2 Vision on-premise deployments.',
      cagr: '+72.1%'
    }
  ];

  const filteredCatalysts = activeHardwareFocus === 'all' 
    ? hardwareCatalysts 
    : hardwareCatalysts.filter(h => h.id === activeHardwareFocus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-2 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden hud-corner">
        
        {/* Top High-Density Control Bar */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <span>MACRO CATALYST // MARKET PULSE VISUALIZER</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  REAL-TIME SPECTRAL ENGINE
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Hardware Influx Telemetry • Big Tech Spatial Ingestion Surge (2024–2033)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed / Frequency Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-[11px] font-mono">
              <span className="text-slate-400 mr-1">Pulse Rate:</span>
              <button 
                onClick={() => setActiveSpeed(0.5)}
                className={`px-2 py-0.5 rounded ${activeSpeed === 0.5 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                0.5x
              </button>
              <button 
                onClick={() => setActiveSpeed(1.0)}
                className={`px-2 py-0.5 rounded ${activeSpeed === 1.0 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                1.0x
              </button>
              <button 
                onClick={() => setActiveSpeed(2.0)}
                className={`px-2 py-0.5 rounded ${activeSpeed === 2.0 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                2.0x
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Animated Video/Canvas Background */}
        <div className="relative flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          
          {/* High-Tech Market Pulse Background Engine */}
          <div className="absolute inset-0 opacity-40 -z-10 pointer-events-none">
            <MarketPulseCanvas intensity={activeSpeed} />
          </div>

          {/* Top Banner: The Physical AI Inflection Point */}
          <div className="p-5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Macro Thesis</div>
              <div className="text-lg font-bold text-white font-heading">The Sensor Influx Shift</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                As Meta, Apple, Samsung & Google flood the market with smart glasses and spatial headsets, enterprise value moves from generic 2D chat interfaces to <strong className="text-cyan-300">Spatial Ingestion & Physical AI Reasoning</strong>.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Market Size Velocity</div>
              <div className="text-lg font-bold text-white font-heading">$667.3B TAM by 2033</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Spatial computing, industrial digital twins, and multimodal computer vision expand at an audited <strong className="text-emerald-300">42.5% CAGR</strong> over the next 8 years.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Spenta Advantage</div>
              <div className="text-lg font-bold text-white font-heading">Full-Stack Composable IP</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Spenta controls the entire pipeline from raw sensor ingestion to WebXR rendering and air-gapped on-premise neural OCR with <strong className="text-purple-300">zero vendor lock-in</strong>.
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <Glasses className="w-4 h-4 text-cyan-400" />
              <span>HARDWARE ECOSYSTEM INGESTION CHANNELS:</span>
            </div>

            <div className="inline-flex p-1 rounded-lg bg-slate-900/90 border border-slate-800">
              <button
                onClick={() => setActiveHardwareFocus('all')}
                className={`px-3 py-1 text-xs font-mono rounded ${activeHardwareFocus === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                All 4 Platforms
              </button>
              {hardwareCatalysts.map(h => (
                <button
                  key={h.id}
                  onClick={() => setActiveHardwareFocus(h.id)}
                  className={`px-3 py-1 text-xs font-mono rounded ${activeHardwareFocus === h.id ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  {h.brand.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Hardware Catalyst Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCatalysts.map(h => (
              <div 
                key={h.id}
                className="p-5 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-mono text-cyan-400 font-semibold">{h.brand}</div>
                    <div className="text-base font-bold text-white font-heading">{h.device}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                      CAGR {h.cagr}
                    </span>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">{h.shipments}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-400 font-mono font-semibold">Macro Role: </span>
                    {h.marketImpact}
                  </div>
                  <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-200">
                    <span className="text-cyan-400 font-mono font-semibold">Spenta Synergistic Capture: </span>
                    {h.spentaSynergy}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500 z-10">
          <span>SPENTA MACRO PULSE // SOURCE: GARTNER, IDC & GOLDMAN SACHS XR RESEARCH 2026</span>
          <span className="text-cyan-400">STATUS: ACCELERATING INGESTION</span>
        </div>

      </div>
    </div>
  );
};
