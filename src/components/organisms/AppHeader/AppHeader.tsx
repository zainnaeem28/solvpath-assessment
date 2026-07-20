import { Link } from "react-router-dom";
import logo from "@/assets/solvpath-logo.png";
import { Button } from "@/components/atoms/Button";
import { useAuthStore } from "@/features/auth/store/authStore";
import "./AppHeader.css";

export function AppHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to={user ? "/" : "/login"} className="app-header__brand" aria-label="solvpath home">
          <img src={logo} alt="solvpath" className="app-header__logo" width={140} height={32} />
        </Link>
        <div className="app-header__aside">
          {user ? (
            <>
              <div className="app-header__account">
                <span className="app-header__account-name">{user.name}</span>
                <span className="app-header__account-email">{user.email}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <p className="app-header__tagline">Post-purchase self-service</p>
          )}
        </div>
      </div>
    </header>
  );
}
