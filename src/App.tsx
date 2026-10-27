import { useState } from "react";
import "./App.css";
import { fetchPokemon, fetchPokemonSpecies } from "./api"; // ★
import type { Pokemon } from "./schemas";
import { typeNameJa } from "./type-names";
import { statNameJa } from "./stat-names";
import { findJapaneseName } from "./japanese-name"; // ★

function App() {
  const [input, setInput] = useState("pikachu");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [displayName, setDisplayName] = useState(""); // ★ 表示する名前
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPokemon(input.trim());
      // ★ 種族データは、ポケモンの「種族名」で取得する
      const species = await fetchPokemonSpecies(result.species.name);
      setPokemon(result);
      // ★ 日本語名がなければ、英語名を表示する
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
        placeholder="英語名 (例: pikachu)"
      />
      <button onClick={handleSearch} disabled={loading}>
        検索
      </button>

      {loading && <p>読み込み中...</p>}
      {error && <p>エラー: {error}</p>}
      {pokemon && (
        <div>
          <h2>{displayName}</h2> {/* ★ */}
          <p>No.{pokemon.id}</p>
          <p>
            タイプ:{" "}
            {pokemon.types.map((t) => typeNameJa(t.type.name)).join(" / ")}
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
