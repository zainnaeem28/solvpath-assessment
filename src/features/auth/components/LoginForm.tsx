import { useEffect, useId, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { DEMO_ACCOUNTS } from "../lib/accounts";
import { useAuthStore } from "../store/authStore";
import "./LoginForm.css";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const loginError = useAuthStore((s) => s.loginError);
  const clearLoginError = useAuthStore((s) => s.clearLoginError);
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0]?.email ?? "");
  const formId = useId();

  const from =
    (location.state as { from?: string } | null)?.from &&
    typeof (location.state as { from?: string }).from === "string"
      ? (location.state as { from: string }).from
      : "/";

  useEffect(() => {
    clearLoginError();
  }, [clearLoginError]);

  if (user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const ok = login(email);
    if (ok) navigate(from, { replace: true });
  };

  return (
    <section className="login">
      <header className="login__intro">
        <p className="login__eyebrow">Welcome back</p>
        <h1 className="login__title">Sign in to solvpath</h1>
        <p className="login__subtitle">
          Access your orders, track deliveries, and manage returns. This demo uses a mock
          account — no password required.
        </p>
      </header>

      <form className="login__form" onSubmit={onSubmit} aria-labelledby={formId}>
        <h2 id={formId} className="sr-only">
          Account sign in
        </h2>
        <Input
          id="login-email"
          name="email"
          type="email"
          label="Email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          hint="Try maya.chen@example.com or jordan.lee@example.com"
        />
        {loginError ? <ErrorBanner title="Sign-in failed" message={loginError} /> : null}
        <Button type="submit" className="login__submit">
          Continue
        </Button>
      </form>

      <div className="login__demos">
        <p className="login__demos-label">Quick demo accounts</p>
        <ul>
          {DEMO_ACCOUNTS.map((account) => (
            <li key={account.id}>
              <button
                type="button"
                className="login__demo"
                onClick={() => setEmail(account.email)}
              >
                <strong>{account.name}</strong>
                <span>{account.email}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
