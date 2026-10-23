"use client";

interface AreaChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  title?: string;
}

export default function AreaChart({
  data,
  height = 280,
  color = "#10B981",
  title = "",
}: AreaChartProps) {
  if (!data || data.length === 0) {
    return <div style={{ height, color: 'var(--ink-muted)' }}>No data available</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  const padding = 40;
  const chartHeight = height - padding * 2;
  const chartWidth = 600;
  const stepX = chartWidth / (data.length - 1 || 1);

  const points = data.map((point, index) => ({
    x: index * stepX,
    y: chartHeight - ((point.value - minValue) / range) * chartHeight,
  }));

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x + padding},${point.y + padding}`
  ).join(' ');

  const areaPath = `${pathData} L ${points[points.length - 1].x + padding},${chartHeight + padding} L ${padding},${chartHeight + padding} Z`;

  return (
    <div>
      {title && (
        <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          {title}
        </h4>
      )}
      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth + padding * 2} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <line
            key={index}
            x1={padding}
            y1={padding + chartHeight * ratio}
            x2={chartWidth + padding}
            y2={padding + chartHeight * ratio}
            stroke="var(--rule)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
        />

        {/* Line path */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x + padding}
            cy={point.y + padding}
            r="4"
            fill={color}
          />
        ))}

        {/* X-axis labels */}
        {data.map((point, index) => (
          <text
            key={index}
            x={points[index].x + padding}
            y={height - 10}
            textAnchor="middle"
            fontSize="10"
            fill="var(--ink-muted)"
          >
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
