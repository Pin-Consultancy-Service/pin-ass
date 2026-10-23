"use client";

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  title?: string;
  showGrid?: boolean;
  gradientFill?: boolean;
}

export default function LineChart({
  data,
  height = 240,
  color = "var(--navy)",
  title = "",
  showGrid = true,
  gradientFill = false,
}: LineChartProps) {
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

  const areaPath = gradientFill
    ? `${pathData} L ${points[points.length - 1].x + padding},${chartHeight + padding} L ${padding},${chartHeight + padding} Z`
    : '';

  return (
    <div>
      {title && (
        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>
          {title}
        </h4>
      )}
      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth + padding * 2} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <g>
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
          </g>
        )}

        {/* Area fill */}
        {gradientFill && areaPath && (
          <path
            d={areaPath}
            fill="url(#lineGradient)"
          />
        )}

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
