/* eslint-disable @typescript-eslint/camelcase */

import { PokemonAbility } from 'types';
import { getName, sortSlots } from 'utils';

const getAbilities = (abilities: PokemonAbility[]) =>
  sortSlots(abilities).map(({ is_hidden, ability }) => ({
    isHidden: is_hidden,
    name: getName(ability.name),
  }));

export default getAbilities;
