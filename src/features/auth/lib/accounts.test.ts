import { describe, expect, it } from "vitest";
import { findAccountByEmail } from "@/features/auth/lib/accounts";

describe("findAccountByEmail", () => {
  it("matches demo accounts case-insensitively", () => {
    expect(findAccountByEmail("Maya.Chen@example.com")?.id).toBe("acct_maya");
    expect(findAccountByEmail("jordan.lee@example.com")?.name).toBe("Jordan Lee");
  });

  it("returns undefined for unknown emails", () => {
    expect(findAccountByEmail("nobody@example.com")).toBeUndefined();
  });
});
