import { StatType } from 'types';

export const LIST_FETCH_LIMIT = 20;

export const MISSINGNO = {
  ID: 13,
  NAME: 'missingno',
  FULL_NAME: 'MissingNo',
};

export const NAMED_STATS = {
  [StatType.HP]: 'HP',
  [StatType.Attack]: 'Attack',
  [StatType.Defense]: 'Defense',
  [StatType.SpecialAttack]: 'Sp. Atk',
  [StatType.SpecialDefense]: 'Sp. Def',
  [StatType.Speed]: 'Speed',
};
