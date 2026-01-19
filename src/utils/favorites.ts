const KEY = "favorites";

export function getFavorites(): number[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setFavorites(ids: number[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent("favorites-changed", { detail: ids }));
  } catch (e) {
    void e;
  }
}

export function isFavorite(id: number) {
  return getFavorites().includes(Number(id));
}

export function toggleFavorite(id: number) {
  const current = getFavorites();
  const n = Number(id);
  const next = current.includes(n) ? current.filter((x) => x !== n) : [...current, n];
  setFavorites(next);
  return next;
}

export function subscribe(fn: (ids: number[]) => void) {
  const handler = (e: Event) => {
    const ev = e as CustomEvent;
    fn(ev.detail ?? getFavorites());
  };
  window.addEventListener("favorites-changed", handler as EventListener);
  return () => window.removeEventListener("favorites-changed", handler as EventListener);
}