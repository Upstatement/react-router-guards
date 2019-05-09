import React from 'react';
import { Redirect } from 'react-router-dom';
import { Home, NotFound } from 'containers';
import { requireLogin } from './guards';

export default () => [
  {
    path: '/',
    exact: true,
    component: Home,
    loading() {
      return 'Definitely not loading...';
    },
    beforeEnter: requireLogin,
  },
  {
    path: '/hello/:id',
    exact: true,
    // eslint-disable-next-line react/prop-types
    render({ match }) {
      return <p>Hey there {match.params.id} :~)</p>;
    },
    beforeEnter: requireLogin,
  },
  {
    path: '/login',
    exact: true,
    // eslint-disable-next-line react/prop-types
    render({ history }) {
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
    render(props) {
      return <NotFound {...props} />;
    },
  },
];
