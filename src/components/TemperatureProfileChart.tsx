import type { DepthTemperature } from '../domain/waterTemperature'

interface TemperatureProfileChartProps {
  profile: DepthTemperature[]
}

export function TemperatureProfileChart({ profile }: TemperatureProfileChartProps) {
  if (profile.length === 0) return null
  const temperatures = profile.map((item) => item.temperatureCelsius)
  const minTemperature = Math.floor(Math.min(...temperatures) - 1)
  const maxTemperature = Math.ceil(Math.max(...temperatures) + 1)
  const maxDepth = Math.max(...profile.map((item) => item.depthMeters), 1)
  const width = 320
  const height = 230
  const padding = 32
  const plotWidth = width - padding * 2
  const plotHeight = height - padding * 2
  const temperatureSpan = Math.max(maxTemperature - minTemperature, 1)
  const points = profile.map((item) => ({
    ...item,
    x: padding + ((item.temperatureCelsius - minTemperature) / temperatureSpan) * plotWidth,
    y: padding + (item.depthMeters / maxDepth) * plotHeight,
  }))
  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <div className="temperature-chart">
      <div className="chart-scale"><span>{maxTemperature}°C</span><span>{minTemperature}°C</span></div>
      <svg aria-label="수심별 예상 수온 그래프" role="img" viewBox={`0 0 ${width} ${height}`}>
        {points.map((point) => (
          <g key={point.depthMeters}>
            <line className="chart-grid" x1={padding} x2={width - padding} y1={point.y} y2={point.y} />
            <text className="chart-depth" x="3" y={point.y + 4}>{point.depthMeters}m</text>
          </g>
        ))}
        <polyline className="chart-line" fill="none" points={polyline} />
        {points.map((point) => <circle className="chart-point" cx={point.x} cy={point.y} key={`point-${point.depthMeters}`} r="4" />)}
      </svg>
    </div>
  )
}

