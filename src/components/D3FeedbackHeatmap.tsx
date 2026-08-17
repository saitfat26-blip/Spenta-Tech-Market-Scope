import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface D3FeedbackHeatmapProps {
  data: { section: string; count: number }[];
}

export const D3FeedbackHeatmap: React.FC<D3FeedbackHeatmapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = 80;
    const margin = { top: 0, right: 0, bottom: 20, left: 0 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.section))
      .range([0, chartWidth])
      .padding(0.1);

    const maxCount = d3.max(data, d => d.count) || 1;

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxCount * 1.5]); // offset so it doesn't get too white

    g.selectAll('.cell')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => x(d.section) || 0)
      .attr('y', 0)
      .attr('width', x.bandwidth())
      .attr('height', chartHeight)
      .attr('fill', d => d.count > 0 ? colorScale(d.count) as string : '#1e293b')
      .attr('rx', 4)
      .style('transition', 'fill 0.3s ease');

    // Add labels
    g.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.section) || 0) + x.bandwidth() / 2)
      .attr('y', chartHeight / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.count > maxCount / 2 ? '#fff' : '#94a3b8')
      .style('font-size', '12px')
      .style('font-family', 'monospace')
      .style('font-weight', 'bold')
      .text(d => d.count);

    // Add x-axis labels
    g.selectAll('.x-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'x-label')
      .attr('x', d => (x(d.section) || 0) + x.bandwidth() / 2)
      .attr('y', chartHeight + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .style('font-size', '8px')
      .style('font-family', 'monospace')
      .each(function(d) {
        // truncate text if too long
        const el = d3.select(this);
        const text = d.section;
        if (text.length > 10) {
          el.text(text.substring(0, 8) + '..');
        } else {
          el.text(text);
        }
      });

  }, [data]);

  return (
    <div className="w-full h-[80px]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
