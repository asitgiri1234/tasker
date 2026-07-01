import { useEffect, useState } from "react";

const EMPTY = { title: "", description: "", status: "pending", dueDate: "" };

/** Convert an ISO date string to the yyyy-mm-dd value <input type=date> needs. */
const toDateInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

/**
 * Shared form for creating and editing tasks.
 * - When `editingTask` is set, the form is prefilled and acts as an editor.
 * - Client-side validation mirrors the backend rules.
 */
export default function TaskForm({ editingTask, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Sync form when switching between create/edit or selecting a different task.
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "pending",
        dueDate: toDateInput(editingTask.dueDate),
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [editingTask]);

  const validate = () => {
    const next = {};
    const title = form.title.trim();
    if (!title) next.title = "Title is required";
    else if (title.length > 120) next.title = "Title cannot exceed 120 characters";
    if (form.description.length > 1000)
      next.description = "Description cannot exceed 1000 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

    if (!editingTask) setForm(EMPTY); // clear after creating
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>

      <div className="field">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Finish the assignment"
          aria-invalid={!!errors.title}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional details…"
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <span className="error-text">{errors.description}</span>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : editingTask ? "Update Task" : "Add Task"}
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
