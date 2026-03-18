"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import type { ConstellationNode, ConstellationLink } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ConstellationGraphProps {
  nodes: ConstellationNode[];
  links: ConstellationLink[];
}

interface SimNode extends d3.SimulationNodeDatum, ConstellationNode {}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  strength: number;
}

export function ConstellationGraph({ nodes, links }: ConstellationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerRef, dimensions] = useResizeObserver();
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);

  const render = useCallback(() => {
    if (!svgRef.current || dimensions.width === 0 || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width } = dimensions;
    const height = 500;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Tooltip
    const tooltip = d3
      .select("body")
      .selectAll<HTMLDivElement, null>(".constellation-tooltip")
      .data([null])
      .join("div")
      .attr("class", "d3-tooltip constellation-tooltip")
      .style("opacity", 0);

    // Scale for node radius
    const maxStars = Math.max(...nodes.map((n) => n.stars), 1);
    const radiusScale = d3.scaleSqrt().domain([0, maxStars]).range([4, 30]);

    // Create simulation data
    const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
    const simLinks: SimLink[] = links
      .map((l) => ({
        source: simNodes.find((n) => n.id === l.source)!,
        target: simNodes.find((n) => n.id === l.target)!,
        strength: l.strength,
      }))
      .filter((l) => l.source && l.target);

    // Defs for glow effect
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Background stars (decorative)
    const starsGroup = svg.append("g").attr("class", "bg-stars");
    for (let i = 0; i < 80; i++) {
      starsGroup
        .append("circle")
        .attr("cx", Math.random() * width)
        .attr("cy", Math.random() * height)
        .attr("r", Math.random() * 1.2)
        .attr("fill", "white")
        .attr("opacity", Math.random() * 0.4 + 0.1);
    }

    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Links
    const link = g
      .append("g")
      .selectAll("line")
      .data(simLinks)
      .join("line")
      .attr("stroke", "hsl(262, 83%, 58%)")
      .attr("stroke-opacity", 0.15)
      .attr("stroke-width", 1);

    // Nodes
    const node = g
      .append("g")
      .selectAll<SVGCircleElement, SimNode>("circle")
      .data(simNodes)
      .join("circle")
      .attr("r", (d) => radiusScale(d.stars))
      .attr("fill", (d) => d.languageColor)
      .attr("stroke", (d) => d.languageColor)
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 2)
      .attr("fill-opacity", 0.7)
      .style("filter", "url(#glow)")
      .style("cursor", "pointer")
      .on("mouseover", (_event, d) => {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(
          `<strong>${d.name}</strong><br/>` +
            `${d.language} &middot; ★ ${d.stars.toLocaleString()} &middot; ${d.commits.toLocaleString()} commits` +
            (d.description ? `<br/><span style="opacity:0.7">${d.description}</span>` : "")
        );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(300).style("opacity", 0);
      })
      .on("click", (_event, d) => {
        window.open(d.url, "_blank");
      });

    // Labels for bigger nodes
    const label = g
      .append("g")
      .selectAll("text")
      .data(simNodes.filter((n) => radiusScale(n.stars) > 8))
      .join("text")
      .text((d) => d.name)
      .attr("font-size", 10)
      .attr("fill", "hsl(210, 40%, 85%)")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => radiusScale(d.stars) + 14)
      .style("pointer-events", "none");

    // Drag behavior
    const drag = d3
      .drag<SVGCircleElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    // Simulation
    const simulation = d3
      .forceSimulation(simNodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(80)
          .strength((d) => d.strength)
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<SimNode>().radius((d) => radiusScale(d.stars) + 4))
      .on("tick", () => {
        link
          .attr("x1", (d) => (d.source as SimNode).x!)
          .attr("y1", (d) => (d.source as SimNode).y!)
          .attr("x2", (d) => (d.target as SimNode).x!)
          .attr("y2", (d) => (d.target as SimNode).y!);

        node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
        label.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [nodes, links, dimensions]);

  useEffect(() => {
    const cleanup = render();
    return () => cleanup?.();
  }, [render]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Constellation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Each star represents a repository. Size = stars, color = language. Drag to explore.
          </p>
        </CardHeader>
        <CardContent>
          <div ref={containerRef} className="w-full" role="img" aria-label="Interactive constellation graph of repositories">
            <svg
              ref={svgRef}
              className="h-[500px] w-full rounded-md bg-background"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
