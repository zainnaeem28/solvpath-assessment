import type { Meta, StoryObj } from "@storybook/react";
import { AppHeader } from "./AppHeader";
import { withRouter, withSignedIn, withSignedOut } from "@/storybook/decorators";

const meta = {
  title: "Organisms/AppHeader",
  component: AppHeader,
  decorators: [withRouter(["/"])],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignedOut: Story = {
  decorators: [withSignedOut],
};

export const OnLoginPage: Story = {
  decorators: [withRouter(["/login"]), withSignedOut],
};

export const SignedIn: Story = {
  decorators: [withSignedIn],
};
