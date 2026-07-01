import { signToken } from '../utils/mockJwt';
import { sanitizeText } from '../utils/validation';

/**
 * authService.js
 */

const USERS_KEY = 'movielist_users';
const TOKEN_KEY = 'movielist_token'; // dipakai bersama httpClient.js
const CURRENT_USER_KEY = 'movielist_current_user';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Simulasikan latensi jaringan agar UX loading state terasa nyata
function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Hash sederhana agar password tidak tersimpan sebagai plain text di localStorage.
async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const authService = {
  async register({ name, email, password }) {
    await delay();
    const users = readUsers();
    const cleanEmail = sanitizeText(email).toLowerCase();

    if (users.some((u) => u.email === cleanEmail)) {
      throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau masuk.');
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: crypto.randomUUID(),
      name: sanitizeText(name),
      email: cleanEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    writeUsers([...users, newUser]);

    const token = signToken({ sub: newUser.id, email: newUser.email });
    const publicUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));

    return { token, user: publicUser };
  },

  async login({ email, password }) {
    await delay();
    const users = readUsers();
    const cleanEmail = sanitizeText(email).toLowerCase();
    const user = users.find((u) => u.email === cleanEmail);

    if (!user) {
      throw new Error('Email atau password salah.');
    }

    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      throw new Error('Email atau password salah.');
    }

    const token = signToken({ sub: user.id, email: user.email });
    const publicUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));

    return { token, user: publicUser };
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getStoredSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(CURRENT_USER_KEY);
    if (!token || !userRaw) return null;
    try {
      return { token, user: JSON.parse(userRaw) };
    } catch {
      return null;
    }
  },
};
