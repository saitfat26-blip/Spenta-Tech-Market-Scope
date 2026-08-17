import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CopyShareButton } from './CopyShareButton';
import { 
  Glasses, 
  Cpu, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Building2, 
  MessageSquare, 
  Eye, 
  ShieldAlert, 
  ShieldCheck, 
  Box,
  ShoppingBag,
  Navigation,
  FileText,
  Scan,
  Brain,
  Bot,
  Mic,
  Radio,
  Zap,
  Network,
  Share2,
  Workflow,
  Terminal
} from 'lucide-react';

interface FloatingDataNode {
  id: string;
  label: string;
  sourceEngine: 'experience' | 'operations' | 'hybrid';
  bandwidth: string;
  latency: string;
  protocol: string;
  color: string;
  pulseDelay: number;
}

const FLOATING_DATA_NODES: FloatingDataNode[] = [
  {
    id: 'node-mesh',
    label: 'SPATIAL_MESH_STREAM // 90 FPS WebXR',
    sourceEngine: 'experience',
    bandwidth: '480 MB/s',
    latency: '11.1ms',
    protocol: 'DRACO / WebGPU',
    color: '#22d3ee',
    pulseDelay: 0
  },
  {
    id: 'node-primeocr',
    label: 'PRIMEDOC_VECTORS // LLaMA 3.2 Air-Gap',
    sourceEngine: 'operations',
    bandwidth: '120 MB/s',
    latency: '174ms',
    protocol: 'pgvector / HNSW',
    color: '#a855f7',
    pulseDelay: 0.8
  },
  {
    id: 'node-scada',
    label: 'SCADA_IIOT_TELEMETRY // MQTT 25k msg/s',
    sourceEngine: 'operations',
    bandwidth: '45 MB/s',
    latency: '2.4ms',
    protocol: 'Wasm / MQTT 5.0',
    color: '#34d399',
    pulseDelay: 1.6
  },
  {
    id: 'node-voice',
    label: 'VOICE_ERP_PARSER // Whisper Multi-Lang',
    sourceEngine: 'operations',
    bandwidth: '18 MB/s',
    latency: '320ms',
    protocol: 'WhatsApp Cloud Webhook',
    color: '#fbbf24',
    pulseDelay: 2.4
  },
  {
    id: 'node-twin',
    label: 'NANITE_DIGITAL_TWIN // UE5 Sub-mm',
    sourceEngine: 'experience',
    bandwidth: '850 MB/s',
    latency: '8.4ms',
    protocol: 'Pixel Streaming / OpenXR',
    color: '#38bdf8',
    pulseDelay: 1.2
  },
  {
    id: 'node-enclave',
    label: 'ZERO_EGRESS_ENCLAVE // TLS 1.3 mTLS',
    sourceEngine: 'hybrid',
    bandwidth: '2.4 GB/s',
    latency: '< 1ms',
    protocol: 'Hardware TPM 2.0',
    color: '#f43f5e',
    pulseDelay: 2.0
  }
];

const MouseParticles: React.FC<{ color: string }> = ({ color }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const particle = document.createElement('div');
    particle.className = 'absolute rounded-full pointer-events-none mix-blend-screen';
    particle.style.width = '3px';
    particle.style.height = '3px';
    particle.style.backgroundColor = color;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.boxShadow = `0 0 8px ${color}, 0 0 12px ${color}`;
    
    particle.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.9 },
      { transform: `translate(-50%, -50%) translate(${(Math.random()-0.5)*60}px, ${(Math.random()-0.5)*60}px) scale(0)`, opacity: 0 }
    ], {
      duration: 500 + Math.random() * 400,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }).onfinish = () => particle.remove();

    containerRef.current.appendChild(particle);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 z-0 overflow-hidden rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
    />
  );
};

export const DualEngineSection: React.FC = () => {
  const [selectedEngine, setSelectedEngine] = useState<'experience' | 'operations'>('experience');
  const [activeCapabilityIndex, setActiveCapabilityIndex] = useState<number>(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const experienceCapabilities = [
    {
      title: 'WebAR Spatial Commerce',
      tag: 'No-App In-Browser AR',
      client: 'ISHO Furniture (+28% Conversion Lift)',
      desc: 'Frictionless, app-less 3D AR product visualization enabling customers to place true-to-scale photorealistic 3D furniture into their physical spaces straight from Safari or Chrome.',
      stack: ['WebXR HTML5', 'Google ARCore', 'Apple ARKit', 'Three.js / WebGL'],
      margin: '40.0% Gross Margin',
      metric: '+28% Conversion / -22% Returns',
      icon: ShoppingBag,
      color: '#22d3ee'
    },
    {
      title: 'Facility Digital Twins & Indoor Wayfinding',
      tag: 'Photogrammetry & UE5',
      client: 'Apollo JMI Hospital & Cultural Heritage',
      desc: 'Sub-meter accurate 3D spatial mapping and Unreal Engine 5 Nanite/Lumen digital twins paired with BLE indoor beacons to eliminate navigation bottlenecks and enable remote virtual inspections.',
      stack: ['Unreal Engine 5', 'Nanite & Lumen', 'BLE Beacons', 'EdgeX Foundry'],
      margin: '44.0% Gross Margin',
      metric: '-40% Patient Intake Delays',
      icon: Navigation,
      color: '#38bdf8'
    },
    {
      title: 'Certified Procedural VR Training Simulations',
      tag: '6-DoF Multi-User VR',
      client: 'Samsung Biologics Cleanroom & LABAID VirtuED',
      desc: 'Certified procedural VR cleanroom operator training and interactive 3D human anatomy surgical dissection simulations replacing costly sterile consumables and physical cadaver labs.',
      stack: ['Unity 3D', 'Meta Horizon OS SDK', 'OpenXR', 'Photon Fusion'],
      margin: '45.0% Gross Margin',
      metric: '70% Cost Cut / Zero Incidents',
      icon: ShieldCheck,
      color: '#818cf8'
    },
    {
      title: '3D DOOH & Attraction Games',
      tag: 'Anamorphic Billboards & Kiosks',
      client: 'Coca-Cola, Adidas & Suzuki',
      desc: 'Corner-billboard anamorphic 3D perspective illusions and camera-tracked gesture floor games commanding viral social reach and 3.5x dwell time over conventional 2D billboards.',
      stack: ['UE5 Cinematics', 'OpenCV Tracking', 'Maya / Blender', 'Octane / Redshift'],
      margin: '45.0% Gross Margin',
      metric: '+350% Engagement / 5.2M Social Views',
      icon: Sparkles,
      color: '#c084fc'
    }
  ];

  const operationsCapabilities = [
    {
      title: 'PrimeOCR Document Intelligence & IDP',
      tag: 'On-Premise Hybrid Vision AI',
      client: 'Prime Bank (Banking KYC & BankDoc)',
      desc: 'Self-hosted multimodal neural pipeline combining LLaMA 3.2 Vision, LayoutLM v3, and heuristic OCR to automate complex banking account opening and handwritten KYC forms with human-in-the-loop validation.',
      stack: ['LLaMA 3.2 Vision', 'LayoutLM v3', 'pgvector', 'Docker / K8s'],
      margin: '45.0% Gross Margin',
      metric: '17.5m → <30s (-97%) / 450% ROI',
      icon: Scan,
      color: '#34d399'
    },
    {
      title: '8 Omni-Vertical AI Reasoning Assistants',
      tag: 'Domain RAG Systems',
      client: 'Banking, Healthcare, Logistics & Legal',
      desc: 'Specialized conversational agents running on private vector databases (pgvector) to query millions of internal policies, medical protocols, and legal contracts without data egress to public cloud providers.',
      stack: ['Self-Hosted LLMs', 'pgvector', 'FastAPI', 'MinIO Object Storage'],
      margin: '42.0% Gross Margin',
      metric: '90% Manual Workload Reduction',
      icon: Brain,
      color: '#10b981'
    },
    {
      title: 'WhatsApp-Native Voice ERP for SMEs',
      tag: 'Hands-Free Multimodal Audio',
      client: 'Mid-Sized Manufacturing & Distributors',
      desc: 'Multilingual conversational voice interface via WhatsApp Business API allowing warehouse managers and sales reps to query inventory, issue invoices, and update CRM records without touching a keyboard.',
      stack: ['WhatsApp Cloud API', 'Whisper ASR', 'FastAPI', 'PostgreSQL / Kafka'],
      margin: '42.0% Gross Margin',
      metric: '60% Faster Monthly Reporting',
      icon: MessageSquare,
      color: '#fbbf24'
    },
    {
      title: 'Predictive Edge Maintenance & SCADA',
      tag: 'IoT Anomaly Forecasting',
      client: 'Industrial Equipment & Fleet Fleets',
      desc: 'Time-series SCADA sensor anomaly forecasting running quantized neural inference on edge micro-controllers to predict machine component failures before unplanned manufacturing halts occur.',
      stack: ['EdgeX Foundry', 'MQTT Pub/Sub', 'WebAssembly (Wasm)', 'ONNX Runtime'],
      margin: '38.0% Gross Margin',
      metric: '-38% Machine Downtime',
      icon: Activity,
      color: '#f59e0b'
    }
  ];

  const currentList = selectedEngine === 'experience' ? experienceCapabilities : operationsCapabilities;
  const activeCap = currentList[activeCapabilityIndex] || currentList[0];
  const ActiveIcon = activeCap.icon;

  // Stagger variants for sequential icon popping on scroll
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const iconPopVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: 'spring', 
        stiffness: 320, 
        damping: 18 
      } 
    }
  };

  return (
    <section id="dual-engines" className="py-20 relative bg-[#070A10] border-t border-b border-slate-800/80 overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs font-mono text-indigo-300">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>SYNERGISTIC COMMERCIAL PORTFOLIOS</span>
            </div>
            <CopyShareButton sectionId="dual-engines" sectionTitle="Dual Commercial Engines" variant="pill" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            The Dual-Engine Advantage
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Unlike point-solution vendors or generic agencies, Spenta deploys two mutually reinforcing commercial engines that capture both consumer engagement and back-office enterprise workflows.
          </p>
        </motion.div>

        {/* Floating Data Flow Nodes Conduit (High-Tech Inter-Engine Visualization) */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Subtle SVG Track Beam Background */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 120">
              <path 
                d="M 50 60 Q 250 15, 500 60 T 950 60" 
                fill="none" 
                stroke="url(#dataLineGradient)" 
                strokeWidth="2" 
                className="animate-data-flow" 
              />
              <path 
                d="M 50 60 Q 250 105, 500 60 T 950 60" 
                fill="none" 
                stroke="url(#dataLineGradient2)" 
                strokeWidth="1.5" 
                className="animate-data-flow" 
                style={{ animationDirection: 'reverse' }}
              />
              <defs>
                <linearGradient id="dataLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="dataLineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#ec4899" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                Live Bi-Directional Data Loop // Telemetry Conduit
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">● 100% Zero-Egress Air-Gapped</span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="hidden sm:inline">Aggregate Pipeline: <strong className="text-slate-200">3.8 GB/s</strong></span>
            </div>
          </div>

          {/* Floating Semi-Transparent Data Nodes Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 relative z-10">
            {FLOATING_DATA_NODES.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <motion.div
                  key={node.id}
                  animate={{
                    y: [-4, 4, -4],
                    scale: [0.99, 1.01, 0.99]
                  }}
                  transition={{
                    duration: 3.8 + node.pulseDelay,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: node.pulseDelay
                  }}
                  onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-md relative overflow-hidden group ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 0 20px ${node.color}30` : undefined
                  }}
                >
                  {/* Floating Top Label with Pulsing Glow Dot */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <motion.span 
                        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: node.pulseDelay }}
                        className="w-1.5 h-1.5 rounded-full shrink-0" 
                        style={{ backgroundColor: node.color }} 
                      />
                      <span className="text-[10px] font-mono font-bold text-slate-200 truncate group-hover:text-white transition-colors">
                        {node.label}
                      </span>
                    </div>

                    <span 
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold shrink-0"
                      style={{ 
                        backgroundColor: `${node.color}18`, 
                        color: node.color,
                        border: `1px solid ${node.color}40`
                      }}
                    >
                      {node.sourceEngine === 'experience' ? 'XR Core' : node.sourceEngine === 'operations' ? 'AI Core' : 'Bridge'}
                    </span>
                  </div>

                  {/* Telemetry metrics bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                    <span className="flex items-center gap-1 text-slate-300">
                      <span>Rate:</span>
                      <strong className="text-white">{node.bandwidth}</strong>
                    </span>
                    <span className="text-slate-400">
                      Lat: <strong className="text-cyan-300">{node.latency}</strong>
                    </span>
                    <span className="text-slate-500 hidden sm:inline truncate max-w-[90px]">
                      {node.protocol}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Engine Switcher Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
            <button
              onClick={() => {
                setSelectedEngine('experience');
                setActiveCapabilityIndex(0);
              }}
              id="engine-tab-experience"
              className={`px-6 py-3 rounded-xl font-heading font-semibold text-sm sm:text-base transition-all flex items-center gap-2.5 cursor-pointer ${
                selectedEngine === 'experience'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Glasses className="w-4 h-4" />
              <span>The Experience Engine (Spatial XR)</span>
            </button>

            <button
              onClick={() => {
                setSelectedEngine('operations');
                setActiveCapabilityIndex(0);
              }}
              id="engine-tab-operations"
              className={`px-6 py-3 rounded-xl font-heading font-semibold text-sm sm:text-base transition-all flex items-center gap-2.5 cursor-pointer ${
                selectedEngine === 'operations'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>The Operations Engine (Physical AI)</span>
            </button>
          </div>
        </div>

        {/* Interactive 2-Column Split: Capability List & Deep-Dive Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          
          {/* Left Column: 4 Capability Cards with 3D Perspective Tilt and Staggered Icon Entrance (5 cols) */}
          <motion.div 
            variants={listContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5"
          >
            {currentList.map((item, idx) => {
              const isSelected = activeCapabilityIndex === idx;
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.title}
                  onClick={() => setActiveCapabilityIndex(idx)}
                  className={`service-card-3d p-4 rounded-xl cursor-pointer transition-all border group relative ${
                    isSelected
                      ? selectedEngine === 'experience'
                        ? 'border-cyan-400/90 shadow-lg shadow-cyan-500/20 bg-slate-900/95 ring-1 ring-cyan-400/40'
                        : 'border-emerald-400/90 shadow-lg shadow-emerald-500/20 bg-slate-900/95 ring-1 ring-emerald-400/40'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/80'
                  }`}
                >
                  <MouseParticles color={item.color} />
                  
                  {/* Interactive Executive Tooltip on Hover */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-11/12 max-w-[280px] bg-slate-800/95 backdrop-blur-xl border border-slate-700 p-2.5 rounded-lg shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none transform -translate-y-2 group-hover:translate-y-0">
                    <div className="text-[9px] font-mono font-bold text-slate-400 mb-1 uppercase tracking-wider">Dual-Engine Impact</div>
                    <div className="text-[10px] text-slate-200 leading-snug line-clamp-2">{item.desc}</div>
                    {/* Tooltip Arrow */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800/95 border-b border-r border-slate-700 rotate-45" />
                  </div>

                  <div className="flex items-start gap-3.5 relative z-10">
                    {/* Staggered Entrance Service Icon with Spring Animation */}
                    <motion.div 
                      variants={iconPopVariants}
                      className="p-2.5 rounded-xl border shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundColor: `${item.color}15`, 
                        borderColor: `${item.color}40`,
                        color: item.color 
                      }}
                    >
                      <ItemIcon className="w-5 h-5" />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 font-medium truncate">
                          {item.tag}
                        </span>
                        
                        {isSelected ? (
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/80 border font-bold flex items-center gap-1 shrink-0 ${selectedEngine === 'experience' ? 'text-cyan-400 border-cyan-500/50' : 'text-emerald-400 border-emerald-500/50'}`}>
                            <Activity className="w-3 h-3" />
                            DEEP DIVE
                          </span>
                        ) : (
                          <span className={`text-[11px] font-mono font-bold shrink-0 ${selectedEngine === 'experience' ? 'text-cyan-500/80' : 'text-emerald-500/80'}`}>
                            {item.margin}
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-[15px] sm:text-base text-white leading-tight mb-0.5">{item.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.client}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Right Column: Deep-Dive Card (7 cols) with 3D Hover & AnimatePresence */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${selectedEngine}-${activeCapabilityIndex}`}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`service-card-3d h-full p-6 sm:p-8 rounded-2xl border flex flex-col justify-between ${
                  selectedEngine === 'experience' ? 'bg-slate-900/90 border-cyan-500/40 shadow-2xl shadow-cyan-950/40' : 'bg-slate-900/90 border-emerald-500/40 shadow-2xl shadow-emerald-950/40'
                }`}
              >
                <div className="space-y-6">
                  
                  {/* Header info */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="p-2 rounded-lg border shrink-0"
                          style={{ 
                            backgroundColor: `${activeCap.color}20`, 
                            borderColor: `${activeCap.color}50`,
                            color: activeCap.color 
                          }}
                        >
                          <ActiveIcon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold ${
                          selectedEngine === 'experience' 
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {activeCap.tag}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Verified Commercial Deployment</span>
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                      {activeCap.title}
                    </h3>

                    <div className={`text-sm font-semibold flex items-center gap-2 ${
                      selectedEngine === 'experience' ? 'text-cyan-300' : 'text-emerald-300'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{activeCap.client}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {activeCap.desc}
                  </p>

                  {/* Highlight Metric Tile with High-Tech Styling */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-slate-400">Audited Impact Result</div>
                      <div className="text-xl font-bold font-mono text-white mt-0.5">{activeCap.metric}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-slate-400">Target Unit Gross Margin</div>
                      <div className={`text-lg font-bold font-mono ${
                        selectedEngine === 'experience' ? 'text-cyan-400' : 'text-emerald-400'
                      }`}>
                        {activeCap.margin}
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div>
                    <div className="text-xs font-mono text-slate-400 mb-2">Integrated Technology Toolchain</div>
                    <div className="flex flex-wrap gap-2">
                      {activeCap.stack.map(tech => (
                        <span key={tech} className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeCap.color }} />
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer Commercial Cross-Sell Synergy */}
                <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Engine Cross-Sell Ratio:</span>
                  </span>
                  <span className="text-cyan-300 font-bold">1 Experience Deal → 1.8 Operations Deals</span>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
