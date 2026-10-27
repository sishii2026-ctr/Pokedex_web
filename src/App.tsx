import { useState } from "react";
import "./App.css";
import { fetchPokemon, fetchPokemonSpecies, fetchAbility } from "./api";
import type { Pokemon } from "./schemas";
import { typeNameJa } from "./type-names";
import { statNameJa } from "./stat-names";
import { findJapaneseName } from "./japanese-name";
import { toSearchKey } from "./name-lookup"; // ★

type AbilityView = { name: string; isHidden: boolean }; // ★

function App() {
  const [input, setInput] = useState("pikachu");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [abilities, setAbilities] = useState<AbilityView[]>([]); // ★
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setError(null);
    try {
      // ★ 日本語名なら英語名に変換する（英語名ならそのまま）
      const searchName = toSearchKey(input.trim());
      const result = await fetchPokemon(searchName); // ★
      const species = await fetchPokemonSpecies(result.species.name);

      // ★ 特性を同時に取得して、日本語名に変える（CLI版と同じ）
      const abilityList = await Promise.all(
        result.abilities.map(async (a) => {
          const ability = await fetchAbility(a.ability.name);
          return {
            name: findJapaneseName(ability) ?? a.ability.name,
            isHidden: a.is_hidden,
          };
        }),
      );
      setAbilities(abilityList); // ★

      setPokemon(result);
      setDisplayName(findJapaneseName(species) ?? result.name);
    } catch (e: unknown) {
      setPokemon(null);
      setError(e instanceof Error ? e.message : "不明なエラー");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>ポケモン図鑑</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="日本語名・英語名 (例: ピカチュウ)" // ★
      />
      <button onClick={handleSearch} disabled={loading}>
        検索
      </button>

      {loading && <p>読み込み中...</p>}
      {error && <p>エラー: {error}</p>}
      {pokemon && (
        <div>
          <h2>{displayName}</h2>
          <p>No.{pokemon.id}</p>
          <p>
            タイプ:{" "}
            {pokemon.types.map((t) => typeNameJa(t.type.name)).join(" / ")}
          </p>

          {/* ★ 特性 */}
          <p>
            特性:{" "}
            {abilities
              .map((a) => (a.isHidden ? `${a.name}（夢特性）` : a.name))
              .join(" / ")}
          </p>

          <h3>種族値</h3>
          <table className="stats">
            <tbody>
              {pokemon.stats.map((s) => (
                <tr key={s.stat.name}>
                  <th>{statNameJa(s.stat.name)}</th>
                  <td>{s.base_stat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
