"use client";

import { useState } from "react";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  title?: string;
  horizontal?: boolean;
}

export default function BarChart({
  data,
  height = 300,
  color = 'var(--navy)',
  title,
  horizontal = false,
}: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 60;
  const chartWidth = 600;
  const chartHeight = height;

  if (horizontal) {
    const barHeight = (chartHeight - 2 * padding) / data.length;
    const barGap = barHeight * 0.3;
    const actualBarHeight = barHeight - barGap;

    return (
      <div className="w-full">
        {title && (
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            {title}
          </h3>
        )}
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          style={{ maxHeight: `${height}px` }}
        >
          {data.map((item, index) => {
            const barWidth = ((item.value / maxValue) * (chartWidth - 2 * padding));
            const y = padding + index * barHeight;
            const barColor = item.color || color;

            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={padding}
                  y={y}
                  width={barWidth}
                  height={actualBarHeight}
                  fill={barColor}
                  rx="4"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
                
                {/* Label */}
                <text
                  x={padding - 10}
                  y={y + actualBarHeight / 2 + 5}
                  textAnchor="end"
                  fontSize="13"
                  fill="var(--ink)"
                  fontWeight="500"
                >
                  {item.label}
                </text>

                {/* Value */}
                <text
                  x={padding + barWidth + 10}
                  y={y + actualBarHeight / 2 + 5}
                  textAnchor="start"
                  fontSize="12"
                  fill="var(--ink-muted)"
                  fontWeight="600"
                >
                  {item.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // Vertical bars
  const barWidth = (chartWidth - 2 * padding) / data.length;
  const barGap = barWidth * 0.3;
  const actualBarWidth = barWidth - barGap;

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          {title}
        </h3>
      )}
      <div className="relative">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          style={{ maxHeight: `${height}px` }}
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padding + (i / 4) * (chartHeight - 2 * padding);
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="var(--rule)"
                strokeWidth="1"
                opacity="0.3"
              />
            );
          })}

          {data.map((item, index) => {
            const barHeight = ((item.value / maxValue) * (chartHeight - 2 * padding));
            const x = padding + index * barWidth + barGap / 2;
            const y = chartHeight - padding - barHeight;
            const barColor = item.color || color;

            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={actualBarWidth}
                  height={barHeight}
                  fill={barColor}
                  rx="4"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />

                {/* Label */}
                <text
                  x={x + actualBarWidth / 2}
                  y={chartHeight - padding + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="var(--ink-muted)"
                >
                  {item.label}
                </text>

                {/* Value on hover */}
                {hoveredIndex === index && (
                  <text
                    x={x + actualBarWidth / 2}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="13"
                    fill="var(--ink)"
                    fontWeight="600"
                  >
                    {item.value}
                  </text>
                )}
              </g>
            );
          })}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => {
            const value = maxValue - (i / 4) * maxValue;
            const y = padding + (i / 4) * (chartHeight - 2 * padding);
            return (
              <text
                key={i}
                x={padding - 10}
                y={y + 5}
                textAnchor="end"
                fontSize="11"
                fill="var(--ink-muted)"
              >
                {Math.round(value)}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
