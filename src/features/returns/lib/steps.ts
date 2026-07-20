export type ReturnStep = "items" | "reason" | "resolution" | "review";

export const RETURN_STEPS: { id: ReturnStep; label: string }[] = [
  { id: "items", label: "Items" },
  { id: "reason", label: "Reason" },
  { id: "resolution", label: "Resolution" },
  { id: "review", label: "Review" },
];
