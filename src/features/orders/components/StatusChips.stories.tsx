import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ComponentProps } from "react";
import type { OrdersStatusFilter } from "../lib/filterOrders";
import { StatusChips } from "./StatusChips";

const meta = {
  title: "Features/Orders/StatusChips",
  component: StatusChips,
} satisfies Meta<typeof StatusChips>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveStatusChips(args: ComponentProps<typeof StatusChips>) {
  const [value, setValue] = useState<OrdersStatusFilter>(args.value);
  return <StatusChips {...args} value={value} onChange={setValue} />;
}

export const Interactive: Story = {
  args: {
    value: "all",
    onChange: () => undefined,
  },
  render: (args) => <InteractiveStatusChips {...args} />,
};

export const DeliveredSelected: Story = {
  args: {
    value: "delivered",
    onChange: () => undefined,
  },
};

export const Disabled: Story = {
  args: {
    value: "all",
    onChange: () => undefined,
    disabled: true,
  },
};
