export interface FeedbackReply {
  id: string;
  text: string;
  timestamp: string;
}

export type FeedbackPriority = 'Critical Inquiry' | 'Strategic Suggestion' | 'General Feedback';

export interface FeedbackComment {
  id: string;
  text: string;
  section: string;
  timestamp: string;
  replies?: FeedbackReply[];
  priority?: FeedbackPriority;
}

export type Currency = 'USD' | 'BDT';

export const USD_TO_BDT_RATE = 122.61;

export interface FinancialTier {
  id: string;
  category: 'A' | 'B' | 'C';
  code: string;
  name: string;
  rangeUsd: string;
  rangeBdt: string;
  baselineUsd: number;
  deliveryTimeline: string;
  scopeSummary: string;
  teamAllocation: string[];
  billableHours?: number;
  cogsPercent: number;
  grossMarginPercent: number;
  cacPercent: number;
  overheadPercent: number;
  netMarginPercent: number;
  costBreakdownUsd: {
    engineeringLabor: number;
    spatialDesignLabor: number;
    aiDevLabor?: number;
    cloudCompute: number;
    salesCac: number;
    overheadReserve: number;
  };
}

export interface FusionLayerEndpoint {
  method: 'GET' | 'POST' | 'WS' | 'gRPC' | 'MQTT';
  path: string;
  description: string;
  samplePayload: string;
}

export interface FusionLayerTechDocs {
  overview: string;
  architectureDiagram?: string;
  endpoints: FusionLayerEndpoint[];
  memoryAllocation: string;
  supportedRuntimes: string[];
  sampleCodeSnippet: {
    language: string;
    title: string;
    code: string;
  };
  complianceMapping: string[];
}

export interface FusionLayer {
  level: number;
  id: string;
  title: string;
  subtitle: string;
  techStack: string[];
  touchpoints: string;
  securityGovernance: string;
  enterpriseImpact: string;
  color: string;
  iconName: string;
  specs?: {
    latency: string;
    throughput: string;
    protocol: string;
    uptimeSLA: string;
    encryption: string;
    errorTolerance: string;
  };
  techDocs?: FusionLayerTechDocs;
}

export interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  headline: string;
  tag: string;
  solution: string;
  techStack: string[];
  metrics: {
    label: string;
    value: string;
    sublabel: string;
    highlight?: boolean;
  }[];
  quote?: string;
}

export interface NonClientStream {
  id: string;
  title: string;
  platform: string;
  payoutSplit: string;
  monthlyUsdRange: string;
  monthlyBdtRange: string;
  grossMargin: string;
  netMargin: string;
  mechanics: string;
  precedent: string;
  icon: string;
}

export interface CompetitorRow {
  attribute: string;
  spenta: string;
  westernAgencies: string;
  commodityOutsourcers: string;
  rigidSaas: string;
}
