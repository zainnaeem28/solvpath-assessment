export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function orderTotalCents(items: { unitPriceCents: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
}
