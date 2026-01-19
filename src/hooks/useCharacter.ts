import { useCallback, useEffect, useState } from "react";
import { getCharacter, getEpisodes } from "../services/api";

type CharacterData = { episode?: string[]; id?: number; [k: string]: unknown };
type Episode = { id: number; name: string; episode?: string; [k: string]: unknown };

export function useCharacter(id?: string | number) {
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const c = await getCharacter(id);
      setCharacter(c);
      const epUrls: string[] = (c.episode as string[]) || [];
      const epIds = epUrls.map((u) => u.split("/").pop()).filter(Boolean) as string[];
      const eps = await getEpisodes(epIds);
      setEpisodes(eps);
    } catch (err) {
      setCharacter(null);
      setEpisodes([]);
      const message = err instanceof Error ? err.message : String(err);
      setError(message ?? "Error fetching character");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData, reload]);

  return {
    character,
    episodes,
    loading,
    error,
    reload: () => setReload((r) => r + 1),
    refetch: fetchData
  };
}