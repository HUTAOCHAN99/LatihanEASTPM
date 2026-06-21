"use client";

import type { Question, OptionKey } from "@/lib/types";
import { SECTIONS } from "@/lib/types";

export default function AnswerSheetNav({
  questions,
  answers,
  currentId,
  onJump,
  onFinish,
}: {
  questions: Question[];
  answers: Record<number, OptionKey | null>;
  currentId: number;
  onJump: (id: number) => void;
  onFinish?: () => void;
}) {
  const answeredCount = Object.values(answers).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display text-base font-semibold">Lembar Jawaban</h2>
        <span className="font-mono text-xs text-ink/50">
          {answeredCount}/{questions.length} terisi
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4">
        {SECTIONS.map((section) => {
          const items = questions.filter((q) => q.section === section);
          if (items.length === 0) return null;
          return (
            <div key={section}>
              <p className="text-[11px] uppercase tracking-wide text-ink/45 font-semibold mb-1.5">
                {section}
              </p>
              <div className="grid grid-cols-8 sm:grid-cols-6 lg:grid-cols-5 gap-1.5">
                {items.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => onJump(q.id)}
                    className={`nav-cell ${answers[q.id] ? "answered" : ""} ${
                      q.id === currentId ? "current" : ""
                    }`}
                    aria-label={`Soal nomor ${q.id}${answers[q.id] ? ", sudah dijawab" : ", belum dijawab"}`}
                  >
                    {q.id}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pt-3 mt-3 border-t border-ink/10 text-[11px] text-ink/55">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-teal" /> Terisi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm border border-ink/30 bg-white" />{" "}
          Kosong
        </span>
      </div>
      {onFinish && (
        <div className="mt-4">
          <button
            onClick={onFinish}
            className="w-full px-4 py-2.5 rounded-lg bg-coral text-paper text-sm font-semibold"
          >
            Selesaikan &amp; Kumpulkan
          </button>
        </div>
      )}
    </div>
  );
}
