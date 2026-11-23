import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Flame, FileText, Settings, Cpu, Route, Target, ArrowRightLeft, LineChart, Globe, Users, Shield, BarChart3, FileSignature, Pin, PinOff, Search, Focus, Filter, ZoomIn, ZoomOut, Info, CheckCircle2, Circle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { FeedbackComment } from '../types';

interface Section {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'pending';
  feedbackCategory?: string;
  icon: React.ElementType;
  colorClass: string;
  preview?: string;
  dependsOn?: string[];
}

const SECTIONS: Section[] = [
  { id: 'hero', name: 'Executive Briefing', status: 'completed', feedbackCategory: 'General Question', icon: FileText, colorClass: 'text-slate-300', preview: 'High-level overview of the Spenta SSOT and dual-engine framework.', dependsOn: [] },
  { id: 'dual-engines', name: 'Dual Engines', status: 'completed', feedbackCategory: 'Dual-Engine Model', icon: Settings, colorClass: 'text-indigo-400', preview: 'Deep dive into Engine 1 (Digital) and Engine 2 (Physical) synergies.', dependsOn: ['hero'] },
  { id: 'fusion-stack', name: 'Architecture', status: 'completed', feedbackCategory: 'Technical Architecture', icon: Cpu, colorClass: 'text-cyan-400', preview: 'Technical schematic of the Fusion Stack and data layer.', dependsOn: ['dual-engines'] },
  { id: 'rd-roadmap', name: 'R&D Roadmap', status: 'pending', feedbackCategory: 'Milestones & Roadmap', icon: Route, colorClass: 'text-purple-400', preview: 'Timeline for future capabilities and research milestones.', dependsOn: ['fusion-stack'] },
  { id: 'milestones', name: 'Milestones', status: 'pending', feedbackCategory: 'Milestones & Roadmap', icon: Target, colorClass: 'text-fuchsia-400', preview: 'Key company milestones and achievements over time.', dependsOn: ['rd-roadmap'] },
  { id: 'value-exchange', name: 'Value Exchange', status: 'pending', icon: ArrowRightLeft, colorClass: 'text-amber-400', preview: 'Real-time transactional throughput between engines and verticals.', dependsOn: ['dual-engines'] },
  { id: 'market-shift', name: 'Market Shift', status: 'pending', icon: LineChart, colorClass: 'text-rose-400', preview: 'Analysis of macroeconomic trends driving the dual-engine need.', dependsOn: [] },
  { id: 'case-studies', name: 'Case Studies', status: 'pending', icon: BarChart3, colorClass: 'text-blue-400', preview: 'Real-world examples of value realization and ROI.', dependsOn: ['market-shift'] },
  { id: 'unit-economics', name: 'Unit Economics', status: 'pending', feedbackCategory: 'Financials & Valuation', icon: LineChart, colorClass: 'text-emerald-400', preview: 'Financial breakdowns, customer acquisition costs, and LTV models.', dependsOn: ['value-exchange'] },
  { id: 'dual-shore-globe', name: 'Global Ops', status: 'completed', icon: Globe, colorClass: 'text-orange-400', preview: 'Global operational footprint and talent distribution.', dependsOn: [] },
  { id: 'executive-team', name: 'Leadership', status: 'completed', icon: Users, colorClass: 'text-teal-400', preview: 'Key leadership and advisory board members.', dependsOn: [] },
  { id: 'passive-ip', name: 'Passive IP', status: 'pending', icon: Shield, colorClass: 'text-rose-500', preview: 'Intellectual property assets and passive revenue streams.', dependsOn: ['fusion-stack'] },
  { id: 'moat-benchmarks', name: 'Moats', status: 'pending', icon: BarChart3, colorClass: 'text-indigo-500', preview: 'Competitive advantages and defensibility metrics.', dependsOn: ['dual-shore-globe', 'executive-team'] },
  { id: 'investment-terms', name: 'Terms', status: 'completed', icon: FileSignature, colorClass: 'text-emerald-500', preview: 'Deal structure, valuation, and term sheet details.', dependsOn: ['unit-economics'] },
];

export const SectionMap: React.FC<{ comments?: FeedbackComment[] }> = ({ comments = [] }) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isOpen, setIsOpen] = useState(false);
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Search & Filter State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMapCollapsed, setIsMapCollapsed] = useState(true); // default collapsed on mobile
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'feedback'>('all');
  
  // Legend & Zoom State
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [mapScale, setMapScale] = useState(1);

  // Drag & Drop State for pinned items
  const [draggedPinned, setDraggedPinned] = useState<string | null>(null);

  // Layout positions for SVG lines
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, {x: number, y: number}>>({});

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

  const toggleSearch = () => { setIsSearchOpen(!isSearchOpen); setIsFilterOpen(false); setIsLegendOpen(false); };
  const toggleFilter = () => { setIsFilterOpen(!isFilterOpen); setIsSearchOpen(false); setIsLegendOpen(false); };
  const toggleLegend = () => { setIsLegendOpen(!isLegendOpen); setIsSearchOpen(false); setIsFilterOpen(false); };

  const handleZoomIn = () => setMapScale(prev => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setMapScale(prev => Math.max(prev - 0.15, 0.55));
  const handleZoomReset = () => setMapScale(1);

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

  const calculatePositions = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const nodes = containerRef.current.querySelectorAll('[data-node-id]');
    const newPos: Record<string, {x: number, y: number}> = {};
    nodes.forEach(node => {
      const rect = node.getBoundingClientRect();
      const id = node.getAttribute('data-node-id');
      if (id) {
        newPos[id] = {
          x: (rect.left - containerRect.left + rect.width / 2) / mapScale,
          y: (rect.top - containerRect.top + rect.height / 2) / mapScale
        };
      }
    });
    setPositions(newPos);
  };

  useEffect(() => {
    const t1 = setTimeout(calculatePositions, 100);
    const t2 = setTimeout(calculatePositions, 600); // after stagger animations
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pinnedSections, isSearchOpen, isHeatmapMode, isOpen, activeSection, mapScale, statusFilter, isFilterOpen, isLegendOpen, isMapCollapsed]);

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

  const renderNode = (s: Section, isPinnedList: boolean = false, index: number = 0) => {
    const isActive = activeSection === s.id;
    const count = sectionCounts[s.id];
    const isPinned = pinnedSections.includes(s.id);
    const uniqueKey = isPinnedList ? `pinned-${s.id}` : `unpinned-${s.id}`;
    const isHovered = hoveredSection === uniqueKey;

    const hasFeedback = count > 0;
    const isMatched = searchQuery ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const isFocusedOut = isFocusMode && !isPinned && !isActive;
    const matchesStatusFilter = 
      statusFilter === 'all' || 
      (statusFilter === 'completed' && s.status === 'completed') || 
      (statusFilter === 'pending' && s.status === 'pending') || 
      (statusFilter === 'feedback' && hasFeedback);

    const shouldDim = !isMatched || isFocusedOut || !matchesStatusFilter;

    let bgStyle = {};
    let bgClass = `w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 relative border cursor-pointer `;

    if (shouldDim) {
      bgClass += 'opacity-30 grayscale ';
    } else if (isHeatmapMode) {
      if (hasFeedback) {
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
    const iconColor = isHeatmapMode && hasFeedback ? 'text-amber-400' : isHeatmapMode && !hasFeedback ? 'text-slate-700' : s.colorClass;

    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: [0.8, 1.1, 1] }}
        transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
        key={uniqueKey} 
        data-node-id={uniqueKey}
        className={`relative group cursor-pointer flex items-center ${isHovered ? 'z-50' : 'z-10'}`}
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
          {isHeatmapMode && hasFeedback && (
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-bold px-1 rounded-full border border-slate-900 leading-none flex items-center justify-center min-w-[14px] h-[14px]">
              {count}
            </div>
          )}
        </div>

        {/* Label */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className={`whitespace-nowrap overflow-hidden text-xs font-mono flex items-center gap-2 pl-2 pr-1 ${shouldDim ? 'opacity-30' : 'text-slate-400'}`}
            >
              <span className={isActive && !isHeatmapMode && !shouldDim ? 'text-cyan-400 font-bold' : ''}>{s.name}</span>
              {isHeatmapMode && hasFeedback && !shouldDim && (
                <span className="text-amber-400 font-bold bg-amber-500/20 px-1 rounded text-[9px] leading-none flex items-center justify-center min-w-[14px] h-[14px]">{count}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rich Tooltip with Quick Peek */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-56 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-xl pointer-events-auto cursor-default z-50"
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
                {hasFeedback ? (
                  <span className="text-slate-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-bold">
                    {count} <span className="text-slate-500 text-[9px] font-normal">{count === 1 ? 'Comment' : 'Comments'}</span>
                  </span>
                ) : (
                  <span className="text-slate-500 font-mono italic">
                    No active discussions
                  </span>
                )}
              </div>

              {s.preview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 leading-relaxed overflow-hidden"
                >
                  <span className="text-cyan-500 font-bold mb-1 block">QUICK PEEK</span>
                  {s.preview}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 xl:left-6 xl:right-auto xl:top-1/2 xl:-translate-y-1/2 xl:bottom-auto z-[80] flex flex-col gap-2 items-end xl:items-start pointer-events-none">
        
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMapCollapsed(!isMapCollapsed)}
          className="xl:hidden px-4 py-2 bg-slate-950 border border-slate-800 rounded-full shadow-2xl text-cyan-400 pointer-events-auto flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors"
        >
          <MapIcon className="w-4 h-4" />
          <span className="text-[10px] font-bold font-mono tracking-wider">MAP</span>
          <motion.div animate={{ rotate: isMapCollapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
            <ChevronUp className="w-4 h-4" />
          </motion.div>
        </button>

        {/* Zoom Controls Overlay */}
        <div className="hidden xl:flex absolute -left-12 top-1/2 -translate-y-1/2 flex-col items-center bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-full p-1.5 shadow-xl gap-1 pointer-events-auto">
          <button onClick={handleZoomIn} className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-full transition-colors" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={handleZoomReset} className="py-1 text-[9px] font-mono font-bold text-slate-500 hover:text-slate-300 transition-colors w-full text-center" title="Reset Zoom">
            {Math.round(mapScale * 100)}%
          </button>
          <button onClick={handleZoomOut} className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-full transition-colors" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Main Map Content */}
        <div className="pointer-events-auto">
        <motion.div 
          style={{ scale: mapScale, transformOrigin: 'left center' }}
          className="transition-transform duration-300 ease-out"
        >
          <motion.div 
            ref={containerRef}
            className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-[2rem] p-2 flex flex-col items-center shadow-2xl relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <AnimatePresence initial={false}>
              {(!isMapCollapsed || window.innerWidth >= 1280) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex flex-col items-start gap-2 overflow-hidden w-full relative SectionMap-collapsible-container p-2 shadow-inner bg-slate-950/40 hover:bg-slate-900/50 transition-colors rounded-[1.5rem]"
                >
                  {/* Animated Flow Lines Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              {SECTIONS.flatMap(s => {
                return (s.dependsOn || []).map(parentId => {
                  const childId = pinnedSections.includes(s.id) ? `pinned-${s.id}` : `unpinned-${s.id}`;
                  const parentIdResolved = pinnedSections.includes(parentId) ? `pinned-${parentId}` : `unpinned-${parentId}`;

                  const childPos = positions[childId];
                  const parentPos = positions[parentIdResolved];

                  if (!childPos || !parentPos) return null;

                  const isVertical = Math.abs(childPos.x - parentPos.x) < 5;
                  let d = "";
                  if (isVertical) {
                    d = `M ${parentPos.x} ${parentPos.y} L ${childPos.x} ${childPos.y}`;
                  } else {
                    const controlX = Math.min(parentPos.x, childPos.x) - 40;
                    d = `M ${parentPos.x} ${parentPos.y} C ${controlX} ${parentPos.y}, ${controlX} ${childPos.y}, ${childPos.x} ${childPos.y}`;
                  }

                  return (
                    <g key={`${parentIdResolved}-${childId}`}>
                      <path d={d} fill="none" stroke="#0f172a" strokeWidth="2" />
                      <path d={d} fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />
                      <circle r="1.5" fill="#22d3ee" className="shadow-[0_0_5px_#22d3ee]">
                        <animateMotion dur="2.5s" repeatCount="indefinite" path={d} />
                      </circle>
                    </g>
                  );
                });
              })}
            </svg>

            <div className="relative flex flex-col items-center mb-1 z-20 gap-1 pb-2 border-b border-slate-800/80 w-full">
              {/* Search Toggle */}
              <button 
                onClick={toggleSearch}
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
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-xl"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Filter Toggle */}
              <div className="relative">
                <button 
                  onClick={toggleFilter}
                  className={`p-2 rounded-full transition-colors z-10 ${statusFilter !== 'all' || isFilterOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-400 hover:text-cyan-400'}`}
                  title="Filter by Status"
                >
                  <Filter className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-10 top-0 w-48 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-2 shadow-xl flex flex-col gap-1 cursor-default"
                    >
                      <span className="text-[10px] font-bold text-slate-500 px-2 pb-1 uppercase tracking-wider mb-1 border-b border-slate-800">Filter View</span>
                      
                      <button onClick={() => setStatusFilter('all')} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${statusFilter === 'all' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'}`}>
                        <Map className="w-3.5 h-3.5" /> All Sections
                      </button>
                      
                      <button onClick={() => setStatusFilter('completed')} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${statusFilter === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </button>

                      <button onClick={() => setStatusFilter('pending')} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${statusFilter === 'pending' ? 'bg-slate-700/50 text-slate-200' : 'text-slate-300 hover:bg-slate-800'}`}>
                        <Circle className="w-3.5 h-3.5" /> In Progress
                      </button>

                      <button onClick={() => setStatusFilter('feedback')} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${statusFilter === 'feedback' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:bg-slate-800'}`}>
                        <MessageSquare className="w-3.5 h-3.5" /> Active Discussions
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Heatmap Toggle */}
              <button 
                onClick={() => setIsHeatmapMode(!isHeatmapMode)}
                className={`p-2 rounded-full transition-colors z-10 ${isHeatmapMode ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-400 hover:text-cyan-400'}`}
                title="Toggle Investor Interest Heatmap"
              >
                {isHeatmapMode ? <Flame className="w-4 h-4" /> : <Map className="w-4 h-4" />}
              </button>

              {/* Focus Toggle */}
              <button 
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={`p-2 rounded-full transition-colors z-10 ${isFocusMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-900 text-slate-400 hover:text-cyan-400'}`}
                title="Toggle Focus Workspace"
              >
                <Focus className="w-4 h-4" />
              </button>

              {/* Legend Toggle */}
              <div className="relative">
                <button 
                  onClick={toggleLegend}
                  className={`p-2 rounded-full transition-colors z-10 ${isLegendOpen ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-900 text-slate-400 hover:text-cyan-400'}`}
                  title="Map Legend & Key"
                >
                  <Info className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isLegendOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-10 top-0 w-64 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-xl z-50 flex flex-col gap-4 cursor-default"
                    >
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">Node Status</h4>
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-500"></div> Completed (Filled/Dim)</div>
                           <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800"></div> Pending (Hollow/Dark)</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">Domain Colors</h4>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300"><Cpu className="w-3.5 h-3.5 text-cyan-400"/> Technical</div>
                           <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300"><LineChart className="w-3.5 h-3.5 text-emerald-400"/> Financial</div>
                           <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300"><Users className="w-3.5 h-3.5 text-teal-400"/> Leadership</div>
                           <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300"><ArrowRightLeft className="w-3.5 h-3.5 text-amber-400"/> Strategy</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">Heatmap Intensity</h4>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 bg-gradient-to-r from-slate-800 via-amber-500/50 to-amber-500 rounded-full border border-slate-700"></div>
                          <span className="text-[9px] text-slate-400 font-mono">0 - MAX</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {pinnedSections.length > 0 && (
              <div className="flex flex-col items-start gap-2 mb-1 pb-3 border-b border-slate-800/80 w-full relative z-10">
                {pinnedSections.map((id, index) => {
                  const s = SECTIONS.find(x => x.id === id);
                  if (!s) return null;
                  return renderNode(s, true, index);
                })}
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-2 z-10 w-full relative">
              {SECTIONS.map((s, index) => renderNode(s, false, index + pinnedSections.length))}
            </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </>
  );
};
