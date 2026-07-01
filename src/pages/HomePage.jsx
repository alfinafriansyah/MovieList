import { useEffect, useState } from 'react';
import { tmdbApi, TmdbError } from '../services/tmdbClient';
import useDebounce from '../hooks/useDebounce';
import MovieGrid from '../components/movies/MovieGrid';
import { PageLoader } from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 450);

  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMovies() {
      setStatus('loading');
      setErrorMsg(null);
      try {
        const data = debouncedQuery.trim()
          ? await tmdbApi.search(debouncedQuery.trim())
          : await tmdbApi.trending();

        if (!cancelled) {
          setMovies(data.results || []);
          setStatus('success');
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof TmdbError ? err.message : 'Gagal memuat data film.';
          setErrorMsg(message);
          setStatus('error');
        }
      }
    }

    loadMovies();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <div className="mx-auto max-w-[90%] px-4 py-10 md:px-6">
      {/* Hero */}
      <section className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber-dark">
            Temukan • Simpan • Tonton
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Fokus pada film yang
            <br className="hidden md:block" /> pantas Anda tonton.
          </h1>
        </div>
      </section>

      {/* Search */}
      <div className="mb-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul film…"
          aria-label="Cari film"
          className="w-full max-w-md rounded-full border border-border bg-surface px-5 py-3 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
        />
      </div>

      <h2 className="mb-4 font-display text-xl font-semibold text-ink">
        {debouncedQuery.trim() ? `Hasil untuk "${debouncedQuery}"` : 'Sedang Trending Minggu Ini'}
      </h2>

      {status === 'loading' && <PageLoader label="Mengambil data film…" />}

      {status === 'error' && <Alert type="error">{errorMsg}</Alert>}

      {status === 'success' && movies.length === 0 && (
        <EmptyState
          title="Tidak ada hasil"
          description="Coba kata kunci lain, atau jelajahi film trending minggu ini."
        />
      )}

      {status === 'success' && movies.length > 0 && <MovieGrid movies={movies} />}
    </div>
  );
}
