import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { TextArea } from "@/components/atoms/TextArea";
import { Badge } from "@/components/atoms/Badge";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { SearchField } from "@/components/molecules/SearchField";
import { Pagination } from "@/components/molecules/Pagination";
import { useState } from "react";

/**
 * Composition stories show how atoms + molecules combine in product UI.
 * Prefer composing shared primitives here instead of one-off CSS in features.
 */
const meta = {
  title: "Patterns/Compositions",
  parameters: {
    docs: {
      description: {
        component:
          "Examples of combining atoms and molecules the way the app does in orders and returns.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ReturnFormFields: Story = {
  name: "Return form (atoms)",
  render: () => (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        maxWidth: "24rem",
        padding: "1.1rem",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-card)",
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <Select
        id="story-reason"
        label="Return reason"
        options={[
          { value: "too_small", label: "Too small" },
          { value: "damaged", label: "Arrived damaged" },
          { value: "other", label: "Other" },
        ]}
        defaultValue="too_small"
      />
      <TextArea
        id="story-comment"
        label="Additional details"
        hint="Optional"
        placeholder="Anything else we should know?"
      />
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
        <Button variant="secondary" type="button">
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  ),
};

export const OrdersToolbar: Story = {
  name: "Orders toolbar (molecules)",
  render: () => <OrdersToolbarDemo />,
};

function OrdersToolbarDemo() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxWidth: "36rem" }}>
      <SearchField
        value={query}
        onChange={setQuery}
        placeholder="Search by order number or product"
      />
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        <Badge tone="neutral">All</Badge>
        <Badge tone="success">Delivered</Badge>
        <Badge tone="info">In transit</Badge>
        <Badge tone="warning">Processing</Badge>
      </div>
      <Pagination page={page} pageSize={4} total={12} onPageChange={setPage} />
    </div>
  );
}

export const ErrorWithRetry: Story = {
  name: "Error recovery (molecule + atom)",
  render: () => (
    <div style={{ maxWidth: "32rem" }}>
      <ErrorBanner
        title="Orders unavailable"
        message="The orders service is temporarily unavailable."
        onRetry={() => undefined}
      />
    </div>
  ),
};

export const SignInEmailFields: Story = {
  name: "Sign-in email (atoms)",
  render: () => (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        maxWidth: "22rem",
        padding: "1.1rem",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-card)",
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        id="story-login-email"
        label="Email"
        type="email"
        placeholder="you@company.com"
        hint="Use a demo email such as maya.chen@example.com"
      />
      <Button type="submit">Continue</Button>
    </form>
  ),
};
