import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NON_CLIENT_STREAMS } from '../data/mockData';
import { Currency } from '../types';
import { 
  Box, 
  Gamepad2, 
  GraduationCap, 
  Video, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck,
  DollarSign
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Box,
  Gamepad2,
  GraduationCap,
  Video,
  TrendingUp
};

interface PassiveIPSectionProps {
  currency: Currency;
}

export const PassiveIPSection: React.FC<PassiveIPSectionProps> = ({ currency }) => {
  const [selectedStreamId, setSelectedStreamId] = useState<string>('fab-unity');

  const activeStream = NON_CLIENT_STREAMS.find(s => s.id === selectedStreamId) || NON_CLIENT_STREAMS[0];
  const IconComponent = iconMap[activeStream.icon] || Box;

  return (
    <section id="passive-ip" className="py-20 relative bg-[#05070B] overflow-hidden">
      
      {/* Ambient glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-purple-600/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
            <Box className="w-3.5 h-3.5 text-purple-400" />
            <span>DIVERSIFIED HIGH-MARGIN IP // NON-CLIENT CASHFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            Passive & Creator Commerce Engines
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Secondary high-margin cashflow engines insulating Spenta from agency market cycles through automated 3D digital asset royalties, multi-tenant Micro-SaaS, and technical media monetization.
          </p>
        </motion.div>

        {/* 5 Streams Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-8">
          {NON_CLIENT_STREAMS.map((stream, idx) => {
            const isSelected = selectedStreamId === stream.id;
            const StreamIcon = iconMap[stream.icon] || Box;

            return (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setSelectedStreamId(stream.id)}
                className={`p-3.5 rounded-lg cursor-pointer transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-purple-400 shadow-md shadow-purple-500/20'
                    : 'bg-slate-950 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded bg-slate-900 text-purple-400 border border-slate-800">
                      <StreamIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      {stream.grossMargin} GM
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xs text-white">
                    {stream.title}
                  </h3>

                  <div className="text-[10px] font-mono text-purple-300 font-bold">
                    {currency === 'USD' ? stream.monthlyUsdRange : stream.monthlyBdtRange}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800 text-[9px] font-mono text-slate-500 truncate uppercase">
                  {stream.platform}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Deep Dive on Active Stream with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedStreamId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900/50 border border-slate-800 p-6 sm:p-7 rounded-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-8 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-900/40 text-purple-300 border border-purple-500/40">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">STREAM SPECIFICATION</span>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                      {activeStream.title}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {activeStream.mechanics}
                </p>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Market Precedent:</strong> {activeStream.precedent}</span>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 text-center space-y-2">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Target Monthly Yield</div>
                  <div className="text-xl font-black font-mono text-white">
                    {currency === 'USD' ? activeStream.monthlyUsdRange : activeStream.monthlyBdtRange}
                  </div>
                  <div className="text-xs font-mono text-purple-300">
                    Payout: {activeStream.payoutSplit}
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-around text-xs font-mono">
                    <span>Gross: <strong className="text-emerald-400">{activeStream.grossMargin}</strong></span>
                    <span>Net: <strong className="text-cyan-400">{activeStream.netMargin}</strong></span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
