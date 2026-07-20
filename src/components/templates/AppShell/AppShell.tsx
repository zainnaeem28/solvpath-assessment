import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AppHeader } from "@/components/organisms/AppHeader";
import { DashboardSidebar } from "@/components/organisms/DashboardSidebar";
import { useAuthStore } from "@/features/auth/store/authStore";
import "./AppShell.css";

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();
  const isAuthShell = Boolean(user) && pathname !== "/login";

  if (!isAuthShell) {
    return (
      <div className="app-shell app-shell--simple">
        <AppHeader />
        <main className="app-shell__main">{children}</main>
      </div>
    );
  }

  return (
    <div className="app-shell app-shell--dashboard">
      <DashboardSidebar />
      <div className="app-shell__content">
        <main className="app-shell__main app-shell__main--dashboard">{children}</main>
      </div>
    </div>
  );
}
