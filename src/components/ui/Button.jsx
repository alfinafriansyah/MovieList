export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-medium text-sm px-5 py-2.5 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-forest text-white hover:bg-forest-dark',
    secondary: 'bg-amber text-white hover:bg-amber-dark',
    outline: 'border border-border text-ink bg-surface hover:bg-paper',
    ghost: 'text-ink-soft hover:bg-paper',
    danger: 'bg-danger text-white hover:opacity-90',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      )}
      {children}
    </button>
  );
}
