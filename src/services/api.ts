const BASE = "https://rickandmortyapi.com/api";

function handleResponse(res: Response) {
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getCharacters(params: {
  page?: number;
  name?: string;
  status?: string;
  species?: string;
}) {
  const sp = new URLSearchParams();
  if (params.name) sp.set("name", params.name);
  if (params.status) sp.set("status", params.status);
  if (params.species) sp.set("species", params.species);
  sp.set("page", String(params.page ?? 1));
  const url = `${BASE}/character?${sp.toString()}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function getCharacter(id: string | number) {
  const res = await fetch(`${BASE}/character/${id}`);
  return handleResponse(res);
}

export async function getEpisodes(ids: Array<string | number>) {
  if (ids.length === 0) return [];
  const list = ids.join(",");
  const res = await fetch(`${BASE}/episode/${list}`);
  const data = await handleResponse(res);
  return Array.isArray(data) ? data : [data];
}