import React, { useState, useEffect } from 'react';
import { Currency, FeedbackComment } from './types';
import { Navbar } from './components/Navbar';
import { SidebarDock } from './components/SidebarDock';
import { HeroSection } from './components/HeroSection';
import { InvestorNewsTicker } from './components/InvestorNewsTicker';
import { DualEngineSection } from './components/DualEngineSection';
import { FusionStackSection } from './components/FusionStackSection';
import { RdRoadmapSection } from './components/RdRoadmapSection';
import { MarketShiftSection } from './components/MarketShiftSection';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { UnitEconomicsSection, FinancialScenario } from './components/UnitEconomicsSection';
import { DualShoreGlobeSection } from './components/DualShoreGlobeSection';
import { ExecutiveTeamSection } from './components/ExecutiveTeamSection';
import { PassiveIPSection } from './components/PassiveIPSection';
import { MoatAndBenchmarksSection } from './components/MoatAndBenchmarksSection';
import { InvestmentTermsSection } from './components/InvestmentTermsSection';
import { Footer } from './components/Footer';
import { PitchDeckModal } from './components/PitchDeckModal';
import { DataRoomModal } from './components/DataRoomModal';
import { ContactModal } from './components/ContactModal';
import { InvestorIntelligenceDashboard } from './components/InvestorIntelligenceDashboard';
import { OnboardingWizardModal, InvestorPersona } from './components/OnboardingWizardModal';
import { ActiveTrackIndicator } from './components/ActiveTrackIndicator';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { GlobalLoadingScreen } from './components/GlobalLoadingScreen';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import { OmniSearchModal } from './components/OmniSearchModal';
import { MilestonesSection } from './components/MilestonesSection';
import { ValueExchangeSection } from './components/ValueExchangeSection';
import { ExecutiveFeedbackDrawer } from './components/ExecutiveFeedbackDrawer';
import { SectionMap } from './components/SectionMap';
import { AnomalyWatchToast } from './components/AnomalyWatchToast';
import { VoiceNavigator } from './components/VoiceNavigator';
import { MessageSquare } from 'lucide-react';

export type GlobalViewMode = 'investor' | 'partner';

export default function App() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState<boolean>(false);
  const [isDataRoomOpen, setIsDataRoomOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isOmniSearchOpen, setIsOmniSearchOpen] = useState<boolean>(false);
  const [isFeedbackDrawerOpen, setIsFeedbackDrawerOpen] = useState<boolean>(false);
  const [globalViewMode, setGlobalViewMode] = useState<GlobalViewMode>('investor');
  const [activePersona, setActivePersona] = useState<InvestorPersona | null>(null);
  const [activeScenario, setActiveScenario] = useState<FinancialScenario>('base');
  const [contactInterestArea, setContactInterestArea] = useState<string>('Seed Round SAFE Allocation ($500k @ $4.5M Cap)');
  const [comments, setComments] = useState<FeedbackComment[]>([]);

  // Deep linking: Detect ?section=xxx or #xxx in URL on load and scroll into view
  useEffect(() => {
    const handleDeepLink = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sectionQuery = urlParams.get('section');
      const hashQuery = window.location.hash.replace('#', '');
      const targetId = sectionQuery || hashQuery;

      if (targetId) {
        // Small delay to allow component rendering and loading screen transition
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Add temporary glowing ring animation
            el.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]', 'transition-all', 'duration-1000');
            setTimeout(() => {
              el.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]');
            }, 3000);
          }
        }, 600);
      }
    };

    handleDeepLink();
    window.addEventListener('popstate', handleDeepLink);

    const handleOpenOmniSearch = () => setIsOmniSearchOpen(true);
    document.addEventListener('open-omni-search', handleOpenOmniSearch);

    return () => {
      window.removeEventListener('popstate', handleDeepLink);
      document.removeEventListener('open-omni-search', handleOpenOmniSearch);
    };
  }, []);

  const getCommentCount = (sectionName: string) => comments.filter(c => c.section === sectionName).length;

  const SectionMarker = ({ count, onClick }: { count: number, onClick: () => void }) => {
    if (count === 0) return null;
    return (
      <div 
        className="absolute top-10 right-10 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer hover:scale-110 hover:bg-slate-800 transition-all"
        onClick={onClick}
        title="View Feedback for this section"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-slate-900 shadow-md">
          {count}
        </span>
      </div>
    );
  };

  // Global Keyboard Shortcuts for Section Navigation
  useEffect(() => {
    const sectionMap: Record<string, string> = {
      '1': 'hero',
      '2': 'dual-engines',
      '3': 'fusion-stack',
      '4': 'rd-roadmap',
      '5': 'case-studies',
      '6': 'unit-economics',
      '7': 'dual-shore-globe',
      '8': 'executive-team',
      '9': 'investment-terms',
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const targetId = sectionMap[e.key];
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]', 'transition-all', 'duration-1000');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]');
          }, 3000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenContact = (interestArea?: string) => {
    if (interestArea) {
      setContactInterestArea(interestArea);
    }
    setIsContactOpen(true);
  };

  const handleOpenIntelligence = (scenario?: FinancialScenario) => {
    if (scenario) {
      setActiveScenario(scenario);
    }
    setIsIntelligenceOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* Global Scroll Progress Bar at very top */}
      <ScrollProgressBar />

      {/* Global Loading Screen Sequence on initial load */}
      <GlobalLoadingScreen />

      {/* Sticky Breadcrumb Navigation */}
      <BreadcrumbNav />

      {/* Top Navbar */}
      <Navbar
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onOpenDataRoom={() => setIsDataRoomOpen(true)}
        onOpenContact={handleOpenContact}
        onOpenIntelligenceDashboard={() => handleOpenIntelligence('base')}
        globalViewMode={globalViewMode}
        onGlobalViewModeChange={setGlobalViewMode}
        onOpenFeedback={() => setIsFeedbackDrawerOpen(true)}
      />

      {/* Floating Spatial Sidebar Dock */}
      <SidebarDock
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onOpenDataRoom={() => setIsDataRoomOpen(true)}
        onOpenContact={() => handleOpenContact('Direct Leadership Inquiry')}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Main Single-Page Scroll Content */}
      <main id="main-content">
        
        {/* 1. Hero & Executive Briefing */}
        <HeroSection
          currency={currency}
          onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
          onOpenDataRoom={() => setIsDataRoomOpen(true)}
          onOpenContact={handleOpenContact}
          globalViewMode={globalViewMode}
        />

        {/* Real-Time Investor News Ticker */}
        <InvestorNewsTicker />

        {/* 2. Synergistic Commercial Portfolios: The Dual Engines */}
        <div className="relative">
          <SectionMarker count={getCommentCount('Dual-Engine Model')} onClick={() => setIsFeedbackDrawerOpen(true)} />
          <DualEngineSection />
        </div>

        {/* 3. 6-Layer Fusion Architecture Deep Dive */}
        <div className="relative">
          <SectionMarker count={getCommentCount('Technical Architecture')} onClick={() => setIsFeedbackDrawerOpen(true)} />
          <FusionStackSection />
        </div>

        {/* 4. R&D Technology Development Timeline & Gantt Roadmap */}
        <RdRoadmapSection />

        {/* Major Milestones & Strategic Sprints */}
        <div className="relative">
          <SectionMarker count={getCommentCount('Milestones & Roadmap')} onClick={() => setIsFeedbackDrawerOpen(true)} />
          <MilestonesSection />
        </div>

        {/* Value Exchange Model */}
        <ValueExchangeSection />

        {/* 5. Macro Catalyst: Big Tech Hardware Influx */}
        <MarketShiftSection />

        {/* 6. Verified Case Studies & Interactive ROI Calculator */}
        <CaseStudiesSection currency={currency} />

        {/* 7. Recalibrated 9-Tier Unit Economics (USD & BDT Waterfall) with Financial Scenarios */}
        <div className="relative">
          <SectionMarker count={getCommentCount('Financials & Valuation')} onClick={() => setIsFeedbackDrawerOpen(true)} />
          <UnitEconomicsSection 
            currency={currency} 
            onOpenIntelligenceDashboard={handleOpenIntelligence}
          />
        </div>

        {/* 8. Interactive Holographic Dual-Shore Globe (San Jose ↔ Dhaka) */}
        <DualShoreGlobeSection onOpenContact={handleOpenContact} />

        {/* 9. Executive Leadership & Founding Team */}
        <ExecutiveTeamSection onOpenContact={handleOpenContact} />

        {/* 10. Non-Client, Passive & Creator Commerce Streams */}
        <PassiveIPSection currency={currency} />

        {/* 11. Real-World Benchmarks & Competitive Moat Matrix */}
        <MoatAndBenchmarksSection />

        {/* 12. Seed Round SAFE Terms, Capital Allocation & Milestones */}
        <InvestmentTermsSection
          currency={currency}
          onOpenDataRoom={() => setIsDataRoomOpen(true)}
          onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
          onOpenContact={handleOpenContact}
        />

      </main>

      {/* Floating Active Investor Persona Track Indicator */}
      <ActiveTrackIndicator
        activePersona={activePersona}
        onOpenWizard={() => setIsOnboardingOpen(true)}
      />

      {/* Footer */}
      <Footer
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onOpenDataRoom={() => setIsDataRoomOpen(true)}
        onOpenContact={(topic) => handleOpenContact(topic || 'General Enterprise & Investor Inquiry')}
      />

      {/* Fullscreen 12-Slide Pitch Deck Modal */}
      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />

      {/* Investor Due Diligence Data Room Modal with Keyword Search & Deep Links */}
      <DataRoomModal
        isOpen={isDataRoomOpen}
        onClose={() => setIsDataRoomOpen(false)}
        onNavigateToSection={(sectionId) => {
          setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              el.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]', 'transition-all');
              setTimeout(() => el.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-[#05070B]'), 3000);
            }
          }, 200);
        }}
      />

      {/* Direct Investor & Partner Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultInterestArea={contactInterestArea}
      />

      {/* Interactive D3.js Investor Intelligence Dashboard Modal */}
      <InvestorIntelligenceDashboard
        isOpen={isIntelligenceOpen}
        onClose={() => setIsIntelligenceOpen(false)}
        currency={currency}
        initialScenario={activeScenario}
      />

      {/* Interactive Onboarding Wizard Modal for Investor Personas */}
      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSelectPersona={(persona) => setActivePersona(persona)}
      />

      {/* Global Omni-Search Modal */}
      <OmniSearchModal
        isOpen={isOmniSearchOpen}
        onClose={() => setIsOmniSearchOpen(false)}
      />

      {/* Executive Feedback Drawer */}
      <ExecutiveFeedbackDrawer
        isOpen={isFeedbackDrawerOpen}
        onClose={() => setIsFeedbackDrawerOpen(false)}
        comments={comments}
        setComments={setComments}
      />
      
      <SectionMap comments={comments} />
      <AnomalyWatchToast />
      <VoiceNavigator />
    </div>
  );
}

