/* eslint-disable @typescript-eslint/camelcase */

import { PokemonStat, StatType } from 'types';

const getStats = (stats: PokemonStat[]) => {
  const statMap: Record<StatType, number> = Object.values(StatType).reduce(
    (acc, key) => ({ ...acc, [key]: 0 }),
    {},
  );
  stats.forEach(({ base_stat, stat: { name } }) => {
    if (name in statMap) {
      statMap[name] = base_stat;
    }
  });
  return statMap;
};

export default getStats;
