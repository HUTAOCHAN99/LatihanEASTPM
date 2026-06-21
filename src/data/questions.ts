import raw from "./questions.json";
import type { Question } from "@/lib/types";

export const questions: Question[] = raw as Question[];

export function getQuestionById(id: number): Question | undefined {
  return questions.find((q) => q.id === id);
}
