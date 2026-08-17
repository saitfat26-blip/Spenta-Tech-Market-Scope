import React, { useState, useEffect } from 'react';
import { Currency, USD_TO_BDT_RATE } from '../types';
import { generateBriefingPdf } from '../utils/pdfGenerator';
import { 
  FileText, 
  Presentation, 
  ShieldCheck, 
  Globe, 
  Menu, 
  X, 
  ChevronRight, 
  Layers, 
  TrendingUp, 
  Briefcase, 
  Cpu, 
  Sparkles, 
  DollarSign, 
  Mail, 
  Download, 
  CheckCircle2, 
  GitBranch, 
  Users,
  LineChart
} from 'lucide-react';

interface NavbarProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onOpenPitchDeck: () => void;
  onOpenDataRoom: () => void;
  onOpenContact: (interest?: string) => void;
  onOpenIntelligenceDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onCurrencyChange,
  onOpenPitchDeck,
  onOpenDataRoom,
  onOpenContact,
  onOpenIntelligenceDashboard
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      try {
        generateBriefingPdf(currency);
        setPdfSuccess(true);
        setTimeout(() => setPdfSuccess(false), 3000);
      } catch (err) {
        console.error('PDF Generation error:', err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 400);
  };

  const navLinks = [
    { label: 'Dual Engines', href: '#dual-engines' },
    { label: '6-Layer Stack', href: '#fusion-stack' },
    { label: 'R&D Roadmap', href: '#rd-roadmap' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'Unit Economics', href: '#unit-economics' },
    { label: 'Global Sync', href: '#dual-shore-globe' },
    { label: 'Executive Team', href: '#executive-team' },
    { label: 'Seed SAFE', href: '#investment-terms' },
  ];

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#05070B]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/50 py-2.5' 
          : 'bg-transparent py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center group focus:outline-none shrink-0">
            <span className="font-bold tracking-tight text-white text-base sm:text-lg">
              SPENTA <span className="text-cyan-400">XR & AI</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-0.5 bg-slate-900/60 p-1 rounded-lg border border-slate-800 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* High Density Telemetry Status Badges & Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">

            {/* Download Full Briefing Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              id="nav-download-briefing-btn"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all border cursor-pointer ${
                pdfSuccess 
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-500/30 hover:border-cyan-400'
              }`}
              title="Download client-side high-fidelity PDF investor briefing"
            >
              {isGeneratingPdf ? (
                <>
                  <span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[11px]">Compiling PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px]">Briefing Saved</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px] font-semibold">Download Briefing</span>
                </>
              )}
            </button>

            {/* Presentation Pitch Deck Button */}
            <button
              onClick={onOpenPitchDeck}
              id="nav-pitch-deck-btn"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer"
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px]">12-Slide Deck</span>
            </button>

            {/* D3 Intelligence Dashboard Overlay Button */}
            {onOpenIntelligenceDashboard && (
              <button
                onClick={onOpenIntelligenceDashboard}
                id="nav-d3-dashboard-btn"
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer"
                title="Launch D3.js 12-Quarter Growth Projections"
              >
                <LineChart className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px]">D3 Intel</span>
              </button>
            )}

            {/* Data Room Button */}
            <button
              onClick={onOpenDataRoom}
              id="nav-data-room-btn"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px]">Data Room</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => onCurrencyChange(currency === 'USD' ? 'BDT' : 'USD')}
              className="px-2 py-1 text-[11px] font-mono bg-slate-900 border border-slate-800 text-cyan-400 rounded-lg"
            >
              {currency}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 p-4 bg-slate-950/95 border border-slate-800 rounded-2xl backdrop-blur-2xl space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 bg-slate-900/80 rounded-xl text-slate-300 hover:text-cyan-400"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDownloadPdf();
                }}
                className="w-full py-2.5 text-xs font-semibold bg-slate-900 text-cyan-300 border border-cyan-500/40 rounded-xl flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                Download Full Briefing (PDF)
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-2.5 text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded-xl flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                Inquire & Contact Leadership
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPitchDeck();
                }}
                className="w-full py-2.5 text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 rounded-xl flex items-center justify-center gap-2"
              >
                <Presentation className="w-4 h-4" />
                Launch 12-Slide Pitch Deck (.pptx)
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDataRoom();
                }}
                className="w-full py-2.5 text-xs font-bold bg-cyan-500 text-slate-950 rounded-xl flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Access Investor Data Room & SSOT
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

