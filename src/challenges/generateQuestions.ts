import { Question, QuestionBank } from './questionBank';

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateChallengeQuestions(params: {
  difficulty: number; // 1..5
  count: number;
}): Question[] {
  const d = Math.min(5, Math.max(1, Math.round(params.difficulty)));
  const pool = QuestionBank.filter((q) => q.difficulty <= d);
  const mixed = shuffle(pool);
  const out: Question[] = [];
  for (const q of mixed) {
    out.push(q);
    if (out.length >= params.count) break;
  }
  // Fallback: if pool is too small, repeat from full bank (still shuffled) but keep unique ids if possible
  if (out.length < params.count) {
    const extra = shuffle(QuestionBank);
    for (const q of extra) {
      if (out.some((x) => x.id === q.id)) continue;
      out.push(q);
      if (out.length >= params.count) break;
    }
  }
  return out.slice(0, params.count);
}


