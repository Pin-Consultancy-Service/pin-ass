"use client";

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  title?: string;
  horizontal?: boolean;
}

export default function BarChart({
  data,
  height = 280,
  title = "",
  horizontal = false,
}: BarChartProps) {
  if (!data || data.length === 0) {
    return <div style={{ height, color: 'var(--ink-muted)' }}>No data available</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 40;
  const labelWidth = 100;

  if (horizontal) {
    const barHeight = 40;
    const gap = 20;
    const chartHeight = data.length * (barHeight + gap);

    return (
      <div>
        {title && (
          <h4 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            {title}
          </h4>
        )}
        <svg width="100%" height={chartHeight} viewBox={`0 0 600 ${chartHeight}`}>
          {data.map((item, index) => {
            const barWidth = (item.value / maxValue) * (600 - labelWidth - padding);
            const y = index * (barHeight + gap);

            return (
              <g key={index}>
                {/* Label */}
                <text
                  x="0"
                  y={y + barHeight / 2}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="var(--ink)"
                  fontWeight="500"
                >
                  {item.label}
                </text>

                {/* Bar */}
                <rect
                  x={labelWidth}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="var(--gold)"
                  rx="4"
                />

                {/* Value label */}
                <text
                  x={labelWidth + barWidth + 10}
                  y={y + barHeight / 2}
                  textAnchor="start"
                  dominantBaseline="middle"
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

  // Vertical bar chart
  const chartWidth = 600;
  const chartHeight = height - padding * 2;
  const barWidth = (chartWidth / data.length) * 0.6;
  const gap = (chartWidth / data.length) * 0.4;

  return (
    <div>
      {title && (
        <h4 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          {title}
        </h4>
      )}
      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth + padding * 2} ${height}`}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding + index * (barWidth + gap) + gap / 2;
          const y = padding + chartHeight - barHeight;

          return (
            <g key={index}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="var(--navy)"
                rx="4"
              />

              {/* Value label */}
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize="12"
                fill="var(--ink)"
                fontWeight="600"
              >
                {item.value}
              </text>

              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={height - 10}
                textAnchor="middle"
                fontSize="10"
                fill="var(--ink-muted)"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {/* X-axis line */}
        <line
          x1={padding}
          y1={padding + chartHeight}
          x2={chartWidth + padding}
          y2={padding + chartHeight}
          stroke="var(--rule)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
