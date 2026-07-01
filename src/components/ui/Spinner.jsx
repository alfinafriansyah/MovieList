export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' };
  return (
    <div
      role="status"
      aria-label="Memuat"
      className={`rounded-full border-border border-t-forest animate-spin ${sizes[size]} ${className}`}
    />
  );
}

export function PageLoader({ label = 'Memuat halaman…' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-muted font-mono">{label}</p>
    </div>
  );
}
