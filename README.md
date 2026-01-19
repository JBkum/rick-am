Rick-AM
Simple SPA con personajes de Rick & Morty — lista con filtros/paginación, detalle de personaje y favoritos (persistidos en localStorage).

Requisitos
Node.js 16+ / npm
Conexión a internet (usa la API pública de Rick & Morty)
Setup
Instalar dependencias:
npm install
Levantar servidor de desarrollo:
npm run dev
Build de producción:
npm run build
Ejecutar linter / typecheck (si aplica):
npm run lint
npm run typecheck
Arquitectura
components: componentes reutilizables (lista, tarjeta, router, links).
pages: vistas (Home, Favorite, CharacterDetail).
services: llamadas HTTP centralizadas y manejo de errores (getCharacters, getCharacter, getEpisodes).
hooks: lógica reutilizable con estados loading/error/data.
utils: utilidades (favoritos en localStorage).
Ejemplos:

Lista/filtros/paginación: CharacterList.tsx:1-200
Detalle: CharacterDetail.tsx:1-200
Servicio API: api.ts:1-200
Favoritos util: favorites.ts:1-200
Rutas principales
/characters — lista con filtros y paginación (la UI también está en /)
/characters?name=rick&status=alive&page=2 — filtros reflejados en URL
/characters/:id — detalle de personaje
/favoritos — lista de favoritos
Decisiones técnicas clave
Batch episodes via /episode/1,2,3 para reducir round-trips.
services/api.ts centraliza las llamadas y normaliza errores.
hooks/* encapsulan loading/error/data para componentes limpios y testeables.
Debounce en búsqueda (400ms) para UX y reducción de peticiones.
Favoritos en localStorage + evento favorites-changed para sincronización UI.
Accesibilidad (mínimo aplicado)
alt en imágenes.
role="status" y aria-live en spinner.
Tarjetas navegables con teclado (Enter/Space).
Botones de favorito con aria-pressed y aria-label.
Manejo de errores
Los hooks y servicios exponen error para que las vistas muestren mensajes legibles y botones de reintento.
Cómo contribuir / commits
Usa commits pequeños y con mensajes claros (imperative tense). Ejemplos:
feat(api): add centralized API service getCharacters/getCharacter/getEpisodes
feat(hooks): add useCharacters and useCharacter hooks
feat(list): add CharacterList with filters, debounce and URL sync
feat(detail): add CharacterDetail with batch episode fetching
feat(favorites): add favorites util and favorites page
fix(links): fix navigation and keyboard handling
docs: update README