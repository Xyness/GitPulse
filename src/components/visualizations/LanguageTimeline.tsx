"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import type { LanguageTimelineEntry } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LanguageTimelineProps {
  data: LanguageTimelineEntry[];
  languageColors: Record<string, string>;
}

export function LanguageTimeline({ data, languageColors }: LanguageTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerRef, dimensions] = useResizeObserver();

  const render = useCallback(() => {
    if (!svgRef.current || dimensions.width === 0 || data.length < 2) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = dimensions.width - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${dimensions.width} 350`);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const langTotals: Record<string, number> = {};
    for (const entry of data) {
      for (const [lang, bytes] of Object.entries(entry.languages)) {
        langTotals[lang] = (langTotals[lang] ?? 0) + bytes;
      }
    }
    // Eight bands is about where a streamgraph stops being readable.
    const topLanguages = Object.entries(langTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([lang]) => lang);

    const stackData = data.map((entry) => {
      const row: Record<string, number | string> = { date: entry.date };
      for (const lang of topLanguages) {
        row[lang] = entry.languages[lang] ?? 0;
      }
      return row;
    });

    const x = d3
      .scalePoint<string>()
      .domain(data.map((d) => d.date))
      .range([0, width])
      .padding(0.5);

    // insideOut + wiggle is the standard streamgraph pairing: biggest series near
    // the middle, and the baseline floats to keep the overall shape smooth.
    const stack = d3
      .stack<Record<string, number | string>>()
      .keys(topLanguages)
      .value((d, key) => (d[key] as number) ?? 0)
      .order(d3.stackOrderInsideOut)
      .offset(d3.stackOffsetWiggle);

    const series = stack(stackData);

    const yMax = d3.max(series, (s) => d3.max(s, (d) => d[1])) ?? 0;
    const yMin = d3.min(series, (s) => d3.min(s, (d) => d[0])) ?? 0;

    const y = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0]);

    const area = d3
      .area<d3.SeriesPoint<Record<string, number | string>>>()
      .x((d) => x(d.data.date as string)!)
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);

    const tooltip = d3
      .select("body")
      .selectAll<HTMLDivElement, null>(".lang-timeline-tooltip")
      .data([null])
      .join("div")
      .attr("class", "d3-tooltip lang-timeline-tooltip")
      .style("opacity", 0);

    g.selectAll("path")
      .data(series)
      .join("path")
      .attr("d", area)
      .attr("fill", (d) => languageColors[d.key] ?? "#8b8b8b")
      .attr("fill-opacity", 0.8)
      .attr("stroke", (d) => languageColors[d.key] ?? "#8b8b8b")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mouseover", (_event, d) => {
        tooltip.transition().duration(150).style("opacity", 1);
        tooltip.html(`<strong>${d.key}</strong>`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 25 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      })
      // Staggered fade-in, one language after another.
      .attr("opacity", 0)
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr("opacity", 1);

    const tickValues = data
      .map((d) => d.date)
      .filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues(tickValues).tickSize(0))
      .call((g) => g.select(".domain").remove())
      .selectAll("text")
      .attr("fill", "hsl(215, 20%, 55%)")
      .attr("font-size", 10);

    return () => {
      tooltip.remove();
    };
  }, [data, languageColors, dimensions]);

  useEffect(() => {
    const cleanup = render();
    return () => cleanup?.();
  }, [render]);

  const topLanguages = Object.entries(
    data.reduce((acc, entry) => {
      for (const [lang, bytes] of Object.entries(entry.languages)) {
        acc[lang] = (acc[lang] ?? 0) + bytes;
      }
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Language Timeline</CardTitle>
          <p className="text-sm text-muted-foreground">
            How your tech stack evolved over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex flex-wrap gap-3">
            {topLanguages.map(([lang]) => (
              <span key={lang} className="flex items-center gap-1.5 text-xs">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: languageColors[lang] ?? "#8b8b8b" }}
                />
                {lang}
              </span>
            ))}
          </div>
          <div
            ref={containerRef}
            className="w-full"
            role="img"
            aria-label="Streamgraph showing language usage evolution over time"
          >
            <svg ref={svgRef} className="h-[350px] w-full" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
