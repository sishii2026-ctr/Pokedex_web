// タイプの英語名 → 日本語名の対応表
const TYPE_NAMES_JA: Record<string, string> = {
  normal: "ノーマル",
  fire: "ほのお",
  water: "みず",
  electric: "でんき",
  grass: "くさ",
  ice: "こおり",
  fighting: "かくとう",
  poison: "どく",
  ground: "じめん",
  flying: "ひこう",
  psychic: "エスパー",
  bug: "むし",
  rock: "いわ",
  ghost: "ゴースト",
  dragon: "ドラゴン",
  dark: "あく",
  steel: "はがね",
  fairy: "フェアリー",
};

// 日本語名を返す。対応表にないタイプは英語名のまま返す
export function typeNameJa(name: string): string {
  return TYPE_NAMES_JA[name] ?? name;
}
