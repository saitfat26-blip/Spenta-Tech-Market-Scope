import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  day: number;
  score: number;
}

interface D3SentimentChartProps {
  data: DataPoint[];
}

export const D3SentimentChart: React.FC<D3SentimentChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const margin = { top: 5, right: 5, bottom: 5, left: 5 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 64 - margin.top - margin.bottom; // 16 * 4 = 64px roughly

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.day) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    const area = d3.area<DataPoint>()
      .x(d => x(d.day))
      .y0(height)
      .y1(d => y(d.score))
      .curve(d3.curveMonotoneX);

    const line = d3.line<DataPoint>()
      .x(d => x(d.day))
      .y(d => y(d.score))
      .curve(d3.curveMonotoneX);

    // Gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "sentiment-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop").attr("offset", "0%").style("stop-color", "#10b981").style("stop-opacity", 0.3);
    gradient.append("stop").attr("offset", "100%").style("stop-color", "#10b981").style("stop-opacity", 0);

    g.append("path")
      .datum(data)
      .attr("fill", "url(#sentiment-gradient)")
      .attr("d", area);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#10b981")
      .attr("stroke-width", 2)
      .attr("d", line);

  }, [data]);

  return (
    <div className="w-full h-16">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
