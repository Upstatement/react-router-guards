import React, { useMemo } from 'react';
import { Pokemon } from 'types';
import { getEntryNumber, getHeight, getName, getWeight } from 'utils';
import styles from './header.module.scss';

interface Props {
  pokemon: Pokemon;
}

const Header: React.FunctionComponent<Props> = ({ pokemon }) => {
  const name = useMemo(() => getName(pokemon.name), [pokemon]);
  const entryNumber = useMemo(() => getEntryNumber(pokemon.id), [pokemon]);
  const height = useMemo(() => getHeight(pokemon.height), [pokemon]);
  const weight = useMemo(() => getWeight(pokemon.weight), [pokemon]);

  return (
    <header className={styles.container}>
      <figure className={styles.image}>
        <div
          className={styles.sprite}
          style={{ backgroundImage: `url(${pokemon.sprites.front_default})` }}
        />
        <figcaption className={styles.caption}>Sprite of {name}</figcaption>
      </figure>
      <div className={styles.meta}>
        <p className={styles.entry}>{entryNumber}</p>
        <h1 className={styles.title}>{name}</h1>
        <div className={styles.sections}>
          <div className={styles.section}>
            <p className={styles.label}>Height</p>
            <p>
              {height.metric}, {height.imperial}
            </p>
          </div>
          <div className={styles.section}>
            <p className={styles.label}>Weight</p>
            <p>
              {weight.metric}, {weight.imperial}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
