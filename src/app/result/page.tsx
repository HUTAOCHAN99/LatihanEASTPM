"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import type { AttemptResult, OptionKey } from "@/lib/types";
import { SECTIONS } from "@/lib/types";
import { readResultFromSession } from "@/lib/quizSession";
import { formatDuration } from "@/lib/format";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [filter, setFilter] = useState<"all" | "wrong" | "empty">("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const r = readResultFromSession<AttemptResult>();
    if (!r) {
      router.replace("/");
      return;
    }
    setResult(r);
    setReady(true);
  }, [router]);

  const sectionBreakdown = useMemo(() => {
    if (!result) return [];
    return SECTIONS.map((section) => {
      const items = questions.filter((q) => q.section === section);
      const correct = items.filter((q) => result.answers[q.id] === q.correct).length;
      return { section, correct, total: items.length };
    });
  }, [result]);

  const filteredQuestions = useMemo(() => {
    if (!result) return [];
    return questions.filter((q) => {
      const selected = result.answers[q.id] ?? null;
      if (filter === "wrong") return selected !== null && selected !== q.correct;
      if (filter === "empty") return selected === null;
      return true;
    });
  }, [result, filter]);

  if (!ready || !result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-ink/50">Memuat hasil…</p>
      </main>
    );
  }

  const emptyCount = result.totalQuestions - Object.values(result.answers).filter(Boolean).length;
  const wrongCount = result.totalQuestions - result.correctCount - emptyCount;

  return (
    <main className="min-h-screen px-4 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-teal mb-3 text-center">
          Hasil Pengerjaan
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-center mb-1">
          {result.nama}
        </h1>
        <p className="text-center text-ink/55 text-sm mb-8">
          Waktu pengerjaan: {formatDuration(result.durationSeconds)}
        </p>

        <div className="paper-card p-6 sm:p-8 mb-6 text-center">
          <div className="font-display text-6xl font-bold text-teal">
            {result.score}
          </div>
          <p className="text-ink/60 text-sm mt-1 mb-6">dari skor maksimal 100</p>

          <div className="grid grid-cols-3 gap-3">
            <ScoreStat label="Benar" value={result.correctCount} color="text-teal" />
            <ScoreStat label="Salah" value={wrongCount} color="text-coral" />
            <ScoreStat label="Kosong" value={emptyCount} color="text-ink/50" />
          </div>
        </div>

        <div className="paper-card p-6 sm:p-8 mb-6">
          <h2 className="font-display text-lg font-semibold mb-4">Per Bagian Materi</h2>
          <div className="space-y-3">
            {sectionBreakdown.map((s) => (
              <div key={s.section}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{s.section}</span>
                  <span className="font-mono text-ink/60">
                    {s.correct}/{s.total}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-ink/10 overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full"
                    style={{ width: `${(s.correct / s.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <a
            href="/"
            className="flex-1 text-center px-4 py-3 rounded-lg bg-teal text-paper text-sm font-semibold"
          >
            Coba lagi
          </a>
          <a
            href="/history"
            className="flex-1 text-center px-4 py-3 rounded-lg border border-ink/20 text-sm font-semibold"
          >
            Lihat riwayat
          </a>
        </div>

        <div className="paper-card p-5 sm:p-7">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h2 className="font-display text-lg font-semibold">Pembahasan Singkat</h2>
            <div className="flex gap-1.5 font-mono text-xs">
              {(["all", "wrong", "empty"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md border ${
                    filter === f
                      ? "bg-ink text-paper border-ink"
                      : "border-ink/20 text-ink/60"
                  }`}
                >
                  {f === "all" ? "Semua" : f === "wrong" ? "Salah" : "Kosong"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const selected = result.answers[q.id] ?? null;
              const isCorrect = selected === q.correct;
              return (
                <div key={q.id} className="border-b border-ink/10 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs text-ink/40">No. {q.id}</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isCorrect
                          ? "bg-teal/10 text-teal"
                          : selected
                          ? "bg-coral/10 text-coral"
                          : "bg-ink/10 text-ink/50"
                      }`}
                    >
                      {isCorrect ? "Benar" : selected ? "Salah" : "Tidak dijawab"}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-ink mb-2">{q.question}</p>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-ink/50">Jawabanmu: </span>
                      <span className={selected ? (isCorrect ? "text-teal font-semibold" : "text-coral font-semibold") : "text-ink/40"}>
                        {selected ? `${selected}. ${q.options[selected]}` : "—"}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p>
                        <span className="text-ink/50">Kunci jawaban: </span>
                        <span className="text-teal font-semibold">
                          {q.correct}. {q.options[q.correct]}
                        </span>
                      </p>
                    )}
                    <p className="text-ink/60 text-xs mt-1">
                      Pembahasan: jawaban yang tepat adalah{" "}
                      <span className="font-semibold">{q.correct}</span> —{" "}
                      {q.options[q.correct]}.
                    </p>
                  </div>
                </div>
              );
            })}
            {filteredQuestions.length === 0 && (
              <p className="text-sm text-ink/50 text-center py-6">
                Tidak ada soal pada filter ini. 🎉
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ScoreStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/50 px-3 py-3">
      <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-ink/50 mt-0.5">
        {label}
      </div>
    </div>
  );
}
