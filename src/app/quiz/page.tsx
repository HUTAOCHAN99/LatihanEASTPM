"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import type { OptionKey, AttemptResult } from "@/lib/types";
import { QUIZ_DURATION_SECONDS } from "@/lib/types";
import {
  readSession,
  writeSession,
  clearSession,
  writeResultToSession,
  type QuizSession,
} from "@/lib/quizSession";
import { useQuizTimer } from "@/lib/useQuizTimer";
import { formatClock } from "@/lib/format";
import { saveAttempt } from "@/lib/history";
import AnswerSheetNav from "@/components/AnswerSheetNav";
import QuestionCard from "@/components/QuestionCard";

export default function QuizPage() {
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = readSession();
    if (!s) {
      router.replace("/");
      return;
    }
    setSession(s);
    setReady(true);
  }, [router]);

  const submit = useCallback(
    async (finalAnswers: Record<number, OptionKey | null>, nama: string, startTime: number) => {
      setSubmitting(true);
      const elapsed = Math.min(
        QUIZ_DURATION_SECONDS,
        Math.floor((Date.now() - startTime) / 1000)
      );
      let correctCount = 0;
      for (const q of questions) {
        if (finalAnswers[q.id] === q.correct) correctCount++;
      }
      const result: AttemptResult = {
        nama,
        createdAt: new Date().toISOString(),
        score: Math.round((correctCount / questions.length) * 100),
        correctCount,
        totalQuestions: questions.length,
        durationSeconds: elapsed,
        answers: finalAnswers,
      };
      await saveAttempt(result);
      writeResultToSession(result);
      clearSession();
      router.push("/result");
    },
    [router]
  );

  const handleExpire = useCallback(() => {
    if (!session) return;
    submit(session.answers, session.nama, session.startTime);
  }, [session, submit]);

  const remaining = useQuizTimer(session?.startTime ?? Date.now(), handleExpire);

  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(
    () => (session ? Object.values(session.answers).filter(Boolean).length : 0),
    [session]
  );

  function handleSelect(opt: OptionKey) {
    if (!session) return;
    const updated: QuizSession = {
      ...session,
      answers: { ...session.answers, [currentQuestion.id]: opt },
    };
    setSession(updated);
    writeSession(updated);
  }

  function jumpTo(id: number) {
    const idx = questions.findIndex((q) => q.id === id);
    if (idx >= 0) {
      setCurrentIndex(idx);
      setNavOpen(false);
    }
  }

  if (!ready || !session) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-ink/50">Memuat lembar ujian…</p>
      </main>
    );
  }

  const lowTime = remaining <= 5 * 60;

  return (
    <main className="min-h-screen pb-28 lg:pb-8">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-paper/95 backdrop-blur border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display font-bold text-sm sm:text-base truncate">
              {session.nama}
            </p>
            <p className="text-[11px] text-ink/50">
              {answeredCount}/{questions.length} terjawab
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`font-mono text-lg sm:text-xl font-semibold px-3 py-1.5 rounded-lg border ${
                lowTime
                  ? "text-coral border-coral/40 bg-coral/10"
                  : "text-teal border-teal/30 bg-teal/5"
              }`}
            >
              {formatClock(remaining)}
            </div>
            <button
              onClick={() => setNavOpen(true)}
              className="lg:hidden font-mono text-xs px-3 py-2 rounded-lg border border-ink/20 bg-white"
            >
              Lembar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-6 grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar nav - desktop */}
        <aside className="hidden lg:block paper-card p-4 h-[calc(100vh-7rem)] sticky top-24">
          <AnswerSheetNav
            questions={questions}
            answers={session.answers}
            currentId={currentQuestion.id}
            onJump={jumpTo}
            onFinish={() => setConfirmOpen(true)}
          />
        </aside>

        {/* Question area */}
        <section>
          <QuestionCard
            question={currentQuestion}
            selected={session.answers[currentQuestion.id] ?? null}
            onSelect={handleSelect}
          />

          <div className="flex items-center justify-between gap-3 mt-5">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-lg border border-ink/20 bg-white text-sm font-semibold disabled:opacity-30"
            >
              ← Sebelumnya
            </button>

            <span className="font-mono text-xs text-ink/40 hidden sm:block">
              {currentIndex + 1} / {questions.length}
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                className="px-4 py-2.5 rounded-lg bg-teal text-paper text-sm font-semibold"
              >
                Selanjutnya →
              </button>
            ) : (
              <button
                onClick={() => setConfirmOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-coral text-paper text-sm font-semibold"
              >
                Selesai &amp; Kumpulkan
              </button>
            )}
          </div>

          <div className="mt-4 text-center lg:hidden">
            <button
              onClick={() => setConfirmOpen(true)}
              className="text-sm font-semibold text-coral underline underline-offset-4"
            >
              Akhiri ujian sekarang
            </button>
          </div>
        </section>
      </div>

      {/* Mobile nav drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-paper p-4 shadow-xl">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setNavOpen(false)}
                className="font-mono text-xs px-3 py-1.5 rounded-lg border border-ink/20"
              >
                Tutup
              </button>
            </div>
            <AnswerSheetNav
              questions={questions}
              answers={session.answers}
              currentId={currentQuestion.id}
              onJump={jumpTo}
              onFinish={() => setConfirmOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Confirm submit modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => !submitting && setConfirmOpen(false)}
          />
          <div className="relative paper-card p-6 max-w-sm w-full">
            <h3 className="font-display text-lg font-bold mb-2">
              Kumpulkan jawaban?
            </h3>
            <p className="text-sm text-ink/70 mb-1">
              Kamu sudah menjawab{" "}
              <span className="font-semibold text-ink">
                {answeredCount} dari {questions.length}
              </span>{" "}
              soal.
            </p>
            {answeredCount < questions.length && (
              <p className="text-sm text-coral mb-4">
                Masih ada {questions.length - answeredCount} soal kosong.
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-ink/20 text-sm font-semibold"
              >
                Kembali
              </button>
              <button
                onClick={() => submit(session.answers, session.nama, session.startTime)}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-teal text-paper text-sm font-semibold disabled:opacity-60"
              >
                {submitting ? "Menyimpan…" : "Ya, kumpulkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
