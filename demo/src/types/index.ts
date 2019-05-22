type Name = string;

export interface ListResult {
  name: Name;
  url: string;
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

export interface Pokemon {
  id: number;
  name: Name;
  height: number;
  weight: number;
  sprites: PokemonSprites;
}
