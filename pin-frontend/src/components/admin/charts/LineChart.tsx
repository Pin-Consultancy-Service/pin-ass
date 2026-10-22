"use client";

import { useState } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  gradientFill?: boolean;
  title?: string;
}

export default function LineChart({
  data,
  height = 300,
  color = 'var(--navy)',
  showGrid = true,
  gradientFill = true,
  title,
}: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  const padding = 40;
  const chartWidth = 600;
  const chartHeight = height;

  // Generate SVG path
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - ((d.value - minValue) / range) * (chartHeight - 2 * padding);
    return { x, y, value: d.value, label: d.label };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  const areaPath = gradientFill
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : '';

  const gradientId = `line-gradient-${Math.random().toString(36).substr(2, 9)}`;

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
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {showGrid && (
            <g>
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
                    opacity="0.5"
                  />
                );
              })}
            </g>
          )}

          {/* Area fill */}
          {gradientFill && areaPath && (
            <path
              d={areaPath}
              fill={`url(#${gradientId})`}
            />
          )}

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'all 0.3s ease' }}
          />

          {/* Points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredIndex === index ? 6 : 4}
                fill="white"
                stroke={color}
                strokeWidth="2"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              />
            </g>
          ))}

          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={chartHeight - 10}
              textAnchor="middle"
              fontSize="12"
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
                fontSize="12"
                fill="var(--ink-muted)"
              >
                {Math.round(value / 1000)}k
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
              ₦{data[hoveredIndex].value.toLocaleString('en-NG')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
