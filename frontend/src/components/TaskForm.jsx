import { useEffect, useState } from "react";
import StatusDropdown from "./StatusDropdown";
import DatePicker from "./DatePicker";

const EMPTY = { title: "", description: "", status: "pending", dueDate: "" };

/** ISO -> yyyy-mm-dd (local) for the custom date picker. */
const toDateKey = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/**
 * Shared create/edit form built entirely from custom controls
 * (no native select or date input). Client-side validation mirrors
 * the backend rules.
 */
export default function TaskForm({ editingTask, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "pending",
        dueDate: toDateKey(editingTask.dueDate),
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [editingTask]);

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const validate = () => {
    const next = {};
    const title = form.title.trim();
    if (!title) next.title = "Give the task a title";
    else if (title.length > 120) next.title = "Keep the title under 120 characters";
    if (form.description.length > 1000)
      next.description = "Description is too long (max 1000)";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      dueDate: form.dueDate || null,
    });
    if (!editingTask) setForm(EMPTY);
  };

  return (
    <form className="panel" onSubmit={handleSubmit} noValidate>
      <h2 className="panel-title">
        {editingTask ? "Edit task" : "What needs doing?"}
      </h2>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Draft the project brief…"
          maxLength={120}
          aria-invalid={!!errors.title}
          autoComplete="off"
        />
        <div className="field-meta">
          {errors.title ? <span className="error-text">{errors.title}</span> : <span />}
          <span className="counter">{form.title.length}/120</span>
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Notes</label>
        <textarea
          id="description"
          rows="2"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Optional details, links, context…"
          maxLength={1000}
          aria-invalid={!!errors.description}
        />
        <div className="field-meta">
          {errors.description ? (
            <span className="error-text">{errors.description}</span>
          ) : (
            <span />
          )}
          <span className="counter">{form.description.length}/1000</span>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <span className="label" id="status-label">Status</span>
          <StatusDropdown
            id="status"
            value={form.status}
            onChange={(v) => set("status", v)}
          />
        </div>
        <div className="field">
          <span className="label">Due date</span>
          <DatePicker
            id="dueDate"
            value={form.dueDate}
            onChange={(v) => set("dueDate", v)}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : editingTask ? "Save changes" : "Add task"}
        </button>
        {editingTask && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
