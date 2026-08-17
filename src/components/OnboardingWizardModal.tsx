import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Eye, 
  Zap,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type InvestorPersona = 'vc' | 'angel' | 'strategic' | 'sovereign';

export interface PersonaConfig {
  id: InvestorPersona;
  title: string;
  badge: string;
  badgeColor: string;
  icon: any;
  summary: string;
  prioritySteps: {
    title: string;
    sectionId: string;
    description: string;
  }[];
}

export const personas: Record<InvestorPersona, PersonaConfig> = {
  vc: {
    id: 'vc',
    title: 'Institutional Venture Capitalist',
    badge: 'Series Lead / Institutional Track',
    badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40',
    icon: TrendingUp,
    summary: 'Focused on 9-Tier Unit Economics, 45% Gross Margins, Seed SAFE Terms ($500k @ $4.5M Cap), and 12-Quarter DCF Projections.',
    prioritySteps: [
      { title: '1. Recalibrated Unit Economics', sectionId: 'unit-economics', description: 'Audited 45% Gross & 25% Net profit waterfall' },
      { title: '2. Seed Round SAFE Agreement', sectionId: 'investment-terms', description: 'Y Combinator standard $500k @ $4.5M Post-Money Cap' },
      { title: '3. Dual-Shore Arbitrage Model', sectionId: 'dual-shore-globe', description: '78% operational cost savings between San Jose & Dhaka' },
      { title: '4. Competitive Moats & Data Moat', sectionId: 'moat-benchmarks', description: 'Air-gapped deployment & proprietary spatial neural stack' }
    ]
  },
  angel: {
    id: 'angel',
    title: 'Angel Investor & Syndicate Major',
    badge: 'Angel / Private Syndicate Track',
    badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-500/40',
    icon: Sparkles,
    summary: 'Focused on Executive Leadership pedigree, 12-Slide Pitch Deck, Verified Client Case Studies, and Passive IP revenue streams.',
    prioritySteps: [
      { title: '1. Executive Leadership Team', sectionId: 'executive-team', description: 'Deep tech founders with Silicon Valley & Dhaka R&D pedigree' },
      { title: '2. Enterprise Case Studies', sectionId: 'case-studies', description: 'Prime Bank (-97% OCR time) & Samsung Cleanroom SOPs' },
      { title: '3. Passive & Creator IP Streams', sectionId: 'passive-ip', description: 'High-margin asset store modules & enterprise creator IP' },
      { title: '4. Seed Allocation Terms', sectionId: 'investment-terms', description: 'Standard $25k–$150k syndicate ticket tranches' }
    ]
  },
  strategic: {
    id: 'strategic',
    title: 'Strategic Hardware & Enterprise Partner',
    badge: 'Technology & Hardware OEM Track',
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
    icon: Cpu,
    summary: 'Focused on 6-Layer Neural Fusion Architecture, WebXR Wasm pipeline, R&D Gantt Milestones, and Hardware Ecosystem compatibility.',
    prioritySteps: [
      { title: '1. 6-Layer Fusion Stack (L1–L6)', sectionId: 'fusion-stack', description: 'Full-stack sensor ingest to WebXR rendering pipeline' },
      { title: '2. R&D Technology Roadmap', sectionId: 'rd-roadmap', description: 'Maturation timeline for Spatial Engine & Document Intelligence' },
      { title: '3. Big Tech Hardware Catalyst', sectionId: 'market-shift', description: 'Smart glasses & headset influx integration strategy' },
      { title: '4. Commercial Portfolios', sectionId: 'dual-engines', description: 'Synergistic enterprise AI & spatial computing delivery' }
    ]
  },
  sovereign: {
    id: 'sovereign',
    title: 'Sovereign Fund & Family Office',
    badge: 'Governance & Data Sovereignty Track',
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-500/40',
    icon: ShieldCheck,
    summary: 'Focused on On-Premise Air-Gapped Compliance, National Data Sovereignty, Tier-1 Banking security, and long-term asset value.',
    prioritySteps: [
      { title: '1. Data Moat & Air-Gapped Security', sectionId: 'moat-benchmarks', description: 'Zero-cloud egress on-premise neural OCR for Tier-1 banks' },
      { title: '2. Dual-Shore Governance', sectionId: 'dual-shore-globe', description: 'San Jose Delaware C-Corp governance with Dhaka engineering engine' },
      { title: '3. Audited Financial Waterfall', sectionId: 'unit-economics', description: '100% reconciled USD and BDT accounting frameworks' },
      { title: '4. Capital Allocation Milestones', sectionId: 'investment-terms', description: '18-month institutional milestone roadmap' }
    ]
  }
};

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPersona: (persona: InvestorPersona) => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onSelectPersona
}) => {
  const [selectedPersona, setSelectedPersona] = useState<InvestorPersona>('vc');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectPersona(selectedPersona);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onClose();

    // Smooth scroll to the first step of the selected track
    const firstStep = personas[selectedPersona].prioritySteps[0];
    if (firstStep) {
      setTimeout(() => {
        const el = document.getElementById(firstStep.sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]', 'transition-all');
          setTimeout(() => el.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]'), 3000);
        }
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden hud-corner">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <span>INVESTOR ONBOARDING & BRIEFING TRACK WIZARD</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  PERSONALIZED FLOW
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Select your investor profile to configure tailored deep-dive navigation and metric highlights
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

        {/* Wizard Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Select Your Investor Profile
            </h3>
            <p className="text-xs text-slate-300">
              We will customize your briefing track to prioritize the exact financial, technical, or governance modules matching your diligence criteria.
            </p>
          </div>

          {/* 4 Persona Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(personas) as InvestorPersona[]).map((key) => {
              const p = personas[key];
              const Icon = p.icon;
              const isSelected = selectedPersona === key;

              return (
                <div
                  key={key}
                  onClick={() => setSelectedPersona(key)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-white text-sm font-heading">{p.title}</h4>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                        {p.badge.split(' ')[0]}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {p.summary}
                    </p>
                  </div>

                  {/* Priority Track Preview */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Curated Priority Track:</div>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-cyan-300">
                      {p.prioritySteps.slice(0, 2).map((s, idx) => (
                        <div key={idx} className="truncate flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span className="truncate">{s.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Track Detail Box */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>ACTIVE BRIEFING TRACK SEQUENCE: {personas[selectedPersona].title.toUpperCase()}</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">4 Curated Milestones</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {personas[selectedPersona].prioritySteps.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-cyan-300 font-mono flex items-center justify-between">
                    <span>{step.title}</span>
                    <span className="text-[9px] text-slate-500 font-mono">0{idx + 1}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                    {step.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            Skip Customization
          </button>

          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <span>Activate Briefing Track</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
