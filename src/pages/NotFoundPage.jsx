import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="font-display text-3xl font-semibold text-ink">Halaman tidak ditemukan</h1>
      <p className="max-w-sm text-ink-soft">
        Film yang Anda cari mungkin belum ada di database kami, atau alamat halamannya salah.
      </p>
      <Link to="/">
        <Button>Kembali ke Beranda</Button>
      </Link>
    </div>
  );
}
