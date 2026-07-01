import { Link } from 'react-router-dom';
import RatingRing from '../ui/RatingRing';
import { tmdbImage } from '../../services/tmdbConfig';
import { useAuthStore } from '../../store/authStore';
import { useWatchlistStore } from '../../store/watchlistStore';
import { useToastStore } from '../../store/toastStore';

export default function MovieCard({ movie }) {
  const { isAuthenticated, user } = useAuthStore();
  const { isInWatchlist, add, remove } = useWatchlistStore();
  const toast = useToastStore();
  const inList = isInWatchlist(movie.id);

  async function toggleWatchlist(e) {
    e.preventDefault();
    e.stopPropagation();

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

  const poster = tmdbImage(movie.poster_path, 'w342');

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-border">
        {poster ? (
          <img
            src={poster}
            alt={`Poster ${movie.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted font-mono">
            Tidak ada poster
          </div>
        )}

        <button
          onClick={toggleWatchlist}
          aria-label={inList ? 'Hapus dari watchlist' : 'Tambah ke watchlist'}
          aria-pressed={inList}
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-sm shadow-md transition-colors
            ${inList ? 'bg-amber text-white' : 'bg-white/90 text-ink hover:bg-white'}`}
        >
          {inList ? '★' : '☆'}
        </button>

        <div className="absolute bottom-2 left-2 rounded-full bg-white/90 backdrop-blur">
          <RatingRing voteAverage={movie.vote_average || 0} size={40} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-ink">
          {movie.title}
        </h3>
        <p className="font-mono text-xs text-muted">
          {movie.release_date ? movie.release_date.slice(0, 4) : '—'}
        </p>
      </div>
    </Link>
  );
}
