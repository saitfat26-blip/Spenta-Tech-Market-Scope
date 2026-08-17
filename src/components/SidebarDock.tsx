import React, { useEffect, useState } from 'react';
import { 
  Compass, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  Calculator, 
  Box, 
  Target, 
  Presentation, 
  ShieldCheck,
  ChevronUp,
  Mail
} from 'lucide-react';

interface SidebarDockProps {
  onOpenPitchDeck: () => void;
  onOpenDataRoom: () => void;
  onOpenContact?: () => void;
  onOpenOnboarding?: () => void;
}

export const SidebarDock: React.FC<SidebarDockProps> = ({
  onOpenPitchDeck,
  onOpenDataRoom,
  onOpenContact,
  onOpenOnboarding
}) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const sections = [
    { id: 'hero', label: 'Executive Briefing', icon: Compass },
    { id: 'dual-engines', label: 'Dual Engines', icon: Layers },
    { id: 'fusion-stack', label: '6-Layer Stack', icon: Layers },
    { id: 'market-shift', label: 'Market Shift', icon: TrendingUp },
    { id: 'case-studies', label: 'Case Studies', icon: CheckCircle2 },
    { id: 'unit-economics', label: 'Unit Economics', icon: Calculator },
    { id: 'passive-ip', label: 'Passive IP Streams', icon: Box },
    { id: 'investment-terms', label: 'SAFE Seed Round', icon: Target },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(currentProgress);

      const sectionElements = sections.map(s => ({
        id: s.id,
        el: document.getElementById(s.id)
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el) {
          const rect = item.el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside 
      id="sidebar-navigation-dock" 
      aria-label="Section Navigation Dock"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col items-center gap-3 pointer-events-auto"
    >
      {/* Scroll Progress Tube & High Density Rail */}
      <div className="bg-slate-950 border border-slate-800 shadow-2xl p-2 rounded-xl flex flex-col items-center gap-1.5">
        
        <div className="text-[9px] uppercase font-mono text-cyan-400 font-bold mb-1">
          {Math.round(scrollProgress)}%
        </div>

        <div className="w-1 h-12 bg-slate-800 rounded-full overflow-hidden mb-1 relative">
          <div 
            className="w-full bg-cyan-400 rounded-full transition-all duration-150"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>

        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`group relative p-2 rounded-lg transition-all flex items-center justify-center ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              
              {/* Tooltip on hover */}
              <span className="absolute right-full mr-3 px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-200 text-[11px] font-mono rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl">
                {section.label}
              </span>
            </a>
          );
        })}

        <div className="w-6 h-[1px] bg-slate-800 my-1" />

        {/* Persona Track Wizard Trigger */}
        {onOpenOnboarding && (
          <button
            onClick={onOpenOnboarding}
            className="p-2 rounded-lg text-amber-400 hover:bg-slate-900 hover:text-amber-200 transition-all group relative border border-transparent hover:border-amber-500/30"
            title="Personalize Briefing Track"
          >
            <Target className="w-4 h-4" />
            <span className="absolute right-full mr-3 px-2.5 py-1 bg-slate-900 border border-amber-500/40 text-amber-200 text-[11px] font-mono rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
              Briefing Track
            </span>
          </button>
        )}

        {/* Quick Launch Buttons */}
        <button
          onClick={onOpenPitchDeck}
          className="p-2 rounded-lg text-indigo-400 hover:bg-slate-900 hover:text-indigo-200 transition-all group relative border border-transparent hover:border-indigo-500/30"
          title="Open Pitch Deck"
        >
          <Presentation className="w-4 h-4" />
          <span className="absolute right-full mr-3 px-2.5 py-1 bg-slate-900 border border-indigo-500/40 text-indigo-200 text-[11px] font-mono rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
            12-Slide Deck
          </span>
        </button>

        <button
          onClick={onOpenDataRoom}
          className="p-2 rounded-lg text-emerald-400 hover:bg-slate-900 hover:text-emerald-200 transition-all group relative border border-transparent hover:border-emerald-500/30"
          title="Data Room"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="absolute right-full mr-3 px-2.5 py-1 bg-slate-900 border border-emerald-500/40 text-emerald-200 text-[11px] font-mono rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
            Data Room Dossier
          </span>
        </button>

        {onOpenContact && (
          <button
            onClick={onOpenContact}
            className="p-2 rounded-lg text-cyan-400 hover:bg-slate-900 hover:text-cyan-200 transition-all group relative border border-transparent hover:border-cyan-500/30"
            title="Inquire & Contact Leadership"
          >
            <Mail className="w-4 h-4" />
            <span className="absolute right-full mr-3 px-2.5 py-1 bg-slate-900 border border-cyan-500/40 text-cyan-200 text-[11px] font-mono rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
              Inquire / Contact
            </span>
          </button>
        )}

        <button
          onClick={scrollToTop}
          className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-all mt-0.5"
          title="Scroll To Top"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

      </div>
    </aside>
  );
};
