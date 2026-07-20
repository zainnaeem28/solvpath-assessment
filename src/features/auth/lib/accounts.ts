export interface AccountUser {
  id: string;
  name: string;
  email: string;
}

/** Demo shoppers for the take-home (no real backend). */
export const DEMO_ACCOUNTS: AccountUser[] = [
  {
    id: "acct_maya",
    name: "Maya Chen",
    email: "maya.chen@example.com",
  },
  {
    id: "acct_jordan",
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
  },
];

export function findAccountByEmail(email: string): AccountUser | undefined {
  const normalized = email.trim().toLowerCase();
  return DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === normalized);
}
