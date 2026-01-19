import { useEffect, useState } from "react";
import { Link } from "../components/Links";
import { isFavorite, toggleFavorite, subscribe } from "../utils/favorites";

type Episode = { id: number; name: string; episode?: string; [k: string]: unknown };
type CharacterData = { episode?: string[]; id?: number; [k: string]: unknown };

export default function CharacterDetail({ params }: { params: { id?: string } }) {
  const id = params?.id;
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fav, setFav] = useState<boolean>(false);

  useEffect(() => {
    setFav(id ? isFavorite(Number(id)) : false);
    const unsub = subscribe(() => setFav(id ? isFavorite(Number(id)) : false));
    return unsub;
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setCharacter(data);

        const epUrls: string[] = (data.episode as string[]) || [];
        const epIds = epUrls.map((u) => u.split("/").pop()).filter(Boolean) as string[];
        if (epIds.length > 0) {
          const batchUrl = `https://rickandmortyapi.com/api/episode/${epIds.join(",")}`;
          const epRes = await fetch(batchUrl);
          if (!epRes.ok) throw new Error(`HTTP ${epRes.status} (episodes)`);
          const epData = await epRes.json();
          const list: Episode[] = Array.isArray(epData) ? epData : [epData];
          setEpisodes(list);
        } else {
          setEpisodes([]);
        }
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : String(err);
          setError(message ?? "Error cargando personaje");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const toggleFav = () => {
    if (!character) return;
    toggleFavorite(Number(character.id));
    setFav(isFavorite(Number(character.id)));
  };

  if (!id) return <div>Id de personaje inválido</div>;

  return (
    <main style={{ padding: 12 }}>
      <Link to="/characters">← Volver a personajes</Link>
      {loading ? (
        <p>Cargando personaje…</p>
      ) : error ? (
        <div>
          <p style={{ color: "crimson" }}>Error: {error}</p>
        </div>
      ) : character ? (
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <div>
            <img src={String(character.image)} alt={String(character.name)} style={{ width: 260, borderRadius: 8 }} />
            <div style={{ marginTop: 8 }}>
              <button onClick={toggleFav}>{fav ? "Quitar de favoritos" : "Agregar a favoritos"}</button>
            </div>
          </div>
          <div>
            <h2>{String(character.name)}</h2>
            <p><strong>Status:</strong> {String(character.status)}</p>
            <p><strong>Species:</strong> {String(character.species)}</p>
            <p><strong>Gender:</strong> {String(character.gender)}</p>
            <p><strong>Origin:</strong> {String((character.origin as any)?.name)}</p>
            <p><strong>Location:</strong> {String((character.location as any)?.name)}</p>

            <h3>Episodios</h3>
            {episodes.length === 0 ? (
              <p>No hay episodios listados.</p>
            ) : (
              <ul>
                {episodes.map((ep) => (
                  <li key={ep.id}>{ep.episode ? `${ep.episode} — ${ep.name}` : ep.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p>Personaje no encontrado</p>
      )}
    </main>
  );
}