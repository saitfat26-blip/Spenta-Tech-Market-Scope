import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ChevronRight, X } from 'lucide-react';

export const AnomalyWatchToast: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate detecting a high-severity anomaly shortly after load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000); // 15 seconds after load
    return () => clearTimeout(timer);
  }, []);

  const handleJump = () => {
    setIsVisible(false);
    // Jump to Unit Economics / Intelligence Dashboard
    const el = document.getElementById('unit-economics');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-rose-500', 'transition-all');
      setTimeout(() => el.classList.remove('ring-2', 'ring-rose-500'), 3000);
      
      // Simulate click on Intelligence Dashboard button if we want to open it
      // For now scrolling is enough
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[90]">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            className="bg-slate-950/90 backdrop-blur-md border border-rose-500/50 rounded-lg shadow-[0_0_20px_rgba(244,63,94,0.2)] p-4 max-w-sm w-full"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-xs">
                <AlertTriangle className="w-4 h-4" />
                AI ANOMALY WATCH DETECTED
              </div>
              <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              High-severity market variance detected in Retail Consumer vertical acquisition costs.
            </p>
            <button 
              onClick={handleJump}
              className="w-full flex items-center justify-between bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded py-2 px-3 text-xs font-mono font-bold transition-colors"
            >
              <span>INVESTIGATE VARIANCE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
