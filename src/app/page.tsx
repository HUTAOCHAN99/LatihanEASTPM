"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startSession } from "@/lib/quizSession";
import { questions } from "@/data/questions";
import { SECTIONS, QUIZ_DURATION_SECONDS } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [error, setError] = useState("");

  function handleStart() {
    const trimmed = nama.trim();
    if (!trimmed) {
      setError("Isi nama dahulu sebelum memulai ujian.");
      return;
    }
    startSession(trimmed);
    router.push("/quiz");
  }

  const perSection = SECTIONS.map((s) => ({
    name: s,
    count: questions.filter((q) => q.section === s).length,
  }));

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-teal mb-3">
            Lembar Jawaban Komputer · Simulasi EAS
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight text-ink">
            Latihan EAS
            <br className="sm:hidden" /> Teknologi &amp; Pemrograman Mobile
          </h1>
          <p className="mt-4 text-ink/70 max-w-xl mx-auto">
            150 soal pilihan ganda, durasi 60 menit, pengecekan jawaban otomatis
            sesuai kunci, dan pembahasan singkat di akhir pengerjaan.
          </p>
        </div>

        <div className="paper-card p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <Stat label="Jumlah soal" value={`${questions.length}`} />
            <Stat label="Durasi" value={`${QUIZ_DURATION_SECONDS / 60} menit`} />
            <Stat label="Format" value="Pilihan ganda A–E" />
          </div>

          <div className="tick-rule mb-6" />

          <div className="mb-6">
            <h2 className="font-display text-lg font-semibold mb-3">Cakupan materi</h2>
            <ul className="space-y-2">
              {perSection.map((s, i) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between text-sm border border-ink/10 rounded-lg px-3 py-2 bg-white/40"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-brass">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.name}
                  </span>
                  <span className="font-mono text-xs text-ink/50">
                    {s.count} soal
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tick-rule mb-6" />

          <div className="mb-6">
            <label htmlFor="nama" className="block text-sm font-semibold mb-2">
              Nama peserta
            </label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              placeholder="Tulis nama lengkap kamu"
              className="w-full rounded-lg border border-ink/20 bg-white px-4 py-3 text-base focus:border-teal outline-none"
            />
            {error && <p className="mt-2 text-sm text-coral">{error}</p>}
          </div>

          <button
            onClick={handleStart}
            className="w-full rounded-lg bg-teal text-paper font-semibold py-3.5 text-base hover:bg-teal/90 active:scale-[0.99] transition"
          >
            Mulai ujian — waktu langsung berjalan
          </button>

          <p className="mt-3 text-xs text-ink/50 text-center">
            Setelah ditekan, hitung mundur 60 menit dimulai. Progres tersimpan
            otomatis selama tab ini tidak ditutup.
          </p>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/history"
            className="text-sm font-semibold text-teal hover:underline underline-offset-4"
          >
            Lihat riwayat pengerjaan →
          </a>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/50 px-3 py-3 text-center">
      <div className="font-display text-xl font-bold text-ink">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-ink/50 mt-0.5">
        {label}
      </div>
    </div>
  );
}
