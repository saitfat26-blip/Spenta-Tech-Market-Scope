import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { Currency, USD_TO_BDT_RATE } from '../types';
import { CopyShareButton } from './CopyShareButton';
import { 
  Target, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  PieChart as PieIcon, 
  Calendar, 
  DollarSign, 
  Award, 
  Clock, 
  Sparkles,
  Lock,
  Mail
} from 'lucide-react';

interface InvestmentTermsSectionProps {
  currency: Currency;
  onOpenDataRoom: () => void;
  onOpenPitchDeck: () => void;
  onOpenContact?: (interest?: string) => void;
}

export const InvestmentTermsSection: React.FC<InvestmentTermsSectionProps> = ({
  currency,
  onOpenDataRoom,
  onOpenPitchDeck,
  onOpenContact
}) => {
  const [selectedFundCategory, setSelectedFundCategory] = useState<number>(0);

  const fundAllocations = [
    {
      percent: 40,
      amountUsd: '$200,000 USD',
      amountBdt: '24.5M ৳',
      numericUsd: 200000,
      color: '#38BDF8',
      title: 'Productize Fusion IP SDKs & SaaS Packaging',
      description: 'Standardizing PrimeOCR IDP and the Escape Room LMS assessment engine into self-serve, multi-tenant enterprise SDKs and B2B SaaS modules.',
      milestone: 'Launch PrimeOCR self-serve developer portal with turnkey REST/Python SDKs.'
    },
    {
      percent: 35,
      amountUsd: '$175,000 USD',
      amountBdt: '21.5M ৳',
      numericUsd: 175000,
      color: '#818CF8',
      title: 'Global Enterprise Sales & Business Development',
      description: 'Placing dedicated onshore enterprise account directors in Sydney / Melbourne (Australia) and San Jose (USA) for healthcare and banking procurement.',
      milestone: 'Close 8 qualified enterprise pilots across Australian mining, banking, and hospital sectors.'
    },
    {
      percent: 25,
      amountUsd: '$125,000 USD',
      amountBdt: '15.3M ৳',
      numericUsd: 125000,
      color: '#34D399',
      title: 'Dedicated GPU Nodes & 18-Month Operating Runway',
      description: 'Procuring on-premise high-throughput GPU inference clusters (NVIDIA L40S/H100) to guarantee bank-grade on-premise SLA compliance without public cloud egress.',
      milestone: 'Secure 18-month working capital runway and achieve $60,000 USD platform MRR.'
    }
  ];

  const pieData = fundAllocations.map(f => ({
    name: f.title,
    value: f.numericUsd,
    percent: f.percent,
    color: f.color
  }));

  return (
    <section id="investment-terms" className="py-20 relative bg-[#05070B] overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[500px] bg-cyan-600/10 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>SEED FINANCING MEMO // YC POST-MONEY SAFE</span>
            </div>
            <CopyShareButton sectionId="investment-terms" sectionTitle="Investment Terms & SAFE" variant="pill" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            The Investment Opportunity
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            We are raising <strong className="text-white">$500,000 USD</strong> to productize our core Fusion IP, deploy direct enterprise sales representatives in Australia and North America, and secure local high-throughput GPU infrastructure.
          </p>
        </motion.div>

        {/* 4 Investment Term Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1"
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Instrument</div>
            <div className="text-lg font-bold font-heading text-white">Post-Money SAFE</div>
            <div className="text-[11px] font-mono text-cyan-400">Standard Y Combinator</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1"
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Target Capital</div>
            <div className="text-xl font-black font-mono text-emerald-400">
              {currency === 'USD' ? '$500,000 USD' : '61,305,000 ৳'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">Seed Round Allocation</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1"
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Valuation Cap</div>
            <div className="text-xl font-black font-mono text-cyan-300">
              {currency === 'USD' ? '$4.5M USD' : '551.7M ৳'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">Post-Money Cap</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1"
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Conversion Discount</div>
            <div className="text-xl font-black font-mono text-purple-300">20.0%</div>
            <div className="text-[11px] font-mono text-slate-400">Early Angel Terms</div>
          </motion.div>

        </div>

        {/* Use of Funds Interactive Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12">
          
          {/* Left: 3 Allocation Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between px-1 uppercase tracking-wider">
              <span>USE OF CAPITAL (18-MONTH RUNWAY)</span>
              <span>100% ALLOCATED</span>
            </div>

            {fundAllocations.map((fund, idx) => {
              const isSelected = selectedFundCategory === idx;
              return (
                <motion.div
                  key={fund.title}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  onClick={() => setSelectedFundCategory(idx)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-md shadow-cyan-500/15'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fund.color }} />
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {fund.percent}% OF ROUND
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">
                      {currency === 'USD' ? fund.amountUsd : fund.amountBdt}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-sm text-white">
                    {fund.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {fund.description}
                  </p>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>Target: {fund.milestone}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: 12-Month Milestones Summary Box (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5"
          >
            <div className="h-full bg-slate-900/60 border border-slate-800 p-6 rounded-xl flex flex-col justify-between space-y-5">
              
              <div className="space-y-3.5">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  <Calendar className="w-3 h-3" />
                  <span>12-MONTH STRATEGIC TARGETS</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                  Milestones to Series A
                </h3>

                <div className="space-y-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-300">• Target Recurring ARR</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">$60,000/mo MRR</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-300">• Australian Enterprise Pilots</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">8 Secured Deployments</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-300">• Epic Fab / Unity 3D Catalog</span>
                    <span className="text-xs font-mono font-bold text-purple-300">50+ Modular Packs</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-300">• Runway Duration</span>
                    <span className="text-xs font-mono font-bold text-sky-300">18 Months Full Reserve</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3 border-t border-slate-800">
                {onOpenContact && (
                  <button
                    onClick={() => onOpenContact('Seed Round SAFE Allocation ($500k @ $4.5M Cap)')}
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Inquire on SAFE Allocation ($500k Round)</span>
                  </button>
                )}

                <button
                  onClick={onOpenDataRoom}
                  className="w-full py-2.5 px-4 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Request Full Data Room & SAFE Agreement</span>
                </button>

                <button
                  onClick={onOpenPitchDeck}
                  className="w-full py-2 px-4 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Review 12-Slide Deck in Presenter Mode</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
