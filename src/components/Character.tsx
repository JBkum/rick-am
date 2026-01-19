import { navigate } from "./Links";
import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite, subscribe } from "../utils/favorites";

type CharacterData = {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
  [key: string]: unknown;
};

export function Character(props: { character: CharacterData }) {
  const { character } = props;
  const id = Number(character.id);
  const [fav, setFav] = useState<boolean>(isFavorite(id));

  useEffect(() => {
    const unsub = subscribe(() => setFav(isFavorite(id)));
    return unsub;
  }, [id]);

  const goDetail = () => navigate(`/characters/${id}`);

  const onToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
    setFav(isFavorite(id));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goDetail();
        }
      }}
      style={{ cursor: "pointer", border: "1px solid #eee", padding: 8, borderRadius: 6, display: "inline-block", margin: 8 }}
      aria-label={`Ver detalle de ${character.name}`}
    >
      <div style={{ position: "relative" }}>
        <img src={String(character.image)} alt={String(character.name)} style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 6 }} />
        <button
          onClick={onToggleFav}
          aria-pressed={fav}
          aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            background: fav ? "#ffd700" : "rgba(255,255,255,0.9)",
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: "4px 6px",
            cursor: "pointer"
          }}
        >
          {fav ? "★" : "☆"}
        </button>
      </div>
      <h3 style={{ margin: "8px 0 4px" }}>{character.name}</h3>
      <p style={{ margin: 0 }}>Especie: {character.species}</p>
      <p style={{ margin: 0 }}>Estado: {character.status}</p>
    </div>
  );
}