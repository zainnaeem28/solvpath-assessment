import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "Delivered" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = { args: { tone: "success" } };
export const Info: Story = { args: { tone: "info", children: "In transit" } };
export const Warning: Story = { args: { tone: "warning", children: "Processing" } };
export const Danger: Story = { args: { tone: "danger", children: "Cancelled" } };
