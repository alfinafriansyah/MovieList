import { create } from 'zustand';
import { authService } from '../services/authService';
import { isTokenValid } from '../utils/mockJwt';

const existingSession = authService.getStoredSession();
const hasValidSession = existingSession && isTokenValid(existingSession.token);

export const useAuthStore = create((set) => ({
  user: hasValidSession ? existingSession.user : null,
  token: hasValidSession ? existingSession.token : null,
  isAuthenticated: Boolean(hasValidSession),
  status: 'idle', // idle | loading | error
  error: null,

  async register(payload) {
    set({ status: 'loading', error: null });
    try {
      const { token, user } = await authService.register(payload);
      set({ token, user, isAuthenticated: true, status: 'idle', error: null });
      return { ok: true };
    } catch (err) {
      set({ status: 'error', error: err.message });
      return { ok: false, error: err.message };
    }
  },

  async login(payload) {
    set({ status: 'loading', error: null });
    try {
      const { token, user } = await authService.login(payload);
      set({ token, user, isAuthenticated: true, status: 'idle', error: null });
      return { ok: true };
    } catch (err) {
      set({ status: 'error', error: err.message });
      return { ok: false, error: err.message };
    }
  },

  logout() {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false, status: 'idle', error: null });
  },

  clearError() {
    set({ error: null });
  },
}));
