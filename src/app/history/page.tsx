"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchHistory } from "@/lib/history";
import { supabaseEnabled } from "@/lib/supabaseClient";
import { writeResultToSession } from "@/lib/quizSession";
import type { AttemptResult } from "@/lib/types";
import { formatDateTime, formatDuration } from "@/lib/format";

export default function HistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<AttemptResult[] | null>(null);

  useEffect(() => {
    fetchHistory().then(setItems);
  }, []);

  function viewDetail(item: AttemptResult) {
    writeResultToSession(item);
    router.push("/result");
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-teal mb-3 text-center">
          Arsip Lembar Jawaban
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-center mb-2">
          Riwayat Pengerjaan
        </h1>
        <p className="text-center text-ink/55 text-sm mb-2">
          {supabaseEnabled
            ? "Tersinkron dengan database Supabase."
            : "Supabase belum dikonfigurasi — menampilkan riwayat lokal di perangkat ini saja."}
        </p>

        <div className="text-center mb-8">
          <a
            href="/"
            className="inline-block text-sm font-semibold text-teal hover:underline underline-offset-4"
          >
            ← Mulai ujian baru
          </a>
        </div>

        {items === null && (
          <p className="text-center font-mono text-sm text-ink/50">Memuat riwayat…</p>
        )}

        {items !== null && items.length === 0 && (
          <div className="paper-card p-8 text-center">
            <p className="text-ink/60 text-sm">
              Belum ada riwayat pengerjaan. Selesaikan satu ujian untuk melihatnya
              di sini.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {items?.map((item, i) => (
            <button
              key={item.id ?? `${item.createdAt}-${i}`}
              onClick={() => viewDetail(item)}
              className="w-full text-left paper-card p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-teal/50 transition"
            >
              <div className="min-w-0">
                <p className="font-display font-bold truncate">{item.nama}</p>
                <p className="text-xs text-ink/50 mt-0.5">
                  {formatDateTime(item.createdAt)} · {formatDuration(item.durationSeconds)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-2xl font-bold text-teal">
                  {item.score}
                </div>
                <div className="text-[11px] text-ink/50 font-mono">
                  {item.correctCount}/{item.totalQuestions} benar
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
