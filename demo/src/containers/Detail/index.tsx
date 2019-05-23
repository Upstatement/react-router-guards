import React, { useCallback } from 'react';
import { GuardFunction } from 'react-router-guards';
import { LabeledSection, SpriteList, Type } from 'components';
import { useSerializePokemon } from 'hooks';
import { Pokemon, MoveLearn } from 'types';
import { api, className } from 'utils';
import styles from './detail.module.scss';

interface Props {
  pokemon: Pokemon;
}

const Detail: React.FunctionComponent<Props> = ({ pokemon }) => {
  const { abilities, entryNumber, height, moves, name, stats, types, weight } = useSerializePokemon(
    pokemon,
  );

  console.log(stats);

  const renderMoveList = useCallback(
    (type: MoveLearn, renderLevel: boolean = false) => (
      <ul className={styles.list}>
        {moves[type].map(({ name, level }) => (
          <li key={name} className={styles.listItem}>
            {renderLevel ? level : name}
          </li>
        ))}
      </ul>
    ),
    [moves],
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
          <LabeledSection className={styles.physiqueSection} label="Height">
            <ul className={styles.physiqueList}>
              <li className={styles.physiqueItem}>{height.metric}</li>
              <li className={styles.physiqueItem}>{height.imperial}</li>
            </ul>
          </LabeledSection>
          <LabeledSection className={styles.physiqueSection} label="Weight">
            <ul className={styles.physiqueList}>
              <li className={styles.physiqueItem}>{weight.metric}</li>
              <li className={styles.physiqueItem}>{weight.imperial}</li>
            </ul>
          </LabeledSection>
        </section>
        <LabeledSection className={styles.abilities} label="Abilities">
          <ul className={styles.list}>
            {abilities.map(({ isHidden, name }) => (
              <li key={name} className={styles.listItem}>
                {name}
                {isHidden && <span className={styles.hiddenLabel}>Hidden Ability</span>}
              </li>
            ))}
          </ul>
        </LabeledSection>
        <section className={styles.stats}>
          <h2 className={styles.sectionHeader}>Statistics</h2>
          <LabeledSection className={styles.statsSection} label="Base Experience Yield">
            <p>{pokemon.base_experience} XP</p>
          </LabeledSection>
          <LabeledSection className={styles.statsSection} label="Base Stats" />
        </section>
        <section className={styles.moves}>
          <h2 className={styles.sectionHeader}>Moves</h2>
          {moves[MoveLearn.LevelUp].length > 0 && (
            <LabeledSection className={styles.moveSection} label="By leveling up" large>
              <ul className={styles.table}>
                <li className={styles.tableRow}>
                  <LabeledSection
                    {...className(styles.tableColumn, styles.tableColumnLevels)}
                    label="Level"
                  />
                  <LabeledSection className={styles.tableColumn} label="Move" />
                </li>
                {moves[MoveLearn.LevelUp].map(({ name, level }) => (
                  <li key={name} {...className(styles.tableRow, styles.listItem)}>
                    <p {...className(styles.tableColumn, styles.tableColumnLevels)}>{level}</p>
                    <p className={styles.tableColumn}>{name}</p>
                  </li>
                ))}
              </ul>
            </LabeledSection>
          )}
          {moves[MoveLearn.Egg].length > 0 && (
            <LabeledSection className={styles.moveSection} label="From Egg" large>
              {renderMoveList(MoveLearn.Egg)}
            </LabeledSection>
          )}
          {moves[MoveLearn.Machine].length > 0 && (
            <LabeledSection className={styles.moveSection} label="From TM/HM" large>
              {renderMoveList(MoveLearn.Machine)}
            </LabeledSection>
          )}
          {moves[MoveLearn.Tutor].length > 0 && (
            <LabeledSection className={styles.moveSection} label="From Tutor" large>
              {renderMoveList(MoveLearn.Tutor)}
            </LabeledSection>
          )}
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
