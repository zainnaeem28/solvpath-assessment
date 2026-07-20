import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/solvpath-logo.png";
import { Button } from "@/components/atoms/Button";
import { useAuthStore } from "@/features/auth/store/authStore";
import "./AppHeader.css";

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const onLoginPage = location.pathname === "/login";

  const onSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

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
              <Button variant="ghost" size="sm" onClick={onSignOut}>
                Sign out
              </Button>
            </>
          ) : onLoginPage ? null : (
            <Link to="/login" className="btn btn--secondary btn--sm app-header__signin">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
