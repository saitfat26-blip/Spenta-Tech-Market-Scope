import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cpu, Layers, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

interface GlobalLoadingScreenProps {
  onLoaded?: () => void;
}

export const GlobalLoadingScreen: React.FC<GlobalLoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const steps = [
    { label: 'Initializing Spenta Fusion Core v2.6', icon: Cpu },
    { label: 'Binding 6-Layer Telemetry & Sensor Pipelines', icon: Layers },
    { label: 'Calibrating 9-Tier Unit Economics (USD & BDT)', icon: Activity },
    { label: 'Synthesizing WebGL Spatial Engine & Neural Assets', icon: Sparkles },
    { label: 'Securing Due Diligence Data Room & SAFE Memo', icon: ShieldCheck }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            if (onLoaded) onLoaded();
          }, 350);
          return 100;
        }
        const increment = Math.floor(Math.random() * 18) + 12;
        const nextVal = Math.min(100, prev + increment);
        if (nextVal > 25 && nextVal <= 50) setStepIndex(1);
        else if (nextVal > 50 && nextVal <= 75) setStepIndex(2);
        else if (nextVal > 75 && nextVal < 100) setStepIndex(3);
        else if (nextVal === 100) setStepIndex(4);
        return nextVal;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="global-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] bg-[#030508] flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Subtle Cyberpunk Ambient Glow */}
          <div className="absolute w-[500px] h-[500px] bg-cyan-600/10 blur-[140px] pointer-events-none -z-10" />

          <div className="w-full max-w-md space-y-6 text-center">
            
            {/* Logo Mark with Pulsing Ring */}
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shadow-[0_0_30px_rgba(6,182,212,0.35)] animate-pulse">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center font-display font-black text-2xl text-cyan-400">
                  S
                </div>
              </div>
              <div className="absolute -inset-2 rounded-3xl border border-cyan-500/20 animate-ping pointer-events-none" />
            </div>

            {/* Title & Brand */}
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white flex items-center justify-center gap-2">
                SPENTA <span className="text-cyan-400">XR & PHYSICAL AI</span>
              </h1>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Investor Briefing & Master SSOT v2.6
              </p>
            </div>

            {/* Progress Bar with Cyan Glow */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300 flex items-center gap-1.5 font-semibold">
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  SYSTEM INITIALIZATION
                </span>
                <span className="text-emerald-400 font-bold">{progress}%</span>
              </div>

              <div className="w-full h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-300 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>
            </div>

            {/* Current Step Readout */}
            <div className="p-3 bg-slate-900/60 border border-slate-800/90 rounded-xl flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 animate-ping" />
                <span className="text-xs font-mono text-slate-300 truncate">
                  {steps[stepIndex]?.label}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 pl-2">
                {stepIndex + 1}/5
              </span>
            </div>

            {/* Diagnostics Micro-Checklist */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 text-left">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>San Jose & Dhaka Dual-Shore</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Seed SAFE: $500k @ $4.5M Cap</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>100% On-Premise Data Sovereignty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Unreal Engine 5 & LLaMA 3.2 Vision</span>
              </div>
            </div>

            {/* Skip button if user wants immediate access */}
            <button
              onClick={() => {
                setIsFinished(true);
                if (onLoaded) onLoaded();
              }}
              className="text-[11px] font-mono text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-wider underline cursor-pointer"
            >
              Skip Loading →
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
