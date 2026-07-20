import { SearchField } from "@/components/molecules/SearchField";
import { useAuthStore } from "@/features/auth/store/authStore";
import "./DashboardTopBar.css";

export interface DashboardTopBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function DashboardTopBar({ query, onQueryChange }: DashboardTopBarProps) {
  const user = useAuthStore((s) => s.user);
  const initials =
    user?.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2) ?? "SP";

  return (
    <header className="dash-top">
      <div className="dash-top__identity">
        <span className="dash-top__avatar" aria-hidden>
          {initials}
        </span>
        <div>
          <p className="dash-top__hi">Hi, {user?.name.split(" ")[0] ?? "there"}!</p>
          <h1 className="dash-top__welcome">Welcome Back!</h1>
        </div>
      </div>

      <div className="dash-top__search">
        <SearchField
          value={query}
          onChange={onQueryChange}
          placeholder="Search"
          label="Search orders"
        />
      </div>
    </header>
  );
}
