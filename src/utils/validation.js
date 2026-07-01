/**
 * validation.js — helper validasi form & sanitasi input dasar.
 */

// Menghapus tag HTML/script dari input teks bebas (mis. catatan watchlist)
// untuk mengurangi risiko XSS ketika teks ditampilkan kembali di DOM.
export function sanitizeText(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, '')
    .trim();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  if (!password || password.length < 6) {
    return 'Password minimal 6 karakter.';
  }
  return null;
}

export function validateRegisterForm({ name, email, password, confirmPassword }) {
  const errors = {};
  if (!name || sanitizeText(name).length < 2) {
    errors.name = 'Nama minimal 2 karakter.';
  }
  if (!email || !isValidEmail(email)) {
    errors.email = 'Format email tidak valid.';
  }
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Konfirmasi password tidak cocok.';
  }
  return errors;
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!email || !isValidEmail(email)) {
    errors.email = 'Format email tidak valid.';
  }
  if (!password) {
    errors.password = 'Password wajib diisi.';
  }
  return errors;
}
