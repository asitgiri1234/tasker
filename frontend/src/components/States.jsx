/** Skeleton loading — ruled shimmer rows echoing the real task cards. */
export function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="skeleton-list" aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-row" key={i}>
          <div className="sk-ring" />
          <div className="sk-lines">
            <div className="sk-bar" style={{ width: `${70 - i * 12}%` }} />
            <div className="sk-bar short" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Designed empty state — a "clean slate" with a drawn illustration. */
export function EmptyState({ filtered }) {
  return (
    <div className="state">
      <svg className="empty-illustration" viewBox="0 0 240 120" fill="none" aria-hidden="true">
        <line className="empty-line" x1="60" y1="34" x2="200" y2="34" />
        <line className="empty-line" x1="60" y1="60" x2="180" y2="60" />
        <line className="empty-line" x1="60" y1="86" x2="150" y2="86" />
        <circle className="empty-ring" cx="38" cy="34" r="9" />
        <circle className="empty-ring" cx="38" cy="60" r="9" />
        <circle className="empty-ring" cx="38" cy="86" r="9" />
      </svg>
      {filtered ? (
        <>
          <h3 className="state-title">Nothing matches</h3>
          <p className="state-sub">
            No tasks fit this filter or search. Try clearing it to see everything.
          </p>
        </>
      ) : (
        <>
          <h3 className="state-title">A clean slate</h3>
          <p className="state-sub">
            No tasks yet. Add the first one above — then finish it and watch it
            light up.
          </p>
        </>
      )}
    </div>
  );
}

/** Error notice — a bordered, ember-marked card (never plain gray text). */
export function ErrorNotice({ message, onDismiss }) {
  return (
    <div className="notice" role="alert">
      <span className="notice-mark">✦</span>
      <div>
        <p className="notice-title">Something went sideways</p>
        <p className="notice-body">{message}</p>
      </div>
      <button className="notice-close" onClick={onDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
