import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Flame, FileText, Settings, Cpu, Route, Target, ArrowRightLeft, LineChart, Globe, Users, Shield, BarChart3, FileSignature, Pin, PinOff, Search } from 'lucide-react';
import { FeedbackComment } from '../types';

interface Section {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'pending';
  feedbackCategory?: string;
  icon: React.ElementType;
  colorClass: string;
}

const SECTIONS: Section[] = [
  { id: 'hero', name: 'Executive Briefing', status: 'completed', feedbackCategory: 'General Question', icon: FileText, colorClass: 'text-slate-300' },
  { id: 'dual-engines', name: 'Dual Engines', status: 'completed', feedbackCategory: 'Dual-Engine Model', icon: Settings, colorClass: 'text-indigo-400' },
  { id: 'fusion-stack', name: 'Architecture', status: 'completed', feedbackCategory: 'Technical Architecture', icon: Cpu, colorClass: 'text-cyan-400' },
  { id: 'rd-roadmap', name: 'R&D Roadmap', status: 'pending', feedbackCategory: 'Milestones & Roadmap', icon: Route, colorClass: 'text-purple-400' },
  { id: 'milestones', name: 'Milestones', status: 'pending', feedbackCategory: 'Milestones & Roadmap', icon: Target, colorClass: 'text-fuchsia-400' },
  { id: 'value-exchange', name: 'Value Exchange', status: 'pending', icon: ArrowRightLeft, colorClass: 'text-amber-400' },
  { id: 'market-shift', name: 'Market Shift', status: 'pending', icon: LineChart, colorClass: 'text-rose-400' },
  { id: 'case-studies', name: 'Case Studies', status: 'pending', icon: BarChart3, colorClass: 'text-blue-400' },
  { id: 'unit-economics', name: 'Unit Economics', status: 'pending', feedbackCategory: 'Financials & Valuation', icon: LineChart, colorClass: 'text-emerald-400' },
  { id: 'dual-shore-globe', name: 'Global Ops', status: 'completed', icon: Globe, colorClass: 'text-orange-400' },
  { id: 'executive-team', name: 'Leadership', status: 'completed', icon: Users, colorClass: 'text-teal-400' },
  { id: 'passive-ip', name: 'Passive IP', status: 'pending', icon: Shield, colorClass: 'text-rose-500' },
  { id: 'moat-benchmarks', name: 'Moats', status: 'pending', icon: BarChart3, colorClass: 'text-indigo-500' },
  { id: 'investment-terms', name: 'Terms', status: 'completed', icon: FileSignature, colorClass: 'text-emerald-500' },
];

export const SectionMap: React.FC<{ comments?: FeedbackComment[] }> = ({ comments = [] }) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isOpen, setIsOpen] = useState(false);
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Drag & Drop State for pinned items
  const [draggedPinned, setDraggedPinned] = useState<string | null>(null);

  const [pinnedSections, setPinnedSections] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('spenta-pinned-sections') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('spenta-pinned-sections', JSON.stringify(pinnedSections));
  }, [pinnedSections]);

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedSections(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

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
    handleScroll();
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

  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SECTIONS.forEach(s => {
      if (s.feedbackCategory) {
        counts[s.id] = comments.filter(c => c.section === s.feedbackCategory).length;
      } else {
        counts[s.id] = 0;
      }
    });
    return counts;
  }, [comments]);

  const maxCount = Math.max(...Object.values(sectionCounts), 1);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedPinned(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      (e.target as HTMLElement).classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedPinned(null);
    (e.target as HTMLElement).classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedPinned && draggedPinned !== targetId) {
      setPinnedSections(prev => {
        const newArr = [...prev];
        const dragIdx = newArr.indexOf(draggedPinned);
        const dropIdx = newArr.indexOf(targetId);
        newArr.splice(dragIdx, 1);
        newArr.splice(dropIdx, 0, draggedPinned);
        return newArr;
      });
    }
  };

  const renderNode = (s: Section, isPinnedList: boolean = false) => {
    const isActive = activeSection === s.id;
    const count = sectionCounts[s.id];
    const isPinned = pinnedSections.includes(s.id);
    const uniqueKey = isPinnedList ? `pinned-${s.id}` : s.id;
    const isHovered = hoveredSection === uniqueKey;

    // Filter Logic
    const isMatched = searchQuery ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;

    let bgStyle = {};
    let bgClass = `w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 relative border cursor-pointer `;

    if (!isMatched) {
      bgClass += 'opacity-30 grayscale ';
    } else if (isHeatmapMode) {
      if (count > 0) {
        const intensity = 0.3 + (count / maxCount) * 0.7;
        bgStyle = { backgroundColor: `rgba(245, 158, 11, ${intensity * 0.3})`, borderColor: `rgba(245, 158, 11, ${intensity})` };
      } else {
        bgClass += 'bg-slate-900 border-slate-800 text-slate-600 ';
      }
    } else {
      if (isActive) {
        bgClass += `bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_#22d3ee] scale-110 `;
      } else if (s.status === 'completed') {
        bgClass += `bg-slate-900 border-slate-700 hover:border-slate-500 `;
      } else {
        bgClass += `bg-slate-950 border-slate-800 opacity-60 hover:opacity-100 `;
      }
    }

    const Icon = s.icon;
    const iconColor = isHeatmapMode && count > 0 ? 'text-amber-400' : isHeatmapMode && count === 0 ? 'text-slate-700' : s.colorClass;

    return (
      <div 
        key={uniqueKey} 
        className={`relative group cursor-pointer ${isHovered ? 'z-50' : 'z-10'}`}
        onClick={() => scrollToSection(s.id)}
        onMouseEnter={() => setHoveredSection(uniqueKey)}
        onMouseLeave={() => setHoveredSection(null)}
        draggable={isPinnedList}
        onDragStart={(e) => isPinnedList && handleDragStart(e, s.id)}
        onDragEnd={isPinnedList ? handleDragEnd : undefined}
        onDragOver={isPinnedList ? handleDragOver : undefined}
        onDrop={(e) => isPinnedList && handleDrop(e, s.id)}
      >
        <div className={bgClass} style={bgStyle}>
          <Icon className={`w-3.5 h-3.5 transition-colors ${iconColor}`} />
          {!isPinnedList && isPinned && (
            <div className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-0.5 shadow-sm border border-slate-900">
              <Pin className="w-2 h-2 text-white" />
            </div>
          )}
          {isHeatmapMode && count > 0 && (
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-bold px-1 rounded-full border border-slate-900 leading-none flex items-center justify-center min-w-[14px] h-[14px]">
              {count}
            </div>
          )}
        </div>

        {/* Basic Label */}
        <AnimatePresence>
          {isOpen && !isHovered && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className={`absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-xs font-mono px-2 py-1 rounded border border-slate-800 pointer-events-none flex items-center gap-2 ${!isMatched ? 'opacity-30' : 'text-slate-400'}`}
            >
              <span className={isActive && !isHeatmapMode && isMatched ? 'text-cyan-400 font-bold' : ''}>{s.name}</span>
              {isHeatmapMode && count > 0 && isMatched && (
                <span className="text-amber-400 font-bold bg-amber-500/20 px-1 rounded text-[9px] leading-none flex items-center justify-center min-w-[14px] h-[14px]">{count}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rich Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-10 top-1/2 -translate-y-1/2 w-48 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-xl pointer-events-auto cursor-default"
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold leading-tight ${isActive && !isHeatmapMode ? 'text-cyan-400' : 'text-slate-200'}`}>
                  {s.name}
                </span>
                <button
                  onClick={(e) => togglePin(s.id, e)}
                  className="text-slate-400 hover:text-rose-400 transition-colors focus:outline-none shrink-0 ml-2 bg-slate-800/50 hover:bg-slate-800 p-1 rounded"
                  title={isPinned ? "Unpin section" : "Pin section"}
                >
                  {isPinned ? <PinOff className="w-3.5 h-3.5 text-rose-400" /> : <Pin className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] mt-2">
                <span className="text-slate-400 font-mono">STATUS</span>
                <span className={`px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider ${
                  s.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  s.status === 'active' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                  'bg-slate-800 text-slate-500 border border-slate-700'
                }`}>
                  {s.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] mt-2 pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-mono">FEEDBACK</span>
                {count > 0 ? (
                  <span className="text-slate-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-bold">
                    {count} <span className="text-slate-500 text-[9px] font-normal">{count === 1 ? 'Comment' : 'Comments'}</span>
                  </span>
                ) : (
                  <span className="text-slate-500 font-mono italic">
                    No active discussions
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[80] hidden xl:block">
      <motion.div 
        className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-[2rem] p-2 flex flex-col items-center gap-2 shadow-2xl relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="relative flex flex-col items-center mb-1">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-full transition-colors z-10 ${isSearchOpen || searchQuery ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400 hover:text-cyan-400'}`}
            title="Search Sections"
          >
            <Search className="w-4 h-4" />
          </button>
          
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0, x: -10 }}
                animate={{ opacity: 1, width: 220, x: 0 }}
                exit={{ opacity: 0, width: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-10 top-0 overflow-hidden"
              >
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter sections..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => setIsHeatmapMode(!isHeatmapMode)}
          className={`p-2 rounded-full mb-1 transition-colors ${isHeatmapMode ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-400 hover:text-cyan-400'}`}
          title="Toggle Investor Interest Heatmap"
        >
          {isHeatmapMode ? <Flame className="w-4 h-4" /> : <Map className="w-4 h-4" />}
        </button>
        
        {pinnedSections.length > 0 && (
          <div className="flex flex-col items-center gap-2 mb-1 pb-3 border-b border-slate-800/80 w-full relative">
            <div className="absolute -left-1 top-0 bottom-3 w-[2px] bg-rose-500/20 rounded-full" />
            {pinnedSections.map(id => {
              const s = SECTIONS.find(x => x.id === id);
              if (!s) return null;
              return renderNode(s, true);
            })}
          </div>
        )}
        
        {SECTIONS.map(s => renderNode(s, false))}
      </motion.div>
    </div>
  );
};

