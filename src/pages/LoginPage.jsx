import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { validateLoginForm } from '../utils/validation';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, status, error, clearError } = useAuthStore();
  const toast = useToastStore();
  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (error) clearError();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const res = await login(form);
    if (res.ok) {
      toast.success('Berhasil masuk. Selamat menonton!');
      navigate(location.state?.from || '/', { replace: true });
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Selamat datang kembali</h1>
        <p className="mt-2 text-sm text-ink-soft">Masuk untuk mengelola watchlist film Anda.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button type="submit" loading={status === 'loading'} className="mt-2 w-full">
          Masuk
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Belum punya akun?{' '}
        <Link to="/register" className="font-medium text-forest hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
