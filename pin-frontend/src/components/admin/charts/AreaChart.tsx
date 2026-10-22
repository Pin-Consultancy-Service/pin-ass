"use client";

import { useState } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  title?: string;
}

export default function AreaChart({
  data,
  height = 250,
  color = '#10B981',
  title,
}: AreaChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = 0;
  const range = maxValue || 1;
  const padding = 40;
  const chartWidth = 600;
  const chartHeight = height;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - ((d.value - minValue) / range) * (chartHeight - 2 * padding);
    return { x, y, value: d.value, label: d.label };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  const gradientId = `area-gradient-${Math.random().toString(36).substr(2, 9)}`;

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
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>

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

          {/* Area fill */}
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? 5 : 3}
              fill={color}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            />
          ))}

          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={chartHeight - 10}
              textAnchor="middle"
              fontSize="11"
              fill="var(--ink-muted)"
            >
              {point.label}
            </text>
          ))}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => {
            const value = maxValue - (i / 4) * range;
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

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute pointer-events-none z-10 px-3 py-2 rounded-lg shadow-lg"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--rule)',
              left: `${(hoveredIndex / (data.length - 1)) * 100}%`,
              top: '20px',
              transform: 'translateX(-50%)',
            }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>
              {data[hoveredIndex].label}
            </p>
            <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
              {data[hoveredIndex].value} enrollments
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
