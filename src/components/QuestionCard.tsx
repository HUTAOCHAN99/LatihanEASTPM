"use client";

import type { Question, OptionKey } from "@/lib/types";

const LETTERS: OptionKey[] = ["A", "B", "C", "D", "E"];

export default function QuestionCard({
  question,
  selected,
  onSelect,
}: {
  question: Question;
  selected: OptionKey | null;
  onSelect: (opt: OptionKey) => void;
}) {
  return (
    <div className="paper-card p-5 sm:p-7">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs px-2 py-1 rounded bg-brass/15 text-brass font-semibold">
          {question.section}
        </span>
        <span className="font-mono text-xs text-ink/40">
          Soal No. {question.id}
        </span>
      </div>

      <p className="font-display text-lg sm:text-xl leading-relaxed text-ink mb-6">
        {question.question}
      </p>

      <div className="space-y-2.5">
        {LETTERS.map((letter) => {
          const text = question.options[letter];
          if (!text) return null;
          const isSelected = selected === letter;
          return (
            <button
              key={letter}
              onClick={() => onSelect(letter)}
              className={`bubble ${isSelected ? "selected" : ""}`}
            >
              <span className="bubble-letter">{letter}</span>
              <span className="text-sm sm:text-base text-ink/90">{text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
