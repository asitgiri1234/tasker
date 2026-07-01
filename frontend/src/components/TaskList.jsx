import TaskItem from "./TaskItem";

/** Renders the list of tasks, or friendly empty/loading states. */
export default function TaskList({
  tasks,
  loading,
  onEdit,
  onDelete,
  onCycleStatus,
  busyId,
}) {
  if (loading) {
    return <p className="muted">Loading tasks…</p>;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet.</p>
        <p className="muted">Add your first task using the form above.</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onCycleStatus={onCycleStatus}
          busy={busyId === task._id}
        />
      ))}
    </ul>
  );
}
