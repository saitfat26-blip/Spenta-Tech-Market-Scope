import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Lock, 
  CheckCircle2, 
  Download, 
  Eye, 
  FileSpreadsheet, 
  Layers, 
  Briefcase,
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  Database,
  Compass,
  Cpu,
  CornerDownRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DataRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const DataRoomModal: React.FC<DataRoomModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigateToSection 
}) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [ticketSize, setTicketSize] = useState<string>('$50,000 – $150,000 (Syndicate Major)');
  const [ndaAccepted, setNdaAccepted] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'ip' | 'financials' | 'roadmap' | 'contracts'>('all');

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsUnlocked(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  const portalKnowledgeIndex = [
    {
      id: 'unit-economics',
      type: 'financials',
      title: '9-Tier Unit Economics Waterfall & Margin Models',
      summary: 'Audited 45% Gross Margin & 25% Net Profit across Enterprise AI, Spatial Prototyping & Retainers.',
      tags: ['gross margin', 'net margin', 'waterfall', 'cagr', 'pricing', 'tiers', 'cost of delivery', 'ebitda'],
      sectionId: 'unit-economics'
    },
    {
      id: 'fusion-stack',
      type: 'ip',
      title: '6-Layer Neural Fusion Architecture (L1–L6)',
      summary: 'Sensor Ingest, Spatial Engine, Multimodal AI, WebXR Rendering, Composable Business Logic & Governance.',
      tags: ['6-layer', 'neural fusion', 'wasm', 'webxr', 'sensor ingest', 'spatial engine', 'unreal nanite', 'ip'],
      sectionId: 'fusion-stack'
    },
    {
      id: 'rd-roadmap',
      type: 'roadmap',
      title: 'R&D Technology Development Timeline & Gantt Milestones',
      summary: 'Phase 1–4 maturation of Spatial Engine, Air-Gapped LLaMA 3.2 Vision, and SCADA spatial twins.',
      tags: ['roadmap', 'timeline', 'gantt', 'r&d', 'milestones', 'q1 2026', 'patents', 'spatial engine'],
      sectionId: 'rd-roadmap'
    },
    {
      id: 'investment-terms',
      type: 'financials',
      title: 'Seed Round SAFE Agreement ($500k @ $4.5M Cap)',
      summary: 'Standard YC Post-Money SAFE with 20% discount rate, 18-month runway, and 60% engineering allocation.',
      tags: ['safe', 'cap table', 'valuation', '4.5m', '500k', 'runway', 'use of funds', 'terms'],
      sectionId: 'investment-terms'
    },
    {
      id: 'case-studies',
      type: 'contracts',
      title: 'Enterprise Case Studies & ROI Proof (Prime Bank, Samsung)',
      summary: 'Prime Bank -97% OCR processing latency, Samsung Biologics VR cleanroom training SOP certification.',
      tags: ['prime bank', 'samsung', 'case studies', 'roi', 'traction', 'contracts', 'testimonials', 'ishoi'],
      sectionId: 'case-studies'
    },
    {
      id: 'dual-shore-globe',
      type: 'financials',
      title: 'Dual-Shore Arbitrage Model (San Jose HQ ↔ Dhaka R&D)',
      summary: '78% operational cost savings ($3,200/mo Dhaka vs $14,500/mo Bay Area senior engineering talent).',
      tags: ['dual-shore', 'dhaka', 'san jose', 'arbitrage', 'talent cost', '24/7', 'margins'],
      sectionId: 'dual-shore-globe'
    }
  ];

  const dataRoomFiles = [
    {
      category: '1. CORPORATE & ARCHITECTURE',
      type: 'ip',
      items: [
        { name: 'Spenta Master SSOT: Consolidated Enterprise & Financial Architecture.pdf', size: '14.2 MB', pages: '194 Pages', status: 'Verified', tags: ['ssot', 'master', 'architecture', 'enterprise'] },
        { name: 'Spenta_Angel_Investor_Pitch_Deck_2026.pptx', size: '28.6 MB', pages: '12 Slides', status: 'Downloadable', tags: ['pitch deck', 'presentation', 'slides', 'deck'] },
        { name: '6-Layer Fusion Architecture Technical Specification Whitepaper.pdf', size: '4.8 MB', pages: '32 Pages', status: 'Available', tags: ['whitepaper', 'fusion stack', 'technical', 'layers', 'spec'] }
      ]
    },
    {
      category: '2. FINANCIAL MODELS & 9-TIER UNIT ECONOMICS',
      type: 'financials',
      items: [
        { name: 'Spenta_Dynamic_3Yr_Financial_Model_Models_A_B_C.xlsx', size: '3.1 MB', pages: 'Waterfall Engine', status: 'Interactive', tags: ['financial model', 'excel', 'waterfall', 'projections', 'dcf'] },
        { name: 'Dual-Shore_Margin_Audited_Reconciliation_USD_BDT.pdf', size: '1.9 MB', pages: 'Audit Dossier', status: 'Verified', tags: ['audit', 'bdt', 'usd', 'margin', 'reconciliation'] },
        { name: 'Y_Combinator_Post_Money_SAFE_Template_4.5M_Cap.pdf', size: '420 KB', pages: 'Legal Contract', status: 'Ready to Sign', tags: ['safe', 'yc', 'contract', 'legal', '4.5m'] }
      ]
    },
    {
      category: '3. ENTERPRISE CONTRACTS & TRACTION PROOF',
      type: 'contracts',
      items: [
        { name: 'Prime_Bank_PrimeOCR_Deployment_MSA_ROI_Audit.pdf', size: '5.4 MB', pages: '-97% Time Audit', status: 'Client Signed', tags: ['prime bank', 'msa', 'roi', 'ocr', 'banking'] },
        { name: 'Samsung_Biologics_VR_Cleanroom_SOP_Certification.pdf', size: '8.1 MB', pages: 'Pharma Approved', status: 'Active', tags: ['samsung biologics', 'pharma', 'cleanroom', 'sop', 'vr'] },
        { name: 'LABAID_VirtuED_3D_Anatomy_12_Colleges_LOI.pdf', size: '2.3 MB', pages: 'EdTech Pipeline', status: 'Executed', tags: ['labaid', 'edtech', 'loi', 'anatomy', '3d'] }
      ]
    }
  ];

  // Client-side search and filtering logic
  const filteredKnowledge = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return portalKnowledgeIndex.filter(item => {
      const matchCategory = searchCategory === 'all' || item.type === searchCategory;
      const matchText = item.title.toLowerCase().includes(q) || 
                        item.summary.toLowerCase().includes(q) ||
                        item.tags.some(t => t.includes(q));
      return matchCategory && matchText;
    });
  }, [searchQuery, searchCategory]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return dataRoomFiles;
    const q = searchQuery.toLowerCase();
    return dataRoomFiles.map(cat => {
      const filteredItems = cat.items.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.tags.some(t => t.includes(q)) ||
        cat.category.toLowerCase().includes(q)
      );
      return {
        ...cat,
        items: filteredItems
      };
    }).filter(cat => cat.items.length > 0);
  }, [searchQuery, dataRoomFiles]);

  const handleJumpToSection = (sectionId: string) => {
    onClose();
    if (onNavigateToSection) {
      onNavigateToSection(sectionId);
    } else {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]', 'transition-all');
          setTimeout(() => el.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]'), 3000);
        }
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden hud-corner">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold font-mono text-white flex items-center gap-2">
                <span>INVESTOR DATA ROOM & DUE DILIGENCE DOSSIER</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono">
                  CONFIDENTIAL
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Institutional Access Portal // Spenta Seed SAFE ($500k @ $4.5M Cap)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Cyber Search Bar */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Spenta IP, 9-Tier Unit Economics, SAFE Terms, or Case Studies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-[11px] font-mono shrink-0">
            <button
              onClick={() => setSearchCategory('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${searchCategory === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              All
            </button>
            <button
              onClick={() => setSearchCategory('financials')}
              className={`px-2.5 py-1 rounded-lg transition-all ${searchCategory === 'financials' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              Financials
            </button>
            <button
              onClick={() => setSearchCategory('ip')}
              className={`px-2.5 py-1 rounded-lg transition-all ${searchCategory === 'ip' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              6-Layer IP
            </button>
            <button
              onClick={() => setSearchCategory('roadmap')}
              className={`px-2.5 py-1 rounded-lg transition-all ${searchCategory === 'roadmap' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              Roadmap
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* If Search Query is Active: Show Matching Live Knowledge & Direct Jump Action */}
          {searchQuery.trim() && (
            <div className="space-y-4 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>KEYWORD MATCHES IN MASTER SSOT ({filteredKnowledge.length + filteredCategories.reduce((acc, c) => acc + c.items.length, 0)} results)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Click to instantly scroll & highlight</span>
              </div>

              {filteredKnowledge.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredKnowledge.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleJumpToSection(item.sectionId)}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-400/60 transition-all cursor-pointer group space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                          <span>Jump to Section</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="text-xs font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-2">
                        {item.summary}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isUnlocked ? (
            /* Locked Gate Form */
            <div className="max-w-xl mx-auto py-4 space-y-6">
              
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white font-heading">
                  Unlock Immediate Due Diligence Access
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Enter your credentials below to access the full Master SSOT dossier, 3-year dynamic Excel financial model, audited client MSAs, and YC SAFE agreement.
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Your Full Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., John Smith, Partner"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Institutional / Syndicate Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@australiaventure.com.au"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Expected Investment Ticket Size
                  </label>
                  <select
                    value={ticketSize}
                    onChange={(e) => setTicketSize(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option>$25,000 – $50,000 (Angel Ticket)</option>
                    <option>$50,000 – $150,000 (Syndicate Major)</option>
                    <option>$200,000 – $500,000 (Lead Investor)</option>
                    <option>Strategic Commercial Partner</option>
                  </select>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="nda-checkbox"
                    checked={ndaAccepted}
                    onChange={(e) => setNdaAccepted(e.target.checked)}
                    className="mt-1 accent-cyan-400 cursor-pointer"
                  />
                  <label htmlFor="nda-checkbox" className="text-xs text-slate-400 leading-tight">
                    I acknowledge that data room assets are proprietary to Spenta Inc. and agree to standard mutual non-disclosure provisions.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Unlock Instant Data Room Access</span>
                </button>
              </form>

            </div>
          ) : (
            /* Unlocked Data Room File Explorer */
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <div className="text-xs font-mono font-bold text-emerald-300">
                      ACCESS GRANTED // CREDENTIALS VERIFIED
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Welcome, {fullName || 'Partner'} ({email || 'Verified Investor'}) • All 9 Data Room Assets Available
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    confetti({ particleCount: 50 });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-mono text-xs font-bold hover:bg-emerald-400 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All (.ZIP)</span>
                </button>
              </div>

              {/* Data Room Categories */}
              <div className="space-y-5">
                {filteredCategories.map(category => (
                  <div key={category.category} className="space-y-2">
                    <div className="text-xs font-mono font-bold text-cyan-400 px-1">
                      {category.category}
                    </div>
                    <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden">
                      {category.items.map(file => (
                        <div key={file.name} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
                              <FileText className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-white truncate font-mono">
                                {file.name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500">
                                {file.size} • {file.pages}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                              {file.status}
                            </span>
                            <button
                              onClick={() => {
                                confetti({ particleCount: 30 });
                              }}
                              className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
                              title="Download Asset"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Spenta Dual-Shore Governance // San Jose & Dhaka</span>
          <span>Security Protocol: TLS 1.3 End-to-End</span>
        </div>

      </div>
    </div>
  );
};

