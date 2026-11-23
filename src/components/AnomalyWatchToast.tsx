import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ChevronRight, X, ChevronDown, ChevronUp } from 'lucide-react';

export const AnomalyWatchToast: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Detect high-severity anomaly shortly after load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500); // Reduced to 1.5s for immediate visibility
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
    }
  };

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
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
            <div 
              className="flex justify-between items-start cursor-pointer group" 
              onClick={toggleCollapse}
            >
              <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-xs">
                <AlertTriangle className="w-4 h-4" />
                AI ANOMALY WATCH DETECTED
              </div>
              <div className="flex items-center gap-1.5">
                <motion.button 
                  animate={{ rotate: isCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-500 group-hover:text-rose-400 transition-colors"
                  title={isCollapsed ? "Expand" : "Collapse"}
                >
                  <ChevronUp className="w-4 h-4" />
                </motion.button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsVisible(false); }} 
                  className="text-slate-500 hover:text-slate-300 ml-1"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                  animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
