import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { validateRegisterForm } from '../utils/validation';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const initialForm = { name: '', email: '', password: '', confirmPassword: '' };

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const { register, status, error, clearError } = useAuthStore();
  const toast = useToastStore();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (error) clearError();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateRegisterForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const res = await register(form);
    if (res.ok) {
      toast.success('Akun berhasil dibuat. Selamat datang di MovieList!');
      navigate('/', { replace: true });
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Buat akun baru</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Simpan film favorit Anda ke watchlist pribadi.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          id="name"
          name="name"
          label="Nama lengkap"
          autoComplete="name"
          placeholder="Nama Anda"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
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
          autoComplete="new-password"
          placeholder="Minimal 6 karakter"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Konfirmasi password"
          autoComplete="new-password"
          placeholder="Ulangi password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button type="submit" loading={status === 'loading'} className="mt-2 w-full">
          Daftar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-medium text-forest hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
