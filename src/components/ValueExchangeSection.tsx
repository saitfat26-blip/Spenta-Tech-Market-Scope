import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import * as d3 from 'd3';
import { Activity } from 'lucide-react';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: 'engine' | 'vertical';
  radius: number;
  color: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
  label: string;
}

const NODES: Node[] = [
  { id: 'Product Engine', group: 'engine', radius: 40, color: '#06b6d4' },
  { id: 'Commercial Engine', group: 'engine', radius: 40, color: '#3b82f6' },
  { id: 'Enterprise Client', group: 'vertical', radius: 30, color: '#10b981' },
  { id: 'Retail Consumer', group: 'vertical', radius: 30, color: '#f59e0b' },
  { id: 'Strategic Partner', group: 'vertical', radius: 30, color: '#8b5cf6' },
];

const LINKS: Link[] = [
  { source: 'Product Engine', target: 'Enterprise Client', value: 500000, label: 'SaaS Licensing' },
  { source: 'Enterprise Client', target: 'Commercial Engine', value: 600000, label: 'Revenue/Feedback' },
  { source: 'Commercial Engine', target: 'Retail Consumer', value: 200000, label: 'Market Penetration' },
  { source: 'Retail Consumer', target: 'Product Engine', value: 50000, label: 'Usage Data' },
  { source: 'Product Engine', target: 'Strategic Partner', value: 300000, label: 'API Access' },
  { source: 'Strategic Partner', target: 'Commercial Engine', value: 400000, label: 'Co-Marketing' },
  { source: 'Commercial Engine', target: 'Product Engine', value: 1000000, label: 'R&D Reinvestment' },
];

export const ValueExchangeSection: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLink, setHoveredLink] = useState<Link | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Prepare data
    const nodes = NODES.map(d => ({ ...d }));
    const links = LINKS.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(0, 0))
      .force('collide', d3.forceCollide().radius((d: any) => d.radius + 20));

    // Define arrow markers
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#475569')
      .style('stroke','none');

    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', 2)
      .attr('stroke', '#334155')
      .attr('marker-end', 'url(#arrowhead)')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d: any) => {
        setHoveredLink(d);
        d3.select(event.currentTarget).attr('stroke', '#0ea5e9').attr('stroke-width', 4);
      })
      .on('mouseleave', (event) => {
        setHoveredLink(null);
        d3.select(event.currentTarget).attr('stroke', '#334155').attr('stroke-width', 2);
      });

    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(d3.drag<SVGGElement, any>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    const packets = g.append('g')
      .selectAll('circle')
      .data(links)
      .enter().append('circle')
      .attr('r', 3)
      .attr('fill', '#38bdf8')
      .style('filter', 'drop-shadow(0 0 5px #38bdf8)');

    function animatePacket(selection: any) {
      selection
        .transition()
        .duration((d: any) => 1500 + Math.random() * 1500)
        .ease(d3.easeLinear)
        .attrTween('cx', function(this: any, d: any) {
          return function(t: number) {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // target edge
            const ratioTarget = (distance - d.target.radius) / distance;
            // source edge
            const ratioSource = d.source.radius / distance;
            const startX = d.source.x + dx * ratioSource;
            const endX = d.source.x + dx * ratioTarget;
            return String(startX + (endX - startX) * t);
          };
        })
        .attrTween('cy', function(this: any, d: any) {
          return function(t: number) {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // target edge
            const ratioTarget = (distance - d.target.radius) / distance;
            // source edge
            const ratioSource = d.source.radius / distance;
            const startY = d.source.y + dy * ratioSource;
            const endY = d.source.y + dy * ratioTarget;
            return String(startY + (endY - startY) * t);
          };
        })
        .on('end', function(this: any) {
          d3.select(this).call(animatePacket);
        });
    }

    packets.call(animatePacket);

    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 4)
      .style('filter', 'drop-shadow(0 0 10px rgba(0,0,0,0.5))');

    node.append('text')
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .text(d => d.id)
      .attr('fill', '#fff')
      .style('font-size', '10px')
      .style('font-family', 'monospace')
      .style('pointer-events', 'none')
      .each(function(d) {
        // Simple word wrap
        const el = d3.select(this);
        const words = d.id.split(' ');
        el.text('');
        for (let i = 0; i < words.length; i++) {
          el.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? '-0.2em' : '1.2em')
            .text(words[i]);
        }
      });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => {
          // Adjust to not go to center of target, but edge
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const ratio = (distance - d.target.radius) / distance;
          return d.source.x + dx * ratio;
        })
        .attr('y2', (d: any) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const ratio = (distance - d.target.radius) / distance;
          return d.source.y + dy * ratio;
        });

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <section id="value-exchange" className="py-24 bg-[#05070B] relative border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold mb-4"
          >
            <Activity className="w-4 h-4" />
            VALUE EXCHANGE MODEL
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Circular Economic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Flow</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Interactive visualization demonstrating the continuous reinvestment and value transfer between our Dual-Engines and core market verticals.
          </p>
        </div>

        <div className="relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-center p-8 min-h-[500px]">
          <div className="w-full lg:w-2/3 flex justify-center items-center overflow-hidden">
            <svg ref={svgRef} width="800" height="500" className="max-w-full h-auto cursor-crosshair" viewBox="0 0 800 500" />
          </div>

          <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:pl-8">
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-2xl h-full min-h-[250px] flex flex-col justify-center">
              {hoveredLink ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={hoveredLink.label}
                >
                  <div className="text-xs font-mono font-bold text-cyan-400 mb-2">FLOW DETAILS</div>
                  <h4 className="text-xl font-bold text-white mb-2">{hoveredLink.label}</h4>
                  <div className="flex items-center gap-2 text-slate-400 mb-4 text-sm">
                    <span className="text-slate-200">{(hoveredLink.source as Node).id}</span>
                    <span className="text-cyan-500">→</span>
                    <span className="text-slate-200">{(hoveredLink.target as Node).id}</span>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <div className="text-[10px] font-mono text-slate-500 mb-1">SIMULATED ANNUAL VOLUME</div>
                    <div className="text-2xl font-mono font-bold text-emerald-400">
                      ${(hoveredLink.value).toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center text-slate-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Hover over the connection lines in the diagram to inspect simulated transaction volumes and strategic flow descriptions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
