import { Component } from 'react';
import Button from './Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Di production, di sini idealnya dikirim ke error tracking service.
    console.error('MovieList ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
          <h1 className="font-display text-3xl text-ink">Ada yang tidak beres</h1>
          <p className="max-w-sm text-ink-soft">
            Terjadi kesalahan tak terduga pada aplikasi. Coba muat ulang halaman ini.
          </p>
          <Button onClick={() => window.location.reload()}>Muat Ulang</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
