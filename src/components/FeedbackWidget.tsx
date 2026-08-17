import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  Send, 
  X,
  FileSpreadsheet,
  Cpu,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedbackWidgetProps {
  onOpenContact?: (topic: string) => void;
  onOpenDataRoom?: () => void;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  onOpenContact,
  onOpenDataRoom
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('unit-economics');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [sentiment, setSentiment] = useState<'positive' | 'needs_detail' | 'question' | null>(null);

  const sectionsList = [
    { id: 'unit-economics', label: '9-Tier Unit Economics & Waterfall' },
    { id: 'fusion-stack', label: '6-Layer Neural Fusion Architecture' },
    { id: 'rd-roadmap', label: 'R&D Technology Roadmap & Gantt' },
    { id: 'investment-terms', label: 'Seed SAFE Terms ($500k @ $4.5M Cap)' },
    { id: 'case-studies', label: 'Enterprise Case Studies (Prime Bank, Samsung)' },
    { id: 'dual-shore-globe', label: 'Dual-Shore Arbitrage (San Jose ↔ Dhaka)' }
  ];

  const handleSendFeedback = (type: 'positive' | 'needs_detail' | 'question') => {
    setSentiment(type);
    setFeedbackSent(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  const handleReset = () => {
    setFeedbackSent(false);
    setSentiment(null);
    setFeedbackComment('');
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all hud-corner space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
              <span>INVESTOR ENGAGEMENT & CLARITY TELEMETRY</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                LIVE FEEDBACK
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Was this section clear and comprehensive for your investment diligence?
            </div>
          </div>
        </div>

        {/* Section Target Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-mono text-slate-500">Topic:</label>
          <select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              setFeedbackSent(false);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] font-mono focus:outline-none focus:border-cyan-400"
          >
            {sectionsList.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Rating Area */}
      {!feedbackSent ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={() => handleSendFeedback('positive')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 text-xs font-mono flex items-center gap-2.5 transition-all cursor-pointer group text-left"
          >
            <ThumbsUp className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-white group-hover:text-emerald-200">High Conviction</div>
              <div className="text-[10px] text-slate-400">Clear & institutional-grade</div>
            </div>
          </button>

          <button
            onClick={() => handleSendFeedback('needs_detail')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 text-slate-200 hover:text-amber-300 text-xs font-mono flex items-center gap-2.5 transition-all cursor-pointer group text-left"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-white group-hover:text-amber-200">Request More Data</div>
              <div className="text-[10px] text-slate-400">Needs audit reconciliation</div>
            </div>
          </button>

          <button
            onClick={() => handleSendFeedback('question')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-slate-200 hover:text-indigo-300 text-xs font-mono flex items-center gap-2.5 transition-all cursor-pointer group text-left"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-white group-hover:text-indigo-200">Have Questions</div>
              <div className="text-[10px] text-slate-400">Discuss with Sait Fatemi</div>
            </div>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Feedback Logged to Session Diligence Log</span>
            </div>
            <button
              onClick={handleReset}
              className="text-[10px] font-mono text-slate-400 hover:text-white underline"
            >
              Submit Another
            </button>
          </div>

          <div className="text-xs text-slate-300 font-mono">
            {sentiment === 'positive' && "Thank you for the signal. Your engagement index has been registered in the diligence ledger."}
            {sentiment === 'needs_detail' && "Understood. The Data Room contains the complete unredacted Excel models and technical whitepapers."}
            {sentiment === 'question' && "We would be glad to address your specific diligence queries directly."}
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {onOpenDataRoom && (
              <button
                onClick={onOpenDataRoom}
                className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Open Data Room Assets</span>
              </button>
            )}

            {onOpenContact && (
              <button
                onClick={() => onOpenContact(`Diligence Follow-up: ${sectionsList.find(s => s.id === selectedSection)?.label}`)}
                className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Direct Inquiry to Founder</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
