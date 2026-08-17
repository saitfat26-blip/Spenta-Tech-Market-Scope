import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CopyShareButton } from './CopyShareButton';
import { 
  GitBranch, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  Calendar, 
  Terminal,
  Zap
} from 'lucide-react';

interface RoadmapMilestone {
  id: string;
  track: 'spatial' | 'ai' | 'both';
  phase: string;
  quarter: string;
  title: string;
  category: string;
  status: 'completed' | 'in-progress' | 'target';
  progress: number;
  description: string;
  techStack: string[];
  deliverables: string[];
  validationMetric: string;
}

export const RdRoadmapSection: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'spatial' | 'ai'>('all');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('spatial-q2-25');

  const milestones: RoadmapMilestone[] = [
    // Track 1: Spatial Engine
    {
      id: 'spatial-q1-24',
      track: 'spatial',
      phase: 'Phase 1: Foundation',
      quarter: "Q1-Q2 '24",
      title: 'WebXR 60FPS Micro-Pipeline',
      category: 'Spatial Simulation',
      status: 'completed',
      progress: 100,
      description: 'Zero-install WebAssembly & Three.js 3D viewport engine for real estate and retail e-commerce walkthroughs.',
      techStack: ['WebXR Wasm', 'Three.js', 'glTF 2.0', 'Draco Compression'],
      deliverables: ['Sub-16ms frame render guarantee', 'Cross-browser iOS/Android touch & gyroscope binding', 'Automated CAD to WebXR pipeline'],
      validationMetric: '45,000 active monthly WebAR sessions delivered.'
    },
    {
      id: 'spatial-q4-24',
      track: 'spatial',
      phase: 'Phase 1: Scale',
      quarter: "Q3-Q4 '24",
      title: 'Unreal Engine 5 Nanite Digital Twins',
      category: 'Spatial Simulation',
      status: 'completed',
      progress: 100,
      description: 'Photorealistic cleanroom and industrial factory digital twins rendering over 1.2 billion polygons with dynamic Lumen lighting.',
      techStack: ['Unreal Engine 5.4', 'Nanite Virtualized Geometry', 'Lumen Global Illumination', 'C++ Plugin Architecture'],
      deliverables: ['Real-time bioreactor vessel simulation', 'True-to-scale cleanroom operator workflows', 'Air-gapped executable binaries'],
      validationMetric: '96% reduction in pilot operator procedural errors.'
    },
    {
      id: 'spatial-q2-25',
      track: 'spatial',
      phase: 'Phase 2: Deployment',
      quarter: "Q1-Q2 '25",
      title: 'Procedural VR Escape Room LMS',
      category: 'Spatial Simulation',
      status: 'in-progress',
      progress: 85,
      description: 'Modular enterprise training engine generating automated diagnostic quizzes, physics puzzles, and team assessment analytics.',
      techStack: ['OpenXR SDK', 'Meta Quest 3', 'Apple Vision Pro (visionOS)', 'Deterministic Physics Engine'],
      deliverables: ['50+ customizable puzzle templates', 'SCORM & xAPI enterprise LMS export', 'Multiplayer co-presence spatial lobby'],
      validationMetric: 'Adopted across 4 university engineering departments.'
    },
    {
      id: 'spatial-q4-25',
      track: 'spatial',
      phase: 'Phase 2: Productization',
      quarter: "Q3-Q4 '25",
      title: 'Spatial Eyewear AR HUD & SLAM',
      category: 'Spatial Simulation',
      status: 'in-progress',
      progress: 55,
      description: 'First-person wearable HUD overlays with hands-free gesture recognition and indoor beacon wayfinding.',
      techStack: ['ARKit / ARCore', 'Ray-Ban Meta Ingest', 'OpenCV SLAM', 'WebSockets Edge Gateway'],
      deliverables: ['Optical HUD reticle alignment', 'Sub-5ms IMU telemetry packetization', 'Real-time wayfinding indoor pathfinding'],
      validationMetric: '< 10ms visual motion-to-photon latency.'
    },
    {
      id: 'spatial-q2-26',
      track: 'spatial',
      phase: 'Phase 3: Autonomous',
      quarter: "Q1-Q2 '26",
      title: 'Neural Radiance Fields (NeRF/Gaussian Splatting)',
      category: 'Spatial Simulation',
      status: 'target',
      progress: 20,
      description: 'Instant photorealistic real-world site digitization from drone video into interactive 3D spatial twins in minutes.',
      techStack: ['3D Gaussian Splatting', 'CUDA / TensorRT', 'WebGPU Shaders', 'Colmap Point Clouds'],
      deliverables: ['10x faster site capture pipeline', 'WebGPU real-time rendering in standard browsers', 'Millimeter-accurate spatial measurement tools'],
      validationMetric: 'Target: Turn 5-minute drone flyover into navigable 3D twin.'
    },

    // Track 2: Physical AI & Document Intelligence
    {
      id: 'ai-q1-24',
      track: 'ai',
      phase: 'Phase 1: Foundation',
      quarter: "Q1-Q2 '24",
      title: 'PrimeOCR Dual-Script Engine (Bengali & English)',
      category: 'Document Intelligence',
      status: 'completed',
      progress: 100,
      description: 'High-accuracy OCR pipeline engineered specifically for complex bilingual Southeast Asian forms, stamps, and cursive signatures.',
      techStack: ['LayoutLM v3', 'Tesseract Extended', 'spaCy NER', 'FastAPI'],
      deliverables: ['Bengali NID / Passport parser', 'Automated tabular data alignment', '99.4% F1 extraction score on damaged scans'],
      validationMetric: 'Cuts form processing from 20 mins to <30 seconds (-97%).'
    },
    {
      id: 'ai-q4-24',
      track: 'ai',
      phase: 'Phase 1: Security',
      quarter: "Q3-Q4 '24",
      title: 'Air-Gapped On-Premise LLaMA 3.2 Vision',
      category: 'Document Intelligence',
      status: 'completed',
      progress: 100,
      description: 'Self-hosted multimodal LLMs deployed directly on client-owned NVIDIA GPU nodes guaranteeing 100% data sovereignty.',
      techStack: ['LLaMA 3.2 11B Vision', 'vLLM', 'NVIDIA TensorRT-LLM', 'PostgreSQL pgvector'],
      deliverables: ['Zero public cloud egress architecture', 'Sub-320ms multimodal query response', 'Complete Human-In-The-Loop audit logs'],
      validationMetric: '100% compliance with banking and medical data sovereignty laws.'
    },
    {
      id: 'ai-q2-25',
      track: 'ai',
      phase: 'Phase 2: Telemetry',
      quarter: "Q1-Q2 '25",
      title: 'SCADA IIoT & Voice ERP Integration',
      category: 'Document Intelligence',
      status: 'in-progress',
      progress: 75,
      description: 'Real-time industrial sensor anomaly detection coupled with WhatsApp Business voice conversational commands for field engineers.',
      techStack: ['MQTT 5.0 Pub/Sub', 'Whisper ASR', 'EdgeX Foundry', 'Kafka Event Stream'],
      deliverables: ['Sub-2.4ms edge vibration anomaly alerts', 'Voice-driven inventory query via WhatsApp', 'Multi-tenant ERP webhook bridges'],
      validationMetric: 'Processing 120,000 sensor telemetry messages per second.'
    },
    {
      id: 'ai-q4-25',
      track: 'ai',
      phase: 'Phase 2: Scaling',
      quarter: "Q3-Q4 '25",
      title: 'Multi-Agent Verification & Fraud Guard',
      category: 'Document Intelligence',
      status: 'in-progress',
      progress: 40,
      description: 'Autonomous multi-agent consensus network cross-validating financial KYC documents, tax forms, and biometric signatures.',
      techStack: ['LangGraph Agents', 'Milvus Vector Database', 'PyTorch Anomaly Net', 'mTLS TPM 2.0'],
      deliverables: ['3-tier agentic document verification', 'Automated anti-fraud anomaly scoring', 'Instant KYC audit certificates'],
      validationMetric: 'Reduces manual compliance review overhead by 88%.'
    },
    {
      id: 'ai-q2-26',
      track: 'ai',
      phase: 'Phase 3: Autonomous',
      quarter: "Q1-Q2 '26",
      title: 'Spatio-Temporal World Models for Physical Robotics',
      category: 'Document Intelligence',
      status: 'target',
      progress: 15,
      description: 'Fusing real-time 3D spatial geometry with vision-language models to enable autonomous robotic navigation and predictive maintenance.',
      techStack: ['Spatial Action Transformers', 'ROS 2 Bridge', 'NVIDIA Isaac Sim', 'Edge TPU Quantization'],
      deliverables: ['Sim-to-real robotic policy transfer', 'Predictive machine failure forecasting', 'Unified Physical AI runtime'],
      validationMetric: 'Target: 99.999% autonomous factory floor safety clearance.'
    }
  ];

  const filteredMilestones = milestones.filter(m => {
    if (selectedTrack === 'all') return true;
    return m.track === selectedTrack || m.track === 'both';
  });

  const activeMilestone = milestones.find(m => m.id === activeMilestoneId) || milestones[2];

  const statusConfig = {
    completed: {
      label: 'SHIPPED / PRODUCTION',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/80 border-emerald-500/40',
      barColor: 'bg-emerald-400'
    },
    'in-progress': {
      label: 'ACTIVE DEVELOPMENT',
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-950/80 border-cyan-500/40',
      barColor: 'bg-cyan-400'
    },
    target: {
      label: 'TARGETED R&D MILESTONE',
      color: 'text-purple-400',
      badgeBg: 'bg-purple-950/80 border-purple-500/40',
      barColor: 'bg-purple-400'
    }
  };

  return (
    <section id="rd-roadmap" className="py-20 relative bg-[#05070B] border-t border-b border-slate-800/80 overflow-hidden">
      
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[400px] bg-cyan-600/10 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>TECHNOLOGY HORIZONS // 2024 – 2027 EXECUTION ROADMAP</span>
            </div>
            <CopyShareButton sectionId="rd-roadmap" sectionTitle="R&D Roadmap" variant="pill" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            R&D & Technology Maturation Gantt
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Systematic dual-track maturation converting bespoke high-margin spatial contracts and on-premise vision algorithms into scalable, multi-tenant IP SDKs.
          </p>
        </motion.div>

        {/* Track Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-lg bg-slate-900 border border-slate-800 backdrop-blur-md">
            <button
              onClick={() => setSelectedTrack('all')}
              className={`px-4 py-2 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedTrack === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>ALL TRACKS (10 MILESTONES)</span>
            </button>

            <button
              onClick={() => setSelectedTrack('spatial')}
              className={`px-4 py-2 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedTrack === 'spatial'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>SPATIAL SIMULATION TRACK</span>
            </button>

            <button
              onClick={() => setSelectedTrack('ai')}
              className={`px-4 py-2 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedTrack === 'ai'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>PHYSICAL AI & IDP TRACK</span>
            </button>
          </div>
        </div>

        {/* Horizontal Timeline Quarters Header Ribbon */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6 overflow-x-auto">
          <div className="min-w-[700px] flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>MATURATION PHASES:</span>
            </div>
            <div className="flex items-center gap-8">
              <span className="text-emerald-400 font-semibold">Q1-Q4 2024 (Foundation)</span>
              <span className="text-cyan-300 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Q1-Q4 2025 (Active Scale)
              </span>
              <span className="text-sky-300">Q1-Q4 2026 (Physical AI)</span>
              <span className="text-purple-300">2027+ (Autonomous)</span>
            </div>
          </div>

          {/* Interactive Gantt Milestone Rows */}
          <div className="min-w-[700px] pt-4 space-y-2.5">
            {filteredMilestones.map((m) => {
              const isSelected = activeMilestoneId === m.id;
              const cfg = statusConfig[m.status];
              const isSpatial = m.track === 'spatial';

              return (
                <div
                  key={m.id}
                  onClick={() => setActiveMilestoneId(m.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  {/* Left info */}
                  <div className="flex items-center gap-3 w-1/3 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${isSpatial ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                    <div>
                      <div className="text-xs font-bold font-heading text-white truncate">
                        {m.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {m.quarter} • {m.category}
                      </div>
                    </div>
                  </div>

                  {/* Center Gantt Progress Bar */}
                  <div className="flex-1 px-4">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
                      <span>{m.phase}</span>
                      <span className={cfg.color}>{m.progress}% Complete</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full ${cfg.barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Right Status Badge */}
                  <div className="w-36 text-right shrink-0">
                    <span className={`inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${cfg.badgeBg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deep Dive on Selected Milestone Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMilestone.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-7 rounded-xl bg-slate-900/70 border border-cyan-500/40 shadow-xl hud-corner"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Details (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg border ${activeMilestone.track === 'spatial' ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300' : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'}`}>
                    {activeMilestone.track === 'spatial' ? <Layers className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        {activeMilestone.quarter} // {activeMilestone.phase}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${statusConfig[activeMilestone.status].badgeBg} ${statusConfig[activeMilestone.status].color}`}>
                        {statusConfig[activeMilestone.status].label}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
                      {activeMilestone.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {activeMilestone.description}
                </p>

                {/* Key Deliverables Bullet Points */}
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                    CORE TECHNICAL DELIVERABLES:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeMilestone.deliverables.map((del, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[10px] font-mono text-slate-500 mr-1">TECH STACK:</span>
                  {activeMilestone.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right KPI Card (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 text-center space-y-3">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    TARGET VALIDATION METRIC
                  </div>
                  <div className="text-base sm:text-lg font-black font-heading text-white">
                    {activeMilestone.validationMetric}
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Execution Track:</span>
                    <span className="text-cyan-300 font-bold capitalize">{activeMilestone.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Engineering Readiness:</span>
                    <span className="text-emerald-400 font-bold">{activeMilestone.progress}% Complete</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
