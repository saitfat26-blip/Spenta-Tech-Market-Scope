import { jsPDF } from 'jspdf';
import { Currency, USD_TO_BDT_RATE } from '../types';

export const generateBriefingPdf = (currency: Currency = 'USD') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [6, 182, 212]; // Cyan #06B6D4
  const darkBg: [number, number, number] = [7, 10, 16]; // Dark #070A10
  const slateText: [number, number, number] = [148, 163, 184]; // Slate 400
  const whiteText: [number, number, number] = [255, 255, 255];
  const emeraldText: [number, number, number] = [52, 211, 153]; // Emerald 400

  const rate = currency === 'USD' ? 1 : USD_TO_BDT_RATE;
  const currSym = currency === 'USD' ? '$' : '৳ ';
  const currSuffix = currency === 'USD' ? ' USD' : ' BDT';

  // --- PAGE 1: COVER & EXECUTIVE SUMMARY ---
  // Background
  doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
  doc.rect(0, 0, 210, 297, 'F');

  // Cyan Top Banner Stripe
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 6, 'F');

  // Header Title
  doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('SPENTA XR & PHYSICAL AI', 20, 25);

  doc.setFontSize(10);
  doc.setFont('courier', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('INVESTOR BRIEFING & STRATEGIC SINGLE SOURCE OF TRUTH (SSOT)', 20, 32);

  // Subtitle / Metadata
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`Dual-Shore Enterprise: San Jose, CA (USA) & Dhaka (Bangladesh) | Date: August 2026 | Currency: ${currency}`, 20, 39);

  // Divider Line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(20, 43, 190, 43);

  // Section 1: Executive Overview
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
  doc.text('1. EXECUTIVE SUMMARY & VENTURE ARCHITECTURE', 20, 52);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  const execSummary = [
    'Spenta bridges physical space and enterprise automation by pioneering a dual-engine commercial model:',
    '1. High-Performance Spatial Computing (Digital Twins, Unreal Engine 5 Nanite/Lumen, Procedural VR Simulation, WebXR).',
    '2. High-Precision Physical AI & Document Intelligence (PrimeOCR IDP, Bengali/English Multimodal LLMs, SCADA Telemetry).',
    'Backed by a high-leverage dual-shore operation (Executive/Client Strategy in San Jose; 24/7 Deep Engineering in Dhaka),',
    'Spenta delivers Tier-1 Silicon Valley execution quality at an 8:1 structural cost efficiency.'
  ];
  doc.text(execSummary, 20, 59);

  // Key Investment Highlights Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(20, 84, 170, 38, 3, 3, 'F');
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, 84, 170, 38, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('INVESTMENT ROUND HIGHLIGHTS (YC POST-MONEY SAFE)', 25, 92);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
  doc.text(`• Target Seed Capital:  ${currency === 'USD' ? '$500,000 USD' : '61.3M ৳'}`, 25, 100);
  doc.text(`• Post-Money Valuation Cap: ${currency === 'USD' ? '$4.5M USD' : '551.7M ৳'}`, 25, 106);
  doc.text('• Conversion Discount:     20.0% Standard Early Terms', 25, 112);
  doc.text('• 18-Month Operating Runway to $60,000 USD ARR and 8 Key Australian Pilots', 25, 118);

  // Section 2: 6-Layer Neural Fusion Stack
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
  doc.text('2. THE 6-LAYER NEURAL FUSION ARCHITECTURE', 20, 132);

  const layers = [
    { num: 'L6', name: 'Application Delivery', spec: '< 16ms 60FPS WebXR, Flutter, WhatsApp Business API' },
    { num: 'L5', name: 'Cloud & Vector Memory', spec: '< 8ms Milvus / pgvector, Kafka streaming, SOC2 on-prem' },
    { num: 'L4', name: 'Spatial Simulation', spec: '< 11.1ms UE5 Nanite/Lumen, 1.2B polys rendered, OpenXR' },
    { num: 'L3', name: 'Multimodal AI & OCR', spec: '< 180ms OCR, LLaMA 3.2 Vision, LayoutLM v3, zero cloud egress' },
    { num: 'L2', name: 'Edge Processing & Wasm', spec: '< 2.4ms quantized on-device inference, MQTT 5.0, TPM 2.0' },
    { num: 'L1', name: 'Physical Sensing Ingest', spec: 'LiDAR point clouds, Ray-Ban Meta eyewear, SCADA arrays' }
  ];

  let layerY = 140;
  layers.forEach((l) => {
    doc.setFillColor(15, 23, 42);
    doc.rect(20, layerY, 170, 8, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`[${l.num}] ${l.name}:`, 23, layerY + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(l.spec, 75, layerY + 5.5);
    layerY += 9.5;
  });

  // Section 3: Commercial Portfolios & 9-Tier Unit Economics
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
  doc.text('3. COMMERCIAL MODELS & UNIT ECONOMICS WATERFALL', 20, 208);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Audited unit economics ensuring disciplined gross margins (≤45.0%) and operating margins (≤25.0%):', 20, 215);

  // Table
  const tableData = [
    { tier: 'Model A: Micro-Projects', range: currency === 'USD' ? '$800 - $5k' : '98k - 613k ৳', gm: '42.0%', net: '20.0%', hours: '70-130h' },
    { tier: 'Model B: Mid-Market Solutions', range: currency === 'USD' ? '$5k - $30k' : '613k - 3.68M ৳', gm: '40.0%', net: '19.0%', hours: '320-800h' },
    { tier: 'Model C: Enterprise Platforms', range: currency === 'USD' ? '$40k - $100k+' : '4.9M - 12.2M+ ৳', gm: '38.0%', net: '18.0%', hours: '1200-2400h' }
  ];

  doc.setFillColor(30, 41, 59);
  doc.rect(20, 220, 170, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
  doc.text('Commercial Model', 23, 224.5);
  doc.text('Contract Range', 80, 224.5);
  doc.text('Gross Margin', 120, 224.5);
  doc.text('Net Operating', 145, 224.5);
  doc.text('Team Effort', 170, 224.5);

  let rowY = 227;
  tableData.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 15 : 20, i % 2 === 0 ? 23 : 30, i % 2 === 0 ? 42 : 50);
    doc.rect(20, rowY, 170, 7, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
    doc.text(row.tier, 23, rowY + 4.5);
    doc.text(row.range, 80, rowY + 4.5);
    doc.setTextColor(emeraldText[0], emeraldText[1], emeraldText[2]);
    doc.text(row.gm, 120, rowY + 4.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(row.net, 145, rowY + 4.5);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(row.hours, 170, rowY + 4.5);
    rowY += 7;
  });

  // Footer Page 1
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Spenta XR & Physical AI // Confidential Investor Briefing // Page 1 of 2', 20, 285);
  doc.text('Direct Inquiries: founders@spenta.io | San Jose & Dhaka', 120, 285);

  // --- PAGE 2: ROADMAP, TEAM & DEFENSIBILITY ---
  doc.addPage();
  doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
  doc.rect(0, 0, 210, 297, 'F');

  // Cyan Top Banner Stripe
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 6, 'F');

  // Page 2 Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
  doc.text('4. TECHNOLOGY & R&D ROADMAP (2024 – 2027)', 20, 22);

  const roadmapItems = [
    { phase: 'Phase 1 (Q1-Q4 2024)', status: 'COMPLETED', title: 'Core Spatial & IDP Engines', desc: 'Shipped PrimeOCR v1.0, WebXR showroom engine, and initial hospital wayfinding.' },
    { phase: 'Phase 2 (Q1-Q4 2025)', status: 'IN PRODUCTION', title: 'Dual-Shore Scale & Cleanroom Twin', desc: 'Deploying VR cleanroom simulation, LLaMA 3.2 Vision on-premise, and 8 Australian pilots.' },
    { phase: 'Phase 3 (Q1-Q4 2026)', status: 'ACTIVE EXECUTION', title: 'Physical AI & Spatial Eyewear HUD', desc: 'Ray-Ban Meta / Vision Pro field assist, real-time SCADA IoT bridge, multi-tenant B2B SaaS.' },
    { phase: 'Phase 4 (2027+)', status: 'TARGETED', title: 'Autonomous Multi-Agent Spatial Robotics', desc: 'Spatio-temporal neural world models for industrial robotics and global creator IP marketplace.' }
  ];

  let roadY = 30;
  roadmapItems.forEach((rm) => {
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(20, roadY, 170, 16, 2, 2, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${rm.phase} [${rm.status}]`, 24, roadY + 5.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
    doc.text(rm.title, 85, roadY + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(rm.desc, 24, roadY + 11.5);
    roadY += 19;
  });

  // Section 5: Executive Leadership
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
  doc.text('5. EXECUTIVE LEADERSHIP & DUAL-SHORE ADVANTAGE', 20, 115);

  const team = [
    { role: 'Chief Executive Officer & Spatial Architect', loc: 'San Jose, USA', focus: 'Ex-Spatial Computing Lead, UE5 & WebXR Architect, Strategic Venture Lead.' },
    { role: 'Chief Technology Officer (AI & Vision Systems)', loc: 'Dhaka, BD', focus: 'Specialist in Document Intelligence, On-Premise LLaMA Multimodal & SCADA Integration.' },
    { role: 'VP of Global Enterprise Solutions', loc: 'Sydney, AUS', focus: 'APAC Healthcare, Mining & Banking Procurement Relations (ASX Pipeline).' },
    { role: 'Director of 3D Pipeline & Procedural Simulation', loc: 'Dhaka Studio', focus: 'AAA Real-Time Asset Pipeline, Photorealistic Cleanroom Twins & LMS Physics.' }
  ];

  let teamY = 123;
  team.forEach((t) => {
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(20, teamY, 170, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
    doc.text(t.role, 24, teamY + 5.5);
    doc.setFont('courier', 'normal');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`[${t.loc}]`, 150, teamY + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(t.focus, 24, teamY + 10.5);
    teamY += 17;
  });

  // Section 6: Proven Market Precedents & Competitive Moat
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(whiteText[0], whiteText[1], whiteText[2]);
  doc.text('6. MARKET PRECEDENTS & 4-WAY COMPARATIVE MOAT', 20, 198);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  const precedents = [
    '• Matterport (NASDAQ: MTTR, $1.6B Acquisition by CoStar) validates enterprise spatial digital twin scale.',
    '• Scale AI ($13.8B Valuation) & Hyperscience ($1.1B Valuation) validate mission-critical on-premise document AI.',
    '• XREAL (Valuation $1.0B+) proves consumer & enterprise smart glasses spatial optics demand.',
    '• ASX:XRG (xReality Group) demonstrates Australian enterprise willingness to procure specialized simulation at 80%+ GM.'
  ];
  doc.text(precedents, 20, 206);

  // Sign-off / Confidentiality Notice
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(20, 232, 170, 36, 3, 3, 'F');
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, 232, 170, 36, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('CONFIDENTIALITY & INVESTMENT ENGAGEMENT NOTICE', 25, 240);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  const legalText = [
    'This briefing memo contains proprietary architectural specifications and forward-looking financial scenarios for Spenta XR.',
    'All SAFE allocations and technical due diligence data room audits are subject to execution of standard institutional NDAs.',
    'For direct partner inquiries, wire instructions, or to schedule a founder meeting: contact founders@spenta.io'
  ];
  doc.text(legalText, 25, 246);

  // Footer Page 2
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Spenta XR & Physical AI // Confidential Investor Briefing // Page 2 of 2', 20, 285);
  doc.text('Generated via Spenta Intelligence Portal v2.6', 125, 285);

  // Save the PDF file
  doc.save(`Spenta_XR_Physical_AI_Investor_Briefing_${currency}.pdf`);
};
