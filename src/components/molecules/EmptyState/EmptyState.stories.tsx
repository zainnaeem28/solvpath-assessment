import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  args: {
    title: "No orders match",
    description: "Try another status filter or clear your search.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    actionLabel: "Clear filters",
    onAction: () => undefined,
  },
};
