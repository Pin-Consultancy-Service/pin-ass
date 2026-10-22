"use client";

import { useState } from "react";

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DataPoint[];
  size?: number;
  title?: string;
  centerLabel?: string;
}

export default function DonutChart({
  data,
  size = 200,
  title,
  centerLabel,
}: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;
  const innerRadius = radius * 0.6;

  let currentAngle = -90;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const start = polarToCartesian(centerX, centerY, radius, startAngle);
    const end = polarToCartesian(centerX, centerY, radius, endAngle);
    const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
      'Z',
    ].join(' ');

    return {
      ...item,
      pathData,
      percentage: percentage.toFixed(1),
    };
  });

  function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const angleInRadians = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  }

  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          {title}
        </h3>
      )}
      
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full"
          >
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.pathData}
                fill={segment.color}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: 'center',
                }}
              />
            ))}
            
            {/* Center text */}
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              fontSize="24"
              fontWeight="bold"
              fill="var(--ink)"
            >
              {totalValue}
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              fontSize="12"
              fill="var(--ink-muted)"
            >
              {centerLabel || 'Total'}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-1 gap-2 w-full">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg"
              style={{
                backgroundColor: hoveredIndex === index ? 'var(--navy-50)' : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm" style={{ color: 'var(--ink)' }}>
                  {segment.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                  {segment.value}
                </span>
                <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                  {segment.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
