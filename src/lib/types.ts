export type OptionKey = "A" | "B" | "C" | "D" | "E";

export interface Question {
  id: number;
  section: string;
  question: string;
  options: Record<OptionKey, string>;
  correct: OptionKey;
}

export interface AttemptAnswer {
  questionId: number;
  selected: OptionKey | null;
}

export interface AttemptResult {
  id?: string;
  nama: string;
  createdAt: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  durationSeconds: number;
  answers: Record<number, OptionKey | null>;
}

export const SECTIONS = [
  "WiFi & Bluetooth",
  "Mobile Cellular & LBS",
  "Dart & Flutter",
  "Cloud Computing & Web Service",
  "Android & Pengembangan Mobile",
] as const;

export const QUIZ_DURATION_SECONDS = 60 * 60; // 60 minutes
