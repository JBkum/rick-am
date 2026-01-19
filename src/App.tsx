import HomePage from "./pages/Home";
import FavoritePage from "./pages/Favorite";
import CharacterDetail from "./pages/CharacterDetail";

import { Router } from "./components/Router";

const routes = [
  { path: "/", Component: HomePage },
  { path: "/characters", Component: HomePage }, // misma pantalla de lista con filtros
  { path: "/characters/:id", Component: CharacterDetail },
  { path: "/favoritos", Component: FavoritePage }
];

function App() {
  return (
    <main>
      <Router routes={routes} />
    </main>
  );
}

export default App;