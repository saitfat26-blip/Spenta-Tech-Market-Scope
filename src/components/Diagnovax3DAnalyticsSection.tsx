import React, { Component, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Box,
  Layers,
  TrendingUp,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Eye,
  Expand,
  Minimize2,
  AlertTriangle,
} from 'lucide-react';
import { Currency } from '../types';
import { FINANCIAL_TIERS, FUSION_LAYERS } from '../data/mockData';
import { FinancialScenario } from './UnitEconomicsSection';
import { CopyShareButton } from './CopyShareButton';
import {
  Diagnovax3DCanvas,
  DiagnovaxChartMode,
  CameraPreset,
  MatrixMetric,
  SelectedTelemetryItem,
  QUARTER_TRAJECTORY_DATA,
  formatDiagnovaxMoney,
} from './three/Diagnovax3DCharts';

interface Diagnovax3DAnalyticsSectionProps {
  currency: Currency;
  scenario: FinancialScenario;
  onScenarioChange?: (scenario: FinancialScenario) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<{ children: React.ReactNode; fallback: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const Diagnovax3DAnalyticsSection: React.FC<Diagnovax3DAnalyticsSectionProps> = ({
  currency,
  scenario,
  onScenarioChange,
}) => {
  const [mode, setMode] = useState<DiagnovaxChartMode>('matrix');
  const [localScenario, setLocalScenario] = useState<FinancialScenario>(scenario);
  const [matrixMetric, setMatrixMetric] = useState<MatrixMetric>('revenue');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('isometric');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [explodedStack, setExplodedStack] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [webglLost, setWebglLost] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SelectedTelemetryItem | null>(null);
  const [hoverCallout, setHoverCallout] = useState<{ label: string; value: string } | null>(null);
  const calloutDomRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLocalScenario(scenario);
  }, [scenario]);

  // Keep a meaningful default telemetry readout whenever mode/currency/scenario switches
  useEffect(() => {
    if (mode === 'matrix') {
      const tier = FINANCIAL_TIERS[7]; // Model C2 Enterprise Tier 2
      const mult = localScenario === 'aggressive' ? 1.15 : 1.0;
      const rev = tier.baselineUsd * mult;
      const gross = rev * (tier.grossMarginPercent / 100);
      const net = rev * (tier.netMarginPercent / 100);
      setSelectedItem({
        id: tier.id,
        category: `Model ${tier.category} · ${tier.deliveryTimeline}`,
        title: `${tier.code}: ${tier.name}`,
        subtitle: tier.scopeSummary,
        primaryLabel: 'Scenario Revenue',
        primaryValue: formatDiagnovaxMoney(rev, currency),
        secondaryLabel: 'Gross Margin',
        secondaryValue: `${tier.grossMarginPercent.toFixed(1)}% (${formatDiagnovaxMoney(gross, currency)})`,
        tertiaryLabel: 'Net Margin',
        tertiaryValue: `${tier.netMarginPercent.toFixed(1)}% (${formatDiagnovaxMoney(net, currency)})`,
        accentColor: '#34d399',
      });
    } else if (mode === 'trajectory') {
      const q12 = QUARTER_TRAJECTORY_DATA[11];
      const mult = localScenario === 'aggressive' ? 1.24 : localScenario === 'conservative' ? 0.78 : 1.0;
      setSelectedItem({
        id: q12.id,
        category: `12-Quarter Projection · ${localScenario.toUpperCase()}`,
        title: `${q12.label} Commercial Trajectory`,
        subtitle: `Dual-engine enterprise & WebXR deployment velocity across ${Math.round(q12.clients * mult)} active enterprise accounts.`,
        primaryLabel: 'Projected ARR',
        primaryValue: formatDiagnovaxMoney(q12.arrUsd * mult * 1_000_000, currency),
        secondaryLabel: 'Gross Profit Run-Rate',
        secondaryValue: formatDiagnovaxMoney(q12.grossUsd * mult * 1_000_000, currency),
        tertiaryLabel: 'Active Clients / Net Margin',
        tertiaryValue: `${Math.round(q12.clients * mult)} Accounts · ${q12.netMargin.toFixed(1)}%`,
        accentColor: '#22d3ee',
      });
    } else {
      const layer = FUSION_LAYERS.find((l) => l.level === 4) || FUSION_LAYERS[0];
      setSelectedItem({
        id: layer.id,
        category: `Layer 0${layer.level} · ${layer.specs?.protocol || 'Fusion Contract'}`,
        title: layer.title,
        subtitle: layer.subtitle,
        primaryLabel: 'Target Latency',
        primaryValue: layer.specs?.latency || '< 11.1ms',
        secondaryLabel: 'Throughput',
        secondaryValue: layer.specs?.throughput || '1.2B polys',
        tertiaryLabel: 'Reliability SLA',
        tertiaryValue: layer.specs?.uptimeSLA || '99.95%',
        accentColor: layer.color,
      });
    }
  }, [mode, localScenario, currency]);

  const handleScenarioUpdate = (next: FinancialScenario) => {
    setLocalScenario(next);
    onScenarioChange?.(next);
  };

  const fallbackView = (
    <div className="w-full h-full bg-[#060B15] flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="w-8 h-8 text-cyan-400 mb-3" />
      <h3 className="text-base font-semibold text-white mb-1">Interactive 3D Viewport Unavailable</h3>
      <p className="text-xs text-slate-400 max-w-md mb-5">
        WebGL rendering context could not be initialized on this device. Review the synchronized diagnostic summary below or reload to re-enable 3D spatial exploration.
      </p>
      <button
        onClick={() => setWebglLost(false)}
        className="px-4 py-2 text-xs font-mono font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer"
      >
        Retry 3D Viewport
      </button>
    </div>
  );

  return (
    <section
      id="spatial-analytics-3d"
      className="py-20 relative bg-[#050810] border-t border-b border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Editorial Section Header (Zero-Pill Discipline) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>Diagnovax Spatial Telemetry</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">React Three Fiber</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">360° Interactive WebGL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight [text-wrap:balance]">
              Interactive 3D Financial & Architecture Observatory
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Orbit, zoom, and click any calibrated diagnostic pillar, quarterly trajectory node, or Fusion Stack layer to inspect Spenta&apos;s multi-dimensional unit economics and technical telemetry in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <CopyShareButton sectionId="spatial-analytics-3d" sectionTitle="3D Spatial Observatory" variant="pill" />
          </div>
        </div>

        {/* Unobstructed Full-Width 3D Viewport Container */}
        <div className="relative w-full h-[520px] lg:h-[600px] rounded-xl overflow-hidden border border-slate-800 bg-[#050912]">
          {/* Minimal Top-Left Viewport Title Spec (Solid surface, no backdrop-blur over WebGL) */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#060B14]/92 border border-slate-800 text-xs font-mono text-slate-300">
            <Box className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-white font-semibold">
              {mode === 'matrix' && '9-Tier Margin Matrix'}
              {mode === 'trajectory' && '12-Quarter ARR Trajectory'}
              {mode === 'stack' && '6-Layer Fusion Core'}
            </span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-slate-400 hidden sm:inline">Drag to orbit · Scroll to zoom · Click nodes</span>
          </div>

          {/* Projected 3D-to-2D Floating Callout Overlay (Zero nested React roots) */}
          <div
            ref={calloutDomRef}
            className="absolute top-0 left-0 z-10 pointer-events-none transition-opacity duration-150"
            style={{ opacity: 0, willChange: 'transform, opacity' }}
          >
            {hoverCallout && (
              <div className="px-2.5 py-1.5 rounded-md bg-[#050A14] border border-cyan-500/60 shadow-lg whitespace-nowrap text-center">
                <div className="text-[10px] font-mono text-cyan-400 tracking-wide">{hoverCallout.label}</div>
                <div className="text-xs font-mono font-bold text-white tabular-nums">{hoverCallout.value}</div>
              </div>
            )}
          </div>

          {/* Isolated WebGL Canvas Mount */}
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            {webglLost ? (
              fallbackView
            ) : (
              <CanvasErrorBoundary fallback={fallbackView}>
                <Diagnovax3DCanvas
                  mode={mode}
                  scenario={localScenario}
                  matrixMetric={matrixMetric}
                  currency={currency}
                  cameraPreset={cameraPreset}
                  autoRotate={autoRotate}
                  explodedStack={explodedStack}
                  selectedId={selectedItem?.id || null}
                  calloutDomRef={calloutDomRef}
                  onHoverCalloutChange={setHoverCallout}
                  onSelect={(item) => setSelectedItem(item)}
                  onContextLost={() => setWebglLost(true)}
                />
              </CanvasErrorBoundary>
            )}
          </div>

          {/* Unified Collapsible Bottom Control Dock (Zero Side-Panel Occlusion, No backdrop-blur) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[920px] flex flex-col items-center pointer-events-none">
            <button
              onClick={() => setIsDockCollapsed(!isDockCollapsed)}
              className="pointer-events-auto mb-1.5 px-3 py-1 rounded-md bg-[#060B14]/95 border border-slate-800 hover:border-cyan-500/50 text-[11px] font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{isDockCollapsed ? 'Show Controls' : 'Hide Controls'}</span>
            </button>

            <AnimatePresence initial={false}>
              {!isDockCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-auto w-full bg-[#060B14]/95 border border-slate-800 rounded-xl px-3 py-2.5 flex flex-wrap items-center justify-between gap-2.5 shadow-2xl"
                >
                  {/* Chart Mode Switcher */}
                  <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setMode('matrix')}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        mode === 'matrix'
                          ? 'bg-cyan-500 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>9-Tier Matrix</span>
                    </button>
                    <button
                      onClick={() => setMode('trajectory')}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        mode === 'trajectory'
                          ? 'bg-cyan-500 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>12Q Trajectory</span>
                    </button>
                    <button
                      onClick={() => setMode('stack')}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        mode === 'stack'
                          ? 'bg-cyan-500 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Fusion Core</span>
                    </button>
                  </div>

                  {/* Mode-Specific Controls */}
                  {mode === 'matrix' && (
                    <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
                      {(['revenue', 'gross', 'net'] as MatrixMetric[]).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMatrixMetric(m)}
                          className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            matrixMetric === m
                              ? 'bg-slate-800 text-cyan-300 font-semibold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {m === 'revenue' ? 'Revenue' : m === 'gross' ? 'Gross' : 'Net'}
                        </button>
                      ))}
                    </div>
                  )}

                  {(mode === 'matrix' || mode === 'trajectory') && (
                    <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
                      {(['conservative', 'base', 'aggressive'] as FinancialScenario[]).map((sc) => (
                        <button
                          key={sc}
                          onClick={() => handleScenarioUpdate(sc)}
                          className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            localScenario === sc
                              ? sc === 'aggressive'
                                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                                : sc === 'conservative'
                                ? 'bg-rose-500/20 text-rose-300 font-semibold'
                                : 'bg-indigo-500/25 text-indigo-200 font-semibold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {sc === 'conservative' ? 'Cons' : sc === 'base' ? 'Base' : 'Aggr'}
                        </button>
                      ))}
                    </div>
                  )}

                  {mode === 'stack' && (
                    <button
                      onClick={() => setExplodedStack(!explodedStack)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        explodedStack
                          ? 'bg-indigo-500/20 border-indigo-400/60 text-indigo-200'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {explodedStack ? <Minimize2 className="w-3.5 h-3.5" /> : <Expand className="w-3.5 h-3.5" />}
                      <span>{explodedStack ? 'Assemble Stack' : 'Explode Layers'}</span>
                    </button>
                  )}

                  {/* Camera Presets & Orbit Toggle */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
                      {(['isometric', 'front', 'top'] as CameraPreset[]).map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setCameraPreset(preset)}
                          className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            cameraPreset === preset
                              ? 'bg-slate-800 text-white font-semibold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                          title={`Camera: ${preset}`}
                        >
                          {preset === 'isometric' ? 'Iso' : preset === 'front' ? 'Front' : 'Top'}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setAutoRotate(!autoRotate)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        autoRotate
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title="Toggle auto-orbit"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Orbit</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Synchronized Telemetry Readout Strip Below Viewport (Zero Viewport Occlusion) */}
        {selectedItem && (
          <div className="mt-5 rounded-xl bg-[#0A101D] border border-slate-800/90 p-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{selectedItem.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-white font-heading">
                  {selectedItem.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {selectedItem.subtitle}
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-6">
                <div>
                  <div className="text-xs font-mono text-slate-500 mb-1">{selectedItem.primaryLabel}</div>
                  <div className="text-lg font-mono font-bold text-cyan-300 tabular-nums">
                    {selectedItem.primaryValue}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-500 mb-1">{selectedItem.secondaryLabel}</div>
                  <div className="text-sm font-mono font-semibold text-emerald-300 tabular-nums">
                    {selectedItem.secondaryValue}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-500 mb-1">{selectedItem.tertiaryLabel}</div>
                  <div className="text-sm font-mono font-semibold text-slate-200 tabular-nums">
                    {selectedItem.tertiaryValue}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
