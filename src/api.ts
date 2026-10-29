import {
  AbilitySchema,
  MoveSchema,
  PokemonSchema,
  PokemonSpeciesSchema,
  TypeSchema, // ★
  type Ability,
  type Move,
  type Pokemon,
  type PokemonSpecies,
  type TypeData, // ★
} from "./schemas";

export async function fetchPokemon(name: string): Promise<Pokemon> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`,
  );
  if (!res.ok) {
    throw new Error(`見つかりませんでした: ${name} (${res.status})`);
  }
  // as ではなく parse で、実行時に形を検証する
  return PokemonSchema.parse(await res.json());
}

export async function fetchPokemonSpecies(
  name: string,
): Promise<PokemonSpecies> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${name.toLowerCase()}`,
  );
  if (!res.ok) {
    throw new Error(
      `種族データが見つかりませんでした: ${name} (${res.status})`,
    );
  }
  return PokemonSpeciesSchema.parse(await res.json());
}

// 特性データを取得する
export async function fetchAbility(name: string): Promise<Ability> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/ability/${name.toLowerCase()}`,
  );
  if (!res.ok) {
    throw new Error(
      `特性データが見つかりませんでした: ${name} (${res.status})`,
    );
  }
  return AbilitySchema.parse(await res.json());
}

// わざデータを取得する
export async function fetchMove(name: string): Promise<Move> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/move/${name.toLowerCase()}`,
  );
  if (!res.ok) {
    throw new Error(
      `わざデータが見つかりませんでした: ${name} (${res.status})`,
    );
  }
  return MoveSchema.parse(await res.json());
}

// ★ タイプデータを取得する（ポケモンのデータに入っているURLをそのまま使う）
export async function fetchType(url: string): Promise<TypeData> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `タイプデータが見つかりませんでした: ${url} (${res.status})`,
    );
  }
  return TypeSchema.parse(await res.json());
}
