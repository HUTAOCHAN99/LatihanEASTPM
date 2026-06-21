import { supabase, supabaseEnabled } from "@/lib/supabaseClient";
import type { AttemptResult, OptionKey } from "@/lib/types";

const LOCAL_KEY = "eas_mobile_quiz_history_v1";

function readLocalHistory(): AttemptResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as AttemptResult[]) : [];
  } catch {
    return [];
  }
}

function writeLocalHistory(items: AttemptResult[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export function saveAttemptLocally(result: AttemptResult) {
  const items = readLocalHistory();
  items.unshift(result);
  writeLocalHistory(items.slice(0, 50));
}

export async function saveAttempt(result: AttemptResult): Promise<{ savedToServer: boolean }> {
  // Always keep a local copy so history works even without Supabase configured.
  saveAttemptLocally(result);

  if (!supabaseEnabled || !supabase) {
    return { savedToServer: false };
  }

  const { error } = await supabase.from("quiz_attempts").insert({
    nama: result.nama,
    score: result.score,
    correct_count: result.correctCount,
    total_questions: result.totalQuestions,
    duration_seconds: result.durationSeconds,
    answers: result.answers,
  });

  if (error) {
    console.error("Gagal menyimpan riwayat ke Supabase:", error.message);
    return { savedToServer: false };
  }
  return { savedToServer: true };
}

export async function fetchHistory(): Promise<AttemptResult[]> {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("quiz_attempts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      return data.map((row: any) => ({
        id: row.id,
        nama: row.nama,
        createdAt: row.created_at,
        score: row.score,
        correctCount: row.correct_count,
        totalQuestions: row.total_questions,
        durationSeconds: row.duration_seconds,
        answers: row.answers as Record<number, OptionKey | null>,
      }));
    }
    console.error("Gagal mengambil riwayat dari Supabase, memakai data lokal.", error?.message);
  }

  return readLocalHistory();
}
