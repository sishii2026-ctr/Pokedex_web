import { z } from "zod";

// APIレスポンスのうち、使う部分だけを定義する
export const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(), // 10cm単位
  weight: z.number(), // 100g単位
  species: z.object({ name: z.string() }),
  types: z.array(z.object({ type: z.object({ name: z.string() }) })),
  abilities: z.array(
    z.object({
      ability: z.object({ name: z.string() }),
      is_hidden: z.boolean(),
    }),
  ),
  moves: z.array(
    z.object({
      move: z.object({ name: z.string() }),
      version_group_details: z.array(
        z.object({
          level_learned_at: z.number(),
          move_learn_method: z.object({ name: z.string() }),
        }),
      ),
    }),
  ),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      stat: z.object({ name: z.string() }),
    }),
  ),
});

// 各言語の名前の一覧。種族データと特性データで共通
export const NameSchema = z.object({
  names: z.array(
    z.object({
      name: z.string(),
      language: z.object({ name: z.string() }),
    }),
  ),
});

export const PokemonSpeciesSchema = NameSchema;
export const AbilitySchema = NameSchema;
export const MoveSchema = NameSchema;

// スキーマから型を自動で作る（二重定義が不要）
export type Pokemon = z.infer<typeof PokemonSchema>;
export type Names = z.infer<typeof NameSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type Ability = z.infer<typeof AbilitySchema>;
export type Move = z.infer<typeof MoveSchema>;
