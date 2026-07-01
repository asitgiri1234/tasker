import { useEffect, useMemo, useRef, useState } from "react";
import TaskForm from "./TaskForm";
import TaskFilters from "./TaskFilters";
import TaskList from "./TaskList";
import ThemeToggle from "./ThemeToggle";
import { ErrorNotice } from "./States";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";

const orderKey = (userId) => `tasker-order-${userId}`;

const loadOrder = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(orderKey(userId))) || [];
  } catch {
    return [];
  }
};

/** The authenticated task board. Assumes a valid session (App gates on it). */
export default function Board({ user, onLogout, theme, onToggleTheme }) {
  const [tasks, setTasks] = useState([]);
  const [order, setOrder] = useState(() => loadOrder(user.id));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [enteringId, setEnteringId] = useState(null);
  const [leavingId, setLeavingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileTimers = useRef({});

  useEffect(() => {
    loadTasks();
    return () => Object.values(fileTimers.current).forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(orderKey(user.id), JSON.stringify(order));
    } catch {
      /* ignore */
    }
  }, [order, user.id]);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks();
      setTasks(data);
      setOrder((prev) => {
        const ids = data.map((t) => t._id);
        const known = prev.filter((id) => ids.includes(id));
        const fresh = ids.filter((id) => !prev.includes(id));
        return [...fresh, ...known];
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const byId = useMemo(() => {
    const m = {};
    tasks.forEach((t) => (m[t._id] = t));
    return m;
  }, [tasks]);

  const orderedTasks = useMemo(
    () => order.map((id) => byId[id]).filter(Boolean),
    [order, byId]
  );

  const counts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      "in-progress": tasks.filter((t) => t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }),
    [tasks]
  );

  const isFiltered = filter !== "all" || search.trim() !== "";

  const visibleTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orderedTasks.filter((t) => {
      const matchesStatus = filter === "all" || t.status === filter;
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orderedTasks, filter, search]);

  const remaining = tasks.filter((t) => t.status !== "completed").length;

  // ---- CRUD ----
  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id, payload);
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        setEditingTask(null);
      } else {
        const created = await createTask(payload);
        setTasks((prev) => [created, ...prev]);
        setOrder((prev) => [created._id, ...prev.filter((id) => id !== created._id)]);
        setEnteringId(created._id);
        setTimeout(() => setEnteringId(null), 520);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task? This can't be undone.")) return;
    setBusyId(id);
    setError("");
    try {
      await deleteTask(id);
      setLeavingId(id);
      setTimeout(() => {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        setOrder((prev) => prev.filter((x) => x !== id));
        setLeavingId(null);
      }, 240);
      if (editingTask?._id === id) setEditingTask(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleComplete = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    const prevSnapshot = task;

    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
    );

    try {
      const updated = await updateTask(task._id, { ...task, status: nextStatus });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

      if (nextStatus === "completed") {
        clearTimeout(fileTimers.current[task._id]);
        fileTimers.current[task._id] = setTimeout(() => {
          setOrder((prev) => [...prev.filter((id) => id !== task._id), task._id]);
        }, 620);
      }
    } catch (err) {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? prevSnapshot : t)));
      setError(err.message);
    }
  };

  const handleReorder = (from, to) => {
    setOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const initials = (user.name || user.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <div className="wordmark">
            <h1>
              Tasker<span className="dot">.</span>
            </h1>
          </div>
          <p className="header-meta">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} · {remaining} open
          </p>
        </div>

        <div className="header-right">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <div className="account">
            <button
              className="avatar"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 120)}
              title={user.email}
            >
              {initials}
            </button>
            {menuOpen && (
              <div className="account-menu" role="menu">
                <div className="account-info">
                  <p className="account-name">{user.name}</p>
                  <p className="account-email">{user.email}</p>
                </div>
                <button className="account-logout" role="menuitem" onClick={onLogout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        <TaskForm
          editingTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => setEditingTask(null)}
          submitting={submitting}
        />

        {error && <ErrorNotice message={error} onDismiss={() => setError("")} />}

        {!loading && tasks.length > 0 && (
          <TaskFilters
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            counts={counts}
          />
        )}

        <TaskList
          tasks={visibleTasks}
          loading={loading}
          isFiltered={isFiltered}
          enteringId={enteringId}
          leavingId={leavingId}
          busyId={busyId}
          reorderable={!isFiltered}
          onReorder={handleReorder}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <footer className="app-footer">Tasker · Ink &amp; Ember</footer>
    </div>
  );
}
