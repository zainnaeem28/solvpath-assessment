import { NavLink } from "react-router-dom";
import logo from "@/assets/solvpath-logo.png";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Button } from "@/components/atoms/Button";
import "./DashboardSidebar.css";

export function DashboardSidebar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) return null;

  return (
    <aside className="dash-sidebar" aria-label="Dashboard">
      <div className="dash-sidebar__brand">
        <img src={logo} alt="solvpath" className="dash-sidebar__logo" width={132} height={30} />
        <p className="dash-sidebar__product">Post-purchase</p>
      </div>

      <nav className="dash-sidebar__nav">
        <p className="dash-sidebar__nav-label">Overview</p>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `dash-sidebar__link${isActive ? " is-active" : ""}`
          }
        >
          <span className="dash-sidebar__dot" aria-hidden />
          Orders dashboard
        </NavLink>
      </nav>

      <div className="dash-sidebar__footer">
        <div className="dash-sidebar__user">
          <span className="dash-sidebar__avatar" aria-hidden>
            {user.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </span>
          <div className="dash-sidebar__user-copy">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={logout}
          className="dash-sidebar__signout"
        >
          Sign out
        </Button>
      </div>
    </aside>
  );
}
