const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

/**
 * Search box + status filter tabs (with live counts).
 * Purely presentational — state lives in App.
 */
export default function TaskFilters({ filter, onFilterChange, search, onSearchChange, counts }) {
  return (
    <div className="filters">
      <div className="search-wrap">
        <input
          type="search"
          className="search-input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="🔍 Search tasks…"
          aria-label="Search tasks"
        />
      </div>

      <div className="filter-tabs" role="tablist">
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
