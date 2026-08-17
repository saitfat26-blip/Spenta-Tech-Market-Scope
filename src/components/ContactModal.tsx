import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Mail, 
  User, 
  Building2, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  DollarSign,
  Layers,
  ArrowRight,
  Globe
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInterestArea?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultInterestArea = 'Seed Round SAFE Allocation ($500k)'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [interestArea, setInterestArea] = useState(defaultInterestArea);
  const [investmentBracket, setInvestmentBracket] = useState('$50,000 – $100,000 USD');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');

  useEffect(() => {
    if (defaultInterestArea) {
      setInterestArea(defaultInterestArea);
    }
  }, [defaultInterestArea]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    // Simulate instantaneous high-speed enterprise API ingestion
    setTimeout(() => {
      const generatedId = `SPN-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
      setInquiryId(generatedId);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setOrganization('');
    setMessage('');
    setIsSubmitted(false);
    onClose();
  };

  const interestOptions = [
    'Seed Round SAFE Allocation ($500k @ $4.5M Cap)',
    'Enterprise Spatial Digital Twin Deployment (UE5/XR)',
    'PrimeOCR Banking / IDP Enterprise Solution',
    'Australian Market Pilot Collaboration (ASX/Mining/Health)',
    'Creator & Passive IP Commerce Distribution',
    'Strategic Advisory / Direct Diligence Q&A'
  ];

  const bracketOptions = [
    'Angel / Syndicated: $25k – $50k USD',
    'Institutional / Family Office: $50k – $100k USD',
    'Major Seed Lead / Co-Lead: $100k – $250k+ USD',
    'Enterprise Commercial Client ($20k–$100k+ Tier)',
    'Other / Strategic Inquirer'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      
      {/* Backdrop Click */}
      <div className="fixed inset-0" onClick={onClose} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-2xl bg-[#070A10] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 hud-corner overflow-hidden z-10 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Ribbon */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  SPENTA EXECUTIVE INQUIRY PORTAL
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  ACTIVE 24/7 SLA
                </span>
              </div>
              <h2 className="text-lg font-bold font-heading text-white">
                Direct Investor & Enterprise Inquiry
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="inquiry-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Direct connection with Spenta founders and leadership (San Jose & Dhaka). Inquiries are routed immediately to the investment committee with <strong className="text-white">turnaround within 12 hours</strong>.
                </p>

                {/* Grid Inputs: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Full Name <span className="text-rose-400">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-xs font-mono placeholder:text-slate-600 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Work / Institutional Email <span className="text-rose-400">*</span></span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. s.jenkins@venturefund.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-xs font-mono placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Organization / Fund Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Organization, Venture Fund, or Enterprise Entity</span>
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Apex Horizon Capital / Health Partners Australia"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-xs font-mono placeholder:text-slate-600 transition-colors"
                  />
                </div>

                {/* Interest Area Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Primary Interest Area</span>
                  </label>
                  <select
                    value={interestArea}
                    onChange={(e) => setInterestArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-xs font-mono transition-colors"
                  >
                    {interestOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estimated Allocation or Engagement Scale */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Target Investment or Project Bracket</span>
                  </label>
                  <select
                    value={investmentBracket}
                    onChange={(e) => setInvestmentBracket(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-xs font-mono transition-colors"
                  >
                    {bracketOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message / Strategic Note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Brief Note or Key Discussion Points (Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide context regarding your fund mandate, pilot timeline, or questions on the SAFE terms..."
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-xs font-mono placeholder:text-slate-600 transition-colors"
                  />
                </div>

                {/* Security & Confidentiality Tag */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Encrypted & Confidential under Mutual NDA</span>
                  </div>
                  <span className="text-cyan-400">SLA: &lt;12h Response</span>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Dossier...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Inquiry & Request Call</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="inquiry-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-5"
              >
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                    <span>TRANSMISSION CONFIRMED // {inquiryId}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white font-heading">
                    Inquiry Successfully Logged
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Thank you, <strong className="text-white">{name}</strong>. Your inquiry regarding <strong className="text-cyan-300">{interestArea}</strong> has been routed to Spenta’s executive team at <span className="text-white font-mono">{email}</span>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left text-xs font-mono space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Reference Ticket:</span>
                    <span className="text-cyan-400 font-bold">{inquiryId}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Expected Response:</span>
                    <span className="text-emerald-400">Within 12 Hours</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Direct Founder Channel:</span>
                    <span className="text-slate-300">founders@spenta.io</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    Return to Briefing
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
};
