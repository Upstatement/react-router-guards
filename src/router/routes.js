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
    render({ match }) {
      return <p>Hey there {match.params.id} :~)</p>;
    },
  },
  {
    path: '*',
    render(props) {
      return <NotFound {...props} />;
    },
    beforeEnter() {
      throw new Error(null);
    },
    error() {
      return 'Not here';
    },
  },
];
