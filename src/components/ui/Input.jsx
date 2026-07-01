export default function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border bg-surface px-4 py-2.5 text-ink placeholder:text-muted transition-colors
          ${error ? 'border-danger' : 'border-border focus:border-forest'}
          focus:outline-none focus:ring-2 focus:ring-forest/20
          ${className}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
