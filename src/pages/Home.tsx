import { Link } from '../components/Links';
import { CharacterList } from '../components/CharacterList';

export default function HomePage () {
  return(
    <main>
      <h2>
        Pagina de inicio donde estaran las tarjetas de personajes
      </h2>
      <p>Personajes de Rick And Morty</p>
      <CharacterList />
      <Link to='/favoritos'>Personaje favoritos</Link>
    </main>
  );
}