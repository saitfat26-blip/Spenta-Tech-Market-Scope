import React from 'react';
import { motion } from 'motion/react';
import { CopyShareButton } from './CopyShareButton';
import { 
  Users, 
  Linkedin, 
  ExternalLink, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Mail, 
  Sparkles, 
  Cpu, 
  Layers, 
  Globe 
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  location: string;
  locationCode: string;
  avatarUrl: string;
  bio: string;
  previousExperience: string[];
  skills: string[];
  linkedinUrl: string;
  featuredQuote?: string;
}

interface ExecutiveTeamSectionProps {
  onOpenContact?: (interest?: string) => void;
}

export const ExecutiveTeamSection: React.FC<ExecutiveTeamSectionProps> = ({ onOpenContact }) => {
  const teamMembers: TeamMember[] = [
    {
      id: 'sait-fatemi',
      name: 'Sait Fatemi',
      role: 'Founder & Chief Executive Officer',
      location: 'San Jose, CA & Dhaka',
      locationCode: 'US / BD',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Visionary architect behind Spenta’s dual-shore Physical AI model. 8+ years specializing in real-time WebXR simulation engines, spatial computing pipelines, and enterprise software engineering.',
      previousExperience: ['Ex-Lead Spatial Computing Architect', 'Pioneered Unreal Engine 5 Nanite Digital Twins', 'Built Enterprise WebXR Deployments for Fortune 500s'],
      skills: ['Spatial Computing', 'Unreal Engine 5', 'Venture Strategy', 'Dual-Shore Operations', 'Enterprise Sales'],
      linkedinUrl: 'https://www.linkedin.com/in/sait-fatemi',
      featuredQuote: '“Physical AI transforms inert spaces into responsive, intelligent cognitive environments.”'
    },
    {
      id: 'dr-noman-hossain',
      name: 'Dr. Noman Hossain',
      role: 'Chief Technology Officer & Head of AI',
      location: 'Dhaka Engineering Lab',
      locationCode: 'BD',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Ph.D. in Multimodal Computer Vision and Document Intelligence. Lead developer of the self-hosted PrimeOCR engine and localized on-premise LLaMA 3.2 Vision inference pipelines.',
      previousExperience: ['Published 14+ IEEE papers on Bengali/English OCR', 'Ex-Principal ML Scientist', 'Designed air-gapped banking IDP systems'],
      skills: ['LayoutLM v3', 'Self-Hosted LLMs', 'PyTorch / TensorRT', 'SCADA IIoT Telemetry', 'On-Premise GPU SLA'],
      linkedinUrl: 'https://www.linkedin.com/in/dr-noman-hossain',
      featuredQuote: '“True data sovereignty means zero external API egress for mission-critical enterprise intelligence.”'
    },
    {
      id: 'marcus-vance',
      name: 'Marcus Vance',
      role: 'VP of Global Enterprise & APAC BD',
      location: 'Sydney & San Jose',
      locationCode: 'AUS / US',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      bio: '15+ years enterprise software sales across Australia, Southeast Asia, and North America. Scaled enterprise XR procedural simulation contracts across mining, healthcare, and defense tiers.',
      previousExperience: ['Former Managing Director APAC Tech Solutions', 'Led $20M+ enterprise SaaS procurement pipelines', 'ASX:XRG ecosystem specialist'],
      skills: ['Enterprise Procurement', 'APAC Healthcare & Mining', 'SAFE Syndication', 'B2B SaaS Growth'],
      linkedinUrl: 'https://www.linkedin.com/in/marcus-vance-enterprise',
      featuredQuote: '“Australian and US enterprise sectors actively demand 80%+ gross margin spatial simulation.”'
    },
    {
      id: 'ayesha-rahman',
      name: 'Ayesha Rahman',
      role: 'Director of 3D Pipeline & Digital Twins',
      location: 'Dhaka Studio HQ',
      locationCode: 'BD',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      bio: 'Pioneering technical artist and procedural 3D simulation director. Oversees Spenta’s 24/7 AAA asset creation studio, cleanroom physics digital twins, and Epic Fab 3D creator distribution.',
      previousExperience: ['Ex-Senior AAA Technical Artist', 'Procedural Nanite & Lumen asset optimization master', 'Delivered 50+ procedural VR escape rooms'],
      skills: ['Unreal Engine 5', 'Procedural Physics', 'WebXR Wasm', 'Epic Fab Monetization', '3D Asset Pipelines'],
      linkedinUrl: 'https://www.linkedin.com/in/ayesha-rahman-3d',
      featuredQuote: '“We bridge cinematic photorealism with sub-11ms deterministic real-time physics.”'
    }
  ];

  return (
    <section id="executive-team" className="py-20 relative bg-[#05070B] border-t border-slate-800/80 overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-indigo-600/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXECUTIVE LEADERSHIP & CORE FOUNDING PILLARS</span>
            </div>
            <CopyShareButton sectionId="executive-team" sectionTitle="Executive Team" variant="pill" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            The Executive Team
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Uniting Silicon Valley enterprise architecture, Tier-1 computer vision researchers, and high-throughput procedural 3D simulation directors across our San Jose, Sydney, and Dhaka hubs.
          </p>
        </motion.div>

        {/* 4 Team Member Glassmorphic HUD Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/90 hover:border-cyan-500/50 rounded-xl p-5 flex flex-col justify-between space-y-4 hud-corner group transition-all shadow-lg hover:shadow-cyan-950/30"
            >
              <div className="space-y-3.5">
                
                {/* Avatar with HUD border and location tag */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors relative">
                    <img 
                      src={member.avatarUrl} 
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  {/* Location Badge */}
                  <div className="absolute -bottom-2 -right-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-cyan-300">
                    <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                    <span>{member.locationCode}</span>
                  </div>
                </div>

                {/* Name & Role */}
                <div>
                  <h3 className="text-lg font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400 font-semibold mt-0.5">
                    {member.role}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-1">
                    <Globe className="w-3 h-3 text-slate-500" />
                    <span>{member.location}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {member.bio}
                </p>

                {/* Prior Proven Track Record */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">TRACK RECORD</div>
                  <ul className="space-y-1">
                    {member.previousExperience.map((exp, i) => (
                      <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug">
                        <span className="text-cyan-400 shrink-0 font-mono">•</span>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {member.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 group-hover:border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

              </div>

              {/* Action Ribbon & LinkedIn Link */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>View LinkedIn</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                {onOpenContact && (
                  <button
                    onClick={() => onOpenContact(`Leadership Meeting Request: ${member.name} (${member.role})`)}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-all text-[10px] font-mono cursor-pointer"
                    title={`Connect with ${member.name}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </motion.div>
          ))}
        </div>

        {/* Dual-Shore Strategic Governance Callout */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ALIGNMENT OF INTERESTS // 100% FULL-TIME COMMITTED</span>
            </div>
            <h4 className="text-lg font-bold font-heading text-white">
              Institutional Governance & Technical Due Diligence
            </h4>
            <p className="text-xs text-slate-300 max-w-2xl">
              Founders hold 4-year standard YC reverse-vesting equity schedules with a 1-year cliff. Key IP, patents, and codebase repositories are 100% assigned to Spenta US Delaware C-Corp.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenContact && (
              <button
                onClick={() => onOpenContact('Direct Founder Call & SAFE Term Due Diligence')}
                className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Schedule Founder Briefing</span>
              </button>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
