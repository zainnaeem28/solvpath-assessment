import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  args: {
    id: "email",
    name: "email",
    label: "Email",
    placeholder: "you@company.com",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: "Use a demo email such as maya.chen@example.com",
  },
};

export const WithError: Story = {
  args: {
    error: "Enter a valid email address.",
    value: "not-an-email",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "maya.chen@example.com",
  },
};
