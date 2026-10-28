import type { Pokemon } from "./schemas";

export type LevelUpMove = { name: string; level: number };

// レベルアップで覚えられるわざを、覚えるレベルの低い順にcount個選ぶ
export function pickLevelUpMoves(p: Pokemon, count: number): LevelUpMove[] {
  const moves = p.moves.flatMap((m) => {
    // そのわざを「レベルアップで」覚えるバージョンだけに絞る
    const levelUps = m.version_group_details.filter(
      (d) => d.move_learn_method.name === "level-up",
    );
    // いちばん新しいバージョン（配列の最後）を使う
    const last = levelUps[levelUps.length - 1];
    // レベルアップで覚えないわざは、空の配列を返して除外する
    return last ? [{ name: m.move.name, level: last.level_learned_at }] : [];
  });

  return moves.sort((a, b) => a.level - b.level).slice(0, count);
}
