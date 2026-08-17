import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FUSION_LAYERS } from '../data/mockData';
import { FusionLayer } from '../types';
import { CopyShareButton } from './CopyShareButton';
import { 
  Layers, 
  Database, 
  Cpu, 
  Zap, 
  Glasses, 
  Layout, 
  ShieldCheck, 
  ArrowUpRight, 
  Terminal, 
  Sparkles,
  Lock,
  Activity,
  Gauge,
  Wifi,
  Server,
  Info,
  Code2,
  FileCode,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Box,
  HardDrive
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Layout,
  Database,
  Layers,
  Cpu,
  Zap,
  Glasses
};

export const FusionStackSection: React.FC = () => {
  const [selectedLayerLevel, setSelectedLayerLevel] = useState<number>(3);
  const [hoveredLayerLevel, setHoveredLayerLevel] = useState<number | null>(null);
  const [expandedDocLevel, setExpandedDocLevel] = useState<number | null>(3);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'architecture' | 'endpoints' | 'sdk' | 'compliance'>('endpoints');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const selectedLayer = FUSION_LAYERS.find(l => l.level === selectedLayerLevel) || FUSION_LAYERS[0];
  const IconComponent = iconMap[selectedLayer.iconName] || Layers;

  const handleCopyCode = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(identifier);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const toggleDocExpand = (level: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandedDocLevel === level) {
      setExpandedDocLevel(null);
    } else {
      setExpandedDocLevel(level);
      setSelectedLayerLevel(level);
    }
  };

  return (
    <section id="fusion-stack" className="py-20 relative bg-[#05070B] overflow-hidden scroll-mt-16">
      
      {/* Subtle Background Grid & Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-indigo-600/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Motion Entrance */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>TECHNICAL BLUEPRINT // THE 6-LAYER FUSION ARCHITECTURE</span>
            </div>
            <CopyShareButton sectionId="fusion-stack" sectionTitle="6-Layer Fusion Stack" variant="pill" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            Composable Stack: Sensing to Enterprise Action
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            A modular, API-first software stack designed for incremental enterprise adoption. Click any layer node below to inspect live API schemas, payload contracts, and SDK code examples.
          </p>
        </motion.div>

        {/* Interactive Stack Grid: 6 Vertical Layers + Detailed Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 6 Stack Blocks with Expandable Interactive Tech Doc Nodes (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 space-y-3"
          >
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between px-1 mb-2">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                HIGHER ABSTRACTION (APPLICATION LAYER)
              </span>
              <span>L6 → L1</span>
            </div>

            <div className="space-y-3 relative">
              {FUSION_LAYERS.map((layer) => {
                const isSelected = selectedLayerLevel === layer.level;
                const isDocExpanded = expandedDocLevel === layer.level;
                const LayerIcon = iconMap[layer.iconName] || Layers;
                const fillPct = `${(layer.level / 6) * 100}%`;

                return (
                  <div
                    key={layer.id}
                    onClick={() => {
                      setSelectedLayerLevel(layer.level);
                    }}
                    className={`service-card-3d p-4 rounded-xl cursor-pointer transition-all border flex flex-col gap-3 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-slate-900/95 border-cyan-400 shadow-xl shadow-cyan-500/15 ring-1 ring-cyan-400/40'
                        : 'bg-slate-950/80 border-slate-800/90 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg border shrink-0 transition-transform group-hover:scale-105"
                        style={{ 
                          color: layer.color, 
                          backgroundColor: `${layer.color}15`,
                          borderColor: `${layer.color}40`
                        }}
                      >
                        <LayerIcon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          {/* Interactive Layer Label Node */}
                          <button
                            type="button"
                            onClick={(e) => toggleDocExpand(layer.level, e)}
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-all cursor-pointer"
                            style={{ 
                              backgroundColor: isSelected ? `${layer.color}25` : 'rgba(30, 41, 59, 0.8)',
                              color: layer.color,
                              border: `1px solid ${layer.color}50`
                            }}
                            title="Click to expand technical documentation"
                          >
                            <Code2 className="w-3 h-3" />
                            <span>LAYER 0{layer.level} NODE</span>
                            {isDocExpanded ? (
                              <ChevronUp className="w-3 h-3 ml-0.5" />
                            ) : (
                              <ChevronDown className="w-3 h-3 ml-0.5" />
                            )}
                          </button>

                          <div className="flex items-center gap-1.5">
                            {layer.specs && (
                              <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 hidden sm:inline">
                                {layer.specs.latency}
                              </span>
                            )}
                            {isSelected && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                                ACTIVE
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="font-heading font-bold text-sm text-white truncate">
                          {layer.title.replace(' Contracts', '')}
                        </div>
                      </div>

                      <ArrowUpRight className={`w-4 h-4 transition-transform shrink-0 ${isSelected ? 'text-cyan-400 rotate-45' : 'text-slate-600 group-hover:text-slate-400'}`} />
                    </div>

                    {/* Micro Progress Bar */}
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: fillPct, 
                          backgroundColor: isSelected ? layer.color : 'rgba(100, 116, 139, 0.4)' 
                        }} 
                      />
                    </div>

                    {/* Expandable Technical Documentation Accordion Drawer */}
                    <AnimatePresence>
                      {isDocExpanded && layer.techDocs && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="pt-2 border-t border-slate-800/80 space-y-2.5 overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-[11px] text-slate-300 leading-relaxed font-sans bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/60">
                            {layer.techDocs.overview}
                          </div>

                          {/* Quick Spec Tags */}
                          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                            <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                              <span className="text-slate-500 block text-[8px] uppercase">Memory / Buffer</span>
                              <span className="text-cyan-300 font-semibold truncate block">{layer.techDocs.memoryAllocation}</span>
                            </div>
                            <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                              <span className="text-slate-500 block text-[8px] uppercase">Primary Endpoint</span>
                              <span className="text-emerald-300 font-semibold truncate block">
                                {layer.techDocs.endpoints[0]?.method} {layer.techDocs.endpoints[0]?.path}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-cyan-400" />
                              Technical Doc Active
                            </span>
                            <button
                              onClick={() => {
                                setSelectedLayerLevel(layer.level);
                                setActiveInspectorTab('endpoints');
                              }}
                              className="text-[10px] font-mono text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>Inspect Full API Schema</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="text-xs font-mono text-slate-400 flex items-center justify-between px-1 pt-1">
              <span className="flex items-center gap-1.5">
                <Glasses className="w-3.5 h-3.5 text-rose-400" />
                PHYSICAL SENSING (HARDWARE TELEMETRY)
              </span>
              <span>L1 FOUNDATION</span>
            </div>
          </motion.div>

          {/* Right Column: Interactive Deep-Dive Technical Documentation Inspector (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="service-card-3d bg-slate-900/80 border border-slate-800 p-6 sm:p-7 rounded-2xl shadow-2xl relative">
              
              {/* Top Banner with Layer Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2.5 rounded-xl border border-slate-700/80 shadow-md"
                    style={{ 
                      color: selectedLayer.color, 
                      backgroundColor: `${selectedLayer.color}20`,
                      borderColor: `${selectedLayer.color}50`
                    }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider uppercase">
                        FUSION CONTRACT SPECIFICATION // LAYER 0{selectedLayer.level}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedLayer.color }} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading">
                      {selectedLayer.title}
                    </h3>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  Status: <span className="text-emerald-400 font-semibold">Active in Production</span>
                </div>
              </div>

              {/* Inspector Documentation Tabs */}
              <div className="flex items-center gap-1.5 pt-4 pb-2 border-b border-slate-800/80 overflow-x-auto">
                <button
                  onClick={() => setActiveInspectorTab('endpoints')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    activeInspectorTab === 'endpoints'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>API Endpoints & Schemas</span>
                </button>

                <button
                  onClick={() => setActiveInspectorTab('sdk')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    activeInspectorTab === 'sdk'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>SDK Implementation</span>
                </button>

                <button
                  onClick={() => setActiveInspectorTab('architecture')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    activeInspectorTab === 'architecture'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Architecture & Telemetry</span>
                </button>

                <button
                  onClick={() => setActiveInspectorTab('compliance')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    activeInspectorTab === 'compliance'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Security & Compliance</span>
                </button>
              </div>

              {/* Tab Content Panel with AnimatePresence */}
              <div className="py-4">
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: API Endpoints & Schemas */}
                  {activeInspectorTab === 'endpoints' && (
                    <motion.div
                      key="tab-endpoints"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <div className="text-xs text-slate-300">
                        {selectedLayer.techDocs?.overview || selectedLayer.subtitle}
                      </div>

                      <div className="space-y-3">
                        <div className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center justify-between">
                          <span>Verified Contract Endpoints</span>
                          <span className="text-cyan-400 text-[10px]">Zero Redundant Infrastructure</span>
                        </div>

                        {selectedLayer.techDocs?.endpoints.map((ep, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                  ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                                  ep.method === 'GET' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                                  ep.method === 'WS' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                                  ep.method === 'gRPC' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                                  'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                }`}>
                                  {ep.method}
                                </span>
                                <code className="text-xs font-mono text-slate-200 font-semibold">{ep.path}</code>
                              </div>

                              <button
                                onClick={() => handleCopyCode(ep.samplePayload, `payload-${idx}`)}
                                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[10px] font-mono text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                {copiedPath === `payload-${idx}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy JSON Payload</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <p className="text-xs text-slate-400">{ep.description}</p>

                            <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/80 overflow-x-auto">
                              <pre className="text-[11px] font-mono text-cyan-200/90 leading-tight">
                                {ep.samplePayload}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: SDK Implementation Code Snippet */}
                  {activeInspectorTab === 'sdk' && (
                    <motion.div
                      key="tab-sdk"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-purple-300 font-bold uppercase">
                            {selectedLayer.techDocs?.sampleCodeSnippet.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 uppercase">
                            {selectedLayer.techDocs?.sampleCodeSnippet.language}
                          </span>
                        </div>

                        <button
                          onClick={() => selectedLayer.techDocs && handleCopyCode(selectedLayer.techDocs.sampleCodeSnippet.code, 'sdk-snippet')}
                          className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {copiedPath === 'sdk-snippet' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied SDK Code</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto relative">
                        <pre className="text-xs font-mono text-slate-200 leading-relaxed">
                          {selectedLayer.techDocs?.sampleCodeSnippet.code}
                        </pre>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Supported Client Environments:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedLayer.techDocs?.supportedRuntimes.map(rt => (
                            <span key={rt} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                              {rt}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: Architecture & Telemetry */}
                  {activeInspectorTab === 'architecture' && (
                    <motion.div
                      key="tab-architecture"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-1">Architectural Role & Scope</h4>
                        <p className="text-slate-200 text-sm leading-relaxed">
                          {selectedLayer.subtitle}
                        </p>
                      </div>

                      {/* Performance & Telemetry Panel */}
                      {selectedLayer.specs && (
                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5" />
                              RUNTIME TELEMETRY BENCHMARKS
                            </span>
                            <span>SOC 2 Type II Verified</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <div className="text-[9px] text-slate-500 uppercase">Target Latency</div>
                              <div className="text-cyan-300 font-bold mt-0.5">{selectedLayer.specs.latency}</div>
                            </div>
                            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <div className="text-[9px] text-slate-500 uppercase">Cluster Throughput</div>
                              <div className="text-emerald-300 font-bold mt-0.5">{selectedLayer.specs.throughput}</div>
                            </div>
                            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <div className="text-[9px] text-slate-500 uppercase">Network Protocol</div>
                              <div className="text-slate-200 font-bold mt-0.5">{selectedLayer.specs.protocol}</div>
                            </div>
                            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <div className="text-[9px] text-slate-500 uppercase">Guaranteed Uptime</div>
                              <div className="text-purple-300 font-bold mt-0.5">{selectedLayer.specs.uptimeSLA}</div>
                            </div>
                            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <div className="text-[9px] text-slate-500 uppercase">Encryption Standard</div>
                              <div className="text-amber-300 font-bold mt-0.5">{selectedLayer.specs.encryption}</div>
                            </div>
                            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <div className="text-[9px] text-slate-500 uppercase">Error Tolerance</div>
                              <div className="text-rose-300 font-bold mt-0.5">{selectedLayer.specs.errorTolerance}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tech Stack Modules */}
                      <div>
                        <h4 className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-2">Engine & Toolchain Stack</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedLayer.techStack.map(tech => (
                            <div 
                              key={tech}
                              className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedLayer.color }} />
                              <span>{tech}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: Security & Compliance */}
                  {activeInspectorTab === 'compliance' && (
                    <motion.div
                      key="tab-compliance"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {/* Security & Governance Box */}
                      <div className="p-3.5 rounded-lg bg-indigo-950/25 border border-indigo-500/30 space-y-1.5">
                        <div className="text-xs font-mono text-indigo-300 font-semibold flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-indigo-400" />
                          <span>AIR-GAPPED ZERO-EGRESS GUARANTEE</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {selectedLayer.securityGovernance}
                        </p>
                      </div>

                      {/* Compliance Mapping Badges */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Regulatory Compliance & Standards Mapping</h4>
                        <div className="space-y-1.5">
                          {selectedLayer.techDocs?.complianceMapping.map((comp, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs font-mono text-emerald-300">
                              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>{comp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Enterprise Impact */}
                      <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                        <div className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>ENTERPRISE DELIVERED IMPACT</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {selectedLayer.enterpriseImpact}
                        </p>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Bottom Layer Contract Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Contract Type: <strong className="text-white">API-First Composable</strong></span>
                <span className="text-cyan-400">Zero Redundant Infrastructure</span>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
