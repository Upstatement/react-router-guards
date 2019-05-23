import { useCallback, useEffect, useState } from 'react';
import { Pokemon } from 'types';
import { api } from 'utils';

type UsePokemonHook = [Pokemon | null, boolean];

const useFetchPokemon = (identifier: string | number): UsePokemonHook => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const fetchPokemon = useCallback(async () => {
    setIsFetching(true);
    try {
      const pokemon = await api.get(identifier);
      setPokemon(pokemon);
    } catch {
      setPokemon(null);
    }
    setIsFetching(false);
  }, [identifier]);

  useEffect(() => {
    setPokemon(null);
    fetchPokemon();
  }, [fetchPokemon]);

  return [pokemon, isFetching];
};

export default useFetchPokemon;
