/* eslint-disable @typescript-eslint/camelcase */

import { PokemonMove, MoveLearn } from 'types';
import { getName } from 'utils';

interface Move {
  name: string;
  level: number;
}

const getMoves = (moves: PokemonMove[]) => {
  const movesMap: Record<MoveLearn, Move[]> = Object.values(MoveLearn).reduce(
    (acc, key) => ({ ...acc, [key]: [] }),
    {},
  );

  moves.forEach(({ move, version_group_details }) => {
    const { level_learned_at, move_learn_method } = version_group_details[0];
    const method = move_learn_method.name;
    if (movesMap[method]) {
      movesMap[method].push({
        name: getName(move.name),
        level: level_learned_at,
      });
    }
  });

  const sortByMove = (a: Move, b: Move) => a.name.localeCompare(b.name);

  return {
    [MoveLearn.Egg]: movesMap[MoveLearn.Egg].sort(sortByMove),
    [MoveLearn.LevelUp]: movesMap[MoveLearn.LevelUp].sort((a, b) => {
      const levelDiff = a.level - b.level;
      if (levelDiff === 0) {
        return sortByMove(a, b);
      }
      return levelDiff;
    }),
    [MoveLearn.Machine]: movesMap[MoveLearn.Machine].sort(sortByMove),
    [MoveLearn.Tutor]: movesMap[MoveLearn.Tutor].sort(sortByMove),
  };
};

export default getMoves;
