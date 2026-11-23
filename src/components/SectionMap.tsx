import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Map as MapIcon,
  Flame,
  FileText,
  Settings,
  Cpu,
  Route,
  Target,
  ArrowRightLeft,
  LineChart,
  Globe,
  Users,
  Shield,
  BarChart3,
  FileSignature,
  Pin,
  PinOff,
  Search,
  Focus,
  Filter,
  ZoomIn,
  ZoomOut,
  Info,
  CheckCircle2,
  Circle,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  Link2,
  Check,
  X,
  Box,
} from 'lucide-react';
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
  keywords?: string[];
}

const SECTIONS: Section[] = [
  { id: 'hero', name: 'Executive Briefing', status: 'completed', feedbackCategory: 'General Question', icon: FileText, colorClass: 'text-slate-300', preview: 'High-level overview of the Spenta SSOT and dual-engine framework.', dependsOn: [], keywords: ['overview', 'summary', 'executive', 'briefing'] },
  { id: 'dual-engines', name: 'Dual Engines', status: 'completed', feedbackCategory: 'Dual-Engine Model', icon: Settings, colorClass: 'text-indigo-400', preview: 'Deep dive into Engine 1 (Digital) and Engine 2 (Physical) synergies.', dependsOn: ['hero'], keywords: ['engines', 'commercial', 'xr', 'ai'] },
  { id: 'fusion-stack', name: 'Architecture', status: 'completed', feedbackCategory: 'Technical Architecture', icon: Cpu, colorClass: 'text-cyan-400', preview: 'Technical schematic of the 6-Layer Fusion Stack and data layer.', dependsOn: ['dual-engines'], keywords: ['architecture', 'stack', 'technical', 'llm', 'webxr'] },
  { id: 'rd-roadmap', name: 'R&D Roadmap', status: 'pending', feedbackCategory: 'Milestones & Roadmap', icon: Route, colorClass: 'text-purple-400', preview: 'Timeline for future capabilities and research milestones.', dependsOn: ['fusion-stack'], keywords: ['roadmap', 'gantt', 'timeline', 'research'] },
  { id: 'milestones', name: 'Milestones', status: 'pending', feedbackCategory: 'Milestones & Roadmap', icon: Target, colorClass: 'text-fuchsia-400', preview: 'Key company milestones and strategic sprint targets.', dependsOn: ['rd-roadmap'], keywords: ['sprints', 'milestones', 'goals'] },
  { id: 'value-exchange', name: 'Value Exchange', status: 'pending', icon: ArrowRightLeft, colorClass: 'text-amber-400', preview: 'Real-time transactional throughput between engines and verticals.', dependsOn: ['dual-engines'], keywords: ['value', 'exchange', 'synergy'] },
  { id: 'market-shift', name: 'Market Shift', status: 'pending', icon: LineChart, colorClass: 'text-rose-400', preview: 'Analysis of macroeconomic trends driving the dual-engine need.', dependsOn: [], keywords: ['market', 'tam', 'macro', 'hardware'] },
  { id: 'case-studies', name: 'Case Studies', status: 'pending', icon: BarChart3, colorClass: 'text-blue-400', preview: 'Real-world examples of value realization and ROI calculators.', dependsOn: ['market-shift'], keywords: ['roi', 'prime bank', 'samsung', 'proof'] },
  { id: 'unit-economics', name: 'Unit Economics', status: 'pending', feedbackCategory: 'Financials & Valuation', icon: LineChart, colorClass: 'text-emerald-400', preview: 'Financial breakdowns, customer acquisition costs, and LTV models.', dependsOn: ['value-exchange'], keywords: ['financial', 'margin', 'waterfall', 'cogs', 'revenue'] },
  { id: 'spatial-analytics-3d', name: '3D Observatory', status: 'completed', feedbackCategory: 'Financials & Valuation', icon: Box, colorClass: 'text-cyan-400', preview: 'Interactive React Three Fiber 3D charts for financials and architecture.', dependsOn: ['unit-economics', 'fusion-stack'], keywords: ['3d', 'diagnovax', 'charts', 'financial', 'architecture', 'observatory'] },
  { id: 'dual-shore-globe', name: 'Global Ops', status: 'completed', icon: Globe, colorClass: 'text-orange-400', preview: 'Global operational footprint and dual-shore talent distribution.', dependsOn: [], keywords: ['globe', 'san jose', 'dhaka', 'operations'] },
  { id: 'executive-team', name: 'Leadership', status: 'completed', icon: Users, colorClass: 'text-teal-400', preview: 'Key leadership and advisory board members.', dependsOn: [], keywords: ['team', 'founders', 'leadership'] },
  { id: 'passive-ip', name: 'Passive IP', status: 'pending', icon: Shield, colorClass: 'text-rose-500', preview: 'Intellectual property assets and passive revenue streams.', dependsOn: ['fusion-stack'], keywords: ['ip', 'passive', 'creator'] },
  { id: 'moat-benchmarks', name: 'Moats', status: 'pending', icon: BarChart3, colorClass: 'text-indigo-500', preview: 'Competitive advantages and defensibility metrics.', dependsOn: ['dual-shore-globe', 'executive-team'], keywords: ['moat', 'competitors', 'defensibility'] },
  { id: 'investment-terms', name: 'Terms', status: 'completed', icon: FileSignature, colorClass: 'text-emerald-500', preview: 'Deal structure, valuation, and SAFE term sheet details.', dependsOn: ['unit-economics'], keywords: ['safe', 'valuation', 'seed', 'financial', 'terms'] },
];

export const SectionMap: React.FC<{ comments?: FeedbackComment[] }> = ({ comments = [] }) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isOpen, setIsOpen] = useState(false);
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Auto-collapse accordion state: only one section detail panel can be open at a time
  const [expandedSectionKey, setExpandedSectionKey] = useState<string | null>(null);
  // Per-section copied feedback state
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);

  // Responsive desktop media query
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : true
  );

  // Search, Collapse & Filter State
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const copyTimerRef = useRef<number | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  const [pinnedSections, setPinnedSections] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('spenta-pinned-sections') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const handleChange = () => setIsDesktop(mq.matches);
    handleChange();
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('spenta-pinned-sections', JSON.stringify(pinnedSections));
  }, [pinnedSections]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedSections(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Auto-collapse handler: opening a new section closes the previously opened one and any popovers
  const toggleSectionAccordion = (uniqueKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFilterOpen(false);
    setIsLegendOpen(false);
    setExpandedSectionKey(prev => (prev === uniqueKey ? null : uniqueKey));
  };

  const handleCopyAnchorLink = async (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const anchorUrl = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(anchorUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = anchorUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      // Fallback silent catch if clipboard permissions are restricted
    }

    setCopiedSectionId(sectionId);
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => {
      setCopiedSectionId(null);
    }, 2000);
  };

  const toggleFilter = () => {
    setIsFilterOpen(prev => !prev);
    setIsLegendOpen(false);
    setExpandedSectionKey(null);
  };
  const toggleLegend = () => {
    setIsLegendOpen(prev => !prev);
    setIsFilterOpen(false);
    setExpandedSectionKey(null);
  };

  const handleZoomIn = () => setMapScale(prev => Math.min(prev + 0.15, 1.5));
  const handleZoomOut = () => setMapScale(prev => Math.max(prev - 0.15, 0.6));
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
    const newPos: Record<string, { x: number; y: number }> = {};
    nodes.forEach(node => {
      const rect = node.getBoundingClientRect();
      const id = node.getAttribute('data-node-id');
      if (id) {
        newPos[id] = {
          x: (rect.left - containerRect.left + 14) / mapScale,
          y: (rect.top - containerRect.top + 16) / mapScale,
        };
      }
    });
    setPositions(newPos);
  };

  const isExpandedPanel = isOpen || Boolean(searchQuery) || Boolean(expandedSectionKey) || !isDesktop;

  useEffect(() => {
    const t1 = setTimeout(calculatePositions, 120);
    const t2 = setTimeout(calculatePositions, 550);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [
    pinnedSections,
    searchQuery,
    isHeatmapMode,
    isOpen,
    activeSection,
    mapScale,
    statusFilter,
    isFilterOpen,
    isLegendOpen,
    isMapCollapsed,
    isDesktop,
    expandedSectionKey,
  ]);

  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-2', 'ring-cyan-400', 'transition-all');
      setTimeout(() => el.classList.remove('ring-2', 'ring-cyan-400'), 2800);
    }
    if (!isDesktop) {
      setIsMapCollapsed(true);
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

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchesQuery = (s: Section) => {
    if (!normalizedQuery) return true;
    const haystack = [
      s.name,
      s.preview || '',
      s.status,
      s.feedbackCategory || '',
      ...(s.keywords || []),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  };

  const filteredSections = useMemo(
    () => SECTIONS.filter(matchesQuery),
    [normalizedQuery]
  );

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
    const isSectionExpanded = expandedSectionKey === uniqueKey;
    const isCopied = copiedSectionId === s.id;

    const hasFeedback = count > 0;
    const isMatched = matchesQuery(s);
    const isFocusedOut = isFocusMode && !isPinned && !isActive;
    const matchesStatusFilter =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && s.status === 'completed') ||
      (statusFilter === 'pending' && s.status === 'pending') ||
      (statusFilter === 'feedback' && hasFeedback);

    const shouldDim = !isMatched || isFocusedOut || !matchesStatusFilter;

    let bgStyle: React.CSSProperties = {};
    let bgClass =
      'w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 relative border cursor-pointer ';

    if (shouldDim) {
      bgClass += 'opacity-30 grayscale ';
    } else if (isHeatmapMode) {
      if (hasFeedback) {
        const intensity = 0.3 + (count / maxCount) * 0.7;
        bgStyle = {
          backgroundColor: `rgba(245, 158, 11, ${intensity * 0.3})`,
          borderColor: `rgba(245, 158, 11, ${intensity})`,
        };
      } else {
        bgClass += 'bg-slate-900 border-slate-800 text-slate-600 ';
      }
    } else {
      if (isActive) {
        bgClass += 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_#22d3ee] scale-110 ';
      } else if (s.status === 'completed') {
        bgClass += 'bg-slate-900 border-slate-700 hover:border-slate-500 ';
      } else {
        bgClass += 'bg-slate-950 border-slate-800 opacity-65 hover:opacity-100 ';
      }
    }

    const Icon = s.icon;
    const iconColor =
      isHeatmapMode && hasFeedback
        ? 'text-amber-400'
        : isHeatmapMode && !hasFeedback
        ? 'text-slate-700'
        : s.colorClass;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.3), ease: 'easeOut' }}
        key={uniqueKey}
        data-node-id={uniqueKey}
        className={`relative group w-full rounded-lg transition-colors ${
          isSectionExpanded ? 'bg-slate-900/80 border border-slate-800/90' : 'border border-transparent'
        } ${isHovered ? 'z-50' : 'z-10'}`}
        onMouseEnter={() => setHoveredSection(uniqueKey)}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <div
          className="flex items-center justify-between gap-1.5 w-full rounded-lg px-1 py-0.5 transition-colors hover:bg-slate-800/40 cursor-pointer"
          onClick={(e) => {
            if (isExpandedPanel) {
              toggleSectionAccordion(uniqueKey, e);
            } else {
              scrollToSection(s.id, e);
            }
          }}
          draggable={isPinnedList}
          onDragStart={(e) => isPinnedList && handleDragStart(e, s.id)}
          onDragEnd={isPinnedList ? handleDragEnd : undefined}
          onDragOver={isPinnedList ? handleDragOver : undefined}
          onDrop={(e) => isPinnedList && handleDrop(e, s.id)}
        >
          <div className="flex items-center min-w-0 flex-1">
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

            {/* Inline Label when expanded */}
            <AnimatePresence initial={false}>
              {isExpandedPanel && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`whitespace-nowrap overflow-hidden text-xs font-mono flex items-center gap-1.5 pl-2 pr-1 truncate ${
                    shouldDim ? 'opacity-35' : 'text-slate-300'
                  }`}
                >
                  <span className={`truncate ${isActive && !isHeatmapMode && !shouldDim ? 'text-cyan-400 font-bold' : ''}`}>
                    {s.name}
                  </span>
                  {isHeatmapMode && hasFeedback && !shouldDim && (
                    <span className="text-amber-400 font-bold text-[10px] leading-none tabular-nums">
                      ({count})
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Direct Action Controls: Copy Link, Jump, & Auto-Collapse Accordion Toggle */}
          {isExpandedPanel && (
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={(e) => handleCopyAnchorLink(s.id, e)}
                aria-label={`Copy link to #${s.id}`}
                title={isCopied ? `Copied #${s.id}` : `Copy link (#${s.id})`}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  isCopied
                    ? 'text-emerald-400 bg-emerald-500/15'
                    : 'text-slate-500 hover:text-cyan-300 hover:bg-slate-800/80'
                }`}
              >
                {isCopied ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
              </button>

              <a
                href={`#${s.id}`}
                onClick={(e) => scrollToSection(s.id, e)}
                aria-label={`Jump to ${s.name}`}
                title={`Jump to ${s.name}`}
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25'
                    : 'text-slate-500 hover:text-cyan-300 hover:bg-slate-800/80'
                }`}
              >
                <span>Jump</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={(e) => toggleSectionAccordion(uniqueKey, e)}
                aria-expanded={isSectionExpanded}
                aria-label={`${isSectionExpanded ? 'Collapse' : 'Expand'} ${s.name} details`}
                title={isSectionExpanded ? 'Collapse details' : 'Expand details'}
                className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <motion.div
                  animate={{ rotate: isSectionExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3 h-3" />
                </motion.div>
              </button>
            </div>
          )}
        </div>

        {/* Auto-Collapsing Inline Section Detail Drawer */}
        <AnimatePresence initial={false}>
          {isExpandedPanel && isSectionExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-2.5 pb-2.5 pt-1.5 border-t border-slate-800/80 space-y-2 text-[11px]">
                {s.preview && (
                  <p className="text-slate-400 leading-relaxed">{s.preview}</p>
                )}

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>
                    Status:{' '}
                    <span
                      className={
                        s.status === 'completed'
                          ? 'text-emerald-400 uppercase font-semibold'
                          : 'text-slate-300 uppercase font-semibold'
                      }
                    >
                      {s.status}
                    </span>
                  </span>
                  <span className="tabular-nums">
                    {hasFeedback ? `${count} ${count === 1 ? 'note' : 'notes'}` : 'No discussions'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => scrollToSection(s.id, e)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-[10px] font-mono font-semibold transition-colors whitespace-nowrap"
                  >
                    <span>Jump to Section</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={(e) => handleCopyAnchorLink(s.id, e)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap ${
                      isCopied
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
                    }`}
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => togglePin(s.id, e)}
                    title={isPinned ? 'Unpin section' : 'Pin section'}
                    className="p-1 rounded bg-slate-950 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
                  >
                    {isPinned ? <PinOff className="w-3 h-3 text-rose-400" /> : <Pin className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rich Tooltip with Quick Peek (Desktop hover when not already expanded inline) */}
        <AnimatePresence>
          {isHovered && isDesktop && !isSectionExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-56 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-xl pointer-events-auto cursor-default z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-xs font-bold leading-tight ${
                    isActive && !isHeatmapMode ? 'text-cyan-400' : 'text-slate-200'
                  }`}
                >
                  {s.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => togglePin(s.id, e)}
                  className="text-slate-400 hover:text-rose-400 transition-colors focus:outline-none shrink-0 ml-2 bg-slate-800/50 hover:bg-slate-800 p-1 rounded cursor-pointer"
                  title={isPinned ? 'Unpin section' : 'Pin section'}
                >
                  {isPinned ? <PinOff className="w-3.5 h-3.5 text-rose-400" /> : <Pin className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] mt-2">
                <span className="text-slate-400 font-mono">STATUS</span>
                <span
                  className={`font-mono uppercase font-bold tracking-wider ${
                    s.status === 'completed'
                      ? 'text-emerald-400'
                      : s.status === 'active'
                      ? 'text-cyan-400'
                      : 'text-slate-400'
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] mt-2 pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-mono">FEEDBACK</span>
                {hasFeedback ? (
                  <span className="text-slate-300 font-mono font-bold tabular-nums">
                    {count}{' '}
                    <span className="text-slate-500 text-[9px] font-normal">
                      {count === 1 ? 'Comment' : 'Comments'}
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-500 font-mono italic">No active discussions</span>
                )}
              </div>

              {s.preview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.35, duration: 0.25 }}
                  className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 leading-relaxed overflow-hidden"
                >
                  <span className="text-cyan-400 font-semibold mb-1 block">Quick Peek</span>
                  {s.preview}
                </motion.div>
              )}

              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => scrollToSection(s.id, e)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-[10px] font-mono font-semibold transition-colors whitespace-nowrap"
                >
                  <span>Jump to Section</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleCopyAnchorLink(s.id, e)}
                  title={`Copy #${s.id}`}
                  className={`px-2 py-1.5 rounded border text-[10px] font-mono inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                    isCopied
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40'
                  }`}
                >
                  {isCopied ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const showCollapsibleBody = !isMapCollapsed || isDesktop;

  return (
    <div className="fixed bottom-6 right-6 xl:left-6 xl:right-auto xl:top-1/2 xl:-translate-y-1/2 xl:bottom-auto z-[80] flex flex-col gap-2 items-end xl:items-start pointer-events-none">
      {/* Mobile Collapsible Map Toggle Button (Rotating 180-deg Chevron) */}
      <button
        type="button"
        onClick={() => setIsMapCollapsed(!isMapCollapsed)}
        aria-expanded={!isMapCollapsed}
        className="xl:hidden px-4 py-2 bg-slate-950 border border-slate-800 rounded-full shadow-2xl text-cyan-400 pointer-events-auto flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors cursor-pointer"
      >
        <MapIcon className="w-4 h-4" />
        <span className="text-[10px] font-bold font-mono tracking-wider">MAP</span>
        <motion.div animate={{ rotate: isMapCollapsed ? 0 : 180 }} transition={{ duration: 0.25 }}>
          <ChevronUp className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Desktop Zoom Controls Overlay */}
      <div className="hidden xl:flex absolute -left-12 top-1/2 -translate-y-1/2 flex-col items-center bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-full p-1.5 shadow-xl gap-1 pointer-events-auto">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-full transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomReset}
          className="py-1 text-[9px] font-mono font-bold text-slate-500 hover:text-slate-300 transition-colors w-full text-center tabular-nums cursor-pointer"
          title="Reset Zoom"
        >
          {Math.round(mapScale * 100)}%
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-full transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Main Map Container */}
      <div className="pointer-events-auto">
        <motion.div
          style={{ scale: mapScale, transformOrigin: 'left center' }}
          className="transition-transform duration-300 ease-out"
        >
          <motion.div
            ref={containerRef}
            className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-[1.75rem] p-2 flex flex-col items-center shadow-2xl relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => {
              if (document.activeElement !== searchInputRef.current && !expandedSectionKey) {
                setIsOpen(false);
              }
            }}
          >
            <AnimatePresence initial={false}>
              {showCollapsibleBody && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  className="SectionMap-collapsible-container flex flex-col items-start gap-2 overflow-visible w-full relative p-2.5 shadow-inner bg-slate-950/45 hover:bg-slate-900/55 transition-colors rounded-[1.35rem] max-h-[76vh] xl:max-h-[82vh]"
                >
                  {/* Animated Flow Lines Layer */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                    {filteredSections.flatMap(s =>
                      (s.dependsOn || []).map(parentId => {
                        const childId = pinnedSections.includes(s.id) ? `pinned-${s.id}` : `unpinned-${s.id}`;
                        const parentIdResolved = pinnedSections.includes(parentId)
                          ? `pinned-${parentId}`
                          : `unpinned-${parentId}`;

                        const childPos = positions[childId];
                        const parentPos = positions[parentIdResolved];

                        if (!childPos || !parentPos) return null;

                        const isVertical = Math.abs(childPos.x - parentPos.x) < 5;
                        let d = '';
                        if (isVertical) {
                          d = `M ${parentPos.x} ${parentPos.y} L ${childPos.x} ${childPos.y}`;
                        } else {
                          const controlX = Math.min(parentPos.x, childPos.x) - 36;
                          d = `M ${parentPos.x} ${parentPos.y} C ${controlX} ${parentPos.y}, ${controlX} ${childPos.y}, ${childPos.x} ${childPos.y}`;
                        }

                        return (
                          <g key={`${parentIdResolved}-${childId}`}>
                            <path d={d} fill="none" stroke="#0f172a" strokeWidth="2" />
                            <path
                              d={d}
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="1"
                              strokeDasharray="4 4"
                              className="opacity-30"
                            />
                            <circle r="1.5" fill="#22d3ee">
                              <animateMotion dur="2.5s" repeatCount="indefinite" path={d} />
                            </circle>
                          </g>
                        );
                      })
                    )}
                  </svg>

                  {/* Integrated Top Search Input inside SectionMap-collapsible-container */}
                  <div className="w-full z-20 pb-2 border-b border-slate-800/80 space-y-2">
                    <AnimatePresence initial={false}>
                      {isExpandedPanel ? (
                        <motion.div
                          key="inline-search"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 256 }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.18 }}
                          className="relative flex items-center"
                        >
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsOpen(true)}
                            placeholder="Filter briefing sections..."
                            aria-label="Filter briefing sections by keyword"
                            className="w-full bg-slate-900/95 border border-slate-700/80 rounded-lg py-1.5 pl-8 pr-7 text-[11px] font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors"
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery('')}
                              aria-label="Clear search filter"
                              className="absolute right-2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </motion.div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(true);
                            setTimeout(() => searchInputRef.current?.focus(), 60);
                          }}
                          className={`p-2 rounded-full transition-colors mx-auto flex items-center justify-center cursor-pointer ${
                            searchQuery
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-slate-900 text-slate-400 hover:text-cyan-400'
                          }`}
                          title="Search Sections"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      )}
                    </AnimatePresence>

                    {/* Compact Toolbar Controls */}
                    <div
                      className={`flex ${
                        isExpandedPanel ? 'flex-row justify-between px-0.5' : 'flex-col items-center'
                      } gap-1 w-full`}
                    >
                      {/* Status Filter Toggle */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={toggleFilter}
                          className={`p-1.5 rounded-full transition-colors z-10 cursor-pointer ${
                            statusFilter !== 'all' || isFilterOpen
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-900 text-slate-400 hover:text-cyan-400'
                          }`}
                          title="Filter by Status"
                        >
                          <Filter className="w-3.5 h-3.5" />
                        </button>

                        <AnimatePresence>
                          {isFilterOpen && (
                            <motion.div
                              initial={{ opacity: 0, x: -10, scale: 0.95 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-10 top-0 w-48 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-2 shadow-xl flex flex-col gap-1 cursor-default z-50"
                            >
                              <span className="text-[10px] font-bold text-slate-500 px-2 pb-1 uppercase tracking-wider mb-1 border-b border-slate-800">
                                Filter View
                              </span>
                              <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                                  statusFilter === 'all'
                                    ? 'bg-cyan-500/20 text-cyan-400'
                                    : 'text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                <MapIcon className="w-3.5 h-3.5" /> All Sections
                              </button>
                              <button
                                type="button"
                                onClick={() => setStatusFilter('completed')}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                                  statusFilter === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                              </button>
                              <button
                                type="button"
                                onClick={() => setStatusFilter('pending')}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                                  statusFilter === 'pending'
                                    ? 'bg-slate-700/50 text-slate-200'
                                    : 'text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                <Circle className="w-3.5 h-3.5" /> In Progress
                              </button>
                              <button
                                type="button"
                                onClick={() => setStatusFilter('feedback')}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                                  statusFilter === 'feedback'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                <MessageSquare className="w-3.5 h-3.5" /> Active Discussions
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Heatmap Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsHeatmapMode(!isHeatmapMode)}
                        className={`p-1.5 rounded-full transition-colors z-10 cursor-pointer ${
                          isHeatmapMode
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-900 text-slate-400 hover:text-cyan-400'
                        }`}
                        title="Toggle Investor Interest Heatmap"
                      >
                        {isHeatmapMode ? <Flame className="w-3.5 h-3.5" /> : <MapIcon className="w-3.5 h-3.5" />}
                      </button>

                      {/* Focus Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`p-1.5 rounded-full transition-colors z-10 cursor-pointer ${
                          isFocusMode
                            ? 'bg-indigo-500/20 text-indigo-400'
                            : 'bg-slate-900 text-slate-400 hover:text-cyan-400'
                        }`}
                        title="Toggle Focus Workspace"
                      >
                        <Focus className="w-3.5 h-3.5" />
                      </button>

                      {/* Legend Toggle */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={toggleLegend}
                          className={`p-1.5 rounded-full transition-colors z-10 cursor-pointer ${
                            isLegendOpen
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-slate-900 text-slate-400 hover:text-cyan-400'
                          }`}
                          title="Map Legend & Key"
                        >
                          <Info className="w-3.5 h-3.5" />
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
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
                                  Node Status
                                </h4>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2 text-xs text-slate-300">
                                    <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-500" />
                                    Completed (Filled)
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-300">
                                    <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800" />
                                    Pending (Hollow)
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
                                  Domain Colors
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
                                    <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Technical
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
                                    <LineChart className="w-3.5 h-3.5 text-emerald-400" /> Financial
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
                                    <Users className="w-3.5 h-3.5 text-teal-400" /> Leadership
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
                                    <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" /> Strategy
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
                                  Heatmap Intensity
                                </h4>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 flex-1 bg-gradient-to-r from-slate-800 via-amber-500/50 to-amber-500 rounded-full border border-slate-700" />
                                  <span className="text-[9px] text-slate-400 font-mono">0 - MAX</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Pinned Favorites List (Drag & Drop Reorderable) */}
                  {pinnedSections.length > 0 && (
                    <div className="flex flex-col items-start gap-1 mb-0.5 pb-2 border-b border-slate-800/80 w-full relative z-10">
                      {pinnedSections.map((id, index) => {
                        const s = SECTIONS.find(x => x.id === id);
                        if (!s || !matchesQuery(s)) return null;
                        return renderNode(s, true, index);
                      })}
                    </div>
                  )}

                  {/* Filtered Briefing Sections List with Auto-Collapse Details, Copy Link & Direct Jump */}
                  <div className="grid grid-cols-1 gap-1 z-10 w-full relative overflow-y-auto max-h-[52vh] pr-0.5">
                    {filteredSections.length > 0 ? (
                      filteredSections.map((s, index) => renderNode(s, false, index + pinnedSections.length))
                    ) : (
                      <div className="py-4 px-2 text-center space-y-2 w-60">
                        <p className="text-[11px] font-mono text-slate-400">
                          No sections matching &ldquo;{searchQuery}&rdquo;
                        </p>
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-cyan-300 transition-colors cursor-pointer"
                        >
                          Clear Filter
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
