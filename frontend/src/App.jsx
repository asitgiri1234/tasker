import AuthPage from "./components/AuthPage";
import Board from "./components/Board";
import useAuth from "./hooks/useAuth";
import useTheme from "./hooks/useTheme";

export default function App() {
  const { theme, toggle } = useTheme();
  const { user, ready, setSession, logout } = useAuth();

  if (!ready) return null; // brief boot; theme already applied pre-paint

  if (!user) {
    return (
      <AuthPage
        theme={theme}
        onToggleTheme={toggle}
        onAuthed={setSession}
      />
    );
  }

  return (
    <Board
      // Remount the board on account switch so no state leaks between users.
      key={user.id}
      user={user}
      onLogout={logout}
      theme={theme}
      onToggleTheme={toggle}
    />
  );
}
