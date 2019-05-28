import React from 'react';
import { Link } from 'components';
import { useFetchPokemon } from 'hooks';
import { Pokemon } from 'types';
import { className, getIsMissingNo, getName } from 'utils';
import { MISSINGNO } from 'utils/constants';
import styles from './recirculation.module.scss';

interface Props {
  id: number;
}

const Recirculation: React.FunctionComponent<Props> = ({ id }) => {
  const [next, nextFetching] = useFetchPokemon(id + 1);
  const [previous, prevFetching] = useFetchPokemon(id - 1);

  const renderSection = (isNext: boolean, pokemon: Pokemon | null, isFetching: boolean) => {
    const name = pokemon ? pokemon.name : '';
    const label = isNext ? 'Next' : 'Previous';
    const showMissingno = getIsMissingNo(id + (isNext ? 1 : -1));
    const section = (
      <div {...className(styles.section, styles[`section${label}`])}>
        <p className={styles.label}>{label}</p>
        <p {...className(styles.name, isFetching && styles.nameLoading)}>
          {isFetching ? 'Loading...' : showMissingno ? MISSINGNO.FULL_NAME : getName(name)}
        </p>
      </div>
    );

    if (name) {
      return (
        <Link className={styles.link} to={`/${showMissingno ? MISSINGNO.NAME : name}`}>
          {section}
        </Link>
      );
    }
    return section;
  };

  return (
    <div className={styles.container}>
      {prevFetching || previous ? renderSection(false, previous, prevFetching) : <div />}
      {(nextFetching || next) && renderSection(true, next, nextFetching)}
    </div>
  );
};

export default Recirculation;
