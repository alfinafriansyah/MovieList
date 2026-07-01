import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useWatchlistStore } from '../store/watchlistStore';
import { useToastStore } from '../store/toastStore';
import { tmdbImage } from '../services/tmdbConfig';
import { sanitizeText } from '../utils/validation';
import RatingRing from '../components/ui/RatingRing';
import Button from '../components/ui/Button';
import { PageLoader } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

export default function WatchlistPage() {
  const { user } = useAuthStore();
  const { items, status, fetch, remove, updateNote } = useWatchlistStore();
  const toast = useToastStore();
  const [draftNotes, setDraftNotes] = useState({});

  useEffect(() => {
    fetch(user.id);
  }, [user.id, fetch]);

  async function handleRemove(movieId, title) {
    const res = await remove(user.id, movieId);
    if (res.ok) toast.success(`"${title}" dihapus dari watchlist.`);
  }

  async function handleSaveNote(movieId) {
    const note = sanitizeText(draftNotes[movieId] ?? '');
    const res = await updateNote(user.id, movieId, note);
    if (res.ok) toast.success('Catatan disimpan.');
  }

  if (status === 'loading' && items.length === 0) return <PageLoader label="Memuat watchlist…" />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Watchlist Saya</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {items.length} film tersimpan untuk ditonton nanti.
      </p>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Watchlist masih kosong"
            description="Tambahkan film dari halaman jelajahi untuk mulai membangun daftar tontonan Anda."
            action={
              <Link to="/">
                <Button>Jelajahi Film</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {items.map((movie) => (
            <div
              key={movie.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row"
            >
              <Link to={`/movie/${movie.id}`} className="flex-shrink-0">
                <img
                  src={tmdbImage(movie.poster_path, 'w200') || 'https://placehold.co/200x300?text=No+Poster'}
                  alt={movie.title}
                  className="h-36 w-24 rounded-lg object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/movie/${movie.id}`}>
                      <h3 className="font-display text-lg font-semibold text-ink hover:underline">
                        {movie.title}
                      </h3>
                    </Link>
                    <p className="font-mono text-xs text-muted">
                      {movie.release_date?.slice(0, 4) || '—'}
                    </p>
                  </div>
                  <RatingRing voteAverage={movie.vote_average || 0} size={40} />
                </div>

                <textarea
                  rows={2}
                  placeholder="Tulis catatan pribadi tentang film ini…"
                  value={draftNotes[movie.id] ?? movie.note ?? ''}
                  onChange={(e) =>
                    setDraftNotes((prev) => ({ ...prev, [movie.id]: e.target.value }))
                  }
                  className="w-full resize-none rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleSaveNote(movie.id)}>
                    Simpan Catatan
                  </Button>
                  <Button variant="danger" onClick={() => handleRemove(movie.id, movie.title)}>
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
