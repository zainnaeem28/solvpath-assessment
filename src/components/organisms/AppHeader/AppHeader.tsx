import { Link } from "react-router-dom";
import logo from "@/assets/solvpath-logo.png";
import "./AppHeader.css";

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="app-header__brand" aria-label="solvpath home">
          <img src={logo} alt="solvpath" className="app-header__logo" width={140} height={32} />
        </Link>
        <p className="app-header__tagline">Post-purchase self-service</p>
      </div>
    </header>
  );
}
