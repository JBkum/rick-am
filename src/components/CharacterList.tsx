import { useEffect, useState, useRef } from "react";
import { Character } from "./Character";

type CharacterType = {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
  [key: string]: unknown;
};

type Info = { next: string | null; prev: string | null; pages?: number | null };

export function CharacterList() {
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [info, setInfo] = useState<Info>({ next: null, prev: null, pages: null });

  // filters + pagination
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>(""); // alive | dead | unknown | ""
  const [species, setSpecies] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const skipPush = useRef(true);

  // Inicializa desde URL (page, name, status, species) y escucha popstate
  useEffect(() => {
    const u = new URL(window.location.href);
    const q = u.searchParams;
    setPage(q.get("page") ? Number(q.get("page")) : 1);
    setName(q.get("name") ?? "");
    setSearchTerm(q.get("name") ?? "");
    setStatus(q.get("status") ?? "");
    setSpecies(q.get("species") ?? "");

    const onPop = () => {
      const uu = new URL(window.location.href);
      const qq = uu.searchParams;
      setPage(qq.get("page") ? Number(qq.get("page")) : 1);
      setName(qq.get("name") ?? "");
      setSearchTerm(qq.get("name") ?? "");
      setStatus(qq.get("status") ?? "");
      setSpecies(qq.get("species") ?? "");
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Debounce searchTerm -> name (400ms).
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchTerm !== name) {
        setName(searchTerm);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm, name]);

  // Sincroniza estado -> URL (pushState), evita push inicial
  useEffect(() => {
    if (skipPush.current) {
      skipPush.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (status) params.set("status", status);
    if (species) params.set("species", species);
    if (page && page > 1) params.set("page", String(page));
    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.pushState({ page }, "", newUrl);
  }, [page, name, status, species]);

  // Fetch (cuando cambian page, name, status, species, reload)
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (name) params.set("name", name);
        if (status) params.set("status", status);
        if (species) params.set("species", species);
        params.set("page", String(page));
        const url = `https://rickandmortyapi.com/api/character?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!mounted) return;
        setCharacters(data.results || []);
        setInfo({
          next: data.info?.next ?? null,
          prev: data.info?.prev ?? null,
          pages: data.info?.pages ?? null
        });
      } catch (err) {
        if (mounted) {
          setCharacters([]);
          setInfo({ next: null, prev: null, pages: null });
          const message = err instanceof Error ? err.message : String(err);
          setError(message ?? "Error al cargar personajes");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, [page, name, status, species, reload]);

  // Usa info.next/info.prev para navegar manteniendo filtros actuales
  const gotoPageFromUrl = (url: string | null) => {
    if (!url) return;
    try {
      const p = new URL(url).searchParams.get("page");
      if (p) setPage(Number(p));
    } catch (e) {
      void e;
    }
  };

  function Spinner() {
    return (
      <div role="status" aria-live="polite" style={{ display: "flex", justifyContent: "center", padding: 16 }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: "4px solid #ddd",
            borderTopColor: "#333",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const PaginationHeader = (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
      <button onClick={() => gotoPageFromUrl(info.prev)} disabled={!info.prev || loading}>
        Prev
      </button>
      <span>
        Página {page}
        {info.pages ? ` / ${info.pages}` : ""}
      </span>
      <button onClick={() => gotoPageFromUrl(info.next)} disabled={!info.next || loading}>
        Next
      </button>
    </div>
  );

  const Filters = (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
      <input
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: 6 }}
        aria-label="Buscar por nombre"
      />
      <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filtrar por estado">
        <option value="">Todos</option>
        <option value="alive">Alive</option>
        <option value="dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>
      <input
        placeholder="Species (texto)"
        value={species}
        onChange={(e) => { setSpecies(e.target.value); setPage(1); }}
        style={{ padding: 6 }}
        aria-label="Filtrar por especie"
      />
      <button onClick={() => { setSearchTerm(""); setName(""); setStatus(""); setSpecies(""); setPage(1); }}>
        Limpiar
      </button>
    </div>
  );

  if (error) {
    return (
      <div>
        {Filters}
        {PaginationHeader}
        <div>
          <p style={{ color: "crimson" }}>Error: {error}</p>
          <button onClick={() => setReload((r) => r + 1)}>Reintentar</button>
        </div>
      </div>
    );
  }

  if (!loading && characters.length === 0) {
    return (
      <div>
        {Filters}
        {PaginationHeader}
        <div>
          <p>No se encontraron personajes.</p>
          <button onClick={() => setReload((r) => r + 1)}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {Filters}
      {PaginationHeader}
      {loading ? (
        <Spinner />
      ) : (
        <div>
          {characters.map((character) => (
            <Character key={character.id} character={character} />
          ))}
        </div>
      )}
    </div>
  );
}