import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { CopyShareButton } from './CopyShareButton';
import { MarketPulseCanvas } from './MarketPulseCanvas';
import { MacroCatalystOverlay } from './MacroCatalystOverlay';
import { 
  TrendingUp, 
  Glasses, 
  Eye, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  BarChart3, 
  CheckCircle2,
  PieChart as PieIcon,
  Activity,
  Maximize2
} from 'lucide-react';

const tamSegments = [
  { name: 'Enterprise Spatial Twins & Simulation', value: 240.2, share: '36.0%', cagr: '42.5%', color: '#38BDF8' },
  { name: 'Multimodal Vision AI & Automated OCR', value: 186.8, share: '28.0%', cagr: '44.8%', color: '#34D399' },
  { name: 'Smart Glasses & Wearable Ingest', value: 146.8, share: '22.0%', cagr: '39.2%', color: '#C084FC' },
  { name: 'Edge Vector & Spatial Infrastructure', value: 93.5, share: '14.0%', cagr: '38.0%', color: '#FBBF24' }
];

const hardwareGrowthTrajectory = [
  { year: '2024', smartGlasses: 1.8, spatialHeadsets: 0.9, enterpriseApps: 8.2 },
  { year: '2026', smartGlasses: 7.2, spatialHeadsets: 3.4, enterpriseApps: 59.9 },
  { year: '2028', smartGlasses: 19.5, spatialHeadsets: 9.1, enterpriseApps: 148.0 },
  { year: '2030', smartGlasses: 48.0, spatialHeadsets: 21.0, enterpriseApps: 320.5 },
  { year: '2033', smartGlasses: 110.0, spatialHeadsets: 45.0, enterpriseApps: 667.3 }
];

export const MarketShiftSection: React.FC = () => {
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState<number>(0);
  const [activeTamTab, setActiveTamTab] = useState<'pie' | 'growth'>('pie');
  const [isMacroOverlayOpen, setIsMacroOverlayOpen] = useState<boolean>(false);

  const hardwarePlayers = [
    {
      company: 'Meta Platforms & EssilorLuxottica',
      status: '7M+ Units Shipped (2025)',
      hardware: 'Ray-Ban Meta Smart Glasses, Orion True-AR Prototype, Quest 3/3S',
      shiftRole: 'Mass-market adoption of smart glasses serving as the everyday audio and outward RGB camera ingest organ for multimodal AI.'
    },
    {
      company: 'The Android XR Alliance',
      status: 'Launched 2026 (Google, Samsung & Qualcomm)',
      hardware: 'Android XR Platform, Samsung Galaxy XR Headset, XREAL AURA Glasses',
      shiftRole: 'Standardizing open spatial operating systems for OEM smart eyewear and next-gen spatial productivity headsets.'
    },
    {
      company: 'Apple Spatial Ecosystem',
      status: 'visionOS & Consumer Eyewear R&D',
      hardware: 'Apple Vision Pro, visionOS 2.x, Lightweight Smart Eyewear Pipeline',
      shiftRole: 'Pioneering eye+hand multimodal spatial interactions, ultra-high-resolution micro-OLED rendering, and spatial computing SDKs.'
    }
  ];

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs font-mono backdrop-blur-md">
          <div className="text-cyan-300 font-bold">{data.name}</div>
          <div className="text-white mt-1">Market Size: <span className="font-bold text-emerald-400">${data.value}B</span> ({data.share})</div>
          <div className="text-slate-400 text-[10px] mt-0.5">Projected CAGR: <span className="text-purple-300">{data.cagr}</span></div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="market-shift" className="py-20 relative bg-[#070A10] border-t border-b border-slate-800/80 overflow-hidden">
      
      {/* Abstract High-Tech Market Pulse Video / Canvas Layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none -z-0">
        <MarketPulseCanvas intensity={0.7} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Motion & Action Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              <span>MACRO ECOSYSTEM CATALYST // WHY NOW?</span>
            </div>
            <CopyShareButton sectionId="market-shift" label="Share Macro" />
            <button
              onClick={() => setIsMacroOverlayOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:bg-cyan-900/80 transition-all cursor-pointer shadow-sm"
              title="Launch Fullscreen High-Tech Market Pulse Visualizer"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Launch Macro Pulse Overlay</span>
              <Maximize2 className="w-3 h-3 ml-0.5 opacity-70" />
            </button>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            Big Tech Hardware Wave Unlocks Physical AI
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            The global technology sector is aggressively shifting capital from flat 2D smartphone screens into smart glasses and spatial head-mounted displays.
          </p>
        </motion.div>

        {/* 3 Hardware Players Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {hardwarePlayers.map((player, idx) => (
            <motion.div 
              key={player.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hud-corner flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    ECOSYSTEM 0{idx + 1}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">{player.status}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white">{player.company}</h3>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                  {player.hardware}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {player.shiftRole}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Compatible with Spenta L1/L2 Ingest</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive TAM & Market Share Recharts Infographic */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/50 border border-slate-800 p-6 sm:p-7 rounded-xl mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold mb-1">
                <PieIcon className="w-3 h-3 text-cyan-400" />
                <span>$667.3B GLOBAL TAM SECTOR BREAKDOWN (2033)</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                Enterprise Metaverse & Physical AI Revenue Distribution
              </h3>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveTamTab('pie')}
                className={`px-3 py-1 rounded transition-all ${
                  activeTamTab === 'pie'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                TAM Share (Pie)
              </button>
              <button
                onClick={() => setActiveTamTab('growth')}
                className={`px-3 py-1 rounded transition-all ${
                  activeTamTab === 'growth'
                    ? 'bg-purple-500 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hardware vs App Growth (Bar)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Chart Area (7 cols) */}
            <div className="lg:col-span-7 h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                {activeTamTab === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={tamSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      onClick={(_, index) => setSelectedSegmentIdx(index)}
                      cursor="pointer"
                    >
                      {tamSegments.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke={selectedSegmentIdx === index ? '#ffffff' : '#020617'}
                          strokeWidth={selectedSegmentIdx === index ? 2 : 1}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}
                    />
                  </PieChart>
                ) : (
                  <BarChart data={hardwareGrowthTrajectory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
                    <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }} />
                    <Bar dataKey="smartGlasses" name="Smart Glasses (M Units)" fill="#C084FC" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spatialHeadsets" name="Spatial Headsets (M Units)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="enterpriseApps" name="Enterprise TAM ($B)" fill="#34D399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Segment Inspector Detail (5 cols) */}
            <div className="lg:col-span-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span>SEGMENT DETAIL</span>
                  <span className="text-emerald-400 font-bold">{tamSegments[selectedSegmentIdx].share} OF TAM</span>
                </div>

                <div>
                  <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    {tamSegments[selectedSegmentIdx].name}
                  </div>
                  <div className="text-2xl font-black font-mono text-white mt-1">
                    ${tamSegments[selectedSegmentIdx].value}B USD
                  </div>
                  <div className="text-[11px] font-mono text-purple-300 mt-0.5">
                    Compound Annual Growth Rate: {tamSegments[selectedSegmentIdx].cagr}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {selectedSegmentIdx === 0 && 'High-fidelity simulation engines (Unreal/Unity) combined with real-time SCADA and LiDAR telemetry for digital twin twins.'}
                  {selectedSegmentIdx === 1 && 'Self-hosted vision models and multimodal LLMs parsing physical paperwork, invoices, and KYC video streams with zero cloud egress.'}
                  {selectedSegmentIdx === 2 && 'Everyday smart glasses (Meta, Android XR) providing continuous first-person video and spatial audio feeds.'}
                  {selectedSegmentIdx === 3 && 'Ultra-low latency edge orchestration, on-device Wasm inference, and high-throughput vector memory retrieval.'}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Monetization Layer:</span>
                  <span className="text-cyan-300 font-bold">Spenta Dual-Engine Contracts</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Deep Strategic Infographic: 2D Screen Paradigm vs Spenta Physical AI Layer */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 sm:p-7 rounded-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold">
                <span>STRUCTURAL PARADIGM SHIFT // HARDWARE ACCELERATION</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                Smart Glasses Are The Sensory Ingest Organs for Autonomous AI
              </h3>

              <div className="space-y-2.5 text-slate-300 text-xs sm:text-sm leading-relaxed">
                <p>
                  <strong className="text-white">1. The Post-Smartphone Paradigm:</strong> Smartphone hardware innovation has plateaued. Big Tech is racing to establish the next primary human-computer interface (HCI) tollgate (visionOS, Horizon OS, Android XR).
                </p>
                <p>
                  <strong className="text-white">2. Sensory Ingest for Multimodal AI:</strong> Multimodal AI agents cannot assist workers through a glass pane in their pocket. Hands-free smart glasses supply continuous first-person video, spatial microphones, eye-tracking, and 6-DoF telemetry.
                </p>
                <p>
                  <strong className="text-white">3. Spenta’s Strategic Position:</strong> While hardware giants mass-produce the eyewear, Spenta builds the enterprise applications (cleanroom digital twins, banking KYC OCR, hospital spatial wayfinding) ready to execute immediately.
                </p>
              </div>
            </div>

            {/* Right Stat Callout Box */}
            <div className="lg:col-span-5 space-y-3">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2.5">
                <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                  Grand View Research // Global TAM
                </div>
                <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                  $667.3B
                </div>
                <div className="text-xs font-bold text-cyan-400">
                  Enterprise Metaverse & Physical AI Market by 2033
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Projected 41.1% Compound Annual Growth (CAGR)
                </div>

                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-cyan-400 h-full w-[82%]" />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-0.5">
                  <span>2026: $59.9B</span>
                  <span className="text-emerald-400 font-bold">2033: $667.3B</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Fullscreen High-Tech Macro Catalyst Market Pulse Overlay */}
      <MacroCatalystOverlay 
        isOpen={isMacroOverlayOpen} 
        onClose={() => setIsMacroOverlayOpen(false)} 
      />

    </section>
  );
};
