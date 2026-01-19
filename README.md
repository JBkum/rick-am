# Rick-AM 🧪🌐

Una **Single Page Application (SPA)** moderna construida para explorar el universo de Rick & Morty. Permite buscar personajes, filtrar por estado, gestionar favoritos de forma persistente y visualizar detalles técnicos de cada entidad.



---

## 🚀 Comenzando

Sigue estos pasos para ejecutar el proyecto localmente.

### Requisitos previos
* **Node.js**: 16.0 o superior
* **npm**: 7.0 o superior
* Conexión a internet para el consumo de la [API de Rick & Morty](https://rickandmortyapi.com/).

### Instalación
1. Instalar dependencias:
   ```bash
   npm install

2. Levantar servidor de desarrollo:
   ```bash
   npm run dev
   
3. Build de producción:
   ```bash
   npm run build
[!TIP] Puedes ejecutar el linter o el chequeo de tipos con npm run lint y npm run typecheck.

El proyecto sigue una estructura modular para facilitar el mantenimiento y la escalabilidad:
Directorio,Descripción
components/,"Componentes atómicos y reutilizables (tarjetas, botones, inputs)."
pages/,"Vistas principales de la aplicación (Home, Favorites, Detail)."
services/,Capa de datos centralizada para llamadas HTTP y manejo de errores.
hooks/,"Lógica de negocio extraída en hooks (manejo de loading, error, data)."
utils/,Funciones de ayuda y persistencia en localStorage.

### Rutas Principales
La aplicación utiliza sincronización de estado con la URL para permitir compartir búsquedas específicas:

/ o /characters : Lista principal con filtros y paginación.

/characters?name=rick&status=alive&page=2 : Filtros dinámicos reflejados en la URL.

/characters/:id : Detalle técnico del personaje y sus episodios.

/favoritos : Colección guardada por el usuario.

### Decisiones Técnicas Clave

Optimización de Red: Implementación de Batch fetching para episodios (/episode/1,2,3) reduciendo drásticamente los round-trips al servidor.

UX Proactiva: Uso de Debounce (400ms) en la búsqueda para evitar peticiones innecesarias y mejorar la fluidez.

Sincronización: Sistema de favoritos basado en localStorage con un custom event (favorites-changed) para actualizar la UI en tiempo real entre pestañas o componentes.

Accesibilidad (A11y):

Uso de aria-live y role="status" en cargadores.

Navegación completa mediante teclado (Enter/Space en tarjetas).

Atributos alt descriptivos y aria-pressed en botones de acción.

**Este proyecto sigue una convención de mensajes de commit semánticos e imperativos:**

feat(api): Añadir servicio centralizado de API.

feat(hooks): Implementar useCharacters y useCharacter.

feat(list): Añadir lista con filtros, debounce y sincronización de URL.

fix(links): Corregir navegación y manejo de teclado.

docs: Actualizar documentación del README.
