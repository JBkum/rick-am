import { useEffect, useState } from "react";
import { Link } from "../components/Links";
import { getFavorites, subscribe } from "../utils/favorites";
import { Character } from "../components/Character";

export default function FavoritePage() {
  const [ids, setIds] = useState<number[]>(getFavorites());
  const [characters, setCharacters] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribe((next) => setIds(next));
    return unsub;
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (ids.length === 0) {
          setCharacters([]);
          return;
        }
        const url = `https://rickandmortyapi.com/api/character/${ids.join(",")}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [data];
        if (!mounted) return;
        setCharacters(list);
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : String(err);
          setError(message ?? "Error cargando favoritos");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [ids]);

  return (
    <main style={{ padding: 12 }}>
      <Link to="/">← ir a pagina de inicio</Link>
      <h2>Personajes favoritos</h2>
      {loading ? <p>Cargando...</p> : error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      {!loading && ids.length === 0 ? (
        <div>
          <p>No tienes favoritos aún.</p>
          <Link to="/characters">Ver personajes</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {characters.map((c: any) => (
            <Character key={c.id} character={c} />
          ))}
        </div>
      )}
    </main>
  );
}