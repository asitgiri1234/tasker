import { useState } from "react";
import { login as loginApi, register as registerApi } from "../api/auth";
import ThemeToggle from "./ThemeToggle";
import { ErrorNotice } from "./States";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Combined sign in / create account screen. Same visual language as the app
 * (Ink & Ember): serif headline, mono labels, ember primary action.
 */
export default function AuthPage({ onAuthed, theme, onToggleTheme }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setErrors({});
    setServerError("");
  };

  const validate = () => {
    const next = {};
    if (isRegister && !form.name.trim()) next.name = "What should we call you?";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email";
    if (form.password.length < 6)
      next.password = "At least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = isRegister
        ? { name: form.name.trim(), email: form.email.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password };
      const data = isRegister
        ? await registerApi(payload)
        : await loginApi(payload);
      onAuthed(data);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-toggle-corner">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-ring" aria-hidden="true" />
          <span className="auth-word">
            Tasker<span className="dot">.</span>
          </span>
        </div>

        <h1 className="auth-title">
          {isRegister ? "Make it yours" : "Welcome back"}
        </h1>
        <p className="auth-sub">
          {isRegister
            ? "Create an account and your tasks stay yours — on any device."
            : "Sign in to pick up where you left off."}
        </p>

        {serverError && (
          <ErrorNotice message={serverError} onDismiss={() => setServerError("")} />
        )}

        <form onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ada Lovelace"
                aria-invalid={!!errors.name}
                autoComplete="name"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={submitting}
          >
            {submitting
              ? "One moment…"
              : isRegister
              ? "Create account"
              : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "New to Tasker?"}{" "}
          <button type="button" className="auth-link" onClick={switchMode}>
            {isRegister ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>

      <p className="auth-foot">
        No email verification — this is a demo build. Use any email you like.
      </p>
    </div>
  );
}
