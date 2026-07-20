import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta = {
  title: "Atoms/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {};

export const Small: Story = {
  args: { size: "sm", label: "Refreshing orders" },
};

export const InlineWithLabel: Story = {
  render: () => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      <Spinner size="sm" label="Loading" />
      <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Updating…</span>
    </div>
  ),
};
