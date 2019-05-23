import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchPokemon } from 'hooks';
import { Pokemon } from 'types';
import { className, getName } from 'utils';
import styles from './recirculation.module.scss';

interface Props {
  id: number;
}

const Recirculation: React.FunctionComponent<Props> = ({ id }) => {
  const [next, nextFetching] = useFetchPokemon(id + 1);
  const [previous, prevFetching] = useFetchPokemon(id - 1);

  const renderSection = (label: string, pokemon: Pokemon | null, isFetching: boolean) => {
    const name = pokemon ? pokemon.name : '';
    const section = (
      <div {...className(styles.section, styles[`section${label}`])}>
        <p className={styles.label}>{label}</p>
        <p className={styles.name}>{isFetching ? 'Loading...' : getName(name)}</p>
      </div>
    );

    if (name) {
      return (
        <Link className={styles.link} to={`/${name}`}>
          {section}
        </Link>
      );
    }
    return section;
  };

  return (
    <div className={styles.container}>
      {prevFetching || previous ? renderSection('Previous', previous, prevFetching) : <div />}
      {(nextFetching || next) && renderSection('Next', next, nextFetching)}
    </div>
  );
};

export default Recirculation;
