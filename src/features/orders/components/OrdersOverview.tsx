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
import { useState } from "react";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { formatMoney } from "@/lib/format";
import type { OrdersStatusFilter } from "../lib/filterOrders";
import type { DashboardMetrics, SpendPoint, StatusSlice } from "../lib/dashboard";
import "./OrdersOverview.css";

export interface OrdersOverviewProps {
  metrics: DashboardMetrics;
  statusSlices: StatusSlice[];
  spendSeries: SpendPoint[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onFilterStatus?: (status: OrdersStatusFilter) => void;
}

export function OrdersOverview({
  metrics,
  statusSlices,
  spendSeries,
  loading = false,
  error = null,
  onRetry,
  onFilterStatus,
}: OrdersOverviewProps) {
  return (
    <section className="overview" aria-label="Orders dashboard">
      <header className="overview__head">
        <div>
          <p className="overview__eyebrow">Dashboard</p>
          <h1>Orders Overview</h1>
          <p className="overview__sub">
            See your spend, order status, and what’s ready for returns.
          </p>
        </div>
      </header>

      {error ? (
        <ErrorBanner title="Dashboard Unavailable" message={error} onRetry={onRetry} />
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
            <h2>Monthly Spend</h2>
            <p>How much you spent on orders each month</p>
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
            <h2>Status</h2>
            <p>Where your orders stand right now</p>
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
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}>
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
          height={28}
          tickMargin={10}
          padding={{ left: 12, right: 8 }}
        />
        <YAxis
          tick={{ fill: "#566671", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={48}
          tickMargin={8}
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
  const [active, setActive] = useState<StatusSlice | null>(null);

  return (
    <div className="status-chart">
      <div className="status-chart__plot">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={74}
              paddingAngle={3}
              stroke="none"
              onMouseLeave={() => setActive(null)}
            >
              {data.map((slice) => (
                <Cell
                  key={slice.key}
                  fill={slice.fill}
                  cursor={onSelect ? "pointer" : "default"}
                  onClick={() => onSelect?.(slice.key)}
                  onMouseEnter={() => setActive(slice)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="status-chart__center" aria-hidden>
          <div className="status-chart__center-inner">
            <strong>{total}</strong>
            <span>orders</span>
          </div>
        </div>
      </div>

      <div className="status-chart__hover" aria-live="polite">
        {active ? (
          <>
            <span className="status-chart__hover-dot" style={{ background: active.fill }} />
            <span>
              {active.name}: <strong>{active.value}</strong>
            </span>
          </>
        ) : (
          <span className="status-chart__hover-hint">Hover a segment for details</span>
        )}
      </div>

      <ul className="status-chart__legend">
        {data.map((slice) => (
          <li key={slice.key}>
            <button
              type="button"
              className="status-chart__legend-btn"
              onClick={() => onSelect?.(slice.key)}
              onMouseEnter={() => setActive(slice)}
              onMouseLeave={() => setActive(null)}
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
  const total = Math.max(1, metrics.totalOrders);

  return (
    <article className="overview__panel overview__throughput">
      <header className="overview__panel-head">
        <h2>Order Volume</h2>
        <p>Share of all {metrics.totalOrders} orders by status</p>
      </header>
      <ul className="throughput">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="throughput__meta">
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
            <div
              className="throughput__track"
              role="meter"
              aria-label={`${row.label}: ${row.value} of ${metrics.totalOrders}`}
              aria-valuenow={row.value}
              aria-valuemin={0}
              aria-valuemax={metrics.totalOrders}
            >
              <span
                style={{
                  width: row.value === 0 ? "0%" : `${(row.value / total) * 100}%`,
                  minWidth: row.value > 0 ? 4 : 0,
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
