import React from 'react';
import { motion } from 'motion/react';
import { COMPETITOR_DATA, STARTUP_BENCHMARKS } from '../data/mockData';
import { 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const MoatAndBenchmarksSection: React.FC = () => {
  return (
    <section id="moat-benchmarks" className="py-20 relative bg-[#070A10] border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>DEFENSIBILITY & COMPARABLE MARKET PRECEDENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            Proven Precedents & Competitive Moat
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Global market validation proves the substantial expansion multiples of specialized spatial and enterprise AI ventures.
          </p>
        </motion.div>

        {/* 5 Real-World Startup Benchmark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {STARTUP_BENCHMARKS.map((b, idx) => (
            <motion.div 
              key={b.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hud-corner flex flex-col justify-between space-y-3 hover:border-cyan-500/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {b.sector}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {b.metric}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {b.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-800 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validates Spenta Business Model</span>
              </div>
            </motion.div>
          ))}

          {/* Callout Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">APAC & US EXPANSION</div>
              <h3 className="font-heading font-bold text-lg text-white">
                Australian Investor Alignment
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                ASX:XRG demonstrates that the Australian defense, mining, and healthcare enterprise sectors actively procure specialized XR procedural simulation at 80%+ software gross margins.
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-300 font-semibold">
              Targeting 8 Initial Australian Pilots
            </div>
          </motion.div>
        </div>

        {/* 4-Way Master Competitive Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
              Strategic Landscape Comparison Matrix
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">4-Way Comparative Analysis</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 font-mono text-[10px] text-slate-400">
                  <th className="p-3.5 uppercase tracking-wider">Capability / Dimension</th>
                  <th className="p-3.5 text-cyan-300 font-bold bg-cyan-950/40 border-l border-r border-cyan-500/30">
                    SPENTA DUAL-SHORE
                  </th>
                  <th className="p-3.5 text-slate-300">WESTERN ONSHORE AGENCIES</th>
                  <th className="p-3.5 text-slate-300">COMMODITY OUTSOURCERS</th>
                  <th className="p-3.5 text-slate-300">RIGID SAAS POINT VENDORS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950 font-sans">
                {COMPETITOR_DATA.map((row) => (
                  <tr key={row.attribute} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-white whitespace-nowrap text-xs">
                      {row.attribute}
                    </td>
                    <td className="p-3 text-cyan-300 font-semibold bg-cyan-950/20 border-l border-r border-cyan-500/30 text-xs">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{row.spenta}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-400 text-xs">
                      {row.westernAgencies}
                    </td>
                    <td className="p-3 text-rose-300/80 text-xs">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{row.commodityOutsourcers}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-400 text-xs">
                      {row.rigidSaas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
