import type { Meta, StoryObj } from "@storybook/react";
import { OrderSkeleton } from "./OrderSkeleton";

const meta = {
  title: "Features/Orders/OrderSkeleton",
  component: OrderSkeleton,
  args: { count: 3 },
} satisfies Meta<typeof OrderSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Single: Story = { args: { count: 1 } };
