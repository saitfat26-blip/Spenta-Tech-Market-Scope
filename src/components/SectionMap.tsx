import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Map } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'pending';
}

const SECTIONS: Section[] = [
  { id: 'hero', name: 'Executive Briefing', status: 'completed' },
  { id: 'dual-engines', name: 'Dual Engines', status: 'completed' },
  { id: 'fusion-stack', name: 'Architecture', status: 'completed' },
  { id: 'rd-roadmap', name: 'R&D Roadmap', status: 'pending' },
  { id: 'milestones', name: 'Milestones', status: 'pending' },
  { id: 'value-exchange', name: 'Value Exchange', status: 'pending' },
  { id: 'market-shift', name: 'Market Shift', status: 'pending' },
  { id: 'case-studies', name: 'Case Studies', status: 'pending' },
  { id: 'unit-economics', name: 'Unit Economics', status: 'pending' },
  { id: 'dual-shore-globe', name: 'Global Ops', status: 'completed' },
  { id: 'executive-team', name: 'Leadership', status: 'completed' },
  { id: 'passive-ip', name: 'Passive IP', status: 'pending' },
  { id: 'moat-benchmarks', name: 'Moats', status: 'pending' },
  { id: 'investment-terms', name: 'Terms', status: 'completed' },
];

export const SectionMap: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let current = '';
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section.id;
          }
        }
      }
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-2', 'ring-cyan-400', 'transition-all');
      setTimeout(() => el.classList.remove('ring-2', 'ring-cyan-400'), 3000);
    }
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[80] hidden xl:block">
      <motion.div 
        className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-full p-2 flex flex-col items-center gap-2 shadow-2xl relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="p-2 bg-slate-900 rounded-full text-slate-400 mb-2">
          <Map className="w-4 h-4" />
        </div>
        
        {SECTIONS.map((s, i) => {
          const isActive = activeSection === s.id;
          return (
            <div key={s.id} className="relative group cursor-pointer" onClick={() => scrollToSection(s.id)}>
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee] scale-125' : 
                  s.status === 'completed' ? 'bg-emerald-500/50 hover:bg-emerald-400' :
                  'bg-slate-700 hover:bg-slate-500'
                }`}
              />
              
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-xs font-mono text-slate-300 px-2 py-1 rounded border border-slate-700 pointer-events-none"
                >
                  <span className={isActive ? 'text-cyan-400 font-bold' : ''}>{s.name}</span>
                </motion.div>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
