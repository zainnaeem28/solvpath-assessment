import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "Delivered" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { args: { tone: "neutral", children: "All statuses" } };
export const Success: Story = { args: { tone: "success" } };
export const Info: Story = { args: { tone: "info", children: "In transit" } };
export const Warning: Story = { args: { tone: "warning", children: "Processing" } };
export const Danger: Story = { args: { tone: "danger", children: "Cancelled" } };
export const Accent: Story = { args: { tone: "accent", children: "Store credit" } };
export const AllTones: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="info">Info</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="danger">Danger</Badge>
      <Badge tone="accent">Accent</Badge>
    </div>
  ),
};
