import type { Meta, StoryObj } from "@storybook/react";
import type { Order } from "@/api/mockApi";
import { buildMetrics, buildSpendSeries, buildStatusSlices } from "../lib/dashboard";
import { OrdersOverview } from "./OrdersOverview";

const sampleOrders: Order[] = [
  {
    id: "o_10432",
    orderNumber: "SP-10432",
    placedAt: "2026-06-03",
    status: "delivered",
    items: [
      {
        id: "i_1",
        name: "Aurora Wireless Headphones",
        unitPriceCents: 14200,
        quantity: 1,
        returnEligible: true,
      },
    ],
  },
  {
    id: "o_10419",
    orderNumber: "SP-10419",
    placedAt: "2026-05-09",
    status: "shipped",
    items: [
      {
        id: "i_3",
        name: "Cloud Foam Running Insoles",
        unitPriceCents: 4200,
        quantity: 1,
        returnEligible: true,
      },
    ],
  },
  {
    id: "o_10401",
    orderNumber: "SP-10401",
    placedAt: "2026-04-12",
    status: "processing",
    items: [
      {
        id: "i_4",
        name: "Meridian Cold Brew Maker",
        unitPriceCents: 7900,
        quantity: 1,
        returnEligible: true,
      },
    ],
  },
];

const meta = {
  title: "Features/Orders/OrdersOverview",
  component: OrdersOverview,
  args: {
    metrics: buildMetrics(sampleOrders),
    statusSlices: buildStatusSlices(sampleOrders),
    spendSeries: buildSpendSeries(sampleOrders),
    loading: false,
    error: null,
  },
} satisfies Meta<typeof OrdersOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const ErrorState: Story = {
  args: {
    error: "The orders service is temporarily unavailable.",
    onRetry: () => undefined,
  },
};
