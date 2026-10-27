import { z } from "zod";
import rawNames from "./pokemon-names.json";

const PokemonNamesSchema = z.array(
  z.object({
    id: z.number(),
    en: z.string(),
    ja: z.string(),
  }),
);

const names = PokemonNamesSchema.parse(rawNames);

// ★ 日本語名なら図鑑番号（文字列）を返す。見つからなければ、入力をそのまま返す
export function toSearchKey(query: string): string {
  const found = names.find((p) => p.ja === query);
  return found ? String(found.id) : query;
}
