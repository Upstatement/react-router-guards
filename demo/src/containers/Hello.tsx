import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface HelloParams {
  id: string;
}

const Hello: React.FC<RouteComponentProps<HelloParams>> = ({ match }) => (
  <p>Hey there {match.params.id} :~)</p>
);

export default Hello;
