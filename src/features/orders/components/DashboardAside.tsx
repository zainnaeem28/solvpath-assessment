import { useMemo } from "react";
import type { Order } from "@/api/mockApi";
import type { OrderStats } from "../hooks/useOrderStats";
import "./DashboardAside.css";

export interface DashboardAsideProps {
  stats: OrderStats;
  orders: Order[];
}

interface ProductBar {
  name: string;
  count: number;
  pct: number;
}

export function DashboardAside({ stats, orders }: DashboardAsideProps) {
  const products = useMemo(() => {
    const map = new Map<string, number>();
    for (const order of orders) {
      for (const item of order.items) {
        map.set(item.name, (map.get(item.name) ?? 0) + item.quantity);
      }
    }
    const ranked = [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
    const max = ranked[0]?.count ?? 1;
    return ranked.map<ProductBar>((row) => ({
      ...row,
      pct: Math.round((row.count / max) * 100),
    }));
  }, [orders]);

  const statusBars = [
    { label: "Delivered", value: stats.byStatus.delivered, tone: "success" },
    { label: "In transit", value: stats.byStatus.shipped, tone: "info" },
    { label: "Processing", value: stats.byStatus.processing, tone: "warning" },
    { label: "Cancelled", value: stats.byStatus.cancelled, tone: "danger" },
  ];
  const statusMax = Math.max(1, ...statusBars.map((b) => b.value));

  return (
    <aside className="dash-aside">
      <div className="dash-aside__grid">
        <div className="dash-aside__mini">
          <span>All orders</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="dash-aside__mini">
          <span>In transit</span>
          <strong>{stats.byStatus.shipped}</strong>
        </div>
        <div className="dash-aside__mini">
          <span>Processing</span>
          <strong>{stats.byStatus.processing}</strong>
        </div>
        <div className="dash-aside__mini">
          <span>Cancelled</span>
          <strong>{stats.byStatus.cancelled}</strong>
        </div>
      </div>

      <section className="dash-aside__card">
        <header>
          <div>
            <h3>Best selling products</h3>
            <p>Top items from your orders</p>
          </div>
        </header>
        <ul className="dash-aside__bars">
          {products.map((product, index) => (
            <li key={product.name}>
              <div className="dash-aside__bar-label">
                <span>{product.name}</span>
                <span>{product.count}</span>
              </div>
              <div className="dash-aside__track">
                <span
                  className={`dash-aside__fill dash-aside__fill--${index % 4}`}
                  style={{ width: `${product.pct}%` }}
                />
              </div>
            </li>
          ))}
          {products.length === 0 ? (
            <li className="dash-aside__empty">Products will appear once orders load.</li>
          ) : null}
        </ul>
      </section>

      <section className="dash-aside__card">
        <header>
          <div>
            <h3>Status mix</h3>
            <p>Current order distribution</p>
          </div>
        </header>
        <div className="dash-aside__chart" role="img" aria-label="Order status distribution">
          {statusBars.map((bar) => (
            <div key={bar.label} className="dash-aside__chart-col">
              <span
                className={`dash-aside__chart-bar dash-aside__chart-bar--${bar.tone}`}
                style={{ height: `${Math.max(12, (bar.value / statusMax) * 100)}%` }}
                title={`${bar.label}: ${bar.value}`}
              />
              <small>{bar.label.split(" ")[0]}</small>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
