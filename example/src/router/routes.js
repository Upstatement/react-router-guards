import React from 'react';
import { Home, NotFound } from 'containers';

export default () => [
  {
    path: '/',
    exact: true,
    component: Home,
    loading() {
      return 'Definitely not loading...';
    },
  },
  {
    path: '/hello/:id',
    exact: true,
    // eslint-disable-next-line react/prop-types
    render(props) {
      // eslint-disable-next-line react/prop-types
      return <p>Hey there {props.match.params.id} :~)</p>;
    },
  },
  {
    path: '*',
    render(props) {
      return <NotFound {...props} />;
    },
  },
];
