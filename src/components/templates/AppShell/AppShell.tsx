import type { ReactNode } from "react";
import { AppHeader } from "@/components/organisms/AppHeader";
import "./AppShell.css";

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-shell__main">{children}</main>
    </div>
  );
}
