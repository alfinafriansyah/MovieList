import { TMDB_API_KEY, TMDB_BASE_URL } from './tmdbConfig';

/**
 * tmdbClient.js
 */

export class TmdbError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'TmdbError';
    this.status = status;
  }
}

async function tmdbFetch(path, params = {}) {
  if (!TMDB_API_KEY) {
    throw new TmdbError(
      'TMDB API key belum diset. Tambahkan VITE_TMDB_API_KEY pada file .env Anda.',
      0
    );
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  let response;
  try {
    response = await fetch(url.toString());
  } catch {
    throw new TmdbError('Tidak dapat terhubung ke TMDB. Periksa koneksi internet Anda.', 0);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.status_message || 'Gagal mengambil data film dari TMDB.';
    throw new TmdbError(message, response.status);
  }

  return data;
}

export const tmdbApi = {
  trending: (timeWindow = 'week') => tmdbFetch(`/trending/movie/${timeWindow}`),

  popular: (page = 1) => tmdbFetch('/movie/popular', { page }),

  search: (query, page = 1) =>
    tmdbFetch('/search/movie', { query, page, include_adult: false }),

  detail: (movieId) =>
    tmdbFetch(`/movie/${movieId}`, { append_to_response: 'credits,videos,similar' }),

  genres: () => tmdbFetch('/genre/movie/list'),

  discoverByGenre: (genreId, page = 1) =>
    tmdbFetch('/discover/movie', { with_genres: genreId, page }),
};
