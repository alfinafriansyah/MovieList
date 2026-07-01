# 🎬 MovieList

Aplikasi web untuk **menjelajahi, mencari, dan menyimpan watchlist film pribadi**, dibangun dengan React + Vite dan data film asli dari **TMDB (The Movie Database) API**.

> Fokus pada film yang pantas Anda tonton.

---

## 📋 Daftar Isi

- [Deskripsi Proyek](#-deskripsi-proyek)
- [Demo & Deployment](#-demo--deployment)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Arsitektur & Pola Desain](#-arsitektur--pola-desain)
- [Fitur](#-fitur)
- [Setup & Menjalankan di Lokal](#-setup--menjalankan-di-lokal)
- [Struktur Folder](#-struktur-folder)

---

## 📖 Deskripsi Proyek

MovieList memungkinkan pengguna:

1. Menjelajahi film **trending** dan **mencari film** apa pun lewat TMDB API secara real-time.
2. Melihat halaman detail film (sinopsis, rating, genre, pemeran, trailer).
3. **Mendaftar/masuk** ke akun pribadi (autentikasi berbasis token, mirip JWT).
4. Menambahkan film ke **watchlist pribadi** yang hanya bisa diakses setelah login, lengkap dengan catatan pribadi per film.

Karena proyek ini disepakati **tanpa backend server sendiri**, fitur autentikasi & watchlist disimulasikan sepenuhnya di sisi klien menggunakan `localStorage` sebagai penyimpanan data, dengan token bergaya JWT (header.payload.signature, punya masa berlaku) untuk mensimulasikan alur proteksi rute yang sesungguhnya. Data film (poster, rating, sinopsis, dsb.) **sepenuhnya asli**, diambil langsung dari TMDB REST API menggunakan Fetch API.

---

## 🌐 Demo & Deployment

| Item | Link |
|---|---|
| Web App (Live) | [https://movie-list-flame-beta.vercel.app/](https://movie-list-flame-beta.vercel.app/) |

> Lihat bagian [Setup & Menjalankan di Lokal](#-setup--menjalankan-di-lokal) untuk instruksi deploy sendiri ke Vercel.

---

## 🛠 Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| Build tool | [Vite](https://vitejs.dev/) |
| UI Library | [React 19](https://react.dev/) |
| Routing | [React Router DOM](https://reactrouter.com/) |
| State Management | [Zustand](https://github.com/pmndrs/zustand) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| HTTP Client | Fetch API (native) |
| Data Film | [TMDB API](https://www.themoviedb.org/documentation/api) |
| Linting | [oxlint](https://oxc.rs/docs/guide/usage/linter.html) |

---

## 🏗 Arsitektur & Pola Desain

- **Feature-based & modular folder structure** — pemisahan jelas antara `pages/` (halaman/route), `components/` (UI reusable, dikelompokkan per domain: `ui/`, `layout/`, `movies/`), `store/` (state global), `services/` (komunikasi data), `hooks/`, dan `utils/`.
- **Service layer pattern** — semua komunikasi data (baik ke TMDB API maupun mock auth/watchlist) dipisah ke folder `services/`. Komponen **tidak pernah** memanggil `fetch` langsung; ini membuat komponen tetap bersih dan memudahkan penggantian sumber data (mis. jika suatu saat ingin memakai backend sungguhan) tanpa menyentuh UI.
- **Centralized state dengan Zustand** — `authStore`, `watchlistStore`, dan `toastStore` menyimpan state lintas-komponen (auth, watchlist, notifikasi) tanpa boilerplate Redux, dengan action async yang mengembalikan `{ ok, error }` secara konsisten agar komponen mudah menampilkan feedback.
- **Protected & Guest-only routes** — komponen `ProtectedRoute` dan `GuestOnlyRoute` membungkus route di React Router untuk menjaga akses halaman berdasarkan status login, mensimulasikan proteksi API dengan JWT di sisi backend sungguhan.
- **Container/presentational split ringan** — halaman (`pages/`) menangani data-fetching & state, komponen UI (`components/ui`) murni presentational dan reusable (`Button`, `Input`, `Alert`, `Spinner`, dst).
- **Graceful error handling** — `ErrorBoundary` menangkap crash React yang tak terduga; setiap pemanggilan API dibungkus try/catch dengan pesan error yang informatif dan tidak mengekspos detail teknis sensitif ke pengguna.

---

## ✨ Fitur

- 🔍 Pencarian film real-time (debounced) ke TMDB API
- 🎞 Grid film trending mingguan
- 📄 Halaman detail film: rating melingkar (signature UI), genre, pemeran, tautan trailer YouTube
- 🔐 Register & Login dengan validasi form penuh + token bergaya JWT
- ⭐ Watchlist pribadi per user, dengan catatan personal per film
- 📱 Layout responsif penuh (mobile, tablet, desktop) dengan menu hamburger
- 🔔 Feedback visual: loading state, toast sukses/error, empty state, pesan validasi form
- 🛡 Route terproteksi — halaman watchlist/profil hanya bisa diakses setelah login

---

## 🚀 Setup & Menjalankan di Lokal

### Prasyarat

- Node.js versi 18 atau lebih baru
- API Key TMDB gratis — daftar di [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (pilih **"API Key (v3 auth)"**)

### Langkah-langkah

```bash
# 1. Clone repository
git clone <url-repo-anda>
cd movielist

# 2. Install dependencies
npm install

# 3. Salin file environment variable
cp .env.example .env

# 4. Buka .env dan isi API Key TMDB Anda
#    VITE_TMDB_API_KEY=isi_api_key_anda_di_sini

# 5. Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

### Script yang tersedia

```bash
npm run dev       # menjalankan development server
npm run build     # build production ke folder dist/
npm run preview   # preview hasil build secara lokal
npm run lint      # menjalankan linter (oxlint)
```

### Deploy ke Vercel (disarankan)

1. Push repository ke GitHub.
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repo ini.
3. Vercel otomatis mendeteksi Vite. Pastikan pengaturan build:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Tambahkan Environment Variable di dashboard Vercel:
   - `VITE_TMDB_API_KEY` = API key TMDB Anda
   - `VITE_TMDB_BASE_URL` = `https://api.themoviedb.org/3`
   - `VITE_TMDB_IMAGE_BASE_URL` = `https://image.tmdb.org/t/p`
5. Deploy. Selesai — Vercel juga otomatis menyediakan routing SPA (fallback ke `index.html`) untuk React Router.

---

## 📁 Struktur Folder

```
src/
├── assets/            # gambar & aset statis
├── components/
│   ├── ui/             # komponen UI reusable (Button, Input, Alert, Spinner, RatingRing, dll)
│   ├── layout/          # Navbar, Footer, MainLayout, ProtectedRoute, GuestOnlyRoute
│   └── movies/          # MovieCard, MovieGrid — komponen spesifik domain film
├── hooks/              # custom hooks (useDebounce)
├── pages/              # satu file per halaman/route
├── routes/             # definisi React Router
├── services/           # komunikasi data: tmdbClient, authService, watchlistService, httpClient
├── store/              # Zustand store: authStore, watchlistStore, toastStore
├── utils/              # helper: validasi form, sanitasi input, mock JWT
├── App.jsx
├── main.jsx
└── index.css           # design tokens Tailwind (warna, tipografi)
```

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pembelajaran/penilaian teknis. Data film disediakan oleh TMDB namun proyek ini tidak didukung atau disahkan oleh TMDB.
