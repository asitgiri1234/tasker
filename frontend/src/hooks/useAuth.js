import { useCallback, useEffect, useState } from "react";
import { TOKEN_KEY } from "../api/client";

const USER_KEY = "tasker-user";

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
};

/**
 * Auth state backed by localStorage. Exposes the current user and helpers to
 * establish or clear a session. Listens for the "tasker:unauthorized" event
 * (fired by the API client on a 401) to log out on an expired token.
 */
export default function useAuth() {
  const [user, setUser] = useState(readUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Trust the persisted token/user on boot; a stale token will trigger a
    // 401 on first data fetch and log the user out cleanly.
    setReady(true);
  }, []);

  const setSession = useCallback(({ token, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const onUnauthorized = () => logout();
    window.addEventListener("tasker:unauthorized", onUnauthorized);
    return () => window.removeEventListener("tasker:unauthorized", onUnauthorized);
  }, [logout]);

  return { user, ready, setSession, logout };
}
