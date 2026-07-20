import type { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "./LoginForm";
import { withRouter, withSignedOut } from "@/storybook/decorators";

const meta = {
  title: "Features/Auth/LoginForm",
  component: LoginForm,
  decorators: [withRouter(["/login"]), withSignedOut],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "var(--canvas)",
      }}
    >
      <LoginForm />
    </div>
  ),
};
