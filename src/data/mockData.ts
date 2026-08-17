import { FinancialTier, FusionLayer, CaseStudy, NonClientStream, CompetitorRow } from '../types';

export const FUSION_LAYERS: FusionLayer[] = [
  {
    level: 6,
    id: 'layer-6',
    title: 'Application & Enterprise Delivery Contracts',
    subtitle: 'Cross-platform immersive viewports, mobile apps, and conversational interfaces',
    techStack: ['WebXR HTML5/Wasm', 'Flutter', 'React Native', 'WhatsApp Business API', 'REST / GraphQL Gateways'],
    touchpoints: 'In-browser 3D viewports, mobile field units, WhatsApp Voice ERP bots, executive analytics dashboards.',
    securityGovernance: 'Role-Based Access Control (RBAC), end-to-end TLS 1.3 encryption, zero sensitive data caching on public edge proxies.',
    enterpriseImpact: 'Eliminates friction by embedding spatial computing and generative AI directly into channels employees already use daily.',
    color: '#38BDF8',
    iconName: 'Layout',
    specs: {
      latency: '< 16ms (60 FPS WebXR)',
      throughput: '45,000 active sessions/node',
      protocol: 'HTTPS / WebSockets / WebXR Wasm',
      uptimeSLA: '99.99% Guaranteed SLA',
      encryption: 'TLS 1.3 / E2E RBAC Tokenization',
      errorTolerance: '< 0.001% frame drop rate'
    },
    techDocs: {
      overview: 'Layer 6 acts as the universal presentation and interactive client interface. It exposes zero-install WebXR viewports, mobile Flutter/React Native wrappers, and WhatsApp Business API conversational webhooks. All UI state is synchronized via real-time WebSockets with tokenized RBAC claims.',
      endpoints: [
        {
          method: 'GET',
          path: '/api/v2/viewport/session/init',
          description: 'Initializes a WebXR spatial canvas session and handshakes client device capabilities (ARCore, ARKit, or WebGL fallback).',
          samplePayload: JSON.stringify({ sessionId: "xr_99f2b8a1", viewportType: "WebXR_Wasm", displayRefreshRate: 90, clientCaps: ["LiDAR", "6DoF", "SpatialAudio"] }, null, 2)
        },
        {
          method: 'POST',
          path: '/api/v2/conversational/voice-erp',
          description: 'Webhook gateway for WhatsApp Voice ERP audio parsing and structured JSON business dispatch.',
          samplePayload: JSON.stringify({ messageId: "wa_msg_44810", audioUri: "enc://s3/audio_raw_99.opus", detectedIntent: "INVENTORY_QUERY", skuTarget: "PHARMA-SOP-901" }, null, 2)
        }
      ],
      memoryAllocation: '64 MB per concurrent WebXR instance (Wasm heap isolated sandbox)',
      supportedRuntimes: ['Chrome / Safari iOS 16+', 'Meta Horizon OS WebXR', 'Android WebView', 'Node.js 22 LTS Gateway'],
      sampleCodeSnippet: {
        language: 'typescript',
        title: 'WebXR Spatial Viewport Client Init',
        code: `import { SpentaXRRuntime } from '@spenta/webxr-core';

export async function bootstrapSpatialViewport(containerId: string) {
  const runtime = await SpentaXRRuntime.initialize({
    container: document.getElementById(containerId),
    renderer: 'WebGPU_Fallback_WebGL2',
    targetFps: 60,
    zeroEgressMode: true,
    telemetryHub: 'wss://enclave.spenta.internal/v2/telemetry'
  });

  runtime.on('spatial_anchor_resolved', (anchor) => {
    console.log('[SPENTA] 3D Coordinate Registered:', anchor.matrix);
  });
}`
      },
      complianceMapping: ['SOC 2 Type II Section CC6.1 (Logical Access)', 'HIPAA Security Rule § 164.312(a)', 'WCAG 2.2 AA Accessible UI']
    }
  },
  {
    level: 5,
    id: 'layer-5',
    title: 'Cloud Orchestration & Vector Memory Contracts',
    subtitle: 'High-throughput event streaming, vector embeddings, and container clusters',
    techStack: ['Kubernetes (K8s)', 'pgvector (PostgreSQL)', 'Milvus', 'Apache Kafka', 'MinIO / S3 Storage'],
    touchpoints: 'Real-time spatial POI queries, KYC document vector search, 10,000+ IoT telemetry ingest events per second.',
    securityGovernance: '100% On-Premise or Private VPC deployment, guaranteeing SOC 2, HIPAA, and PCI-DSS compliance.',
    enterpriseImpact: 'Enables instant sub-second retrieval across millions of dense vectors without vendor lock-in or public cloud egress leakage.',
    color: '#818CF8',
    iconName: 'Database',
    specs: {
      latency: '< 8ms vector retrieval (1536-dim)',
      throughput: '120,000 Kafka events/sec',
      protocol: 'gRPC / pgvector HNSW / Kafka',
      uptimeSLA: '99.995% High Availability',
      encryption: 'AES-256-GCM at rest & in transit',
      errorTolerance: 'Zero data loss (3x replication)'
    },
    techDocs: {
      overview: 'Layer 5 provides persistent vector memory and event stream orchestration. Utilizes self-hosted PostgreSQL with pgvector (HNSW indexing with m=16, ef_construction=64) and Apache Kafka cluster for distributed telemetry pub/sub. Zero external cloud API dependencies.',
      endpoints: [
        {
          method: 'POST',
          path: '/api/v2/vector/search-knn',
          description: 'Performs cosine similarity search over 1536-dim multi-modal document and spatial mesh embeddings.',
          samplePayload: JSON.stringify({ collection: "primebank_kyc_vectors", queryVectorLength: 1536, topK: 5, minSimilarityScore: 0.89 }, null, 2)
        },
        {
          method: 'gRPC',
          path: 'spenta.storage.v2.EventStreamService/PublishEvent',
          description: 'High-throughput Kafka topic event publishing with air-gapped schema validation.',
          samplePayload: JSON.stringify({ topic: "scada.factory.sensors", payloadBytes: 4096, partitionKey: "turbine_assembly_zone_04" }, null, 2)
        }
      ],
      memoryAllocation: '32 GB RAM per pgvector cluster node (shared_buffers = 8GB, work_mem = 64MB)',
      supportedRuntimes: ['PostgreSQL 16.2 + pgvector 0.7.0', 'Apache Kafka 3.7 (Kraft Mode)', 'MinIO Object Store K8s'],
      sampleCodeSnippet: {
        language: 'rust',
        title: 'Air-Gapped Vector Query Service in Rust',
        code: `use sqlx::postgres::PgPool;
use pgvector::Vector;

pub async fn query_document_embeddings(
    pool: &PgPool,
    embedding: Vector,
    limit: i64,
) -> Result<Vec<DocumentMatch>, sqlx::Error> {
    sqlx::query_as!(
        DocumentMatch,
        "SELECT id, client_id, 1 - (embedding <=> $1) AS cosine_score 
         FROM enterprise_vector_index 
         ORDER BY embedding <=> $1 LIMIT $2",
        embedding,
        limit
    )
    .fetch_all(pool)
    .await
}`
      },
      complianceMapping: ['PCI-DSS v4.0 Requirement 3 (Protect Stored Account Data)', 'GDPR Article 32 (Security of Processing)', 'ISO/IEC 27001 Annex A.10']
    }
  },
  {
    level: 4,
    id: 'layer-4',
    title: 'Immersive Spatial Simulation Engine Contracts',
    subtitle: 'Photorealistic real-time rendering, deterministic physics, and spatial digital twins',
    techStack: ['Unreal Engine 5 (Nanite & Lumen)', 'Unity 3D', 'Apple ARKit', 'Google ARCore', 'OpenXR Pipelines'],
    touchpoints: 'Hospital wayfinding walkthroughs, procedural VR cleanroom operator certifications, anamorphic 3D billboard spectacles.',
    securityGovernance: 'Air-gapped simulation runtimes, local asset compilation, encrypted 3D telemetry streams.',
    enterpriseImpact: 'Reduces training accidents by 96% and physical prototyping cycles from months to days via true-to-scale digital twins.',
    color: '#C084FC',
    iconName: 'Layers',
    specs: {
      latency: '< 11.1ms (90 Hz native XR)',
      throughput: '1.2B polys rendered via Nanite',
      protocol: 'OpenXR / glTF / WebGL2 / WebGPU',
      uptimeSLA: '99.95% engine runtime',
      encryption: 'Signed binary checksum verification',
      errorTolerance: '< 0.05% collision mesh deviation'
    },
    techDocs: {
      overview: 'Layer 4 delivers real-time spatial simulation with sub-millimeter geometric accuracy. Nanite streaming virtualizes billions of polygons without manual LOD authoring. Lumen hardware ray-tracing simulates accurate surgical lighting in hospital twins and cleanroom simulations.',
      endpoints: [
        {
          method: 'WS',
          path: 'wss://runtime.spenta.internal/v2/spatial/nanite-stream',
          description: 'Continuous binary glTF/DRACO mesh geometry streaming for multi-user WebXR collaborative workspaces.',
          samplePayload: JSON.stringify({ assetId: "twin_cleanroom_samsung_01", lodLevel: "Nanite_FullPrecision", deltaPosMm: [0.12, -0.04, 0.01] }, null, 2)
        },
        {
          method: 'GET',
          path: '/api/v2/physics/collision-audit',
          description: 'Audits physical clearance constraints and equipment tolerances in virtual cleanroom SOP setups.',
          samplePayload: JSON.stringify({ collisionDetected: false, minClearanceMm: 142.5, qualificationPass: true }, null, 2)
        }
      ],
      memoryAllocation: '6.4 GB VRAM per UE5 headless rendering instance (NVIDIA RTX 4090 / A10G)',
      supportedRuntimes: ['Unreal Engine 5.4 Pixel Streaming', 'Unity 2023.3 LTS', 'OpenXR Spec 1.1', 'WebGPU Chrome 122+'],
      sampleCodeSnippet: {
        language: 'cpp',
        title: 'OpenXR 6-DoF Pose Injector in C++',
        code: `#include "SpentaXRRuntime.h"

void USpentaSpatialComponent::TickComponent(float DeltaTime, ELevelTick TickType) {
    Super::TickComponent(DeltaTime, TickType);
    FTransform OutTransform;
    if (SpentaSpatialAPI::GetLatest6DoFPose(DeviceHandle, OutTransform)) {
        SetWorldTransform(OutTransform);
        BroadcastTelemetryEvent("6dof_updated", OutTransform.GetLocation());
    }
}`
      },
      complianceMapping: ['OpenXR 1.1 Conformance', 'FDA 21 CFR Part 11 (Electronic Records for Cleanroom VR)', 'ISO 13485 Medical Simulation']
    }
  },
  {
    level: 3,
    id: 'layer-3',
    title: 'Machine Intelligence & Multimodal Reasoning Contracts',
    subtitle: 'Self-hosted vision LLMs, entity extraction, and spatio-temporal predictive models',
    techStack: ['LLaMA 3.2 Vision (Self-Hosted)', 'LayoutLM v3', 'spaCy NER', 'PyTorch / TensorFlow', 'Whisper ASR'],
    touchpoints: 'Automated KYC document classification, multilingual voice intent parsing, SCADA anomaly detection.',
    securityGovernance: 'Zero third-party public LLM API calls; all weights executed on client-controlled GPU clusters with full HITL audit queues.',
    enterpriseImpact: 'Cuts form processing from 20 mins to <30 seconds (-97%) and lifts fraud pattern detection by 300%.',
    color: '#34D399',
    iconName: 'Cpu',
    specs: {
      latency: '< 180ms OCR / 320ms Multimodal LLM',
      throughput: '85 concurrent token streams/GPU',
      protocol: 'TensorRT-LLM / Triton Server / REST',
      uptimeSLA: '99.99% model inference cluster',
      encryption: 'Zero weight exfiltration air-gap',
      errorTolerance: '99.4% F1 extraction accuracy'
    },
    techDocs: {
      overview: 'Layer 3 houses the multimodal intelligence stack. Self-hosted LLaMA 3.2 Vision (11B parameters quantized to INT8 via TensorRT-LLM) and LayoutLM v3 process unstructured scanned documents, checks, and IDs with human-in-the-loop (HITL) confidence verification thresholds.',
      endpoints: [
        {
          method: 'POST',
          path: '/api/v2/intelligence/ocr/extract-kyc',
          description: 'Ingests raw multi-page scanned PDF or image, detects bounding boxes, extracts key-value pairs with confidence scores.',
          samplePayload: JSON.stringify({ docId: "bankdoc_prime_88129", extractedFields: { nidNumber: "9120-4491-002", fullName: "Zubair Al-Hossain", dob: "1988-04-12", matchConfidence: 0.998 }, latencyMs: 174 }, null, 2)
        },
        {
          method: 'POST',
          path: '/api/v2/intelligence/voice/whisper-dispatch',
          description: 'Multilingual speech-to-text inference with domain-specific acoustic model fine-tuning.',
          samplePayload: JSON.stringify({ audioDurationSec: 4.2, languageDetected: "bn-BD", transcription: "Stock ledger for chemical batch 44 updated successfully.", confidenceScore: 0.992 }, null, 2)
        }
      ],
      memoryAllocation: '18 GB VRAM per INT8 quantized LLaMA 3.2 Vision worker (Triton Inference Server)',
      supportedRuntimes: ['NVIDIA Triton Inference Server 24.04', 'TensorRT-LLM 0.9.0', 'CUDA 12.4', 'PyTorch 2.3'],
      sampleCodeSnippet: {
        language: 'python',
        title: 'Air-Gapped PrimeOCR Inference Handler',
        code: `from spenta_neural import PrimeVisionPipeline, TensorRTBackend

class PrimeOCRService:
    def __init__(self, model_path: str):
        self.backend = TensorRTBackend(model_path, precision="int8")
        self.pipeline = PrimeVisionPipeline(self.backend)

    def extract_document(self, raw_bytes: bytes) -> dict:
        tensors = self.pipeline.preprocess_spatial_image(raw_bytes)
        predictions = self.backend.infer(tensors)
        return self.pipeline.format_kyc_entities(predictions, confidence_threshold=0.95)`
      },
      complianceMapping: ['Bangladesh Bank ICT Security Guideline 2023 § 5.4', 'SOC 2 Type II Trust Services Criteria (Confidentiality)', 'NIST SP 800-53 Rev 5 (IA-5)']
    }
  },
  {
    level: 2,
    id: 'layer-2',
    title: 'Edge Processing & Protocol Network Contracts',
    subtitle: 'Quantized on-device neural inference and ultra-low latency telemetry messaging',
    techStack: ['WebAssembly (Wasm)', 'MQTT Pub/Sub', 'EdgeX Foundry', 'ONNX Runtime', 'WebSockets'],
    touchpoints: 'Factory floor vibration sensors, smart eyewear gesture recognition, sub-millisecond edge anomaly detection.',
    securityGovernance: 'Cryptographically signed edge binaries, mTLS hardware device certificates, zero remote code execution risk.',
    enterpriseImpact: 'Compresses and filters high-bandwidth raw sensor feeds at the device edge, reducing cloud bandwidth costs by 80%.',
    color: '#FBBF24',
    iconName: 'Zap',
    specs: {
      latency: '< 2.4ms edge on-device inference',
      throughput: '25,000 telemetry msgs/sec node',
      protocol: 'MQTT 5.0 / Wasm / mTLS / WebSockets',
      uptimeSLA: '99.999% localized edge runtime',
      encryption: 'Hardware root of trust / TPM 2.0',
      errorTolerance: '< 0.0001% bit corruption rate'
    },
    techDocs: {
      overview: 'Layer 2 executes compiled WebAssembly (Wasm SIMD128) and ONNX micro-runtime binaries directly on local gateway appliances and edge microcontrollers. Filters noise and computes FFT vibration spectrums before dispatching anomalies via MQTT 5.0.',
      endpoints: [
        {
          method: 'MQTT',
          path: 'spenta/edge/scada/+/vibration/spectrum',
          description: 'Subscribes to high-frequency 10 kHz accelerometer feeds, calculates edge kurtosis and RMS velocity.',
          samplePayload: JSON.stringify({ sensorId: "accel_bearing_3b", rmsVelocityMmS: 2.14, peakKurtosis: 3.42, anomalyState: "NORMAL" }, null, 2)
        },
        {
          method: 'POST',
          path: '/api/v2/edge/wasm/deploy-binary',
          description: 'Over-the-air (OTA) signed cryptographic deployment of updated Wasm edge filter logic.',
          samplePayload: JSON.stringify({ binaryHashSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", deploymentTargetNodes: 48, status: "VERIFIED_ACTIVE" }, null, 2)
        }
      ],
      memoryAllocation: '128 MB RAM on industrial edge gateways (e.g. Advantech / Siemens IPC)',
      supportedRuntimes: ['Wasmtime Core 20.0', 'ONNX Runtime Edge 1.18', 'Eclipse Mosquitto 2.0 MQTT', 'EdgeX Foundry v3'],
      sampleCodeSnippet: {
        language: 'rust',
        title: 'Wasm Edge Filter Logic in Rust',
        code: `#[no_mangle]
pub extern "C" fn process_sensor_frame(ptr: *const f32, len: usize) -> u32 {
    let slice = unsafe { std::slice::from_raw_parts(ptr, len) };
    let rms: f32 = (slice.iter().map(|&x| x * x).sum::<f32>() / len as f32).sqrt();
    if rms > 4.50 {
        1 // ANOMALY_TRIGGER
    } else {
        0 // NOMINAL_RANGE
    }
}`
      },
      complianceMapping: ['IEC 62443-4-2 (Security for Industrial Automation Systems)', 'mTLS X.509 Device Certificate Validation', 'NIST Cybersecurity Framework']
    }
  },
  {
    level: 1,
    id: 'layer-1',
    title: 'Physical Sensing & Telemetry Hardware Ingest',
    subtitle: 'Wearable eyewear cameras, spatial microphones, LiDAR scanners, and IIoT arrays',
    techStack: ['Ray-Ban Meta Eyewear', 'LiDAR Point Clouds', '6-DoF IMU Arrays', 'Bluetooth Low Energy (BLE)', 'Industrial SCADA'],
    touchpoints: 'First-person wearable POV streaming, factory machinery telemetry, indoor beacon positioning grids.',
    securityGovernance: 'Physical tamper detection, opt-in biometric stream ingestion, strict hardware perimeter boundaries.',
    enterpriseImpact: 'Acts as the perceptual eyes and ears for Physical AI, transforming real-world physical space into structured live data.',
    color: '#FB7185',
    iconName: 'Glasses',
    specs: {
      latency: '< 5ms sensor capture & packetization',
      throughput: '4K 60fps video + 6-DoF IMU @ 1kHz',
      protocol: 'BLE 5.3 / Wi-Fi 7 / RTSP / Modbus',
      uptimeSLA: '99.9% sensor connectivity',
      encryption: 'AES-128 sensor payload pairing',
      errorTolerance: '< 1mm LiDAR spatial precision'
    },
    techDocs: {
      overview: 'Layer 1 represents the raw physical perceptual boundary. Captures continuous 6-DoF inertial movement (IMU 1000 Hz), stereo RGB camera frames, sub-GHz BLE 5.3 indoor wayfinding beacons, and Modbus/Profibus industrial sensors with sub-millimeter precision.',
      endpoints: [
        {
          method: 'GET',
          path: '/api/v2/hardware/sensor-matrix/status',
          description: 'Polls hardware sensor array health, battery telemetry, and optical calibration matrices.',
          samplePayload: JSON.stringify({ arrayId: "wearable_meta_smart_09", cameraFps: 60, imuSamplingHz: 1000, bleBeaconSync: "12_active", batteryLevel: 94 }, null, 2)
        },
        {
          method: 'WS',
          path: 'wss://hardware.spenta.internal/v2/imu/quaternion-stream',
          description: 'Real-time binary orientation quaternion stream for headless spatial tracking.',
          samplePayload: JSON.stringify({ qW: 0.7071, qX: 0.0, qY: 0.7071, qZ: 0.0, timestampMicros: 1723899201948 }, null, 2)
        }
      ],
      memoryAllocation: 'Direct DMA buffer ring allocator (Zero-copy kernel bypass)',
      supportedRuntimes: ['OpenXR 1.1 Vendor Extensions', 'Linux V4L2 Subsystem', 'Zephyr RTOS for Wearables', 'Modbus RTU/TCP Driver'],
      sampleCodeSnippet: {
        language: 'cpp',
        title: 'Zero-Copy IMU Packetization in C++',
        code: `#include <spenta/hardware/imu_packet.h>

void on_imu_interrupt(const raw_imu_registers* regs) {
    spenta_imu_payload payload;
    payload.timestamp_ns = get_monotonic_clock_ns();
    payload.quat = compute_fused_orientation(regs->accel, regs->gyro);
    dma_ring_buffer_push(&G_SensorBuffer, &payload, sizeof(payload));
}`
      },
      complianceMapping: ['FCC Part 15 / CE RED Compliance', 'Bluetooth SIG Qualification (BLE 5.3)', 'RoHS 3 (2015/863/EU)']
    }
  }
];

export const FINANCIAL_TIERS: FinancialTier[] = [
  // Model A: Micro-Projects
  {
    id: 'tier-a1',
    category: 'A',
    code: 'Model A1',
    name: 'Entry Micro-Project Pilot',
    rangeUsd: '$500 – $1,500',
    rangeBdt: '61.3k – 184k ৳',
    baselineUsd: 1200,
    deliveryTimeline: '1 – 2 Weeks',
    scopeSummary: 'Single-Product WebAR Try-On or Entry Customer Service AI Assistant.',
    teamAllocation: ['Full-Stack Dev + QA (25 hrs)', 'AR/VR Engineer (18 hrs)', 'AI/ML Engineer (15 hrs)', 'UI/UX & 3D Designer (12 hrs)'],
    billableHours: 70,
    cogsPercent: 58.0,
    grossMarginPercent: 42.0,
    cacPercent: 14.0,
    overheadPercent: 8.0,
    netMarginPercent: 20.0,
    costBreakdownUsd: {
      engineeringLabor: 370,
      spatialDesignLabor: 96,
      aiDevLabor: 150,
      cloudCompute: 50,
      salesCac: 168,
      overheadReserve: 96
    }
  },
  {
    id: 'tier-a2',
    category: 'A',
    code: 'Model A2',
    name: 'Standard Micro-Project Baseline',
    rangeUsd: '$1,500 – $3,000',
    rangeBdt: '184k – 368k ৳',
    baselineUsd: 2200,
    deliveryTimeline: '2 – 3 Weeks',
    scopeSummary: 'Multi-Product Interactive WebAR Catalog Viewer or Domain-Specific RAG Chatbot.',
    teamAllocation: ['Full-Stack Dev + QA (35 hrs)', 'AR/VR Engineer (28 hrs)', 'AI/ML Engineer (24 hrs)', 'UI/UX Designer (18 hrs)'],
    billableHours: 105,
    cogsPercent: 60.0,
    grossMarginPercent: 40.0,
    cacPercent: 13.5,
    overheadPercent: 8.0,
    netMarginPercent: 18.5,
    costBreakdownUsd: {
      engineeringLabor: 720,
      spatialDesignLabor: 220,
      aiDevLabor: 300,
      cloudCompute: 80,
      salesCac: 297,
      overheadReserve: 176
    }
  },
  {
    id: 'tier-a3',
    category: 'A',
    code: 'Model A3',
    name: 'Advanced Micro-Project Cap',
    rangeUsd: '$3,500 – $5,000',
    rangeBdt: '430k – 613k ৳',
    baselineUsd: 4500,
    deliveryTimeline: '3 – 4 Weeks',
    scopeSummary: 'Full WebAR E-Commerce Store Integration or Conversational Voice Assistant Prototype.',
    teamAllocation: ['Full-Stack Dev + QA (55 hrs)', 'AR/VR Specialist (45 hrs)', 'AI/ML Specialist (40 hrs)', '3D Technical Artist (28 hrs)'],
    billableHours: 168,
    cogsPercent: 59.0,
    grossMarginPercent: 41.0,
    cacPercent: 13.0,
    overheadPercent: 8.5,
    netMarginPercent: 19.5,
    costBreakdownUsd: {
      engineeringLabor: 1450,
      spatialDesignLabor: 485,
      aiDevLabor: 580,
      cloudCompute: 140,
      salesCac: 585,
      overheadReserve: 382
    }
  },

  // Model B: Mid-Market
  {
    id: 'tier-b1',
    category: 'B',
    code: 'Model B1',
    name: 'Mid-Market Entry Solution',
    rangeUsd: '$5,000 – $12,000',
    rangeBdt: '613k – 1.47M ৳',
    baselineUsd: 10000,
    deliveryTimeline: '4 – 6 Weeks',
    scopeSummary: 'Single-Facility 3D Digital Twin + AI Guide, 3D DOOH Anamorphic Billboard Spot, or Event Floor Kiosk Game.',
    teamAllocation: ['Lead Solution Architect', 'Senior Backend Dev', '3D Technical Artist', 'UI/UX Designer', 'QA Tester', 'Project Manager'],
    billableHours: 320,
    cogsPercent: 62.0,
    grossMarginPercent: 38.0,
    cacPercent: 12.0,
    overheadPercent: 8.0,
    netMarginPercent: 18.0,
    costBreakdownUsd: {
      engineeringLabor: 3600,
      spatialDesignLabor: 1800,
      aiDevLabor: 0,
      cloudCompute: 800,
      salesCac: 1200,
      overheadReserve: 800
    }
  },
  {
    id: 'tier-b2',
    category: 'B',
    code: 'Model B2',
    name: 'Mid-Market Standard Commercial',
    rangeUsd: '$12,000 – $20,000',
    rangeBdt: '1.47M – 2.45M ৳',
    baselineUsd: 16000,
    deliveryTimeline: '6 – 8 Weeks',
    scopeSummary: 'Real Estate 3D Walkthrough with AI Realtor Agent, Multi-Level Cleanroom VR Training Module, or Retail Mall AR Wayfinding.',
    teamAllocation: ['Lead Architect (Dhaka/US)', '2 Senior Developers', '3D Technical Lead', 'UI/UX Specialist', 'DevOps Engineer', 'QA + PM'],
    billableHours: 540,
    cogsPercent: 60.0,
    grossMarginPercent: 40.0,
    cacPercent: 12.5,
    overheadPercent: 8.5,
    netMarginPercent: 19.0,
    costBreakdownUsd: {
      engineeringLabor: 5600,
      spatialDesignLabor: 2800,
      aiDevLabor: 0,
      cloudCompute: 1200,
      salesCac: 2000,
      overheadReserve: 1360
    }
  },
  {
    id: 'tier-b3',
    category: 'B',
    code: 'Model B3',
    name: 'Mid-Market Advanced Solution',
    rangeUsd: '$20,000 – $30,000',
    rangeBdt: '2.45M – 3.68M ৳',
    baselineUsd: 25000,
    deliveryTimeline: '8 – 10 Weeks',
    scopeSummary: 'Full-Scale E-Commerce WebAR + Mall BLE Navigation, Multilingual WhatsApp Voice ERP, or Predictive SCADA Edge Engine.',
    teamAllocation: ['Lead Enterprise Architect', '3 Senior Backend/AI Devs', '2 3D Shader Artists', 'DevOps Engineer', 'QA Lead', 'Dedicated PM'],
    billableHours: 820,
    cogsPercent: 58.0,
    grossMarginPercent: 42.0,
    cacPercent: 12.5,
    overheadPercent: 8.5,
    netMarginPercent: 21.0,
    costBreakdownUsd: {
      engineeringLabor: 8800,
      spatialDesignLabor: 4200,
      aiDevLabor: 0,
      cloudCompute: 1500,
      salesCac: 3125,
      overheadReserve: 2125
    }
  },

  // Model C: Enterprise
  {
    id: 'tier-c1',
    category: 'C',
    code: 'Model C1',
    name: 'Enterprise Tier 1 Platform',
    rangeUsd: '$40,000 – $60,000',
    rangeBdt: '4.90M – 7.35M ৳',
    baselineUsd: 50000,
    deliveryTimeline: '10 – 12 Weeks',
    scopeSummary: 'Comprehensive Hospital Digital Twin + Multilingual Intake Kiosks + Pre-Op VR Orientation System.',
    teamAllocation: ['Principal Systems Architect', '3 Full-Stack Backend Engineers', '2 WebXR / Shader Devs', 'DevOps / K8s Lead', 'Compliance QA', 'Account Director'],
    billableHours: 1400,
    cogsPercent: 57.0,
    grossMarginPercent: 43.0,
    cacPercent: 12.0,
    overheadPercent: 8.5,
    netMarginPercent: 22.5,
    costBreakdownUsd: {
      engineeringLabor: 18500,
      spatialDesignLabor: 6500,
      aiDevLabor: 0,
      cloudCompute: 3500,
      salesCac: 6000,
      overheadReserve: 4250
    }
  },
  {
    id: 'tier-c2',
    category: 'C',
    code: 'Model C2',
    name: 'Enterprise Tier 2 Deployment',
    rangeUsd: '$60,000 – $80,000',
    rangeBdt: '7.35M – 9.80M ৳',
    baselineUsd: 70000,
    deliveryTimeline: '12 – 14 Weeks',
    scopeSummary: 'On-Premise Banking AI IDP Platform (PrimeOCR / BankDoc) + Custom Model Training + Year 1 Platinum SLA.',
    teamAllocation: ['Lead Enterprise Architect', '4 Backend & ML Engineers', '2 WebXR / Frontend Devs', 'SecOps Specialist', 'QA Specialist', 'Dedicated Account PM'],
    billableHours: 2100,
    cogsPercent: 55.0,
    grossMarginPercent: 45.0,
    cacPercent: 12.0,
    overheadPercent: 8.5,
    netMarginPercent: 24.5,
    costBreakdownUsd: {
      engineeringLabor: 26000,
      spatialDesignLabor: 5500,
      aiDevLabor: 0,
      cloudCompute: 7000,
      salesCac: 8400,
      overheadReserve: 5950
    }
  },
  {
    id: 'tier-c3',
    category: 'C',
    code: 'Model C3',
    name: 'Enterprise Tier 3 Flagship',
    rangeUsd: '$80,000 – $100,000+',
    rangeBdt: '9.80M – 12.26M+ ৳',
    baselineUsd: 90000,
    deliveryTimeline: '14 – 16 Weeks',
    scopeSummary: 'National Logistics Multi-Modal Routing Engine + Industrial Predictive SCADA + Multi-Site Digital Twins + High-Volume ARR.',
    teamAllocation: ['Lead Enterprise Architect', '5 Multidisciplinary Engineers', '2 3D Technical Artists', 'SecOps/DevOps Lead', 'Full QA Pod', 'Senior Account Executive'],
    billableHours: 2800,
    cogsPercent: 55.0,
    grossMarginPercent: 45.0,
    cacPercent: 12.0,
    overheadPercent: 8.0,
    netMarginPercent: 25.0,
    costBreakdownUsd: {
      engineeringLabor: 34500,
      spatialDesignLabor: 7500,
      aiDevLabor: 0,
      cloudCompute: 7500,
      salesCac: 10800,
      overheadReserve: 7200
    }
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'prime-bank',
    client: 'Prime Bank',
    industry: 'Banking & Financial Intelligence',
    headline: 'On-Premise Hybrid PrimeOCR Slashes KYC Verification from 20m to <30s',
    tag: '450% 3-Year ROI',
    solution: 'Hybrid Vision AI pipeline combining self-hosted LLaMA 3.2 Vision, LayoutLM v3, and optimized OCR with human-in-the-loop audit verification. Deployed on-premise to comply strictly with national banking data privacy and PCI-DSS regulations.',
    techStack: ['LLaMA 3.2 Vision', 'LayoutLM v3', 'pgvector', 'Docker / K8s', 'React'],
    metrics: [
      { label: 'Form Processing Time', value: '<30s', sublabel: 'Reduced from 17.5 mins (-97%)', highlight: true },
      { label: 'Manual Workload Cut', value: '90%', sublabel: 'Automated data extraction', highlight: true },
      { label: 'Branch Drop-Off', value: '-40%', sublabel: 'Faster customer onboarding' },
      { label: 'Fraud Detection Lift', value: '+300%', sublabel: 'Algorithmic pattern cross-matching' }
    ],
    quote: 'Spenta transformed our back-office onboarding bottleneck into a near-instantaneous competitive advantage while keeping 100% of sensitive customer records behind our internal firewalls.'
  },
  {
    id: 'samsung-biologics',
    client: 'Samsung Biologics',
    industry: 'Pharma & Cleanroom VR',
    headline: 'Certified Procedural VR Cleanroom Training for High-Containment Operators',
    tag: 'Zero Downtime',
    solution: 'Interactive 6-DoF multi-user cleanroom simulation built in Unreal Engine 5. Replicates sterile gowning, airlock decontamination, and bioreactor maintenance protocols, eliminating millions in cleanroom setup waste.',
    techStack: ['Unreal Engine 5', 'Nanite', 'Lumen', 'OpenXR', 'Photon Fusion'],
    metrics: [
      { label: 'Training Cost Reduction', value: '70%', sublabel: 'Less consumable lab waste', highlight: true },
      { label: 'Safety Breaches', value: '0', sublabel: 'Zero fatal SOP infractions' },
      { label: 'Certification Velocity', value: '3.2x', sublabel: 'Faster onboarding cycle', highlight: true },
      { label: 'Audit Compliance', value: '100%', sublabel: 'International biopharma standards' }
    ]
  },
  {
    id: 'isho-webar',
    client: 'ISHO Furniture',
    industry: 'Spatial Commerce & Retail',
    headline: 'Frictionless Browser-Native WebAR 3D Product Try-On',
    tag: '+28% Conversion Lift',
    solution: 'App-less WebXR spatial visualizer embedded directly into e-commerce product pages. Customers place true-to-scale photorealistic 3D furniture into their physical living rooms using mobile browser AR.',
    techStack: ['WebXR', 'Three.js / WebGL', 'Google ARCore', 'Apple ARKit', 'Shopify API'],
    metrics: [
      { label: 'Checkout Conversion', value: '+28%', sublabel: 'Direct revenue lift', highlight: true },
      { label: 'Product Return Rate', value: '-22%', sublabel: 'Fewer sizing & color mismatches', highlight: true },
      { label: 'Session Dwell Time', value: '+3.5x', sublabel: 'Higher customer engagement' },
      { label: 'App Install Friction', value: '0MB', sublabel: 'Runs 100% in mobile browser' }
    ]
  },
  {
    id: 'apollo-hospital',
    client: 'Apollo JMI Hospital',
    industry: 'Healthcare Campus Digital Twin',
    headline: 'Interactive 3D Hospital Twin for Indoor Wayfinding & Surgical Triage',
    tag: '-40% Intake Delay',
    solution: 'Photogrammetry 3D scanning and Unreal Engine 5 digital twin integrated with BLE indoor beacon telemetry. Provides patients and emergency staff with turn-by-turn spatial navigation and pre-op virtual orientation.',
    techStack: ['Unreal Engine 5', 'BLE Beacons', 'EdgeX Foundry', 'HIPAA Local Cloud'],
    metrics: [
      { label: 'Intake Bottleneck Cut', value: '-40%', sublabel: 'Less visitor disorientation', highlight: true },
      { label: 'Wayfinding Precision', value: '<1.2m', sublabel: 'Sub-meter beacon accuracy' },
      { label: 'Pre-Op Anxiety Reduction', value: '62%', sublabel: 'Measured in patient surveys' },
      { label: 'Campus Square Footage', value: '250k', sublabel: 'Fully mapped 3D digital asset' }
    ]
  },
  {
    id: 'coca-cola-adidas',
    client: 'Coca-Cola, Adidas & Suzuki',
    industry: 'Entertainment & 3D DOOH',
    headline: 'Anamorphic 3D Billboards & Gesture Floor Games for Flagship Launches',
    tag: '5M+ Viral Reach',
    solution: 'Curved anamorphic 3D corner-billboard illusions and interactive floor kiosks with OpenCV gesture recognition for massive experiential audience engagement at premier shopping arenas.',
    techStack: ['Unreal Engine 5 Cinematics', 'OpenCV', 'Unity 3D', 'Redshift / Octane'],
    metrics: [
      { label: 'Engagement vs 2D Ads', value: '+350%', sublabel: 'Dwell time & photo capture', highlight: true },
      { label: 'Organic Social Views', value: '5.2M', sublabel: 'Viral reach across TikTok/Meta' },
      { label: 'Avg Kiosk Dwell', value: '4.2m', sublabel: 'Interactive play session' },
      { label: 'Brand Recall Lift', value: '+88%', sublabel: 'Post-event surveyed recall' }
    ]
  },
  {
    id: 'labaid-medical',
    client: 'LABAID VirtuED 3D',
    industry: 'EdTech & Medical AR/VR',
    headline: 'Curriculum-Aligned 3D Human Anatomy & Surgical Dissection Simulation',
    tag: '12 Medical Colleges',
    solution: 'Interactive 3D spatial medical atlas replacing costly physical cadaver specimens with high-fidelity procedural VR and tablet-based dissection simulators for medical college cohorts.',
    techStack: ['Unity 3D', 'Meta Horizon OS', 'WebGL', 'LMS Analytics'],
    metrics: [
      { label: 'Exam Score Lift', value: '+45%', sublabel: 'Improved spatial retention', highlight: true },
      { label: 'Cadaver Lab Expense', value: '-60%', sublabel: 'Physical lab upkeep reduction', highlight: true },
      { label: 'Medical Colleges', value: '12', sublabel: 'Accredited institution adoptions' },
      { label: 'Active Med Students', value: '4,500+', sublabel: 'Monthly platform users' }
    ]
  }
];

export const NON_CLIENT_STREAMS: NonClientStream[] = [
  {
    id: 'fab-unity',
    title: '3D Digital Asset Royalties',
    platform: 'Epic Games Fab & Unity Asset Store',
    payoutSplit: '88% (Fab) / 70% (Unity)',
    monthlyUsdRange: '$2,500 – $8,000 / mo',
    monthlyBdtRange: '306k – 980k ৳ / mo',
    grossMargin: '45.0%',
    netMargin: '25.0%',
    mechanics: 'Standardizing and publishing modular procedural 3D hospital rooms, industrial equipment, cleanrooms, and photogrammetry props developed during client projects onto global marketplaces.',
    precedent: 'Synty Studios built a multi-million-dollar passive catalog; KitBash3D acquired ArtStation & Sketchfab divisions.',
    icon: 'Box'
  },
  {
    id: 'uefn-roblox',
    title: 'Spatial Creator Economy',
    platform: 'Fortnite UEFN & Roblox DevEx',
    payoutSplit: 'Creator Economy 2.0 Pool ($0.0038 / Robux)',
    monthlyUsdRange: '$2,500 – $12,000 / mo',
    monthlyBdtRange: '306k – 1.47M ৳ / mo',
    grossMargin: '42.0%',
    netMargin: '21.5%',
    mechanics: 'Developing viral spatial mini-games, procedural obstacle courses, and brand virtual environments with automated player engagement pool payouts.',
    precedent: 'Top UEFN development teams capture $50k-$250k/mo from Epic Games engagement distribution pool.',
    icon: 'Gamepad2'
  },
  {
    id: 'micro-saas',
    title: 'Productized Gamified LMS Micro-SaaS',
    platform: 'Multi-Tenant B2B Subscription',
    payoutSplit: '$49 – $499 / user / mo',
    monthlyUsdRange: '$6,000 – $25,000 / mo',
    monthlyBdtRange: '735k – 3.06M ৳ / mo',
    grossMargin: '45.0%',
    netMargin: '24.5%',
    mechanics: 'Turning bespoke project assessment logic into a standalone web platform allowing trainers and educators to generate interactive 3D escape rooms with adaptive diagnostic logic.',
    precedent: 'Labster raised $147M serving 6M+ students across 3,000+ universities with gamified virtual STEM simulations.',
    icon: 'GraduationCap'
  },
  {
    id: 'teardown-smm',
    title: '3D Hardware Teardown Media',
    platform: 'YouTube Tech & Meta Creator Program',
    payoutSplit: '$10 – $25 RPM + Sponsorships',
    monthlyUsdRange: '$3,000 – $14,000 / mo',
    monthlyBdtRange: '368k – 1.72M ৳ / mo',
    grossMargin: '42.0%',
    netMargin: '22.0%',
    mechanics: 'Producing photorealistic 3D exploded-view animation teardowns of new consumer electronics (Apple Vision Pro, Ray-Ban Meta, GPU architectures) capturing premier B2B advertiser CPMs.',
    precedent: 'Branch Education commands $20k-$30k sponsorships per 3D hardware animation teardown with millions of views.',
    icon: 'Video'
  },
  {
    id: 'affiliates',
    title: 'Global Affiliates & Compute Referrals',
    platform: 'Amazon Influencer & GPU Cloud Referrals',
    payoutSplit: '15% – 25% Recurring Cloud Commissions',
    monthlyUsdRange: '$1,000 – $5,000 / mo',
    monthlyBdtRange: '122k – 613k ৳ / mo',
    grossMargin: '45.0%',
    netMargin: '25.0%',
    mechanics: 'On-page shoppable review videos on Amazon product listings + developer compute referrals for RunPod, Lambda Labs, and DigitalOcean.',
    precedent: 'OutlierKit and tech review influencers generate steady high-margin passive commission funnels.',
    icon: 'TrendingUp'
  }
];

export const COMPETITOR_DATA: CompetitorRow[] = [
  {
    attribute: 'Hourly Rate / Cost Profile',
    spenta: '$35 – $75/hr (Blended Dual-Shore)',
    westernAgencies: '$150 – $250/hr (Prohibitive)',
    commodityOutsourcers: '$15 – $30/hr (Unskilled)',
    rigidSaas: '$50k – $200k/yr Rigid Seat License'
  },
  {
    attribute: 'Data Sovereignty & Security',
    spenta: '100% On-Premise (Zero Cloud Leakage)',
    westernAgencies: 'Third-Party Cloud Dependent',
    commodityOutsourcers: 'Severe Governance & Security Risk',
    rigidSaas: 'Multi-Tenant Public Cloud Only'
  },
  {
    attribute: 'Technical Depth & Stack',
    spenta: 'Unreal Engine 5 Nanite + Self-Hosted Vision AI',
    westernAgencies: 'High Quality, Slow Delivery',
    commodityOutsourcers: 'Generic CRUD, No Real XR / Vision',
    rigidSaas: 'Inflexible Black-Box Feature Set'
  },
  {
    attribute: 'Gross Profit Margin Discipline',
    spenta: '32.5% – 45.0% (Sustainable & Audited)',
    westernAgencies: '30% – 50% (High Fixed Burn)',
    commodityOutsourcers: '1% – 5% (Commodity Trap)',
    rigidSaas: '70% – 85% (High Sales/CAC Burn)'
  },
  {
    attribute: 'Turnaround Velocity',
    spenta: '1–4 Wk Micro / 8–14 Wk Enterprise',
    westernAgencies: '6–9 Months Lengthy RFPs',
    commodityOutsourcers: 'Unpredictable Delivery Quality',
    rigidSaas: 'Instant Setup, Zero Customization'
  }
];

export const STARTUP_BENCHMARKS = [
  {
    name: 'STRIVR',
    sector: 'Enterprise VR Training',
    metric: '$100M+ Raised',
    description: 'Deployed across 10,000+ Walmart locations (200,000+ associates) and Bank of America (50,000+ staff), achieving a 96% reduction in training time. Validates Spenta’s Samsung Biologics cleanroom model.'
  },
  {
    name: 'OPERATOR XR [ASX:XRG]',
    sector: 'Listed Tactical XR Simulation',
    metric: '$13.2M AUD Receipts',
    description: 'Australian-listed tactical simulation pure-play scaled to $6.2M AUD ARR (+72% YoY) and 83% gross margins on enterprise software with 31% EBITDA. Validates high valuations in APAC.'
  },
  {
    name: 'LABSTER',
    sector: 'Gamified STEM & VR LMS',
    metric: '$147M Raised',
    description: 'Backed by Andreessen Horowitz and GGV Capital; serves 6M+ students across 3,000+ universities (Harvard, MIT, Stanford). Validates the B2B SaaS scalability of Spenta’s Escape Room LMS.'
  },
  {
    name: 'SYNTY STUDIOS & KITBASH3D',
    sector: 'Modular 3D Asset Ecosystems',
    metric: 'Multi-Million Net Royalty',
    description: 'Scaled from modular asset creators to acquiring Epic Games ArtStation and Sketchfab divisions. Validates Spenta packaging internal 3D assets onto Epic Fab.'
  },
  {
    name: 'BRANCH EDUCATION',
    sector: '3D Hardware Animation Media',
    metric: '$15–$25+ RPMs',
    description: 'High-retention 3D mechanical hardware teardowns on YouTube commanding $20k-$30k sponsorships and continuous Amazon storefront affiliate revenue.'
  }
];

export const PITCH_DECK_SLIDES = [
  {
    number: 1,
    title: 'Vision & The Defensible Tech Advantage',
    headline: 'Engineering Intelligent Reality for the Physical AI Era',
    badge: 'Slide 01 • Master Vision',
    points: [
      'Spenta fuses Immersive Spatial Computing (XR) with Enterprise Physical AI & Document Intelligence.',
      'We build the interactive perceptual layer that enables enterprises to attract audiences, simulate physical assets, and automate high-friction workflows.',
      'Delivered via an agile, high-margin dual-shore model: Global architecture (San Jose / Australia) paired with high-efficiency engineering delivery in Dhaka.'
    ],
    visualType: 'split-hero',
    metric: '$667.3B TAM by 2033 (41.1% CAGR)'
  },
  {
    number: 2,
    title: 'The Enterprise Problem Matrix',
    headline: 'Enterprises Face Spatial Disconnection, Document Friction & Prohibitive Costs',
    badge: 'Slide 02 • Problem Space',
    points: [
      'Spatial Disengagement: 2D screens fail to train industrial workforces effectively, convert retail shoppers, or visualize complex physical facilities.',
      'Manual Workflow Bottlenecks: Banking and healthcare staff spend 15–20 mins manually keying forms with 5% error rates and customer drop-off.',
      'Prohibitive Western Costs: Onshore agencies charge $150–$250/hr, making custom AI and XR transformations cost-prohibitive for mid-market firms.'
    ],
    visualType: 'pain-matrix',
    metric: '90% Manual Workload Reduction Needed'
  },
  {
    number: 3,
    title: 'The Solution: 6-Layer Fusion Architecture',
    headline: 'One Composable, API-First Stack from Sensing to Enterprise Action',
    badge: 'Slide 03 • Technical Stack',
    points: [
      'Two Capability Engines: The Experience Engine (WebAR, Digital Twins, VR Training) + The Operations Engine (PrimeOCR, 8 AI Assistants, WhatsApp Voice ERP).',
      '100% On-Premise & Composable: Deployed in private VPCs or on-premise hardware with zero third-party data leakage (HIPAA, SOC 2, PCI-DSS compliant).',
      'Adopt Incrementally: Clients can land with a $1,200 micro-project activation and expand into an $80,000 on-premise platform.'
    ],
    visualType: 'layer-stack',
    metric: '6-Layer Vertically Integrated Pipeline'
  },
  {
    number: 4,
    title: 'Dual-Engine Capability & Flagship Products',
    headline: 'From Event Attraction Attention to Deep Back-Office Automation',
    badge: 'Slide 04 • Product Portfolio',
    points: [
      'The Experience Engine: WebAR frictionless spatial commerce (ISHO), UE5 facility digital twins (Apollo Hospital), and procedural VR training (Samsung Biologics).',
      'The Operations Engine: PrimeOCR hybrid document intelligence (Prime Bank), 8 omni-vertical reasoning assistants, and WhatsApp-native Voice ERP.',
      'Proprietary On-Premise LLM: Self-hosted LLaMA 3.2 Vision and LayoutLM guarantee data sovereignty for regulated institutions.'
    ],
    visualType: 'dual-engine',
    metric: '450% 3-Year ROI (Prime Bank)'
  },
  {
    number: 5,
    title: 'Macro Catalyst: Big Tech Hardware Wave',
    headline: 'The Spatial Hardware Influx Unlocks the $667B Physical AI Market',
    badge: 'Slide 05 • Market Catalyst',
    points: [
      'Big Tech Mass Production: Meta shipped 7M+ Ray-Ban smart glasses in 2025; Google, Samsung & Qualcomm launched Android XR; Apple scaling visionOS.',
      'Hardware as Sensory Ingest: Smart glasses provide outward RGB cameras, spatial audio, and LiDAR, acting as the perceptual eyes and ears for multimodal AI.',
      'First-Mover Software Advantage: Spenta’s L1–L6 Fusion stack provides enterprise software ready to deploy on this newly deployed hardware base.'
    ],
    visualType: 'hardware-race',
    metric: '7M+ Smart Glasses Shipped (2025)'
  },
  {
    number: 6,
    title: 'Granular Business Domain Applications',
    headline: 'Proven Cross-Domain Enterprise Deployments',
    badge: 'Slide 06 • Cross-Domain',
    points: [
      'Tourism & Cultural Heritage: 3D photogrammetry mapping + AI Multilingual Tour Guides ($10k–$35k USD).',
      'Real Estate & Realtors: 3D interactive walkthroughs + Conversational AI Realtor Agents ($4k–$18k USD).',
      'E-Commerce & Malls: WebAR try-before-you-buy + BLE indoor wayfinding ($12k–$45k USD).',
      'Hospitals & Healthcare: Digital twin patient wayfinding + automated intake kiosks ($20k–$65k USD).'
    ],
    visualType: 'domain-grid',
    metric: '11 Granular Monetization Vectors'
  },
  {
    number: 7,
    title: 'Recalibrated 9-Tier Unit Economics',
    headline: 'Sustainable Margins Capped at ≤45% Gross & ≤25% Net Profit',
    badge: 'Slide 07 • Financial Discipline',
    points: [
      'Model A (Micro-Projects $800–$5k): 4-person agile pod (Dev+QA, AR/VR, AI/ML, UI/UX Designer) with 40%–42% gross margin and 18%–20% net margin.',
      'Model B (Mid-Market $5k–$30k): 7-role multidisciplinary team with 38%–42% gross margin and 18%–21% net margin.',
      'Model C (Enterprise Platforms $40k–$100k+): Full 8-role delivery team with 43%–45% gross margin and 22.5%–25% net operating margin.',
      'Strict Cost Absorption: All models fully account for full labor, cloud GPU compute, 12%–15% sales CAC, and 8%–10% lumpsum reserves.'
    ],
    visualType: 'economics-table',
    metric: 'Gross ≤45% • Net ≤25% Ceiling'
  },
  {
    number: 8,
    title: 'Verified Enterprise Case Studies & Traction',
    headline: 'Real-World Client ROI Across Banking, Healthcare, Pharma & Commerce',
    badge: 'Slide 08 • Traction',
    points: [
      'Prime Bank (PrimeOCR): Form processing dropped from 17.5 mins to <30s (-97%), 90% manual workload cut, 450% 3-year client ROI.',
      'Samsung Biologics: Certified procedural cleanroom VR training slashing training overhead by 70% with zero safety incidents.',
      'ISHO Spatial WebAR: 28% checkout conversion uplift and 22% reduction in product return rates.',
      'Global Credibility: Trusted by Adidas, Nike, Suzuki, Hyundai, BAT, Prime Bank, LABAID, and ISHO.'
    ],
    visualType: 'case-studies',
    metric: '-97% Processing Time Lift'
  },
  {
    number: 9,
    title: 'Non-Client, Passive & Social Commerce Streams',
    headline: 'Secondary High-Margin Cashflow Engines Diversifying Core Revenue',
    badge: 'Slide 09 • Passive IP',
    points: [
      '3D Asset Royalties: Catalog of 25 modular asset packs on Epic Games Fab (88% split) and Unity ($2,500–$8,000/mo).',
      'Spatial Creator Economy: Fortnite UEFN & Roblox DevEx maps producing $2,500–$12,000/mo in engagement payouts.',
      'Gamified LMS Micro-SaaS: B2B multi-tenant subscription ($49–$499/mo) yielding $6,000–$25,000/mo.',
      '3D Device Teardown Media: Exploded-view hardware reviews commanding $10–$25 RPMs + Amazon Influencer storefronts ($3,000–$14,000/mo).'
    ],
    visualType: 'passive-streams',
    metric: '$15k – $64k/mo Non-Client Inflow'
  },
  {
    number: 10,
    title: 'Real-World Startup Benchmarks & Proof',
    headline: 'Proven Market Precedents in Comparable Frontier Verticals',
    badge: 'Slide 10 • Precedents',
    points: [
      'Strivr ($100M+ Raised): 10,000+ Walmart locations & Bank of America; proves enterprise VR training demand.',
      'Operator XR [ASX:XRG]: $13.2M AUD customer receipts, $6.2M ARR (+72% YoY), 83% software gross margins on Australian ASX.',
      'Labster ($147M Raised): 6M+ students across Harvard, MIT, Stanford; proves B2B SaaS scalability of procedural STEM engines.',
      'KitBash3D & Synty: Multi-million asset catalogs; acquired ArtStation & Sketchfab divisions from Epic Games.'
    ],
    visualType: 'benchmarks',
    metric: '83% Gross Margins on ASX'
  },
  {
    number: 11,
    title: 'Competitive Moat & Dual-Shore Arbitrage',
    headline: 'Why Spenta Outperforms Western Agencies & Commodity Outsourcers',
    badge: 'Slide 11 • Competitive Moat',
    points: [
      'vs. Western Agencies ($150–$250/hr): Equal architectural quality and security compliance at 50% lower project cost and 2x faster turnaround.',
      'vs. Commodity IT Outsourcers ($15–$30/hr): Proprietary IP in UE5 Nanite, self-hosted LLaMA 3.2 Vision, and banking/HIPAA compliance that 1%–5% commodity shops cannot execute.',
      'vs. Rigid SaaS Vendors: Fully customizable and deployable 100% on-premise for absolute data sovereignty.'
    ],
    visualType: 'moat-matrix',
    metric: '40%–60% Global Cost Advantage'
  },
  {
    number: 12,
    title: 'The Investment Ask, Use of Funds & Milestones',
    headline: '$500,000 USD SAFE to Productize Core IP & Expand Global Sales',
    badge: 'Slide 12 • The Ask',
    points: [
      'Terms: $500,000 USD via standard Y Combinator Post-Money SAFE note at a $4.5M USD Valuation Cap (20% discount).',
      '40% ($200k) • Productize Fusion IP: Packaging PrimeOCR and Escape Room LMS into self-serve enterprise SDKs.',
      '35% ($175k) • Global Enterprise Sales & BD: Placing dedicated onshore enterprise account executives in Australia and North America.',
      '25% ($125k) • GPU Infrastructure & 18-Month Runway: Procuring on-premise NVIDIA GPU nodes and securing working capital reserves.',
      '12-Month Target: Reach $60,000 USD MRR in platform ARR, close 8 Australian enterprise pilots, and publish 50+ 3D asset packs on Epic Fab.'
    ],
    visualType: 'the-ask',
    metric: '$500k SAFE @ $4.5M Cap'
  }
];
