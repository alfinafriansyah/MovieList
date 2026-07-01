import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import Button from '../ui/Button';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-forest' : 'text-ink-soft hover:text-ink'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const toast = useToastStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    toast.success('Anda telah keluar.');
    navigate('/login');
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-[90%] items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="font-display text-xl font-semibold text-ink">
          Movie<span className="text-forest">List</span>
        </Link>

        {/* Desktop & tablet nav */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Jelajahi
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/watchlist" className={navLinkClass}>
              Watchlist
            </NavLink>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted font-mono">Hai, {user.name.split(' ')[0]}</span>
              <Button variant="outline" onClick={handleLogout}>
                Keluar
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link to="/register">
                <Button>Daftar</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          aria-expanded={open}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1">
            <span className="h-0.5 w-5 bg-ink" />
            <span className="h-0.5 w-5 bg-ink" />
            <span className="h-0.5 w-5 bg-ink" />
          </div>
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-border bg-surface px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>
              Jelajahi
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/watchlist" className={navLinkClass} onClick={() => setOpen(false)}>
                Watchlist
              </NavLink>
            )}
            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout}>
                Keluar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setOpen(false)}>
                  <Button className="w-full">Daftar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
