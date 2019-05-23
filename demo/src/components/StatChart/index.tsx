import React from 'react';
import { StatType } from 'types';
import { className } from 'utils';
import { NAMED_STATS } from 'utils/constants';
import styles from './statChart.module.scss';

interface Props {
  stats: Record<StatType, number>;
}

const MAX_VALUE = 255;

const ORDERED_STATS = [
  StatType.HP,
  StatType.Attack,
  StatType.Defense,
  StatType.SpecialAttack,
  StatType.SpecialDefense,
  StatType.Speed,
];

const StatChart: React.FunctionComponent<Props> = ({ stats }) => {
  const statData = ORDERED_STATS.map(type => {
    const value = stats[type] / MAX_VALUE;
    return {
      name: NAMED_STATS[type],
      value: stats[type],
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      barStyle: {
        '--width': `${value * 100}%`,
        '--grad-width': `${(1 / value) * 100}%`,
      } as React.CSSProperties,
    };
  });

  return (
    <div className={styles.container}>
      {statData.map(({ name, value, barStyle }, i) => (
        <div key={i} {...className(styles.row, styles[`row${i}`])}>
          <p className={styles.type}>{name}</p>
          <p className={styles.value}>{value}</p>
          <div className={styles.bar}>
            <div className={styles.barValue} style={barStyle} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatChart;
