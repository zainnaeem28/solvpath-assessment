import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { Order } from "@/api/mockApi";
import { OrderCard } from "./OrderCard";

const delivered: Order = {
  id: "o_10432",
  orderNumber: "SP-10432",
  placedAt: "2026-06-03",
  status: "delivered",
  items: [
    {
      id: "i_1",
      name: "Aurora Wireless Headphones",
      unitPriceCents: 14200,
      quantity: 1,
      thumbColor: "#EDE9FF",
      returnEligible: true,
    },
  ],
};

describe("OrderCard", () => {
  it("shows start a return for delivered orders", () => {
    render(
      <MemoryRouter>
        <OrderCard order={delivered} />
      </MemoryRouter>,
    );
    expect(screen.getByText("SP-10432")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start a return" })).toHaveAttribute(
      "href",
      "/orders/o_10432/return",
    );
  });

  it("expands order details on demand", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OrderCard order={delivered} />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "View order details" }));
    expect(screen.getByText("Order number")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hide details" })).toBeInTheDocument();
  });
});
