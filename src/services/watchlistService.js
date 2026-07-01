/**
 * watchlistService.js — CRUD watchlist film per user, tersimpan di
 * localStorage dengan key ter-scope ke userId sehingga tiap akun
 * punya data terpisah (mensimulasikan proteksi data per-user seperti
 * API sungguhan dengan JWT).
 */

function storageKey(userId) {
  return `movielist_watchlist_${userId}`;
}

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readList(userId) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId))) || [];
  } catch {
    return [];
  }
}

function writeList(userId, list) {
  localStorage.setItem(storageKey(userId), JSON.stringify(list));
}

export const watchlistService = {
  async getAll(userId) {
    await delay();
    return readList(userId);
  },

  async add(userId, movie) {
    await delay();
    const list = readList(userId);
    if (list.some((m) => m.id === movie.id)) {
      return list;
    }
    const updated = [
      {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        addedAt: new Date().toISOString(),
        note: '',
      },
      ...list,
    ];
    writeList(userId, updated);
    return updated;
  },

  async remove(userId, movieId) {
    await delay();
    const updated = readList(userId).filter((m) => m.id !== movieId);
    writeList(userId, updated);
    return updated;
  },

  async updateNote(userId, movieId, note) {
    await delay();
    const updated = readList(userId).map((m) =>
      m.id === movieId ? { ...m, note } : m
    );
    writeList(userId, updated);
    return updated;
  },
};
