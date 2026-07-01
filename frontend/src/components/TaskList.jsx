import { Fragment, useRef, useState } from "react";
import TaskItem from "./TaskItem";
import { EmptyState, LoadingSkeleton } from "./States";

/**
 * Ordered, drag-reorderable task list.
 *
 * Drag-and-drop uses the native HTML5 API for reliability, dressed with
 * custom visual feedback: the source row dims, and an ember insertion line
 * shows where the row will land. `onReorder(fromIndex, toIndex)` is called
 * on drop. Reordering is disabled while a filter/search is active (order is
 * ambiguous when the list is a subset).
 */
export default function TaskList({
  tasks,
  loading,
  isFiltered,
  enteringId,
  leavingId,
  busyId,
  reorderable,
  onReorder,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const rowRefs = useRef([]);

  if (loading) return <LoadingSkeleton />;
  if (tasks.length === 0) return <EmptyState filtered={isFiltered} />;

  const canDrag = reorderable && tasks.length > 1;

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Firefox requires data to be set for drag to start.
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e, index) => {
    if (dragIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    // Insert before or after depending on pointer position within the row.
    const el = rowRefs.current[index];
    let target = index;
    if (el) {
      const rect = el.getBoundingClientRect();
      const after = e.clientY > rect.top + rect.height / 2;
      target = after ? index + 1 : index;
    }
    setOverIndex(target);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dragIndex !== null && overIndex !== null) {
      let to = overIndex;
      if (to > dragIndex) to -= 1; // account for removal of the dragged item
      if (to !== dragIndex) onReorder(dragIndex, to);
    }
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <ul
      className="task-list"
      onDragOver={(e) => canDrag && e.preventDefault()}
      onDrop={handleDrop}
    >
      {tasks.map((task, index) => (
        <Fragment key={task._id}>
          {canDrag && overIndex === index && dragIndex !== index && (
            <li className="drop-indicator" aria-hidden="true" />
          )}
          <TaskItem
            ref={(el) => (rowRefs.current[index] = el)}
            task={task}
            entering={enteringId === task._id}
            leaving={leavingId === task._id}
            isDragging={dragIndex === index}
            busy={busyId === task._id}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            dragProps={
              canDrag
                ? {
                    draggable: true,
                    onDragStart: (e) => handleDragStart(e, index),
                    onDragOver: (e) => handleDragOver(e, index),
                    onDragEnd: handleDragEnd,
                  }
                : {}
            }
          />
        </Fragment>
      ))}
      {canDrag && overIndex === tasks.length && dragIndex !== tasks.length - 1 && (
        <li className="drop-indicator" aria-hidden="true" />
      )}
    </ul>
  );
}
