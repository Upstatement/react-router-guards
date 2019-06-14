import { PokemonAbility, SerializedAbility } from 'types';
import { getName, sortSlots } from 'utils';

const getAbilities = (abilities: PokemonAbility[]): SerializedAbility[] =>
  sortSlots(abilities).map(({ is_hidden, ability }) => ({
    isHidden: is_hidden,
    name: getName(ability.name),
  }));

export default getAbilities;
