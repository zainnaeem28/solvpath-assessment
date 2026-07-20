import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { AppShell } from "./AppShell";
import { withRouter, withSignedOut } from "@/storybook/decorators";

function DemoMain({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: "0.25rem 0" }}>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.925rem" }}>{children}</p>
    </div>
  );
}

const meta = {
  title: "Templates/AppShell",
  component: AppShell,
  decorators: [withRouter(["/"]), withSignedOut],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <DemoMain>
        App shell wraps the sticky header and page content width used across orders and returns.
      </DemoMain>
    ),
  },
};
