# Lembar Latihan EAS — Teknologi & Pemrograman Mobile

Aplikasi simulasi ujian (Next.js 14 + TypeScript + Tailwind) berisi 150 soal
pilihan ganda dari "Soal Latihan EAS Mobile", dengan:

- ⏱️ Timer mundur 60 menit, auto-submit saat waktu habis
- 📋 Lembar jawaban (navigator) bergaya LJK — bisa lompat ke soal mana pun
- ✅ Pengecekan jawaban otomatis sesuai kunci pada dokumen sumber
- 📝 Pembahasan singkat untuk setiap soal di halaman hasil (bisa difilter: semua / salah / kosong)
- 🗂️ Riwayat pengerjaan tersimpan ke **Supabase** (dengan fallback ke localStorage bila Supabase belum diatur)
- 📱 Responsif penuh — nyaman dipakai di HP, tablet, maupun desktop

## 1. Jalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## 2. Menyiapkan Supabase (untuk riwayat pengerjaan)

1. Buat project baru di https://supabase.com
2. Buka **SQL Editor** di dashboard, jalankan isi file `supabase_schema.sql`
   (sudah disertakan di folder ini) untuk membuat tabel `quiz_attempts`
   beserta Row Level Security-nya.
3. Buka **Settings > API**, salin `Project URL` dan `anon public key`.
4. Salin `.env.local.example` menjadi `.env.local`, lalu isi:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
   ```

5. Restart `npm run dev`. Setelah ini, setiap ujian yang selesai dikerjakan
   otomatis tersimpan ke tabel `quiz_attempts`, dan halaman **Riwayat**
   akan menampilkan data dari Supabase.

> Catatan: aplikasi ini tidak memakai sistem login, sehingga semua orang yang
> membuka aplikasi bisa melihat seluruh riwayat (policy `select` bersifat
> publik). Kalau kamu ingin riwayat privat per pengguna, tambahkan Supabase
> Auth dan ubah policy di `supabase_schema.sql` agar berbasis `auth.uid()`.

Jika `.env.local` tidak diisi, aplikasi tetap berjalan normal — riwayat
hanya disimpan di `localStorage` browser (per perangkat, tidak tersinkron).

## 3. Build untuk produksi

```bash
npm run build
npm run start
```

## 4. Deploy

Bisa langsung di-deploy ke Vercel/Netlify. Tambahkan dua environment variable
di atas pada dashboard hosting masing-masing.

## Struktur data soal

Soal & kunci jawaban ada di `src/data/questions.json` (sudah diekstrak dari
dokumen "Soal Latihan EAS Mobile 150 Soal"), dengan tipe di `src/lib/types.ts`.
Jika ingin mengubah/menambah soal, edit file JSON tersebut — formatnya:

```json
{
  "id": 1,
  "section": "WiFi & Bluetooth",
  "question": "...",
  "options": { "A": "...", "B": "...", "C": "...", "D": "...", "E": "..." },
  "correct": "B"
}
```
