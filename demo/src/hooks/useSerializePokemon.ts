import { useMemo } from 'react';
import { Pokemon } from 'types';
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

const useSerializePokemon = (pokemon: Pokemon) => {
  const name = useMemo(() => getName(pokemon.name), [pokemon]);
  const entryNumber = useMemo(() => getEntryNumber(pokemon.id), [pokemon]);
  const types = useMemo(() => sortSlots(pokemon.types).map(({ type }) => type.name), [pokemon]);
  const height = useMemo(() => getHeight(pokemon.height), [pokemon]);
  const weight = useMemo(() => getWeight(pokemon.weight), [pokemon]);
  const abilities = useMemo(() => getAbilities(pokemon.abilities), [pokemon]);
  const moves = useMemo(() => getMoves(pokemon.moves), [pokemon]);
  const stats = useMemo(() => getStats(pokemon.stats), [pokemon]);

  return {
    name,
    entryNumber,
    types,
    height,
    weight,
    abilities,
    moves,
    stats,
  };
};

export default useSerializePokemon;
