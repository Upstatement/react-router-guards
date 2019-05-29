import { useCallback, useEffect, useState } from 'react';
import { FetchedPokemon } from 'types';
import { api } from 'utils';

type UseFetchPokemonReturn = [FetchedPokemon, boolean];

const useFetchPokemon = (identifier: string | number): UseFetchPokemonReturn => {
  const [pokemon, setPokemon] = useState<FetchedPokemon>(null);
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
