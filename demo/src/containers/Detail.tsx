import React, { useMemo } from 'react';
import { GuardFunction } from 'react-router-guards';
import { Pokemon } from 'types';
import { api, getName } from 'utils';

interface Props {
  pokemon: Pokemon;
}

const Detail: React.FC<Props> = ({ pokemon }) => {
  const name = useMemo(() => getName(pokemon.name), [pokemon]);

  return (
    <div>
      <header>
        <img src={pokemon.sprites.front_default || ''} alt={`Sprite of ${name}`} />
        <h1>{name}</h1>
      </header>
    </div>
  );
};

export default Detail;

export const beforeRouteEnter: GuardFunction = async (to, from, next) => {
  const { name } = to.match.params;
  try {
    const pokemon = await api.get(name);
    next.props({ pokemon });
  } catch {
    throw new Error('Pokemon does not exist.');
  }
};
