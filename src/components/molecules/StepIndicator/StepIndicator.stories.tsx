import type { Meta, StoryObj } from "@storybook/react";
import { StepIndicator } from "./StepIndicator";

const RETURN_STEPS = [
  { id: "items", label: "Items" },
  { id: "reason", label: "Reason" },
  { id: "resolution", label: "Resolution" },
  { id: "review", label: "Review" },
];

const meta = {
  title: "Molecules/StepIndicator",
  component: StepIndicator,
  args: {
    steps: RETURN_STEPS,
    currentIndex: 1,
  },
} satisfies Meta<typeof StepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstStep: Story = { args: { currentIndex: 0 } };
export const MidFlow: Story = { args: { currentIndex: 2 } };
export const Review: Story = { args: { currentIndex: 3 } };
