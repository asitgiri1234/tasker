const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

/** Search field + status filter pills with live counts. */
export default function TaskFilters({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  counts,
}) {
  return (
    <div className="toolbar">
      <input
        type="search"
        className="search-input"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks…"
        aria-label="Search tasks"
      />

      <div className="filter-tabs" role="tablist" aria-label="Filter by status">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            className={`filter-tab ${filter === key ? "active" : ""}`}
            onClick={() => onFilterChange(key)}
          >
            {label}
            <span className="count">{counts[key] ?? 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
