import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tmdbApi, TmdbError } from '../services/tmdbClient';
import { tmdbImage } from '../services/tmdbConfig';
import { useAuthStore } from '../store/authStore';
import { useWatchlistStore } from '../store/watchlistStore';
import { useToastStore } from '../store/toastStore';
import RatingRing from '../components/ui/RatingRing';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { PageLoader } from '../components/ui/Spinner';

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState(null);

  const { isAuthenticated, user } = useAuthStore();
  const { isInWatchlist, add, remove } = useWatchlistStore();
  const toast = useToastStore();

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    tmdbApi
      .detail(id)
      .then((data) => {
        if (!cancelled) {
          setMovie(data);
          setStatus('success');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMsg(err instanceof TmdbError ? err.message : 'Gagal memuat detail film.');
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function toggleWatchlist() {
    if (!isAuthenticated) {
      toast.error('Masuk terlebih dahulu untuk menambah watchlist.');
      return;
    }
    if (inList) {
      const res = await remove(user.id, movie.id);
      if (res.ok) toast.success(`"${movie.title}" dihapus dari watchlist.`);
    } else {
      const res = await add(user.id, movie);
      if (res.ok) toast.success(`"${movie.title}" ditambahkan ke watchlist.`);
    }
  }

  if (status === 'loading') return <PageLoader label="Mengambil detail film…" />;

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Alert type="error">{errorMsg}</Alert>
        <Link to="/" className="mt-4 inline-block text-sm text-forest hover:underline">
          ← Kembali ke beranda
        </Link>
      </div>
    );
  }

  const inList = isInWatchlist(movie.id);
  const backdrop = tmdbImage(movie.backdrop_path, 'original');
  const poster = tmdbImage(movie.poster_path, 'w500');
  const director = movie.credits?.crew?.find((c) => c.job === 'Director');
  const cast = movie.credits?.cast?.slice(0, 6) || [];
  const trailer = movie.videos?.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  );

  return (
    <div>
      {backdrop && (
        <div
          className="h-64 w-full bg-cover bg-center md:h-96"
          style={{
            backgroundImage: `linear-gradient(to top, var(--color-paper), rgba(247,245,242,0.3)), url(${backdrop})`,
          }}
        />
      )}

      <div className="mx-auto -mt-24 max-w-6xl px-4 pb-16 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <img
            src={poster}
            alt={`Poster ${movie.title}`}
            className="w-40 flex-shrink-0 self-start rounded-xl border-4 border-surface shadow-lg md:w-56"
          />

          <div className="flex-1">
            <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">
              {movie.title}
            </h1>
            <p className="mt-1 font-mono text-sm text-muted">
              {movie.release_date?.slice(0, 4)} • {movie.runtime ? `${movie.runtime} menit` : '—'}
              {director && ` • Sutradara: ${director.name}`}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(movie.genres || []).map((g) => (
                <span
                  key={g.id}
                  className="rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest-dark"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <RatingRing voteAverage={movie.vote_average || 0} size={64} />
              <Button
                variant={inList ? 'outline' : 'secondary'}
                onClick={toggleWatchlist}
              >
                {inList ? '★ Ada di Watchlist' : '☆ Tambah ke Watchlist'}
              </Button>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="ghost">▶ Tonton Trailer</Button>
                </a>
              )}
            </div>

            <p className="mt-6 max-w-2xl text-ink-soft leading-relaxed">
              {movie.overview || 'Sinopsis tidak tersedia.'}
            </p>
          </div>
        </div>

        {cast.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">Pemeran Utama</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {cast.map((actor) => (
                <div key={actor.cast_id ?? actor.id} className="w-24 flex-shrink-0 text-center">
                  <img
                    src={tmdbImage(actor.profile_path, 'w200') || 'https://placehold.co/200x200?text=%3F'}
                    alt={actor.name}
                    className="mb-2 h-24 w-24 rounded-full object-cover"
                  />
                  <p className="text-xs font-medium text-ink line-clamp-1">{actor.name}</p>
                  <p className="text-xs text-muted line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
