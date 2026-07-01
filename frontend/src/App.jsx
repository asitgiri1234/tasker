import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./api/tasks";

const STATUS_CYCLE = ["pending", "in-progress", "completed"];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");

  // Initial load.
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create or update depending on whether we're editing. State updates in
  // place so the UI reflects changes without a page refresh.
  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id, payload);
        setTasks((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t))
        );
        setEditingTask(null);
      } else {
        const created = await createTask(payload);
        setTasks((prev) => [created, ...prev]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    setBusyId(id);
    setError("");
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (editingTask?._id === id) setEditingTask(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleCycleStatus = async (task) => {
    const next =
      STATUS_CYCLE[(STATUS_CYCLE.indexOf(task.status) + 1) % STATUS_CYCLE.length];
    setBusyId(task._id);
    setError("");
    try {
      const updated = await updateTask(task._id, { ...task, status: next });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remaining = tasks.filter((t) => t.status !== "completed").length;

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Tasker</h1>
        <p className="subtitle">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} · {remaining} open
        </p>
      </header>

      <main className="container">
        <TaskForm
          editingTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => setEditingTask(null)}
          submitting={submitting}
        />

        {error && (
          <div className="banner banner-error" role="alert">
            {error}
            <button className="banner-close" onClick={() => setError("")}>
              ✕
            </button>
          </div>
        )}

        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCycleStatus={handleCycleStatus}
          busyId={busyId}
        />
      </main>

      <footer className="app-footer">
        <span>Tasker · MERN Task Tracker</span>
      </footer>
    </div>
  );
}
