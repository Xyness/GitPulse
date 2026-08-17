"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import type { HeatmapData } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ContributionHeatmapProps {
  data: HeatmapData[];
}

const CELL_SIZE = 13;
const CELL_GAP = 3;
const LEVEL_COLORS = [
  "hsl(222, 47%, 10%)",
  "hsl(262, 50%, 25%)",
  "hsl(262, 60%, 35%)",
  "hsl(262, 70%, 50%)",
  "hsl(262, 83%, 65%)",
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

export function ContributionHeatmap({ data }: ContributionHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerRef, dimensions] = useResizeObserver();
  const [selectedDay, setSelectedDay] = useState<HeatmapData | null>(null);

  const totalContributions = data.reduce((sum, d) => sum + d.count, 0);

  const render = useCallback(() => {
    if (!svgRef.current || dimensions.width === 0 || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const marginLeft = 32;
    const marginTop = 20;
    const totalCellSize = CELL_SIZE + CELL_GAP;

    const weeks: HeatmapData[][] = [];
    let currentWeek: HeatmapData[] = [];

    const firstDay = new Date(data[0].date);
    const startDayOfWeek = firstDay.getDay();

    // Blank cells so week one lines up with the right day-of-week row,
    // the way GitHub's own graph does it.
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({ date: "", count: -1, level: -1 });
    }

    for (const day of data) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const width = marginLeft + weeks.length * totalCellSize + 10;
    const height = marginTop + 7 * totalCellSize + 10;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const tooltip = d3
      .select("body")
      .selectAll<HTMLDivElement, null>(".heatmap-tooltip")
      .data([null])
      .join("div")
      .attr("class", "d3-tooltip heatmap-tooltip")
      .style("opacity", 0);

    DAY_LABELS.forEach((label, i) => {
      if (label) {
        svg
          .append("text")
          .attr("x", marginLeft - 6)
          .attr("y", marginTop + i * totalCellSize + CELL_SIZE)
          .attr("text-anchor", "end")
          .attr("font-size", 9)
          .attr("fill", "hsl(215, 20%, 55%)")
          .text(label);
      }
    });

    const monthPositions: Record<string, number> = {};
    weeks.forEach((week, weekIdx) => {
      for (const day of week) {
        if (day.date) {
          const d = new Date(day.date);
          if (d.getDate() <= 7) {
            const monthName = d.toLocaleDateString("en-US", { month: "short" });
            if (!monthPositions[monthName]) {
              monthPositions[monthName] = weekIdx;
            }
          }
        }
      }
    });

    Object.entries(monthPositions).forEach(([month, weekIdx]) => {
      svg
        .append("text")
        .attr("x", marginLeft + weekIdx * totalCellSize)
        .attr("y", marginTop - 6)
        .attr("font-size", 9)
        .attr("fill", "hsl(215, 20%, 55%)")
        .text(month);
    });

    const cellsGroup = svg.append("g");

    weeks.forEach((week, weekIdx) => {
      week.forEach((day, dayIdx) => {
        if (day.level < 0) return;

        const rect = cellsGroup
          .append("rect")
          .attr("x", marginLeft + weekIdx * totalCellSize)
          .attr("y", marginTop + dayIdx * totalCellSize)
          .attr("width", CELL_SIZE)
          .attr("height", CELL_SIZE)
          .attr("rx", 2)
          .attr("fill", LEVEL_COLORS[0])
          .style("cursor", day.count > 0 ? "pointer" : "default")
          .on("mouseover", (event) => {
            if (!day.date) return;
            const dateStr = new Date(day.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            tooltip.transition().duration(150).style("opacity", 1);
            tooltip.html(
              `<strong>${day.count} contribution${day.count !== 1 ? "s" : ""}</strong><br/>${dateStr}`
            );
          })
          .on("mousemove", (event) => {
            tooltip
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 30 + "px");
          })
          .on("mouseout", () => {
            tooltip.transition().duration(200).style("opacity", 0);
          })
          .on("click", () => {
            if (day.count > 0) {
              setSelectedDay(day);
            }
          });

        // Delay by position so the year fills in left to right.
        rect
          .transition()
          .delay(weekIdx * 8 + dayIdx * 2)
          .duration(300)
          .attr("fill", LEVEL_COLORS[day.level]);
      });
    });

    return () => {
      tooltip.remove();
    };
  }, [data, dimensions]);

  useEffect(() => {
    const cleanup = render();
    return () => cleanup?.();
  }, [render]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Contributions</CardTitle>
              <p className="text-sm text-muted-foreground">
                {totalContributions.toLocaleString()} contributions in the last year
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Less</span>
              {LEVEL_COLORS.map((color, i) => (
                <span
                  key={i}
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={containerRef}
            className="w-full overflow-x-auto"
            role="img"
            aria-label={`Contribution heatmap showing ${totalContributions} contributions in the last year`}
          >
            <svg ref={svgRef} className="h-auto min-w-[700px] w-full" />
          </div>

          <AnimatePresence>
            {selectedDay && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 rounded-md border bg-muted/50 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    <strong>{selectedDay.count} contributions</strong> on{" "}
                    {new Date(selectedDay.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
