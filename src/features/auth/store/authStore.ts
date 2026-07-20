import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccountUser } from "../lib/accounts";
import { findAccountByEmail } from "../lib/accounts";

interface AuthState {
  user: AccountUser | null;
  loginError: string | null;
  login: (email: string) => boolean;
  logout: () => void;
  clearLoginError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loginError: null,
      login: (email) => {
        const account = findAccountByEmail(email);
        if (!account) {
          set({
            user: null,
            loginError:
              "We couldn't find that account. Try maya.chen@example.com or jordan.lee@example.com.",
          });
          return false;
        }
        set({ user: account, loginError: null });
        return true;
      },
      logout: () => set({ user: null, loginError: null }),
      clearLoginError: () => set({ loginError: null }),
    }),
    { name: "solvpath-auth" },
  ),
);
