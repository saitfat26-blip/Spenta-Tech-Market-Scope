import React, { useState } from 'react';
import { InvestorPersona, personas } from './OnboardingWizardModal';
import { 
  Target, 
  ChevronUp, 
  ChevronDown, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface ActiveTrackIndicatorProps {
  activePersona: InvestorPersona | null;
  onOpenWizard: () => void;
}

export const ActiveTrackIndicator: React.FC<ActiveTrackIndicatorProps> = ({
  activePersona,
  onOpenWizard
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!activePersona) {
    return (
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={onOpenWizard}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono backdrop-blur-xl shadow-2xl transition-all group cursor-pointer hover:border-cyan-400"
          title="Personalize Briefing by Investor Persona"
        >
          <Target className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-semibold">Investor Briefing Track</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            Select Track
          </span>
        </button>
      </div>
    );
  }

  const personaConfig = personas[activePersona];
  const Icon = personaConfig.icon;

  const handleJump = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]', 'transition-all');
      setTimeout(() => el.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]'), 3000);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-xs sm:max-w-sm">
      <div className="bg-slate-950/95 border border-cyan-500/40 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden hud-corner">
        
        {/* Header Bar */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-900/80 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400 shrink-0">
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <span>ACTIVE TRACK</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div className="text-xs font-bold text-white font-mono truncate">
                {personaConfig.title}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenWizard();
              }}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Change Persona Track"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="text-slate-400">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Expanded Steps */}
        {isExpanded && (
          <div className="p-3 pt-0 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-200">
            <div className="text-[10px] font-mono text-slate-400 pt-2">
              Curated Diligence Sequence:
            </div>

            <div className="space-y-1.5">
              {personaConfig.prioritySteps.map((step, idx) => (
                <div
                  key={step.sectionId}
                  onClick={() => handleJump(step.sectionId)}
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between text-xs font-mono group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] text-cyan-400 font-bold">0{idx + 1}</span>
                    <span className="text-slate-200 group-hover:text-cyan-300 truncate">
                      {step.title.replace(/^\d+\.\s*/, '')}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>

            <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <button
                onClick={onOpenWizard}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Switch Profile</span>
              </button>
              <span>4 Priority Sections</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
