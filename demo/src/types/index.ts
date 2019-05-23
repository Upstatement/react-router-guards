type Name = string;

export interface ListResult {
  name: Name;
  url: string;
}

type Sprite = string | null;

export interface Slotted {
  slot: number;
}

interface PokemonType extends Slotted {
  type: {
    name: string;
    url: string;
  };
}

interface Ability extends Slotted {
  is_hidden: boolean;
  ability: {
    name: string;
    url: string;
  };
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
  abilities: Ability[];
  base_experience: number;
}
