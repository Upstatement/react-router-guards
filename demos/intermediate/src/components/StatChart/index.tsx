import React, { useMemo } from 'react';
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
  const statData = useMemo(
    () =>
      ORDERED_STATS.map(type => {
        const value = stats[type] / MAX_VALUE;
        const reverseValue = value === 0 ? 1 : 1 / value;
        return {
          name: NAMED_STATS[type],
          value: stats[type],
          barStyle: {
            '--width': `${value * 100}%`,
            '--grad-width': `${reverseValue * 100}%`,
          } as React.CSSProperties,
        };
      }),
    [stats],
  );

  return (
    <div className={styles.container}>
      <table>
        <tbody className={styles.table}>
          {statData.map(({ name, value, barStyle }, i) => (
            <tr key={i} {...className(styles.row, styles[`row${i}`])}>
              <td className={styles.tableColumnMin}>
                <span className={styles.type}>{name}</span>
              </td>
              <td className={styles.tableColumnMin}>
                <span className={styles.value}>{value}</span>
              </td>
              <td>
                <div className={styles.bar}>
                  <div className={styles.barValue} style={barStyle} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatChart;
