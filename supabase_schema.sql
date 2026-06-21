-- Jalankan script ini di Supabase SQL Editor (Project > SQL Editor > New query)

create extension if not exists "pgcrypto";

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  score integer not null,
  correct_count integer not null,
  total_questions integer not null,
  duration_seconds integer not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quiz_attempts_created_at_idx
  on public.quiz_attempts (created_at desc);

-- Aktifkan Row Level Security
alter table public.quiz_attempts enable row level security;

-- Catatan keamanan: aplikasi ini tidak memakai login/auth, jadi memakai
-- kunci "anon" dan mengizinkan insert + select publik supaya riwayat
-- pengerjaan bisa dibaca semua orang yang membuka aplikasi.
-- Jika ingin riwayat bersifat privat per-pengguna, tambahkan auth Supabase
-- dan ganti policy di bawah menjadi berbasis auth.uid().

create policy "Public can insert quiz attempts"
  on public.quiz_attempts
  for insert
  to anon
  with check (true);

create policy "Public can read quiz attempts"
  on public.quiz_attempts
  for select
  to anon
  using (true);
