import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronUp, ChevronDown, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SECTIONS = [
  { id: 'hero', title: 'Executive Summary' },
  { id: 'dual-engines', title: 'Dual Engines' },
  { id: 'fusion-stack', title: 'Fusion Stack' },
  { id: 'rd-roadmap', title: 'R&D Roadmap' },
  { id: 'milestones', title: 'Milestones' },
  { id: 'value-exchange', title: 'Value Exchange' },
  { id: 'market-shift', title: 'Market Shift' },
  { id: 'case-studies', title: 'ROI Case Studies' },
  { id: 'unit-economics', title: 'Unit Economics' },
  { id: 'spatial-analytics-3d', title: '3D Observatory' },
  { id: 'dual-shore-globe', title: 'Global Operations' },
  { id: 'executive-team', title: 'Leadership' },
  { id: 'passive-ip', title: 'Passive IP' },
  { id: 'moat-benchmarks', title: 'Defensibility' },
  { id: 'investment-terms', title: 'Investment Terms' },
];

export const BreadcrumbNav: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const activeIndex = Math.max(
    0,
    SECTIONS.findIndex((s) => s.id === activeSectionId)
  );
  const activeSection = SECTIONS[activeIndex] || SECTIONS[0];

  const navigateToSlide = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, index));
    const target = SECTIONS[clamped];
    const el = document.getElementById(target.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      const sectionElements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
        Boolean
      ) as HTMLElement[];

      let currentActiveId = 'hero';
      for (const el of sectionElements) {
        const rect = el.getBoundingClientRect();
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
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSectionId]);

  // PPTX-style Alt+ArrowUp / Alt+ArrowDown slide stepping
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        navigateToSlide(activeIndex + 1);
      } else if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        navigateToSlide(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, navigateToSlide]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.2 }}
          className="fixed top-[60px] md:top-[72px] left-0 right-0 z-40 bg-[#070A10]/95 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-2"
        >
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full text-xs font-mono font-medium text-slate-400">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => navigateToSlide(0)}
                className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer shrink-0"
              >
                <Home className="w-3 h-3" />
                <span className="hidden sm:inline">Spenta Master SSOT</span>
              </button>
              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
              <motion.span
                key={activeSection.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="text-cyan-400 font-semibold truncate"
              >
                {activeSection.title}
              </motion.span>
            </div>

            {/* PPTX Presentation Slide Stepper */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-slate-500 tabular-nums">
                Slide <span className="text-slate-200 font-semibold">{String(activeIndex + 1).padStart(2, '0')}</span> / {String(SECTIONS.length).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => navigateToSlide(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  title="Previous Slide (Alt + Up)"
                  aria-label="Previous Slide"
                  className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateToSlide(activeIndex + 1)}
                  disabled={activeIndex === SECTIONS.length - 1}
                  title="Next Slide (Alt + Down)"
                  aria-label="Next Slide"
                  className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
