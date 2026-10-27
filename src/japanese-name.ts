import type { Names } from "./schemas";

// 日本語名を探す。見つからなければ undefined を返す
export function findJapaneseName(data: Names): string | undefined {
  const findByLanguage = (lang: string) =>
    data.names.find((n) => n.language.name === lang)?.name;

  return findByLanguage("ja-Hrkt") ?? findByLanguage("ja");
}
