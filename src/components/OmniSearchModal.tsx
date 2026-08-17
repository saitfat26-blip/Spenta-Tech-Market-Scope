import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, ArrowRight, X, FileText, Layers, TrendingUp, DollarSign, Users, Globe, Building2, Zap } from 'lucide-react';

interface OmniSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCH_INDEX = [
  { id: 'hero', title: 'Executive Summary', category: 'Overview', icon: Building2, keywords: ['vision', 'mission', 'overview', 'pitch', 'deck'] },
  { id: 'dual-engines', title: 'Dual Engines', category: 'Architecture', icon: Zap, keywords: ['engine', 'xr', 'physical ai', 'spatial', 'robotics'] },
  { id: 'fusion-stack', title: 'Fusion Stack (Layers 1-6)', category: 'Architecture', icon: Layers, keywords: ['stack', 'infrastructure', 'cloud', 'data', 'security', 'api'] },
  { id: 'rd-roadmap', title: 'R&D Roadmap', category: 'Strategy', icon: FileText, keywords: ['roadmap', 'future', 'development', 'timeline', 'gantt'] },
  { id: 'market-shift', title: 'Market Shift Catalyst', category: 'Market', icon: Globe, keywords: ['market', 'hardware', 'catalyst', 'glasses', 'meta'] },
  { id: 'case-studies', title: 'ROI Case Studies', category: 'Financials', icon: TrendingUp, keywords: ['roi', 'case study', 'examples', 'clients', 'success'] },
  { id: 'unit-economics', title: 'Unit Economics Dashboard', category: 'Financials', icon: DollarSign, keywords: ['unit economics', 'financials', 'margins', 'profit', 'waterfall', 'cogs', 'cac'] },
  { id: 'dual-shore-globe', title: 'Dual-Shore Operations', category: 'Operations', icon: Globe, keywords: ['globe', 'dhaka', 'san jose', 'talent', 'arbitrage', 'offshore'] },
  { id: 'executive-team', title: 'Executive Team', category: 'Leadership', icon: Users, keywords: ['team', 'leadership', 'founders', 'engineers', 'board'] },
  { id: 'passive-ip', title: 'Passive IP Monetization', category: 'Strategy', icon: FileText, keywords: ['passive', 'ip', 'monetization', 'creators', 'assets'] },
  { id: 'moat-benchmarks', title: 'Competitive Moat', category: 'Market', icon: TrendingUp, keywords: ['moat', 'competition', 'benchmarks', 'speed', 'advantage'] },
  { id: 'investment-terms', title: 'Investment Terms', category: 'Financials', icon: DollarSign, keywords: ['investment', 'terms', 'safe', 'valuation', 'raise', 'seed'] }
];

export const OmniSearchModal: React.FC<OmniSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global Ctrl+K / Alt+Q listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlK = (e.metaKey || e.ctrlKey) && e.key === 'k';
      const isAltQ = e.altKey && e.key.toLowerCase() === 'q';
      
      if (isCtrlK || isAltQ) {
        e.preventDefault();
        if (isOpen) onClose();
        else document.dispatchEvent(new CustomEvent('open-omni-search'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredResults = SEARCH_INDEX.filter(item => {
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || 
           item.category.toLowerCase().includes(q) || 
           item.keywords.some(k => k.toLowerCase().includes(q));
  });

  const handleNavigate = (id: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]', 'transition-all', 'duration-1000');
        setTimeout(() => el.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]'), 3000);
      }
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#05070B]/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#0F1420] border border-slate-700/50 rounded-2xl shadow-2xl z-[60] overflow-hidden"
          >
            {/* Search Input */}
            <div className="relative flex items-center p-4 border-b border-slate-800">
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search modules, financials, or architecture..."
                className="w-full bg-transparent border-none text-slate-100 text-lg pl-10 pr-12 focus:ring-0 placeholder:text-slate-500 font-sans"
              />
              <div className="absolute right-4 flex items-center gap-1 text-xs text-slate-500 font-mono">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">ESC</kbd> to close
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredResults.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-sm">
                  No modules found matching "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredResults.map((result, idx) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleNavigate(result.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 transition-colors group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{result.title}</div>
                            <div className="text-xs font-mono text-slate-500 mt-0.5">{result.category}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 group-hover:text-cyan-400 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <Command className="w-3.5 h-3.5" /> 
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/50 text-slate-400">Ctrl+K</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/50 text-slate-400">Alt+Q</kbd> to Open
              </div>
              <div>Master SSOT Index</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
