import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatMoney } from '../utils/format.js'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-strong)',
        borderRadius: 10,
        padding: '8px 12px',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ color: 'var(--text-faint)', marginBottom: 3 }}>Día {label}</div>
      <div style={{ color: 'var(--green)', fontWeight: 700 }}>
        {formatMoney(payload[0].value)}
      </div>
    </div>
  )
}

export default function MonthlyChart({ data }) {
  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#33e6a0" stopOpacity={0.55} />
              <stop offset="55%" stopColor="#2f7dff" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#2f7dff" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="salesStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#33e6a0" />
              <stop offset="100%" stopColor="#2f7dff" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: 'var(--text-faint)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: 'var(--text-faint)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={38}
            tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : v)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--blue)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="url(#salesStroke)"
            strokeWidth={2.5}
            fill="url(#salesGradient)"
            animationDuration={900}
            activeDot={{ r: 5, fill: '#33e6a0', stroke: 'var(--bg-elevated)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}