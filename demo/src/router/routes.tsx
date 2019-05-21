import React from 'react';
import { Redirect } from 'react-router-dom';
import { Home, NotFound } from 'containers';
import { requireLogin } from 'router/guards';

export default () => [
  {
    path: '/',
    exact: true,
    component: Home,
    loading: 'Definitely not loading...',
    error: 'Definitely not an error',
    beforeEnter: requireLogin,
  },
  {
    path: '/hello/:id',
    exact: true,
    // eslint-disable-next-line react/prop-types
    render({ match }: Record<string, any>) {
      return <p>Hey there {match.params.id} :~)</p>;
    },
    beforeEnter: requireLogin,
  },
  {
    path: '/login',
    exact: true,
    // eslint-disable-next-line react/prop-types
    render({ history }: Record<string, any>) {
      if (localStorage.getItem('isLoggedIn') === 'true') {
        return <Redirect to="/" />;
      }
      const login = () => {
        localStorage.setItem('isLoggedIn', 'true');
        history.push('/');
      };
      return <button onClick={login}>Log in</button>;
    },
  },
  {
    path: '*',
    render(props: Record<string, any>) {
      return <NotFound {...props} />;
    },
  },
];
