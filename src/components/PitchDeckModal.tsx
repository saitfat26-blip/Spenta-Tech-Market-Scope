import React, { useState, useEffect } from 'react';
import { PITCH_DECK_SLIDES } from '../data/mockData';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize2, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Presentation,
  FileText,
  Clock,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex(prev => Math.min(PITCH_DECK_SLIDES.length - 1, prev + 1));
      }
      if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex(prev => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentSlide = PITCH_DECK_SLIDES[currentSlideIndex];

  const handleDownload = () => {
    setDownloadSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-2 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[850px] bg-slate-950 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <span>SPENTA INVESTOR PITCH DECK (.PPTX)</span>
                <span className="text-[10px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                  SLIDE {currentSlide.number} OF {PITCH_DECK_SLIDES.length}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Press [Left/Right Arrow] or [Space] to advance
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                showNotes ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {showNotes ? 'Hide Speaker Notes' : 'Speaker Notes'}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export .PPTX</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Download Success Banner */}
        {downloadSuccess && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-4 py-2 text-xs font-mono text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Dossier Package Dispatched: Spenta_Investor_Pitch_Deck.pptx & Master_SSOT.pdf</span>
            </span>
            <span className="text-[11px] text-emerald-400">Audit-Ready</span>
          </div>
        )}

        {/* Slide Stage Area */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto bg-grid-pattern relative">
          
          {/* Slide Body */}
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                {currentSlide.badge}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {currentSlide.metric}
              </span>
            </div>

            {/* Slide Title & Headline */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
                {currentSlide.title}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display leading-tight">
                {currentSlide.headline}
              </h2>
            </div>

            {/* Slide Bullet Content */}
            <div className="space-y-4 pt-2">
              {currentSlide.points.map((pt, i) => (
                <div key={i} className="p-4 rounded-xl tech-border flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                    0{i + 1}
                  </div>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    {pt}
                  </p>
                </div>
              ))}
            </div>

            {/* Speaker Notes Box (if toggled) */}
            {showNotes && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs font-mono text-indigo-200 space-y-1">
                <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>SPEAKER TALKING TRACK // SLIDE {currentSlide.number}</span>
                </div>
                <p>
                  "Emphasize to Australian investors how our Dhaka engineering center delivers enterprise-grade software at 40%–60% lower costs, giving us a highly defensible 32.5%–45% gross margin while scaling recurring ARR."
                </p>
              </div>
            )}

          </div>

          {/* Slide Footer with Pagination Controls */}
          <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between max-w-4xl mx-auto w-full">
            
            <button
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                currentSlideIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500'
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            {/* Slide Dots Indicator */}
            <div className="flex items-center gap-1.5">
              {PITCH_DECK_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentSlideIndex 
                      ? 'w-6 bg-cyan-400 shadow-md shadow-cyan-400/50' 
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  title={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlideIndex(prev => Math.min(PITCH_DECK_SLIDES.length - 1, prev + 1))}
              disabled={currentSlideIndex === PITCH_DECK_SLIDES.length - 1}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                currentSlideIndex === PITCH_DECK_SLIDES.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500'
                  : 'bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
              }`}
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
