import { useState } from "react";
import "./App.css";
import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchAbility,
  fetchMove,
} from "./api";
import { pickLevelUpMoves } from "./moves";
import type { Pokemon } from "./schemas";
import { typeNameJa } from "./type-names";
import { typeColor } from "./type-colors";
import { statNameJa } from "./stat-names";
import { findJapaneseName } from "./japanese-name";
import { toSearchKey } from "./name-lookup";

type AbilityView = { name: string; isHidden: boolean };
type MoveView = { name: string; level: number };

const MOVE_COUNT = 20;
const MAX_STAT = 255;

function App() {
  const [input, setInput] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [abilities, setAbilities] = useState<AbilityView[]>([]);
  const [moves, setMoves] = useState<MoveView[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (input.trim() === "") return;
    setLoading(true);
    setError(null);
    try {
      const searchName = toSearchKey(input.trim());
      const result = await fetchPokemon(searchName);
      const species = await fetchPokemonSpecies(result.species.name);

      const abilityList = await Promise.all(
        result.abilities.map(async (a) => {
          const ability = await fetchAbility(a.ability.name);
          return {
            name: findJapaneseName(ability) ?? a.ability.name,
            isHidden: a.is_hidden,
          };
        }),
      );
      setAbilities(abilityList);

      const moveList = await Promise.all(
        pickLevelUpMoves(result, MOVE_COUNT).map(async (m) => {
          const move = await fetchMove(m.name);
          return { name: findJapaneseName(move) ?? m.name, level: m.level };
        }),
      );
      setMoves(moveList);

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
      {/* ★ タイトルと検索欄を、1つの入れ物にまとめる（PCで横並びにするため） */}
      <header className="header">
        <h1>ポケモン図鑑</h1>
        <div className="search">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="日本語名・英語名 (例: ピカチュウ)"
          />
          <button onClick={handleSearch} disabled={loading}>
            検索
          </button>
        </div>
      </header>

      {loading && <p>読み込み中...</p>}
      {error && <p>エラー: {error}</p>}
      {pokemon && (
        <div className="card">
          {/* ★ 枠1: プロフィール */}
          <section className="panel profile">
            <h2>{displayName}</h2>
            {pokemon.sprites.front_default && (
              <img
                className="sprite"
                src={pokemon.sprites.front_default}
                alt={displayName}
              />
            )}
            <p>No.{pokemon.id}</p>
            <div className="types">
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className="type-badge"
                  style={{ backgroundColor: typeColor(t.type.name) }}
                >
                  {typeNameJa(t.type.name)}
                </span>
              ))}
            </div>
            <div className="abilities">
              <span className="abilities-label">特性</span>
              {abilities.map((a) => (
                <span
                  key={a.name}
                  className={
                    a.isHidden ? "ability-badge is-hidden" : "ability-badge"
                  }
                >
                  {a.name}
                  {a.isHidden && <small className="hidden-tag">隠れ</small>}
                </span>
              ))}
            </div>
          </section>

          {/* ★ 枠2: 種族値 */}
          <section className="panel stats-panel">
            <h3>種族値</h3>
            <table className="stats">
              <tbody>
                {pokemon.stats.map((s) => (
                  <tr key={s.stat.name}>
                    <th>{statNameJa(s.stat.name)}</th>
                    <td>{s.base_stat}</td>
                    <td className="stat-bar-cell">
                      <div className="stat-bar">
                        <div
                          className="stat-bar-fill"
                          style={{
                            width: `${Math.min(100, (s.base_stat / MAX_STAT) * 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* ★ 枠3: わざ。表をやめて、並べ方を変えやすい一覧（ul）にした */}
          <section className="panel moves-panel">
            <h3>わざ（レベルアップ）</h3>
            <ul className="move-list">
              {moves.map((m) => (
                <li key={m.name}>
                  <span className="move-level">Lv.{m.level}</span>
                  {m.name}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
