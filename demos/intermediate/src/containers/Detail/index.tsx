import React, { useCallback } from 'react';
import { GuardFunction } from '@upstatement/react-router-guards';
import { LabeledSection, Recirculation, SpriteList, StatChart, Type } from 'components';
import { MoveLearnType, SerializedPokemon } from 'types';
import { api, className, serializePokemon } from 'utils';
import styles from './detail.module.scss';

interface Props {
  pokemon: SerializedPokemon;
}

const Detail: React.FunctionComponent<Props> = ({
  pokemon: {
    abilities,
    baseExperience,
    entryNumber,
    height,
    id,
    moves,
    name,
    stats,
    sprites,
    types,
    weight,
  },
}) => {
  const renderMoveList = useCallback(
    (type: MoveLearnType, renderLevel: boolean = false) => (
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
      <SpriteList sprites={sprites} />
      <div className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.entry}>{entryNumber}</p>
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
            <p>{baseExperience} XP</p>
          </LabeledSection>
          <LabeledSection className={styles.statsSection} label="Base Stats">
            <StatChart stats={stats} />
          </LabeledSection>
        </section>
        <section className={styles.moves}>
          <h2 className={styles.sectionHeader}>Moves</h2>
          {moves[MoveLearnType.LevelUp].length > 0 && (
            <LabeledSection className={styles.moveSection} label="By leveling up" large>
              <ul className={styles.table}>
                <li className={styles.tableRow}>
                  <LabeledSection
                    {...className(styles.tableColumn, styles.tableColumnLevels)}
                    label="Level"
                  />
                  <LabeledSection className={styles.tableColumn} label="Move" />
                </li>
                {moves[MoveLearnType.LevelUp].map(({ name, level }) => (
                  <li key={name} {...className(styles.tableRow, styles.listItem)}>
                    <p {...className(styles.tableColumn, styles.tableColumnLevels)}>{level}</p>
                    <p className={styles.tableColumn}>{name}</p>
                  </li>
                ))}
              </ul>
            </LabeledSection>
          )}
          {moves[MoveLearnType.Egg].length > 0 && (
            <LabeledSection className={styles.moveSection} label="From Egg" large>
              {renderMoveList(MoveLearnType.Egg)}
            </LabeledSection>
          )}
          {moves[MoveLearnType.Machine].length > 0 && (
            <LabeledSection className={styles.moveSection} label="From TM/HM" large>
              {renderMoveList(MoveLearnType.Machine)}
            </LabeledSection>
          )}
          {moves[MoveLearnType.Tutor].length > 0 && (
            <LabeledSection className={styles.moveSection} label="From Tutor" large>
              {renderMoveList(MoveLearnType.Tutor)}
            </LabeledSection>
          )}
        </section>
        <section className={styles.recirculation}>
          <Recirculation id={id} />
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
    next.props({
      pokemon: serializePokemon(pokemon),
    });
  } catch {
    throw new Error('Pokemon does not exist.');
  }
};
