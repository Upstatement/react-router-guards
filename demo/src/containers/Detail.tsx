import React from 'react';
import { GuardFunction } from 'react-router-guards';
import { Header } from 'components';
import { Pokemon } from 'types';
import { api } from 'utils';

interface Props {
  pokemon: Pokemon;
}

const Detail: React.FunctionComponent<Props> = ({ pokemon }) => {
  console.log(pokemon);
  return (
    <div>
      <Header pokemon={pokemon} />
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
