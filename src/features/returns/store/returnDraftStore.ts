import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReturnResolution } from "@/api/mockApi";
import type { ReturnReason } from "../lib/money";
import type { ExchangeSelection } from "../lib/offlineQueue";
import type { ReturnStep } from "../lib/steps";

export interface ReturnDraft {
  orderId: string;
  stepIndex: number;
  quantities: Record<string, number>;
  reason: ReturnReason | "";
  comment: string;
  resolution: ReturnResolution | null;
  exchangeSelections: Record<string, ExchangeSelection>;
  updatedAt: string;
}

interface ReturnDraftState {
  drafts: Record<string, ReturnDraft>;
  saveDraft: (draft: Omit<ReturnDraft, "updatedAt">) => void;
  clearDraft: (orderId: string) => void;
  getDraft: (orderId: string) => ReturnDraft | undefined;
}

export const useReturnDraftStore = create<ReturnDraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      saveDraft: (draft) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [draft.orderId]: {
              ...draft,
              updatedAt: new Date().toISOString(),
            },
          },
        })),
      clearDraft: (orderId) =>
        set((state) => {
          const next = { ...state.drafts };
          delete next[orderId];
          return { drafts: next };
        }),
      getDraft: (orderId) => get().drafts[orderId],
    }),
    { name: "solvpath-return-drafts" },
  ),
);

export type { ReturnStep };
