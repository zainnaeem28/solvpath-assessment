import type { Meta, StoryObj } from "@storybook/react";
import type { Order } from "@/api/mockApi";
import { withRouter } from "@/storybook/decorators";
import { OrderCard } from "./OrderCard";

const delivered: Order = {
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
      thumbColor: "#EDE9FF",
      returnEligible: true,
    },
    {
      id: "i_2",
      name: "Aurora Travel Carry Case",
      unitPriceCents: 4200,
      quantity: 1,
      thumbColor: "#E6F7F4",
      returnEligible: true,
    },
  ],
};

const shipped: Order = {
  id: "o_10419",
  orderNumber: "SP-10419",
  placedAt: "2026-06-09",
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
};

const cancelled: Order = {
  id: "o_10366",
  orderNumber: "SP-10366",
  placedAt: "2026-05-11",
  status: "cancelled",
  items: [
    {
      id: "i_9",
      name: "Nomad Weekender Duffel",
      unitPriceCents: 12000,
      quantity: 1,
      thumbColor: "#EDE9FF",
      returnEligible: false,
    },
  ],
};

const multiQty: Order = {
  id: "o_10388",
  orderNumber: "SP-10388",
  placedAt: "2026-05-28",
  status: "delivered",
  items: [
    {
      id: "i_5",
      name: "Terra Ceramic Planter Set",
      unitPriceCents: 6400,
      quantity: 2,
      thumbColor: "#EFEAE2",
      returnEligible: true,
    },
    {
      id: "i_6",
      name: "Organic Potting Mix (5L)",
      unitPriceCents: 1800,
      quantity: 1,
      returnEligible: false,
    },
  ],
};

const meta = {
  title: "Features/Orders/OrderCard",
  component: OrderCard,
  decorators: [withRouter(["/"])],
  args: { order: delivered },
} satisfies Meta<typeof OrderCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Delivered: Story = {};
export const InTransit: Story = { args: { order: shipped } };
export const Cancelled: Story = { args: { order: cancelled } };
export const WithQuantity: Story = { args: { order: multiQty } };
