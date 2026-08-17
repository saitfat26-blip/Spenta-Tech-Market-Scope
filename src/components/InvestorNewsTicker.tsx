import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Radio, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Award, 
  Globe, 
  Zap, 
  CheckCircle2,
  X
} from 'lucide-react';

interface NewsItem {
  id: string;
  category: 'PATENT IP' | 'ENTERPRISE PILOT' | 'DUAL-SHORE SYNC' | 'HARDWARE' | 'VENTURE' | 'R&D';
  tagColor: string;
  timestamp: string;
  headline: string;
  detail: string;
  impactMetric: string;
}

const NEWS_FEED: NewsItem[] = [
  {
    id: 'news-1',
    category: 'PATENT IP',
    tagColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    timestamp: '14:20 UTC',
    headline: 'Provisional Patent Filed: Sub-Millimeter Spatial Anchor Engine (SSAE v2.4)',
    detail: 'Proprietary spatial anchoring eliminates drift in multi-room WebXR industrial twins without requiring proprietary LiDAR hardware.',
    impactMetric: 'Zero Drift (<0.8mm variance)'
  },
  {
    id: 'news-2',
    category: 'ENTERPRISE PILOT',
    tagColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    timestamp: '11:45 UTC',
    headline: 'Australian Mining & Logistics Consortium Completes 120-Day Digital Twin Pilot',
    detail: 'Field deployment across 3 distribution hubs demonstrated 28% turnaround velocity uplift and reduced remote training overhead by 41%.',
    impactMetric: '28% Velocity Uplift'
  },
  {
    id: 'news-3',
    category: 'DUAL-SHORE SYNC',
    tagColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
    timestamp: '08:30 UTC',
    headline: 'Dhaka Spatial Engineering Lab Expands Agile Delivery Pod to 16 Specialists',
    detail: 'Dhaka hub maintains 24/7 continuous build cycles with San Jose executive team, preserving 40%+ gross margins across all 9 commercial tiers.',
    impactMetric: '1:4.8 Cost Arbitrage'
  },
  {
    id: 'news-4',
    category: 'HARDWARE',
    tagColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    timestamp: '05:15 UTC',
    headline: 'Universal WebXR Pipeline Validated for Apple VisionOS & Meta Horizon OS',
    detail: 'Zero-install browser runtimes achieve 90 FPS 3D spatial fidelity with instant cross-platform synchronization.',
    impactMetric: '90 FPS Zero-Install'
  },
  {
    id: 'news-5',
    category: 'VENTURE',
    tagColor: 'text-rose-400 border-rose-500/30 bg-rose-950/40',
    timestamp: '02:50 UTC',
    headline: 'Seed SAFE $500K Round: $320K Soft-Committed Across Angel Syndicates',
    detail: 'Early commitments secured from Silicon Valley & APAC spatial computing operators ahead of Q3 milestone execution.',
    impactMetric: '$320k / $500k Soft-Committed'
  },
  {
    id: 'news-6',
    category: 'R&D',
    tagColor: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
    timestamp: 'YESTERDAY',
    headline: 'Neural Document Fusion Engine Reaches 99.4% Parsing Precision on Unstructured CAD & ERPs',
    detail: 'Multimodal transformer layer extracts spatial hierarchies and schema definitions from 10,000+ page legacy blueprints.',
    impactMetric: '99.4% Extraction Accuracy'
  }
];

export const InvestorNewsTicker: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  return (
    <div id="investor-news-ticker" className="relative bg-[#06090F] border-y border-slate-800/80 overflow-hidden select-none">
      
      {/* Ticker Header Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-slate-900">
        
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-200 tracking-wider">LIVE TELEMETRY // REAL-TIME VENTURE & IP DISPATCH</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden sm:inline text-slate-500">HOVER TICKER TO PAUSE</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
            AUTO-SYNC 60s
          </span>
        </div>

      </div>

      {/* Marquee Track Container */}
      <div 
        className="relative py-2.5 overflow-hidden flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left and Right Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#06090F] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#06090F] to-transparent z-10 pointer-events-none" />

        {/* Scrolling Inner Container */}
        <div 
          className="flex gap-4 shrink-0"
          style={{
            animation: 'marquee 45s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {/* Double list for seamless infinite loop */}
          {[...NEWS_FEED, ...NEWS_FEED].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => setSelectedNews(item)}
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer group shrink-0"
            >
              {/* Category Tag */}
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${item.tagColor}`}>
                {item.category}
              </span>

              {/* Timestamp */}
              <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                {item.timestamp}
              </span>

              {/* Headline */}
              <span className="text-xs font-mono text-slate-200 group-hover:text-cyan-200 transition-colors font-medium">
                {item.headline}
              </span>

              {/* Impact Metric Pill */}
              <span className="px-2 py-0.5 rounded-full bg-slate-950 text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/30 group-hover:border-emerald-400">
                {item.impactMetric}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B101B] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${selectedNews.tagColor}`}>
                  {selectedNews.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{selectedNews.timestamp}</span>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white font-heading leading-snug">
                {selectedNews.headline}
              </h3>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                {selectedNews.detail}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Verified Impact Metric:</span>
              <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30">
                {selectedNews.impactMetric}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg cursor-pointer"
              >
                Close Dispatch
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

    </div>
  );
};
