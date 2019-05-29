import { Pokemon, SerializedPokemon } from 'types';
import {
  getAbilities,
  getEntryNumber,
  getHeight,
  getMoves,
  getName,
  getStats,
  getWeight,
  sortSlots,
} from 'utils';

const serializePokemon = (pokemon: Pokemon): SerializedPokemon => ({
  id: pokemon.id,
  name: getName(pokemon.name),
  entryNumber: getEntryNumber(pokemon.id),
  baseExperience: pokemon.base_experience,
  height: getHeight(pokemon.height),
  weight: getWeight(pokemon.weight),
  sprites: pokemon.sprites,
  types: sortSlots(pokemon.types).map(({ type }) => type.name),
  abilities: getAbilities(pokemon.abilities),
  stats: getStats(pokemon.stats),
  moves: getMoves(pokemon.moves),
});

export default serializePokemon;
