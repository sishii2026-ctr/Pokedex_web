// 種族値の英語名 → 日本語名の対応表
const STAT_NAMES_JA: Record<string, string> = {
  hp: "HP",
  attack: "こうげき",
  defense: "ぼうぎょ",
  "special-attack": "とくこう",
  "special-defense": "とくぼう",
  speed: "すばやさ",
};

// 日本語名を返す。対応表にないものは英語名のまま返す
export function statNameJa(name: string): string {
  return STAT_NAMES_JA[name] ?? name;
}
