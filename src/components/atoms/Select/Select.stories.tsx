import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta = {
  title: "Atoms/Select",
  component: Select,
  args: {
    id: "reason",
    name: "reason",
    label: "Return reason",
    options: [
      { value: "", label: "Select a reason", disabled: true },
      { value: "too_small", label: "Too small" },
      { value: "too_large", label: "Too large" },
      { value: "damaged", label: "Arrived damaged" },
      { value: "other", label: "Other" },
    ],
    defaultValue: "",
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "Choose a return reason to continue.",
  },
};

export const Preselected: Story = {
  args: {
    defaultValue: "damaged",
  },
};
