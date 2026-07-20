import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { formatMoney } from "@/lib/format";
import type { OrdersStatusFilter } from "../hooks/useOrders";
import {
  useOrderDashboard,
  type DashboardMetrics,
  type SpendPoint,
  type StatusSlice,
} from "../hooks/useOrderDashboard";
import "./OrdersOverview.css";

export interface OrdersOverviewProps {
  onFilterStatus?: (status: OrdersStatusFilter) => void;
}

export function OrdersOverview({ onFilterStatus }: OrdersOverviewProps) {
  const { metrics, statusSlices, spendSeries, loading, error, retry } =
    useOrderDashboard();

  return (
    <section className="overview" aria-label="Orders dashboard">
      <header className="overview__head">
        <div>
          <p className="overview__eyebrow">Dashboard</p>
          <h1>Orders overview</h1>
          <p className="overview__sub">
            A live snapshot of your post-purchase activity — spend, status mix, and what’s
            ready for returns.
          </p>
        </div>
      </header>

      {error ? (
        <ErrorBanner title="Dashboard unavailable" message={error} onRetry={retry} />
      ) : null}

      <div className={`overview__metrics${loading ? " is-loading" : ""}`}>
        <MetricCard
          label="Total orders"
          value={String(metrics.totalOrders)}
          hint="Across your account"
          onClick={onFilterStatus ? () => onFilterStatus("all") : undefined}
        />
        <MetricCard
          label="Delivered"
          value={String(metrics.delivered)}
          hint="Return-eligible"
          tone="success"
          onClick={onFilterStatus ? () => onFilterStatus("delivered") : undefined}
        />
        <MetricCard
          label="In transit"
          value={String(metrics.inTransit)}
          hint="On the way"
          tone="info"
          onClick={onFilterStatus ? () => onFilterStatus("shipped") : undefined}
        />
        <MetricCard
          label="Lifetime spend"
          value={formatMoney(metrics.spendCents)}
          hint={`${metrics.returnReady} ready for return`}
          tone="accent"
        />
      </div>

      <div className="overview__charts">
        <article className="overview__panel">
          <header className="overview__panel-head">
            <h2>Spend over time</h2>
            <p>Order totals by month</p>
          </header>
          <div className="overview__chart">
            {spendSeries.length === 0 ? (
              <p className="overview__empty">No spend data yet.</p>
            ) : (
              <SpendChart data={spendSeries} />
            )}
          </div>
        </article>

        <article className="overview__panel">
          <header className="overview__panel-head">
            <h2>Status mix</h2>
            <p>Share of orders by status</p>
          </header>
          <div className="overview__chart overview__chart--donut">
            {statusSlices.length === 0 ? (
              <p className="overview__empty">No status data yet.</p>
            ) : (
              <StatusChart
                data={statusSlices}
                total={metrics.totalOrders}
                onSelect={onFilterStatus}
              />
            )}
          </div>
        </article>
      </div>

      <ThroughputStrip metrics={metrics} />
    </section>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone = "neutral",
  onClick,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "neutral" | "success" | "info" | "accent";
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button" as const } : {})}
      className={`metric metric--${tone}${onClick ? " metric--clickable" : ""}`}
      onClick={onClick}
    >
      <span className="metric__label">{label}</span>
      <span className="metric__value">{value}</span>
      <span className="metric__hint">{hint}</span>
    </Tag>
  );
}

function SpendChart({ data }: { data: SpendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#28B0C8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#28B0C8" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#E2E8EB" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#566671", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#566671", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v: number) => `$${v}`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #E2E8EB",
            boxShadow: "0 8px 24px rgb(11 36 48 / 8%)",
          }}
          formatter={(value) => [`$${Number(value ?? 0).toFixed(2)}`, "Spend"]}
        />
        <Area
          type="monotone"
          dataKey="spend"
          stroke="#0C6E80"
          strokeWidth={2.5}
          fill="url(#spendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function StatusChart({
  data,
  total,
  onSelect,
}: {
  data: StatusSlice[];
  total: number;
  onSelect?: (status: OrdersStatusFilter) => void;
}) {
  return (
    <div className="status-chart">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={52}
            outerRadius={74}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((slice) => (
              <Cell
                key={slice.key}
                fill={slice.fill}
                cursor={onSelect ? "pointer" : "default"}
                onClick={() => onSelect?.(slice.key)}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #E2E8EB",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="status-chart__center" aria-hidden>
        <strong>{total}</strong>
        <span>orders</span>
      </div>
      <ul className="status-chart__legend">
        {data.map((slice) => (
          <li key={slice.key}>
            <button
              type="button"
              className="status-chart__legend-btn"
              onClick={() => onSelect?.(slice.key)}
            >
              <span style={{ background: slice.fill }} />
              {slice.name}
              <em>{slice.value}</em>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThroughputStrip({ metrics }: { metrics: DashboardMetrics }) {
  const rows = [
    { label: "Processing", value: metrics.processing, color: "var(--warning)" },
    { label: "In transit", value: metrics.inTransit, color: "var(--info)" },
    { label: "Delivered", value: metrics.delivered, color: "var(--success)" },
    { label: "Cancelled", value: metrics.cancelled, color: "var(--danger)" },
  ];
  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <article className="overview__panel overview__throughput">
      <header className="overview__panel-head">
        <h2>Throughput</h2>
        <p>Relative volume by status — Horizon-style workload view</p>
      </header>
      <ul className="throughput">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="throughput__meta">
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
            <div className="throughput__track">
              <span
                style={{
                  width: `${(row.value / max) * 100}%`,
                  background: row.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
