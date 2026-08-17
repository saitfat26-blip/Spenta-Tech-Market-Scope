import React, { useState, useEffect } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SECTIONS = [
  { id: 'hero', title: 'Executive Summary' },
  { id: 'dual-engines', title: 'Dual Engines' },
  { id: 'fusion-stack', title: 'Fusion Stack' },
  { id: 'rd-roadmap', title: 'R&D Roadmap' },
  { id: 'market-shift', title: 'Market Shift' },
  { id: 'case-studies', title: 'ROI Case Studies' },
  { id: 'unit-economics', title: 'Financials' },
  { id: 'dual-shore-globe', title: 'Global Operations' },
  { id: 'executive-team', title: 'Leadership' },
  { id: 'passive-ip', title: 'Passive IP' },
  { id: 'moat-benchmarks', title: 'Defensibility' },
  { id: 'investment-terms', title: 'Investment' }
];

export const BreadcrumbNav: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show breadcrumbs after scrolling past the main navbar
      if (window.scrollY > 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Determine active section
      const sectionElements = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
      
      let currentActiveId = 'hero';
      for (const el of sectionElements) {
        const rect = el.getBoundingClientRect();
        // If the top of the section is above the middle of the screen, it's considered active
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          currentActiveId = el.id;
          break;
        } else if (rect.top <= 0 && rect.bottom >= 0) {
          currentActiveId = el.id;
          break;
        }
      }
      
      if (currentActiveId !== activeSectionId) {
        setActiveSectionId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSectionId]);

  const activeSection = SECTIONS.find(s => s.id === activeSectionId);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-[60px] md:top-[72px] left-0 right-0 z-40 bg-[#070A10]/95 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full text-xs font-mono font-medium text-slate-400">
            <button 
              onClick={() => {
                document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Home className="w-3 h-3" />
              <span className="hidden sm:inline">Spenta Master SSOT</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <motion.span 
              key={activeSection?.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-cyan-400 font-bold flex items-center gap-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {activeSection?.title || 'Overview'}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
