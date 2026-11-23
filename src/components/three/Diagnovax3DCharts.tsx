import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { FINANCIAL_TIERS, FUSION_LAYERS } from '../../data/mockData';
import { Currency, USD_TO_BDT_RATE } from '../../types';
import { FinancialScenario } from '../UnitEconomicsSection';

export type DiagnovaxChartMode = 'matrix' | 'trajectory' | 'stack';
export type CameraPreset = 'isometric' | 'front' | 'top';
export type MatrixMetric = 'revenue' | 'gross' | 'net';

export interface SelectedTelemetryItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  tertiaryLabel: string;
  tertiaryValue: string;
  accentColor: string;
}

export interface HoverCalloutState {
  label: string;
  value: string;
  worldPos: [number, number, number];
}

export interface Diagnovax3DSceneProps {
  mode: DiagnovaxChartMode;
  scenario: FinancialScenario;
  matrixMetric: MatrixMetric;
  currency: Currency;
  cameraPreset: CameraPreset;
  autoRotate: boolean;
  explodedStack: boolean;
  selectedId: string | null;
  calloutDomRef: React.RefObject<HTMLDivElement | null>;
  onHoverCalloutChange: (callout: { label: string; value: string } | null) => void;
  onSelect: (item: SelectedTelemetryItem) => void;
  onContextLost: () => void;
}

// Detect software WebGL once via GPU renderer string (never userAgent)
let cachedSoftwareGl: boolean | null = null;
export function detectSoftwareGl(): boolean {
  if (cachedSoftwareGl !== null) return cachedSoftwareGl;
  if (typeof document === 'undefined') return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) {
      cachedSoftwareGl = true;
      return true;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    cachedSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return cachedSoftwareGl;
  } catch {
    cachedSoftwareGl = true;
    return true;
  }
}

// Pre-allocated vectors for zero GC inside useFrame
const _camTargetPos = new THREE.Vector3();
const _orbitTargetPos = new THREE.Vector3();
const _projectVec = new THREE.Vector3();

const CAMERA_PRESET_MAP: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  isometric: { pos: [8.8, 6.4, 9.2], target: [0, 1.3, 0] },
  front: { pos: [0, 3.2, 12.2], target: [0, 1.6, 0] },
  top: { pos: [0.01, 13.8, 2.2], target: [0, 0.5, 0] },
};

const SCENARIO_MULT: Record<FinancialScenario, { rev: number; cogs: number; cac: number; overhead: number }> = {
  conservative: { rev: 1.0, cogs: 1.1, cac: 16.0, overhead: 10.0 },
  base: { rev: 1.0, cogs: 1.0, cac: 12.5, overhead: 8.5 },
  aggressive: { rev: 1.15, cogs: 0.78, cac: 9.0, overhead: 7.0 },
};

export const QUARTER_TRAJECTORY_DATA = [
  { id: 'q1', label: 'Q1 26', arrUsd: 0.18, grossUsd: 0.072, clients: 4, netMargin: 18.2 },
  { id: 'q2', label: 'Q2 26', arrUsd: 0.34, grossUsd: 0.141, clients: 8, netMargin: 19.0 },
  { id: 'q3', label: 'Q3 26', arrUsd: 0.58, grossUsd: 0.244, clients: 13, netMargin: 19.8 },
  { id: 'q4', label: 'Q4 26', arrUsd: 0.92, grossUsd: 0.391, clients: 19, netMargin: 20.6 },
  { id: 'q5', label: 'Q1 27', arrUsd: 1.36, grossUsd: 0.585, clients: 27, netMargin: 21.4 },
  { id: 'q6', label: 'Q2 27', arrUsd: 1.88, grossUsd: 0.818, clients: 36, netMargin: 22.0 },
  { id: 'q7', label: 'Q3 27', arrUsd: 2.52, grossUsd: 1.109, clients: 48, netMargin: 22.8 },
  { id: 'q8', label: 'Q4 27', arrUsd: 3.30, grossUsd: 1.468, clients: 61, netMargin: 23.4 },
  { id: 'q9', label: 'Q1 28', arrUsd: 4.25, grossUsd: 1.904, clients: 76, netMargin: 23.9 },
  { id: 'q10', label: 'Q2 28', arrUsd: 5.40, grossUsd: 2.430, clients: 94, netMargin: 24.3 },
  { id: 'q11', label: 'Q3 28', arrUsd: 6.80, grossUsd: 3.060, clients: 115, netMargin: 24.7 },
  { id: 'q12', label: 'Q4 28', arrUsd: 8.45, grossUsd: 3.802, clients: 142, netMargin: 25.0 },
];

export function formatDiagnovaxMoney(usdVal: number, currency: Currency): string {
  if (currency === 'USD') {
    if (usdVal >= 1_000_000) return `$${(usdVal / 1_000_000).toFixed(2)}M`;
    return `$${Math.round(usdVal).toLocaleString()}`;
  }
  const bdt = usdVal * USD_TO_BDT_RATE;
  if (bdt >= 1_000_000) return `${(bdt / 1_000_000).toFixed(2)}M ৳`;
  return `${Math.round(bdt).toLocaleString()} ৳`;
}

// Projects active 3D world anchor onto parent DOM callout element with zero nested React roots
const CalloutProjector: React.FC<{
  worldPosRef: React.MutableRefObject<[number, number, number] | null>;
  calloutDomRef: React.RefObject<HTMLDivElement | null>;
}> = ({ worldPosRef, calloutDomRef }) => {
  const { camera, size } = useThree();

  useFrame(() => {
    const el = calloutDomRef.current;
    const pos = worldPosRef.current;
    if (!el) return;
    if (!pos) {
      el.style.opacity = '0';
      return;
    }
    _projectVec.set(pos[0], pos[1], pos[2]).project(camera);
    const isInFront = _projectVec.z < 1;
    if (!isInFront) {
      el.style.opacity = '0';
      return;
    }
    const x = (_projectVec.x * 0.5 + 0.5) * size.width;
    const y = (-_projectVec.y * 0.5 + 0.5) * size.height;
    el.style.opacity = '1';
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -125%)`;
  });

  return null;
};

// Studio PMREM RoomEnvironment (zero external HDRIs / zero 404s)
const StudioEnvironment: React.FC = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    return () => {
      scene.environment = null;
      envTarget.dispose();
    };
  }, [gl, scene]);

  return null;
};

// Procedural radial contact shadow texture for grounded plinths
function useContactGlowTexture(colorHex: string) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
      grad.addColorStop(0, colorHex);
      grad.addColorStop(0.55, 'rgba(6, 182, 212, 0.14)');
      grad.addColorStop(1, 'rgba(5, 9, 18, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [colorHex]);
}

// Calibrated Diagnostic Floor Grid
const DiagnovaxCalibrationFloor: React.FC = () => {
  const { gl } = useThree();
  const floorTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#060B15';
      ctx.fillRect(0, 0, 512, 512);

      // Minor grid lines
      ctx.strokeStyle = 'rgba(30, 58, 95, 0.35)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 512; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }

      // Major diagnostic ticks
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.22)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i <= 512; i += 128) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }

      // Crosshair intersections
      ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
      for (let x = 0; x <= 512; x += 128) {
        for (let y = 0; y <= 512; y += 128) {
          ctx.fillRect(x - 2, y - 2, 4, 4);
        }
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return tex;
  }, [gl]);

  useEffect(() => {
    return () => {
      floorTex.dispose();
    };
  }, [floorTex]);

  return (
    <group position={[0, -0.02, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial map={floorTex} roughness={0.78} metalness={0.22} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[5.45, 5.52, 64]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.22}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[3.7, 3.74, 64]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.18}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
    </group>
  );
};

// Composite 6-part architectural pillar for the 9-Tier Unit Economics 3D Matrix
interface DiagnosticPillarProps {
  position: [number, number, number];
  targetHeight: number;
  color: string;
  isSelected: boolean;
  isHovered: boolean;
  isSoftwareGl: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

const DiagnosticPillar: React.FC<DiagnosticPillarProps> = ({
  position,
  targetHeight,
  color,
  isSelected,
  isHovered,
  isSoftwareGl,
  onHover,
  onClick,
}) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const sleeveRef = useRef<THREE.Mesh>(null);
  const capRef = useRef<THREE.Group>(null);
  const currentHeightRef = useRef<number>(0.25);
  const contactTex = useContactGlowTexture('rgba(34, 211, 238, 0.35)');

  useEffect(() => {
    return () => {
      contactTex.dispose();
    };
  }, [contactTex]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const boostedTarget = targetHeight + (isSelected ? 0.25 : isHovered ? 0.14 : 0);
    currentHeightRef.current = THREE.MathUtils.damp(currentHeightRef.current, boostedTarget, 6.5, dt);
    const h = Math.max(0.2, currentHeightRef.current);

    if (coreRef.current) {
      coreRef.current.scale.y = h;
      coreRef.current.position.y = 0.16 + h / 2;
    }
    if (sleeveRef.current) {
      sleeveRef.current.scale.y = h + 0.12;
      sleeveRef.current.position.y = 0.16 + (h + 0.12) / 2;
    }
    if (capRef.current) {
      capRef.current.position.y = 0.16 + h + 0.14;
      capRef.current.rotation.y += dt * (isSelected || isHovered ? 1.4 : 0.35);
    }
  });

  const active = isSelected || isHovered;

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Part 1: Grounded radial contact plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[1.65, 1.65]} />
        <meshBasicMaterial
          map={contactTex}
          transparent
          opacity={active ? 0.85 : 0.45}
          depthWrite={false}
        />
      </mesh>

      {/* Part 2: Anodized Titanium Octagonal Plinth Base */}
      <mesh position={[0, 0.08, 0]} castShadow={!isSoftwareGl} receiveShadow={!isSoftwareGl}>
        <cylinderGeometry args={[0.56, 0.64, 0.16, 8]} />
        <meshStandardMaterial
          color={active ? '#1e293b' : '#0f172a'}
          metalness={0.86}
          roughness={0.28}
        />
      </mesh>

      {/* Part 3: Brushed Alloy Collar Ring */}
      <mesh position={[0, 0.17, 0]}>
        <torusGeometry args={[0.46, 0.03, 10, 24]} />
        <meshStandardMaterial
          color={active ? color : '#334155'}
          emissive={color}
          emissiveIntensity={active ? 1.2 : 0.25}
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>

      {/* Part 4: Calibrated Illuminating Core Column */}
      <mesh ref={coreRef} position={[0, 0.5, 0]} castShadow={!isSoftwareGl}>
        <cylinderGeometry args={[0.26, 0.30, 1, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.25 : isHovered ? 0.95 : 0.45}
          metalness={0.35}
          roughness={0.22}
        />
      </mesh>

      {/* Part 5: Optical Glass Diagnostic Casing Sleeve */}
      <mesh ref={sleeveRef} position={[0, 0.5, 0]} renderOrder={2}>
        <cylinderGeometry args={[0.40, 0.42, 1, 8, 1, true]} />
        <meshPhysicalMaterial
          color="#94a3b8"
          metalness={0.1}
          roughness={0.12}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transparent
          opacity={active ? 0.34 : 0.2}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Part 6: Rotating Metallic Telemetry Cap Crown */}
      <group ref={capRef} position={[0, 1.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.025, 8, 6]} />
          <meshStandardMaterial
            color={active ? '#e2e8f0' : '#64748b'}
            emissive={color}
            emissiveIntensity={active ? 1.1 : 0.3}
            metalness={0.92}
            roughness={0.16}
          />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <octahedronGeometry args={[0.075, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={active ? 2.2 : 0.9}
            roughness={0.15}
            metalness={0.4}
          />
        </mesh>
      </group>
    </group>
  );
};

// Mode 1: 9-Tier Unit Economics 3D Pillar Matrix
const UnitEconomics3DMatrix: React.FC<{
  scenario: FinancialScenario;
  matrixMetric: MatrixMetric;
  currency: Currency;
  selectedId: string | null;
  isSoftwareGl: boolean;
  setCallout: (callout: HoverCalloutState | null) => void;
  onSelect: (item: SelectedTelemetryItem) => void;
}> = ({ scenario, matrixMetric, currency, selectedId, isSoftwareGl, setCallout, onSelect }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const mult = SCENARIO_MULT[scenario];

  const pillars = useMemo(() => {
    const categoryColors: Record<'A' | 'B' | 'C', string> = {
      A: '#22d3ee',
      B: '#818cf8',
      C: '#34d399',
    };

    return FINANCIAL_TIERS.map((tier, idx) => {
      const revenue = tier.baselineUsd * mult.rev;
      const cogs = Math.min(tier.baselineUsd * (tier.cogsPercent / 100) * mult.cogs, revenue * 0.75);
      const grossProfit = revenue - cogs;
      const grossMargin = (grossProfit / revenue) * 100;
      const cac = revenue * ((scenario === 'base' ? tier.cacPercent : mult.cac) / 100);
      const overhead = revenue * ((scenario === 'base' ? tier.overheadPercent : mult.overhead) / 100);
      const netProfit = grossProfit - cac - overhead;
      const netMargin = (netProfit / revenue) * 100;

      const metricValue =
        matrixMetric === 'revenue'
          ? revenue
          : matrixMetric === 'gross'
          ? grossProfit
          : netProfit;

      const normalizedHeight = 0.65 + (Math.log10(Math.max(metricValue, 200)) - 2.3) * 1.38;
      const row = Math.floor(idx / 3);
      const col = idx % 3;

      return {
        tier,
        revenue,
        grossProfit,
        grossMargin,
        netProfit,
        netMargin,
        metricValue,
        height: Math.max(0.55, Math.min(4.6, normalizedHeight)),
        color: categoryColors[tier.category],
        position: [(col - 1) * 2.45, 0, (row - 1) * 2.45] as [number, number, number],
      };
    });
  }, [scenario, matrixMetric, mult]);

  const metricLabel =
    matrixMetric === 'revenue'
      ? 'Scenario Revenue'
      : matrixMetric === 'gross'
      ? 'Gross Profit'
      : 'Net Operating Profit';

  useEffect(() => {
    const target = pillars.find((p) => p.tier.id === hoveredId) || pillars.find((p) => p.tier.id === selectedId);
    if (target) {
      setCallout({
        label: `${target.tier.code} · ${target.tier.name}`,
        value: formatDiagnovaxMoney(target.metricValue, currency),
        worldPos: [target.position[0], target.height + 0.68, target.position[2]],
      });
    } else {
      setCallout(null);
    }
  }, [hoveredId, selectedId, pillars, currency, setCallout]);

  return (
    <group>
      {[-2.45, 0, 2.45].map((z, idx) => (
        <Line
          key={`row-${idx}`}
          points={[
            [-3.4, 0.04, z],
            [3.4, 0.04, z],
          ]}
          color={idx === 0 ? '#22d3ee' : idx === 1 ? '#818cf8' : '#34d399'}
          lineWidth={1}
          transparent
          opacity={0.35}
        />
      ))}

      {pillars.map((p) => (
        <DiagnosticPillar
          key={p.tier.id}
          position={p.position}
          targetHeight={p.height}
          color={p.color}
          isSelected={selectedId === p.tier.id}
          isHovered={hoveredId === p.tier.id}
          isSoftwareGl={isSoftwareGl}
          onHover={(h) => setHoveredId(h ? p.tier.id : null)}
          onClick={() =>
            onSelect({
              id: p.tier.id,
              category: `Model ${p.tier.category} · ${p.tier.deliveryTimeline}`,
              title: `${p.tier.code}: ${p.tier.name}`,
              subtitle: p.tier.scopeSummary,
              primaryLabel: metricLabel,
              primaryValue: formatDiagnovaxMoney(p.metricValue, currency),
              secondaryLabel: 'Gross Margin',
              secondaryValue: `${p.grossMargin.toFixed(1)}% (${formatDiagnovaxMoney(p.grossProfit, currency)})`,
              tertiaryLabel: 'Net Margin',
              tertiaryValue: `${p.netMargin.toFixed(1)}% (${formatDiagnovaxMoney(p.netProfit, currency)})`,
              accentColor: p.color,
            })
          }
        />
      ))}
    </group>
  );
};

// Mode 2: 12-Quarter ARR & Gross Profit Kinetic 3D Trajectory
const Trajectory3DSurface: React.FC<{
  scenario: FinancialScenario;
  currency: Currency;
  selectedId: string | null;
  isSoftwareGl: boolean;
  setCallout: (callout: HoverCalloutState | null) => void;
  onSelect: (item: SelectedTelemetryItem) => void;
}> = ({ scenario, currency, selectedId, isSoftwareGl, setCallout, onSelect }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const scenarioScale = scenario === 'aggressive' ? 1.24 : scenario === 'conservative' ? 0.78 : 1.0;

  const { arrCurve, grossCurve, nodes } = useMemo(() => {
    const aPts: THREE.Vector3[] = [];
    const gPts: THREE.Vector3[] = [];

    const mapped = QUARTER_TRAJECTORY_DATA.map((q, i) => {
      const x = (i - 5.5) * 0.85;
      const arrScaled = q.arrUsd * scenarioScale;
      const grossScaled = q.grossUsd * scenarioScale;
      const yArr = 0.35 + (arrScaled / 10.5) * 4.4;
      const yGross = 0.25 + (grossScaled / 10.5) * 4.4;

      const arrVec = new THREE.Vector3(x, yArr, -0.75);
      const grossVec = new THREE.Vector3(x, yGross, 0.95);
      aPts.push(arrVec);
      gPts.push(grossVec);

      return {
        ...q,
        arrUsdScaled: arrScaled * 1_000_000,
        grossUsdScaled: grossScaled * 1_000_000,
        clientsScaled: Math.round(q.clients * scenarioScale),
        arrPos: [x, yArr, -0.75] as [number, number, number],
        grossPos: [x, yGross, 0.95] as [number, number, number],
      };
    });

    return {
      arrCurve: new THREE.CatmullRomCurve3(aPts),
      grossCurve: new THREE.CatmullRomCurve3(gPts),
      nodes: mapped,
    };
  }, [scenarioScale]);

  const arrTubeGeo = useMemo(() => new THREE.TubeGeometry(arrCurve, 64, 0.055, 10, false), [arrCurve]);
  const grossTubeGeo = useMemo(() => new THREE.TubeGeometry(grossCurve, 64, 0.045, 10, false), [grossCurve]);

  useEffect(() => {
    return () => {
      arrTubeGeo.dispose();
      grossTubeGeo.dispose();
    };
  }, [arrTubeGeo, grossTubeGeo]);

  useEffect(() => {
    const target = nodes.find((n) => n.id === hoveredId) || nodes.find((n) => n.id === selectedId);
    if (target) {
      setCallout({
        label: target.label,
        value: `${formatDiagnovaxMoney(target.arrUsdScaled, currency)} ARR`,
        worldPos: [target.arrPos[0], target.arrPos[1] + 0.45, target.arrPos[2]],
      });
    } else {
      setCallout(null);
    }
  }, [hoveredId, selectedId, nodes, currency, setCallout]);

  useFrame((state) => {
    if (pulseRef.current) {
      const t = (state.clock.getElapsedTime() * 0.16) % 1;
      arrCurve.getPointAt(t, pulseRef.current.position);
    }
  });

  return (
    <group>
      <mesh geometry={arrTubeGeo} castShadow={!isSoftwareGl}>
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#06b6d4"
          emissiveIntensity={0.85}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      <mesh geometry={grossTubeGeo} castShadow={!isSoftwareGl}>
        <meshStandardMaterial
          color="#34d399"
          emissive="#10b981"
          emissiveIntensity={0.65}
          metalness={0.7}
          roughness={0.22}
        />
      </mesh>

      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#22d3ee"
          emissiveIntensity={2.4}
          roughness={0.1}
        />
      </mesh>

      {nodes.map((node) => {
        const active = selectedId === node.id || hoveredId === node.id;
        return (
          <group
            key={node.id}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredId(node.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredId(null);
              document.body.style.cursor = 'auto';
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect({
                id: node.id,
                category: `12-Quarter Projection · ${scenario.toUpperCase()}`,
                title: `${node.label} Commercial Trajectory`,
                subtitle: `Dual-engine enterprise & WebXR deployment velocity across ${node.clientsScaled} active enterprise accounts.`,
                primaryLabel: 'Projected ARR',
                primaryValue: formatDiagnovaxMoney(node.arrUsdScaled, currency),
                secondaryLabel: 'Gross Profit Run-Rate',
                secondaryValue: formatDiagnovaxMoney(node.grossUsdScaled, currency),
                tertiaryLabel: 'Active Clients / Net Margin',
                tertiaryValue: `${node.clientsScaled} Accounts · ${node.netMargin.toFixed(1)}%`,
                accentColor: '#22d3ee',
              });
            }}
          >
            <Line
              points={[
                [node.arrPos[0], 0.02, node.arrPos[2]],
                node.arrPos,
              ]}
              color={active ? '#22d3ee' : '#1e293b'}
              lineWidth={active ? 2 : 1}
              transparent
              opacity={active ? 0.9 : 0.55}
            />
            <Line
              points={[node.arrPos, node.grossPos]}
              color={active ? '#34d399' : '#334155'}
              lineWidth={1}
              transparent
              opacity={active ? 0.85 : 0.35}
            />

            <group position={node.arrPos}>
              <mesh>
                <octahedronGeometry args={[active ? 0.19 : 0.12, 0]} />
                <meshStandardMaterial
                  color="#22d3ee"
                  emissive="#06b6d4"
                  emissiveIntensity={active ? 2.0 : 0.75}
                  metalness={0.5}
                  roughness={0.18}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[active ? 0.28 : 0.19, 0.018, 8, 20]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
              </mesh>
            </group>

            <mesh position={node.grossPos}>
              <sphereGeometry args={[active ? 0.12 : 0.08, 12, 12]} />
              <meshStandardMaterial
                color="#34d399"
                emissive="#10b981"
                emissiveIntensity={active ? 1.8 : 0.6}
                metalness={0.4}
                roughness={0.2}
              />
            </mesh>

            <mesh position={[node.arrPos[0], 0.04, node.arrPos[2]]}>
              <cylinderGeometry args={[0.14, 0.18, 0.06, 6]} />
              <meshStandardMaterial
                color={active ? '#22d3ee' : '#1e293b'}
                metalness={0.85}
                roughness={0.28}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Mode 3: 6-Layer Fusion Stack & Diagnovax Telemetry Core
const FusionStack3DCore: React.FC<{
  exploded: boolean;
  selectedId: string | null;
  isSoftwareGl: boolean;
  setCallout: (callout: HoverCalloutState | null) => void;
  onSelect: (item: SelectedTelemetryItem) => void;
}> = ({ exploded, selectedId, isSoftwareGl, setCallout, onSelect }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const layerRefs = useRef<(THREE.Group | null)[]>([]);
  const coreSpinRef = useRef<THREE.Group>(null);

  const orderedLayers = useMemo(() => [...FUSION_LAYERS].sort((a, b) => a.level - b.level), []);

  useEffect(() => {
    const idx = orderedLayers.findIndex((l) => l.id === hoveredId || (!hoveredId && l.id === selectedId));
    if (idx >= 0) {
      const layer = orderedLayers[idx];
      const spacing = exploded ? 0.88 : 0.56;
      const y = 0.55 + idx * spacing + 0.28;
      const radius = 2.35 - idx * 0.18;
      setCallout({
        label: `Layer 0${layer.level}`,
        value: layer.specs?.latency || 'Active',
        worldPos: [radius * 0.72, y, 0],
      });
    } else {
      setCallout(null);
    }
  }, [hoveredId, selectedId, exploded, orderedLayers, setCallout]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();

    orderedLayers.forEach((layer, idx) => {
      const grp = layerRefs.current[idx];
      if (!grp) return;
      const spacing = exploded ? 0.88 : 0.56;
      const baseY = 0.55 + idx * spacing;
      const isSelected = selectedId === layer.id;
      const targetY = baseY + (isSelected ? 0.14 : 0);
      grp.position.y = THREE.MathUtils.damp(grp.position.y, targetY, 6, dt);
      grp.rotation.y = t * (0.12 + idx * 0.03) * (idx % 2 === 0 ? 1 : -1);
    });

    if (coreSpinRef.current) {
      coreSpinRef.current.rotation.y = t * 0.25;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.12, 0]} castShadow={!isSoftwareGl} receiveShadow={!isSoftwareGl}>
        <cylinderGeometry args={[1.9, 2.25, 0.24, 12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.88} roughness={0.26} />
      </mesh>

      <group ref={coreSpinRef}>
        <mesh position={[0, exploded ? 2.65 : 1.9, 0]}>
          <cylinderGeometry args={[0.14, 0.14, exploded ? 5.1 : 3.6, 12]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.65}
            metalness={0.25}
            roughness={0.12}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      {orderedLayers.map((layer, idx) => {
        const active = selectedId === layer.id || hoveredId === layer.id;
        const radius = 2.35 - idx * 0.18;

        return (
          <group
            key={layer.id}
            ref={(el) => {
              layerRefs.current[idx] = el;
            }}
            position={[0, 0.55 + idx * 0.56, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredId(layer.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredId(null);
              document.body.style.cursor = 'auto';
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect({
                id: layer.id,
                category: `Layer 0${layer.level} · ${layer.specs?.protocol || 'Fusion Contract'}`,
                title: layer.title,
                subtitle: layer.subtitle,
                primaryLabel: 'Target Latency',
                primaryValue: layer.specs?.latency || '< 15ms',
                secondaryLabel: 'Throughput',
                secondaryValue: layer.specs?.throughput || 'High Density',
                tertiaryLabel: 'Reliability SLA',
                tertiaryValue: layer.specs?.uptimeSLA || '99.99%',
                accentColor: layer.color,
              });
            }}
          >
            <mesh castShadow={!isSoftwareGl} receiveShadow={!isSoftwareGl}>
              <cylinderGeometry args={[radius, radius * 1.03, 0.12, 6]} />
              <meshStandardMaterial
                color={active ? '#1e293b' : '#0b1220'}
                metalness={0.84}
                roughness={0.26}
              />
            </mesh>

            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius * 1.04, active ? 0.05 : 0.032, 8, 6]} />
              <meshStandardMaterial
                color={layer.color}
                emissive={layer.color}
                emissiveIntensity={active ? 1.85 : 0.75}
                metalness={0.5}
                roughness={0.18}
              />
            </mesh>

            {[0, 1, 2, 3, 4, 5].map((n) => {
              const angle = (n * Math.PI * 2) / 6;
              return (
                <mesh
                  key={n}
                  position={[Math.cos(angle) * radius * 0.85, 0.09, Math.sin(angle) * radius * 0.85]}
                >
                  <cylinderGeometry args={[0.055, 0.055, 0.1, 8]} />
                  <meshStandardMaterial
                    color={layer.color}
                    emissive={layer.color}
                    emissiveIntensity={active ? 1.6 : 0.5}
                    metalness={0.6}
                    roughness={0.22}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

// Smooth Exponential Camera Rig
const CameraRig: React.FC<{
  cameraPreset: CameraPreset;
  autoRotate: boolean;
  isSoftwareGl: boolean;
}> = ({ cameraPreset, autoRotate, isSoftwareGl }) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();
  const isTransitioningRef = useRef<boolean>(false);

  useEffect(() => {
    isTransitioningRef.current = true;
  }, [cameraPreset]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (isTransitioningRef.current && controlsRef.current) {
      const cfg = CAMERA_PRESET_MAP[cameraPreset];
      _camTargetPos.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      _orbitTargetPos.set(cfg.target[0], cfg.target[1], cfg.target[2]);

      camera.position.x = THREE.MathUtils.damp(camera.position.x, _camTargetPos.x, 5.5, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _camTargetPos.y, 5.5, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _camTargetPos.z, 5.5, dt);

      controlsRef.current.target.x = THREE.MathUtils.damp(controlsRef.current.target.x, _orbitTargetPos.x, 5.5, dt);
      controlsRef.current.target.y = THREE.MathUtils.damp(controlsRef.current.target.y, _orbitTargetPos.y, 5.5, dt);
      controlsRef.current.target.z = THREE.MathUtils.damp(controlsRef.current.target.z, _orbitTargetPos.z, 5.5, dt);

      controlsRef.current.update();

      if (camera.position.distanceTo(_camTargetPos) < 0.05) {
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={!isSoftwareGl}
      dampingFactor={0.06}
      autoRotate={autoRotate && !isSoftwareGl}
      autoRotateSpeed={0.85}
      minDistance={5.2}
      maxDistance={19}
      maxPolarAngle={Math.PI / 2 - 0.06}
      onStart={() => {
        isTransitioningRef.current = false;
      }}
    />
  );
};

export const Diagnovax3DCanvas: React.FC<Diagnovax3DSceneProps> = ({
  mode,
  scenario,
  matrixMetric,
  currency,
  cameraPreset,
  autoRotate,
  explodedStack,
  selectedId,
  calloutDomRef,
  onHoverCalloutChange,
  onSelect,
  onContextLost,
}) => {
  const isSoftwareGl = useMemo(() => detectSoftwareGl(), []);
  const calloutWorldPosRef = useRef<[number, number, number] | null>(null);

  const handleSetCallout = React.useCallback(
    (next: HoverCalloutState | null) => {
      if (next) {
        calloutWorldPosRef.current = next.worldPos;
        onHoverCalloutChange({ label: next.label, value: next.value });
      } else {
        calloutWorldPosRef.current = null;
        onHoverCalloutChange(null);
      }
    },
    [onHoverCalloutChange]
  );

  return (
    <Canvas
      shadows={!isSoftwareGl}
      dpr={isSoftwareGl ? 1 : [1, 2]}
      camera={{ position: [8.8, 6.4, 9.2], fov: 42, near: 0.1, far: 100 }}
      gl={{
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.12,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          onContextLost();
        });
      }}
    >
      <color attach="background" args={['#050912']} />
      <fogExp2 attach="fog" args={['#050912', 0.036]} />

      <StudioEnvironment />

      <hemisphereLight args={['#7dd3fc', '#0b1120', 0.75]} />
      <directionalLight
        position={[9, 13, 8]}
        intensity={1.55}
        color="#fff6e5"
        castShadow={!isSoftwareGl}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-8, 6, -7]} intensity={0.95} color="#38bdf8" />
      <pointLight position={[0, 5.5, 0]} intensity={0.75} color="#818cf8" distance={16} />

      <DiagnovaxCalibrationFloor />

      {mode === 'matrix' && (
        <UnitEconomics3DMatrix
          scenario={scenario}
          matrixMetric={matrixMetric}
          currency={currency}
          selectedId={selectedId}
          isSoftwareGl={isSoftwareGl}
          setCallout={handleSetCallout}
          onSelect={onSelect}
        />
      )}
      {mode === 'trajectory' && (
        <Trajectory3DSurface
          scenario={scenario}
          currency={currency}
          selectedId={selectedId}
          isSoftwareGl={isSoftwareGl}
          setCallout={handleSetCallout}
          onSelect={onSelect}
        />
      )}
      {mode === 'stack' && (
        <FusionStack3DCore
          exploded={explodedStack}
          selectedId={selectedId}
          isSoftwareGl={isSoftwareGl}
          setCallout={handleSetCallout}
          onSelect={onSelect}
        />
      )}

      <CalloutProjector worldPosRef={calloutWorldPosRef} calloutDomRef={calloutDomRef} />

      <CameraRig
        cameraPreset={cameraPreset}
        autoRotate={autoRotate}
        isSoftwareGl={isSoftwareGl}
      />
    </Canvas>
  );
};
