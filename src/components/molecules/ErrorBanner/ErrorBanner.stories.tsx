import type { Meta, StoryObj } from "@storybook/react";
import { ErrorBanner } from "./ErrorBanner";

const meta = {
  title: "Molecules/ErrorBanner",
  component: ErrorBanner,
  args: {
    message: "The orders service is temporarily unavailable.",
    onRetry: () => undefined,
  },
} satisfies Meta<typeof ErrorBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithRetry: Story = {};
export const MessageOnly: Story = {
  args: { onRetry: undefined },
};
