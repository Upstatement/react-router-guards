import React, { Fragment, useEffect, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { Link } from 'components';
import { Pokeball } from 'svgs';
import { ListResult } from 'types';
import { api, getIsMissingNo, getName } from 'utils';
import { LIST_FETCH_LIMIT, MISSINGNO } from 'utils/constants';
import styles from './list.module.scss';

interface PokemonResult {
  name: string;
  fullName: string;
}

const List = () => {
  const [results, setResults] = useState<PokemonResult[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const serializeResults = (results: ListResult[]) =>
    results.map(({ name }) => ({
      fullName: getName(name),
      name,
    }));

  const getPokemon = async (signal: AbortSignal) => {
    try {
      const { next, results: newResults } = await api.list(offset, { signal });
      setResults([...results, ...serializeResults(newResults)]);
      setHasMore(!!next);
      setOffset(offset + LIST_FETCH_LIMIT);
    } catch {
      // Do nothing on error...
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    getPokemon(abortController.signal);
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {results.map(({ fullName, name }, i) => (
          <Fragment key={i}>
            {getIsMissingNo(i + 1) ? (
              <Link className={styles.link} to={`/${MISSINGNO.NAME}`}>
                {MISSINGNO.FULL_NAME}
              </Link>
            ) : (
              <Link className={styles.link} to={`/${name}`}>
                {fullName}
              </Link>
            )}
          </Fragment>
        ))}
      </ul>
      <Waypoint onEnter={getPokemon} />
      {hasMore && (
        <div className={styles.loader}>
          <Pokeball isAnimated />
        </div>
      )}
    </div>
  );
};

export default List;
