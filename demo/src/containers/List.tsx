import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListResult } from 'types';
import { api, getName } from 'utils';
import { LIST_FETCH_LIMIT } from 'utils/constants';

interface PokemonResult {
  name: string;
  fullName: string;
}

const List = () => {
  const [results, setResults] = useState<PokemonResult[]>([]);
  const [offset, setOffset] = useState(0);

  const serializeResults = (results: ListResult[]) =>
    results.map(({ name }) => ({
      fullName: getName(name),
      name,
    }));

  const getPokemon = useCallback(async () => {
    const newResults = await api.list(offset);
    setResults([...results, ...serializeResults(newResults)]);
    setOffset(offset + LIST_FETCH_LIMIT);
  }, [results, offset]);

  useEffect(() => {
    getPokemon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ul>
        {results.map(({ fullName, name }) => (
          <Link key={name} to={`/${name}`}>
            {fullName}
          </Link>
        ))}
      </ul>
      <button onClick={getPokemon}>Load more</button>
    </div>
  );
};

export default List;
