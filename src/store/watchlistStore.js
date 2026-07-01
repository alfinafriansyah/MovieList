import { create } from 'zustand';
import { watchlistService } from '../services/watchlistService';

export const useWatchlistStore = create((set, get) => ({
  items: [],
  status: 'idle', // idle | loading | error
  error: null,

  async fetch(userId) {
    set({ status: 'loading', error: null });
    try {
      const items = await watchlistService.getAll(userId);
      set({ items, status: 'idle' });
    } catch (err) {
      set({ status: 'error', error: err.message });
    }
  },

  async add(userId, movie) {
    try {
      const items = await watchlistService.add(userId, movie);
      set({ items });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  async remove(userId, movieId) {
    try {
      const items = await watchlistService.remove(userId, movieId);
      set({ items });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  async updateNote(userId, movieId, note) {
    try {
      const items = await watchlistService.updateNote(userId, movieId, note);
      set({ items });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  isInWatchlist(movieId) {
    return get().items.some((m) => m.id === movieId);
  },

  reset() {
    set({ items: [], status: 'idle', error: null });
  },
}));
