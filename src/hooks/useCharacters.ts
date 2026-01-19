import { useCallback, useEffect, useState } from "react";
import { getCharacters } from "../services/api";

type Info = { next: string | null; prev: string | null; pages?: number | null };

export function useCharacters(opts: {
  page?: number;
  name?: string;
  status?: string;
  species?: string;
  deps?: unknown[];
}) {
  const { page = 1, name, status, species, deps = [] } = opts;
  const [data, setData] = useState<unknown[]>([]);
  const [info, setInfo] = useState<Info>({ next: null, prev: null, pages: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCharacters({ page, name, status, species });
      setData(res.results || []);
      setInfo({
        next: res.info?.next ?? null,
        prev: res.info?.prev ?? null,
        pages: res.info?.pages ?? null
      });
    } catch (err) {
      setData([]);
      setInfo({ next: null, prev: null, pages: null });
      const message = err instanceof Error ? err.message : String(err);
      setError(message ?? "Error fetching characters");
    } finally {
      setLoading(false);
    }
  }, [page, name, status, species]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, reload, ...deps]);

  return {
    data,
    info,
    loading,
    error,
    reload: () => setReload((r) => r + 1),
    refetch: fetchData
  };
}