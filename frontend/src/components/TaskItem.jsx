const STATUS_LABELS = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

/** A single task card with quick status cycling, edit, and delete actions. */
export default function TaskItem({ task, onEdit, onDelete, onCycleStatus, busy }) {
  const due = formatDate(task.dueDate);

  return (
    <li className={`task-item status-${task.status}`}>
      <div className="task-main">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <button
            type="button"
            className={`badge badge-${task.status}`}
            onClick={() => onCycleStatus(task)}
            disabled={busy}
            title="Click to change status"
          >
            {STATUS_LABELS[task.status] || task.status}
          </button>
        </div>

        {task.description && <p className="task-desc">{task.description}</p>}

        {due && <p className="task-due">📅 Due {due}</p>}
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => onEdit(task)}
          disabled={busy}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(task._id)}
          disabled={busy}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
