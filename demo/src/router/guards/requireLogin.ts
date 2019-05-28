import { GuardFunction } from 'react-router-guards';
import { AUTH_ONLY } from 'router/types';

const requireLogin: GuardFunction = (to, from, next) => {
  if (to.meta[AUTH_ONLY] && localStorage.getItem('isLoggedIn') !== 'true') {
    next.redirect('/login');
  }
  next();
};

export default requireLogin;
