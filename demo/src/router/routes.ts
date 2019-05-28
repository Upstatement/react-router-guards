import { GoodBye, Hello, Home, Login, NotFound } from 'containers';
import { AUTH_ONLY } from 'router/types';

export default () => [
  {
    path: '/',
    exact: true,
    component: Home,
    loading: 'Definitely not loading...',
    error: 'Definitely not an error',
    meta: {
      [AUTH_ONLY]: true,
    },
  },
  {
    path: '/hello/:id',
    exact: true,
    component: Hello,
    meta: {
      [AUTH_ONLY]: true,
    },
  },
  {
    path: '/goodbye',
    exact: true,
    component: GoodBye,
  },
  {
    path: '/login',
    exact: true,
    component: Login,
  },
  {
    path: '*',
    component: NotFound,
    ignoreGlobal: true,
  },
];
