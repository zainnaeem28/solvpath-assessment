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
        <Link to="/" className="app-header__brand" aria-label="solvpath home">
          <img src={logo} alt="solvpath" className="app-header__logo" width={128} height={28} />
        </Link>

        <div className="app-header__actions">
          {user ? (
            <>
              <span className="app-header__user" title={user.email}>
                {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <Link to="/login" className="app-header__signin">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
