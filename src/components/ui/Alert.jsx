export default function Alert({ type = 'error', children }) {
  const styles = {
    error: 'bg-danger-light text-danger border-danger/20',
    info: 'bg-forest-light text-forest-dark border-forest/20',
  };

  return (
    <div role="alert" className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}
