import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./TextArea";

const meta = {
  title: "Atoms/TextArea",
  component: TextArea,
  args: {
    id: "comment",
    name: "comment",
    label: "Additional details",
    placeholder: "Anything else we should know?",
    rows: 3,
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: "Optional. Keep it under a few sentences.",
  },
};

export const WithError: Story = {
  args: {
    error: "Please add a short note for this reason.",
    value: "",
  },
};
