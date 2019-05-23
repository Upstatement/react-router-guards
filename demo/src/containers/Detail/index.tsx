/* eslint-disable @typescript-eslint/camelcase */

import React, { useMemo } from 'react';
import { GuardFunction } from 'react-router-guards';
import { SpriteList, Type } from 'components';
import { Pokemon } from 'types';
import { api, getEntryNumber, getHeight, getName, getWeight, sortSlots } from 'utils';
import styles from './detail.module.scss';

interface Props {
  pokemon: Pokemon;
}

const Detail: React.FunctionComponent<Props> = ({ pokemon }) => {
  console.log(pokemon);
  const name = useMemo(() => getName(pokemon.name), [pokemon]);
  const entryNumber = useMemo(() => getEntryNumber(pokemon.id), [pokemon]);
  const types = useMemo(() => sortSlots(pokemon.types).map(({ type }) => type.name), [pokemon]);
  const height = useMemo(() => getHeight(pokemon.height), [pokemon]);
  const weight = useMemo(() => getWeight(pokemon.weight), [pokemon]);
  const abilities = useMemo(
    () =>
      sortSlots(pokemon.abilities).map(({ is_hidden, ability }) => ({
        isHidden: is_hidden,
        name: getName(ability.name),
      })),
    [pokemon],
  );

  return (
    <div className={styles.container}>
      <SpriteList sprites={pokemon.sprites} />
      <div className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>{name}</h1>
          <p>{entryNumber}</p>
        </header>
        <ul className={styles.types}>
          {types.map(type => (
            <li key={type} className={styles.typesItem}>
              <Type type={type} />
            </li>
          ))}
        </ul>
        <section className={styles.physique}>
          <div className={styles.physiqueSection}>
            <p className={styles.label}>Height</p>
            <ul className={styles.physiqueList}>
              <li className={styles.physiqueItem}>{height.metric}</li>
              <li className={styles.physiqueItem}>{height.imperial}</li>
            </ul>
          </div>
          <div className={styles.physiqueSection}>
            <p className={styles.label}>Weight</p>
            <ul className={styles.physiqueList}>
              <li className={styles.physiqueItem}>{weight.metric}</li>
              <li className={styles.physiqueItem}>{weight.imperial}</li>
            </ul>
          </div>
        </section>
        <section className={styles.abilities}>
          <p className={styles.label}>Abilities</p>
          <ul className={styles.abilityList}>
            {abilities.map(({ isHidden, name }) => (
              <li key={name} className={styles.abilityItem}>
                {name}
                {isHidden && <span className={styles.labelSmall}>Hidden Ability</span>}
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.stats}>
          <h2 className={styles.sectionHeader}>Statistics</h2>
          <div className={styles.statsSection}>
            <p className={styles.label}>Base Experience Yield</p>
            <p>{pokemon.base_experience} XP</p>
          </div>
          <div className={styles.statsSection}>
            <p className={styles.label}>Base Stats</p>
          </div>
        </section>
        <section className={styles.moves}>
          <h2 className={styles.sectionHeader}>Moves</h2>
        </section>
      </div>
    </div>
  );
};

export default Detail;

export const beforeRouteEnter: GuardFunction = async (to, from, next) => {
  const { name } = to.match.params;
  try {
    const pokemon = await api.get(name);
    next.props({ pokemon });
  } catch {
    throw new Error('Pokemon does not exist.');
  }
};
