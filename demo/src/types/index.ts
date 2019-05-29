/* Generic interfaces */
export interface Resource<T> {
  name: T;
  url: string;
}

export interface Slotted {
  slot: number;
}

/* List API types */
export type ListResult = Resource<string>;

/* Detail API types */
export interface PokemonAbility extends Slotted {
  is_hidden: boolean;
  ability: Resource<string>;
}

export enum MoveLearnType {
  Egg = 'egg',
  LevelUp = 'level-up',
  Machine = 'machine',
  Tutor = 'tutor',
}
export interface PokemonMove {
  move: Resource<string>;
  version_group_details: {
    level_learned_at: number;
    move_learn_method: Resource<MoveLearnType>;
    version_group: Resource<string>;
  }[];
}

type Sprite = string | null;
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

interface PokemonType extends Slotted {
  type: Resource<string>;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
  stats: PokemonStat[];
  types: PokemonType[];
}

export type FetchedPokemon = Pokemon | null;

export interface Measurement {
  metric: string;
  imperial: string;
}

export interface Height extends Measurement {
  meters: number;
  feet: number;
  inches: number;
}

export interface Weight extends Measurement {
  kilograms: number;
  pounds: number;
}

export interface SerializedAbility {
  isHidden: boolean;
  name: string;
}

export interface SerializedMove {
  name: string;
  level: number;
}

export interface SerializedMoves {
  [MoveLearnType.Egg]: SerializedMove[];
  [MoveLearnType.LevelUp]: SerializedMove[];
  [MoveLearnType.Machine]: SerializedMove[];
  [MoveLearnType.Tutor]: SerializedMove[];
}

export interface SerializedPokemon {
  id: number;
  name: string;
  entryNumber: string;
  baseExperience: number;
  sprites: PokemonSprites;
  height: Height;
  weight: Weight;
  types: string[];
  abilities: SerializedAbility[];
  stats: Record<StatType, number>;
  moves: SerializedMoves;
}
