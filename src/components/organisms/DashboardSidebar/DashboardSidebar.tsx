import { NavLink } from "react-router-dom";
import logo from "@/assets/solvpath-logo.png";
import { useAuthStore } from "@/features/auth/store/authStore";
import "./DashboardSidebar.css";

export function DashboardSidebar() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <aside className="dash-sidebar" aria-label="Primary">
      <NavLink to="/" className="dash-sidebar__logo" aria-label="solvpath home">
        <img src={logo} alt="" width={36} height={36} />
      </NavLink>

      <nav className="dash-sidebar__nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `dash-sidebar__icon${isActive ? " is-active" : ""}`
          }
          title="Orders dashboard"
          aria-label="Orders dashboard"
        >
          <HomeIcon />
        </NavLink>
        <span className="dash-sidebar__icon is-muted" title="Coming soon" aria-hidden>
          <ListIcon />
        </span>
        <span className="dash-sidebar__icon is-muted" title="Coming soon" aria-hidden>
          <ChartIcon />
        </span>
      </nav>

      <button
        type="button"
        className="dash-sidebar__icon dash-sidebar__logout"
        onClick={logout}
        title="Sign out"
        aria-label="Sign out"
      >
        <LogoutIcon />
      </button>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V5M4 19h16M8 16V10M12 16V7M16 16v-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-2M15 12H3m0 0 3-3m-3 3 3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
