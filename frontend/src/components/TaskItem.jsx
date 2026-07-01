import { forwardRef } from "react";
import EmberCheck from "./EmberCheck";

const STATUS_LABELS = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

/** Relative-ish due label + urgency flag (due within 2 days & not done). */
const dueInfo = (iso, status) => {
  if (!iso) return null;
  const due = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueMid = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const days = Math.round((dueMid - today) / 86400000);

  let text;
  if (days === 0) text = "Due today";
  else if (days === 1) text = "Due tomorrow";
  else if (days === -1) text = "Due yesterday";
  else if (days < 0) text = `${Math.abs(days)}d overdue`;
  else text = `Due ${dueMid.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;

  const soon = status !== "completed" && days <= 2;
  return { text, soon };
};

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17v3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M13.5 6.5l3 3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GripIcon = () => (
  <svg width="10" height="18" viewBox="0 0 10 18" fill="currentColor" aria-hidden="true">
    <circle cx="2.5" cy="3" r="1.4" /><circle cx="7.5" cy="3" r="1.4" />
    <circle cx="2.5" cy="9" r="1.4" /><circle cx="7.5" cy="9" r="1.4" />
    <circle cx="2.5" cy="15" r="1.4" /><circle cx="7.5" cy="15" r="1.4" />
  </svg>
);

const TaskItem = forwardRef(function TaskItem(
  {
    task,
    entering,
    leaving,
    isDragging,
    busy,
    onToggleComplete,
    onEdit,
    onDelete,
    dragProps,
  },
  ref
) {
  const completed = task.status === "completed";
  const due = dueInfo(task.dueDate, task.status);

  const cls = [
    "task-item",
    `status-${task.status}`,
    entering ? "entering" : "",
    leaving ? "leaving" : "",
    isDragging ? "dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li ref={ref} className={cls} {...dragProps}>
      <button
        className="drag-handle"
        aria-label="Drag to reorder"
        tabIndex={-1}
        onClick={(e) => e.preventDefault()}
      >
        <GripIcon />
      </button>

      <EmberCheck
        checked={completed}
        disabled={busy}
        label={completed ? `Mark "${task.title}" as not done` : `Complete "${task.title}"`}
        onToggle={() => onToggleComplete(task)}
      />

      <div className="task-body">
        <div className="task-title-row">
          <h3 className="task-title">{task.title}</h3>
        </div>

        {task.description && <p className="task-desc">{task.description}</p>}

        <div className="task-meta">
          <span className="meta-chip status">
            <span className="pip" />
            {STATUS_LABELS[task.status]}
          </span>
          {due && (
            <span className={`meta-chip due ${due.soon ? "soon" : ""}`}>
              {due.text}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          className="btn-icon"
          aria-label="Edit task"
          onClick={() => onEdit(task)}
          disabled={busy}
        >
          <EditIcon />
        </button>
        <button
          className="btn-icon danger"
          aria-label="Delete task"
          onClick={() => onDelete(task._id)}
          disabled={busy}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
});

export default TaskItem;
