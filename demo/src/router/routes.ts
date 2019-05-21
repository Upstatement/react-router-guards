import { Hello, Home, Login, NotFound } from 'containers';
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
    component: Hello,
    beforeEnter: requireLogin,
  },
  {
    path: '/login',
    exact: true,
    component: Login,
  },
  {
    path: '*',
    component: NotFound,
  },
];
