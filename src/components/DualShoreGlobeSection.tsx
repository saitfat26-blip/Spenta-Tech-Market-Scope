import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { CopyShareButton } from './CopyShareButton';
import { 
  Globe, 
  Wifi, 
  Clock, 
  Zap, 
  MapPin, 
  ShieldCheck, 
  RotateCw, 
  Activity, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Server,
  Terminal
} from 'lucide-react';

interface DualShoreGlobeSectionProps {
  onOpenContact?: (interest?: string) => void;
}

export const DualShoreGlobeSection: React.FC<DualShoreGlobeSectionProps> = ({ onOpenContact }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFocus, setActiveFocus] = useState<'both' | 'sanjose' | 'dhaka'>('both');
  const [isRotating, setIsRotating] = useState(true);
  const [pingLatency, setPingLatency] = useState(174);
  const [isPinging, setIsPinging] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'SYNCED' | 'TRANSFERRING'>('SYNCED');

  // Coordinates converted to spherical coordinates
  // San Jose: 37.3382° N, -121.8863° W
  // Dhaka: 23.8103° N, 90.4125° E
  const latLongToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  const globeRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 10, 28);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const masterGlobe = new THREE.Group();
    globeRef.current = masterGlobe;
    scene.add(masterGlobe);

    const globeRadius = 9;

    // 1. Transparent Inner Core
    const coreGeo = new THREE.SphereGeometry(globeRadius * 0.98, 36, 36);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x070c18,
      transparent: true,
      opacity: 0.85
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGlobe.add(coreMesh);

    // 2. Wireframe / Longitude-Latitude Rings
    const wireGeo = new THREE.SphereGeometry(globeRadius, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0891b2,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterGlobe.add(wireMesh);

    // 3. Point Cloud Dot Array (Globe Surface Nodes)
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = globeRadius;

      particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    masterGlobe.add(particles);

    // 4. City Hub Coordinates
    const posSanJose = latLongToVector3(37.33, -121.88, globeRadius);
    const posDhaka = latLongToVector3(23.81, 90.41, globeRadius);
    const posSydney = latLongToVector3(-33.86, 151.20, globeRadius);

    // Helper to create glowing beacon
    const createBeacon = (pos: THREE.Vector3, colorHex: number, label: string) => {
      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(pos);

      // Center sphere
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 16),
        new THREE.MeshBasicMaterial({ color: colorHex })
      );
      beaconGroup.add(sphere);

      // Pulsing outer halo ring
      const ringGeo = new THREE.RingGeometry(0.4, 0.7, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.lookAt(pos.clone().multiplyScalar(2));
      beaconGroup.add(ring);

      masterGlobe.add(beaconGroup);
      return { group: beaconGroup, ring };
    };

    const beaconSJ = createBeacon(posSanJose, 0x38bdf8, 'San Jose'); // Cyan
    const beaconDhaka = createBeacon(posDhaka, 0x34d399, 'Dhaka'); // Emerald
    const beaconSydney = createBeacon(posSydney, 0x818cf8, 'Sydney'); // Indigo

    // 5. Great Circle Arc between San Jose and Dhaka
    const createCurvedArc = (v1: THREE.Vector3, v2: THREE.Vector3, elevation = 3.5) => {
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const midLength = mid.length();
      mid.normalize().multiplyScalar(midLength + elevation);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(60);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
      });
      const line = new THREE.Line(curveGeo, curveMat);
      masterGlobe.add(line);
      return { curve, line };
    };

    const arcSJ_Dhaka = createCurvedArc(posSanJose, posDhaka, 4.2);
    const arcSJ_Sydney = createCurvedArc(posSanJose, posSydney, 3.2);

    // 6. Traveling Photon Pulse Packets along the arc
    const pulseCount = 3;
    const pulseSpheres: { mesh: THREE.Mesh; progress: number; speed: number }[] = [];

    for (let i = 0; i < pulseCount; i++) {
      const pMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x67e8f9 })
      );
      masterGlobe.add(pMesh);
      pulseSpheres.push({
        mesh: pMesh,
        progress: i / pulseCount,
        speed: 0.006 + Math.random() * 0.002
      });
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Auto Rotation
      if (isRotating) {
        masterGlobe.rotation.y += delta * 0.25;
      }

      // Pulse beacon rings
      const pulseScale = 1 + Math.sin(time * 4) * 0.3;
      beaconSJ.ring.scale.set(pulseScale, pulseScale, pulseScale);
      beaconDhaka.ring.scale.set(pulseScale, pulseScale, pulseScale);
      beaconSydney.ring.scale.set(pulseScale, pulseScale, pulseScale);

      // Animate travelling photon packets
      pulseSpheres.forEach((p) => {
        p.progress = (p.progress + p.speed) % 1;
        const pt = arcSJ_Dhaka.curve.getPoint(p.progress);
        p.mesh.position.copy(pt);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight || 450;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isRotating]);

  // Trigger simulated ping test
  const triggerPingTest = () => {
    setIsPinging(true);
    setSyncStatus('TRANSFERRING');
    setTimeout(() => {
      const randomPing = Math.floor(168 + Math.random() * 15);
      setPingLatency(randomPing);
      setIsPinging(false);
      setSyncStatus('SYNCED');
    }, 600);
  };

  return (
    <section id="dual-shore-globe" className="py-20 relative bg-[#070A10] border-t border-b border-slate-800/80 overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-600/10 blur-[180px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>GLOBAL INFRASTRUCTURE & 24/7 DUAL-SHORE VELOCITY</span>
            </div>
            <CopyShareButton sectionId="dual-shore-globe" sectionTitle="Dual-Shore Global Infrastructure" variant="pill" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            San Jose ↔ Dhaka Real-Time Sync
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Capitalizing on a 14-hour timezone delta to deliver continuous 24-hour engineering sprint cycles: Silicon Valley executive strategy coupled with high-throughput deep tech engineering in Dhaka.
          </p>
        </motion.div>

        {/* 2-Column Grid: 3D Holographic Globe (Left 7 cols) & Live Telemetry HUD (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: 3D Three.js Interactive Holographic Globe */}
          <div className="lg:col-span-7 relative bg-slate-950/80 rounded-2xl border border-slate-800/90 p-4 hud-corner overflow-hidden">
            
            {/* 3D Canvas Viewport */}
            <div ref={containerRef} className="w-full h-[400px] sm:h-[460px] cursor-grab active:cursor-grabbing" />

            {/* Floating Globe HUD Overlay Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>CROSS-SHORE SYNC: {syncStatus}</span>
              </div>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`p-1.5 rounded-lg border text-xs font-mono transition-all ${
                    isRotating 
                      ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                  title="Toggle Globe Auto-Rotation"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
                </button>
              </div>
            </div>

            {/* Bottom Node Legends */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                  <span>San Jose, CA (HQ)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                  <span>Dhaka (Engineering Lab)</span>
                </div>
                <div className="flex items-center gap-1.5 text-indigo-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400" />
                  <span>Sydney (APAC BD)</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400">
                Encrypted WireGuard Mesh
              </div>
            </div>

          </div>

          {/* Right: Live Telemetry HUD Metrics (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Live Ping & Tunnel Card */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                  <span>IPSEC / WIREGUARD TELEMETRY</span>
                </div>
                <button
                  onClick={triggerPingTest}
                  disabled={isPinging}
                  className="px-2.5 py-1 rounded bg-slate-950 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-[10px] font-mono transition-all cursor-pointer"
                >
                  {isPinging ? 'Pinging Node...' : 'Test Sync Ping'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Tunnel Latency</div>
                  <div className="text-2xl font-black font-mono text-cyan-400 mt-0.5 flex items-center justify-center gap-1">
                    <span>{pingLatency}</span>
                    <span className="text-xs text-slate-400 font-normal">ms</span>
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 mt-0.5">SLA Guaranteed</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Timezone Delta</div>
                  <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                    +14.0h
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-0.5">24/7 Relay Sprint</div>
                </div>
              </div>
            </div>

            {/* 3 Core Structural Multiplier Highlights */}
            <div className="space-y-3">
              
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-heading text-white">
                    Non-Stop 24-Hour Engineering Velocity
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Client specifications gathered in California or Australia are immediately picked up by our Dhaka engineering sprint during nighttime, accelerating delivery cycles by 3x.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-heading text-white">
                    8:1 Structural Cost Arbitrage Advantage
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Dhaka’s Tier-1 computer vision engineers and AAA 3D technical artists cost $25–$35/hr vs $250+/hr in Silicon Valley, generating 80%+ enterprise gross margins.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-heading text-white">
                    US Delaware C-Corp IP & Governance
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    100% of codebase, patents, and client contracts are strictly owned by Spenta Delaware C-Corp, satisfying US and international institutional venture due diligence.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
