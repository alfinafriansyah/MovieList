export default function Footer() {
  return (
    <footer className="border-t border-border bg-paper mt-16">
      <div className="mx-auto max-w-[90%] px-4 py-8 md:px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted">
        <p>© {new Date().getFullYear()} MovieList. Dibuat dengan React & Vite.</p>
        <p>
          Data film oleh{' '}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="text-forest hover:underline"
          >
            TMDB
          </a>
          , tidak didukung/disahkan oleh TMDB.
        </p>
      </div>
    </footer>
  );
}
