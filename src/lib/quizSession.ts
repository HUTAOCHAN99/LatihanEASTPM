import type { OptionKey } from "@/lib/types";

const SESSION_KEY = "eas_mobile_quiz_session_v1";
const RESULT_KEY = "eas_mobile_quiz_result_v1";

export interface QuizSession {
  nama: string;
  startTime: number; // epoch ms
  answers: Record<number, OptionKey | null>;
}

export function startSession(nama: string): QuizSession {
  const session: QuizSession = {
    nama,
    startTime: Date.now(),
    answers: {},
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function readSession(): QuizSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizSession;
  } catch {
    return null;
  }
}

export function writeSession(session: QuizSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function writeResultToSession(result: unknown) {
  sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function readResultFromSession<T>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
