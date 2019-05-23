type Name = string;

export interface Resource<T> {
  name: T;
  url: string;
}

export interface ListResult {
  name: Name;
  url: string;
}

type Sprite = string | null;

export interface Slotted {
  slot: number;
}

interface PokemonType extends Slotted {
  type: Resource<string>;
}

export interface PokemonAbility extends Slotted {
  is_hidden: boolean;
  ability: Resource<string>;
}

export enum MoveLearn {
  Egg = 'egg',
  LevelUp = 'level-up',
  Machine = 'machine',
  Tutor = 'tutor',
}

export interface PokemonMove {
  move: Resource<string>;
  version_group_details: {
    level_learned_at: number;
    move_learn_method: Resource<MoveLearn>;
    version_group: Resource<string>;
  }[];
}

export enum StatType {
  Attack = 'attack',
  Defense = 'defense',
  HP = 'hp',
  SpecialAttack = 'special-attack',
  SpecialDefense = 'special-defense',
  Speed = 'speed',
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: Resource<StatType>;
}

export interface PokemonSprites {
  front_default: Sprite;
  front_shiny: Sprite;
  front_female: Sprite;
  front_shiny_female: Sprite;
  back_default: Sprite;
  back_shiny: Sprite;
  back_female: Sprite;
  back_shiny_female: Sprite;
}

export interface Pokemon {
  id: number;
  name: Name;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  base_experience: number;
  moves: PokemonMove[];
  stats: PokemonStat[];
}
