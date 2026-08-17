import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Layers, Sparkles, RotateCw, ZoomIn, Activity, ShieldCheck, Cpu, Box } from 'lucide-react';

interface Spatial3DCanvasProps {
  activeLayer?: number;
  mode?: 'neural' | 'cleanroom' | 'eyewear';
  onNodeClick?: (layerLevel: number) => void;
}

export const Spatial3DCanvas: React.FC<Spatial3DCanvasProps> = ({
  activeLayer = 3,
  mode = 'neural',
  onNodeClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMode, setSelectedMode] = useState<'neural' | 'cleanroom' | 'eyewear'>(mode);
  const [isRotating, setIsRotating] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const masterGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Master Group
    const masterGroup = new THREE.Group();
    masterGroupRef.current = masterGroup;
    scene.add(masterGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00F0FF, 3.5, 25);
    pointLightCyan.position.set(4, 4, 4);
    scene.add(pointLightCyan);

    const pointLightPurple = new THREE.PointLight(0xA855F7, 3, 20);
    pointLightPurple.position.set(-4, -4, -2);
    scene.add(pointLightPurple);

    const pointLightGreen = new THREE.PointLight(0x10B981, 2.5, 15);
    pointLightGreen.position.set(0, 3, -3);
    scene.add(pointLightGreen);

    // Build specific 3D Object based on mode
    if (selectedMode === 'neural') {
      // 1. 6-Layer Neural Stack Matrix
      const layerColors = [0xFB7185, 0xFBBF24, 0x34D399, 0xC084FC, 0x818CF8, 0x38BDF8];
      
      for (let i = 0; i < 6; i++) {
        const yPos = (i - 2.5) * 0.52;
        const radius = 1.5 - Math.abs(i - 2.5) * 0.12;
        
        // Hexagonal wireframe ring
        const ringGeo = new THREE.RingGeometry(radius * 0.9, radius, 6);
        const ringMat = new THREE.MeshBasicMaterial({
          color: layerColors[i],
          wireframe: true,
          transparent: true,
          opacity: i + 1 === activeLayer ? 0.95 : 0.35,
          side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = yPos;
        masterGroup.add(ringMesh);

        // Core Glowing Node
        const nodeGeo = new THREE.SphereGeometry(0.09, 16, 16);
        const nodeMat = new THREE.MeshStandardMaterial({
          color: layerColors[i],
          emissive: layerColors[i],
          emissiveIntensity: i + 1 === activeLayer ? 2.8 : 0.9,
          roughness: 0.2
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(0, yPos, 0);
        masterGroup.add(node);

        // Surrounding orbital satellite nodes
        for (let s = 0; s < 3; s++) {
          const satAngle = (s * Math.PI * 2) / 3 + i * 0.4;
          const satX = Math.cos(satAngle) * (radius * 0.95);
          const satZ = Math.sin(satAngle) * (radius * 0.95);
          const satGeo = new THREE.SphereGeometry(0.04, 12, 12);
          const satMat = new THREE.MeshBasicMaterial({ color: layerColors[i] });
          const sat = new THREE.Mesh(satGeo, satMat);
          sat.position.set(satX, yPos, satZ);
          masterGroup.add(sat);
        }

        // Connecting vertical conduits
        if (i < 5) {
          const conduitGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.52, 8);
          const conduitMat = new THREE.MeshBasicMaterial({
            color: 0x38BDF8,
            transparent: true,
            opacity: 0.35
          });
          const conduit = new THREE.Mesh(conduitGeo, conduitMat);
          conduit.position.set(0, yPos + 0.26, 0);
          masterGroup.add(conduit);
        }
      }

      // Outer Cage
      const icosaGeo = new THREE.IcosahedronGeometry(2.3, 1);
      const icosaMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      });
      const cage = new THREE.Mesh(icosaGeo, icosaMat);
      masterGroup.add(cage);

    } else if (selectedMode === 'cleanroom') {
      // 2. Photorealistic Cleanroom Bioreactor Digital Twin
      const vesselGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.4, 24);
      const vesselMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7
      });
      const vessel = new THREE.Mesh(vesselGeo, vesselMat);
      masterGroup.add(vessel);

      // Steel frame rings
      for (let r = 0; r < 4; r++) {
        const ringGeo = new THREE.TorusGeometry(0.92, 0.03, 8, 32);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0x10B981, emissive: 0x059669, emissiveIntensity: 0.6 });
        const frameRing = new THREE.Mesh(ringGeo, ringMat);
        frameRing.rotation.x = Math.PI / 2;
        frameRing.position.y = (r - 1.5) * 0.7;
        masterGroup.add(frameRing);
      }

      // Slicing Laser Grid
      const gridGeo = new THREE.PlaneGeometry(2.5, 2.5, 12, 12);
      const gridMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });
      const grid = new THREE.Mesh(gridGeo, gridMat);
      grid.rotation.x = Math.PI / 2;
      grid.position.y = -1.3;
      masterGroup.add(grid);

      // Digital Twin Telemetry Node Markers
      const coords = [
        { x: 0.95, y: 0.6, z: 0 },
        { x: -0.95, y: -0.4, z: 0 },
        { x: 0, y: 0.2, z: 0.95 },
        { x: 0, y: -0.7, z: -0.95 }
      ];
      coords.forEach((pos) => {
        const pinGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const pinMat = new THREE.MeshStandardMaterial({
          color: 0x10B981,
          emissive: 0x34D399,
          emissiveIntensity: 2.5
        });
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.set(pos.x, pos.y, pos.z);
        masterGroup.add(pin);
      });

    } else if (selectedMode === 'eyewear') {
      // 3. Spatial Eyewear AR Wireframe & Optical Reticle
      // Frame glasses
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0xA855F7,
        emissive: 0x9333ea,
        emissiveIntensity: 0.8,
        wireframe: true
      });

      // Left Lens
      const leftLensGeo = new THREE.TorusGeometry(0.65, 0.08, 12, 28);
      const leftLens = new THREE.Mesh(leftLensGeo, frameMat);
      leftLens.position.set(-0.85, 0, 0);
      masterGroup.add(leftLens);

      // Right Lens
      const rightLensGeo = new THREE.TorusGeometry(0.65, 0.08, 12, 28);
      const rightLens = new THREE.Mesh(rightLensGeo, frameMat);
      rightLens.position.set(0.85, 0, 0);
      masterGroup.add(rightLens);

      // Bridge
      const bridgeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8);
      const bridge = new THREE.Mesh(bridgeGeo, frameMat);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, 0.15, 0);
      masterGroup.add(bridge);

      // AR Holographic Reticle HUD in front
      const reticleGeo = new THREE.RingGeometry(1.6, 1.65, 32);
      const reticleMat = new THREE.MeshBasicMaterial({
        color: 0x00F0FF,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      const reticle = new THREE.Mesh(reticleGeo, reticleMat);
      reticle.position.set(0, 0, 0.8);
      masterGroup.add(reticle);
    }

    // Floating Data Particle Cloud
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      const radius = 1.3 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[p * 3] = radius * Math.cos(phi) * Math.cos(theta);
      positions[p * 3 + 1] = radius * Math.sin(phi) * 1.4;
      positions[p * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      colors[p * 3] = 0.2 + Math.random() * 0.4;
      colors[p * 3 + 1] = 0.7 + Math.random() * 0.3;
      colors[p * 3 + 2] = 0.9 + Math.random() * 0.1;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && masterGroup) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        masterGroup.rotation.y += deltaX * 0.008;
        masterGroup.rotation.x += deltaY * 0.008;
      }
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z = Math.max(3.2, Math.min(8.0, camera.position.z + event.deltaY * 0.003));
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && !isDragging && masterGroup) {
        masterGroup.rotation.y = elapsedTime * 0.22 + mouseX * 0.3;
        masterGroup.rotation.x = Math.sin(elapsedTime * 0.25) * 0.12 + mouseY * 0.15;
      }

      if (particles) {
        particles.rotation.y = -elapsedTime * 0.08;
      }

      renderer.render(scene, camera);
      setIsReady(true);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !rendererRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [selectedMode, activeLayer, isRotating]);

  return (
    <div className="relative w-full h-[460px] md:h-[540px] rounded-xl overflow-hidden tech-border-cyan group" id="spatial-canvas-container">
      {/* 3D Viewport Target */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Skeleton Placeholder State */}
      {!isReady && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center space-y-4 z-30">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-purple-500/20 border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <Box className="w-7 h-7 text-cyan-400 animate-pulse" />
          </div>
          <div className="text-center space-y-1 font-mono">
            <div className="text-xs font-bold text-white tracking-wider uppercase">Initializing WebGL Spatial Engine</div>
            <div className="text-[10px] text-cyan-400 animate-pulse">Compiling GLSL shaders & voxel meshes...</div>
          </div>
          <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 w-2/3 animate-pulse" />
          </div>
        </div>
      )}

      {/* Top HUD Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-md border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>SPENTA.XR.RUNTIME // 60 FPS</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 px-2.5 rounded-md border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              isRotating
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Auto Orbit"
          >
            <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Orbit</span>
          </button>

          <div className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <ZoomIn className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Drag / Scroll to Inspect</span>
          </div>
        </div>
      </div>

      {/* Bottom Mode Selector */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-auto z-10">
        <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setSelectedMode('neural')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedMode === 'neural'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Neural L1-L6</span>
          </button>

          <button
            onClick={() => setSelectedMode('cleanroom')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedMode === 'cleanroom'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SCADA Twin</span>
          </button>

          <button
            onClick={() => setSelectedMode('eyewear')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedMode === 'eyewear'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>WebXR Eyewear</span>
          </button>
        </div>

        {/* Live Active Layer Indicator */}
        <div className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
          <span className="text-cyan-400 font-bold">L{activeLayer}</span>
          <span className="text-slate-400 text-[11px]">
            {activeLayer === 6 && 'WebXR / WhatsApp Delivery'}
            {activeLayer === 5 && 'K8s / pgvector Memory'}
            {activeLayer === 4 && 'UE5 Simulation Twin'}
            {activeLayer === 3 && 'LLaMA 3.2 Vision OCR'}
            {activeLayer === 2 && 'Edge Wasm / MQTT Ingest'}
            {activeLayer === 1 && 'LiDAR / Glasses Telemetry'}
          </span>
        </div>
      </div>
    </div>
  );
};
