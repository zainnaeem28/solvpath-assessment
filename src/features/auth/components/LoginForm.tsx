import { useEffect, useId, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { DEMO_ACCOUNTS } from "../lib/accounts";
import { useAuthStore } from "../store/authStore";
import { initialsFromName } from "@/lib/initials";
import "./LoginForm.css";

type SignInMode = "demo" | "email";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const loginError = useAuthStore((s) => s.loginError);
  const clearLoginError = useAuthStore((s) => s.clearLoginError);
  const [mode, setMode] = useState<SignInMode>("demo");
  const [email, setEmail] = useState("");
  const formId = useId();
  const demoTabId = useId();
  const emailTabId = useId();
  const demoPanelId = useId();
  const emailPanelId = useId();

  const from =
    (location.state as { from?: string } | null)?.from &&
    typeof (location.state as { from?: string }).from === "string"
      ? (location.state as { from: string }).from
      : "/";

  useEffect(() => {
    clearLoginError();
  }, [clearLoginError, mode]);

  if (user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const ok = login(email);
    if (ok) navigate(from, { replace: true });
  };

  const pickAccount = (accountEmail: string) => {
    const ok = login(accountEmail);
    if (ok) navigate(from, { replace: true });
  };

  return (
    <section className="login" aria-label="Sign in">
      <div className="login__layout">
        <aside className="login__aside" aria-hidden="true">
          <p className="login__aside-eyebrow">Post-purchase</p>
          <p className="login__aside-title">Orders & Returns In One Place</p>
          <ul className="login__aside-list">
            <li>Track deliveries and order status</li>
            <li>Start a return on delivered items</li>
            <li>Choose refund, exchange, or store credit</li>
          </ul>
        </aside>

        <div className="login__main">
          <header className="login__head">
            <p className="login__eyebrow">Account</p>
            <h1>Sign In</h1>
            <p className="login__sub">
              Demo accounts need no password. Pick a shopper below or enter an email.
            </p>
          </header>

          <article className="login__panel">
            <div className="login__tabs" role="tablist" aria-label="Sign-in method">
              <button
                type="button"
                id={demoTabId}
                role="tab"
                aria-selected={mode === "demo"}
                aria-controls={demoPanelId}
                tabIndex={mode === "demo" ? 0 : -1}
                className={`login__tab${mode === "demo" ? " is-selected" : ""}`}
                onClick={() => setMode("demo")}
              >
                Use Demo Account
              </button>
              <button
                type="button"
                id={emailTabId}
                role="tab"
                aria-selected={mode === "email"}
                aria-controls={emailPanelId}
                tabIndex={mode === "email" ? 0 : -1}
                className={`login__tab${mode === "email" ? " is-selected" : ""}`}
                onClick={() => setMode("email")}
              >
                Enter Email
              </button>
            </div>

            {mode === "demo" ? (
              <div
                id={demoPanelId}
                className="login__panel-body"
                role="tabpanel"
                aria-labelledby={demoTabId}
              >
                <p className="login__hint">Tap an account to sign in instantly.</p>
                <ul className="login__demos">
                  {DEMO_ACCOUNTS.map((account) => (
                    <li key={account.id}>
                      <button
                        type="button"
                        className="login__demo"
                        onClick={() => pickAccount(account.email)}
                      >
                        <span className="login__demo-avatar" aria-hidden>
                          {initialsFromName(account.name)}
                        </span>
                        <span className="login__demo-copy">
                          <strong>Sign In as {account.name}</strong>
                          <span>{account.email}</span>
                        </span>
                        <span className="login__demo-arrow" aria-hidden>
                          →
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div
                id={emailPanelId}
                className="login__panel-body"
                role="tabpanel"
                aria-labelledby={emailTabId}
              >
                <form className="login__form" onSubmit={onSubmit} aria-labelledby={formId}>
                  <h2 id={formId} className="sr-only">
                    Continue with Email
                  </h2>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    label="Email"
                    autoComplete="username"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    hint="Use a demo email such as maya.chen@example.com"
                  />
                  {loginError ? <ErrorBanner title="Sign-in failed" message={loginError} /> : null}
                  <Button type="submit" className="login__submit">
                    Continue
                  </Button>
                </form>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
