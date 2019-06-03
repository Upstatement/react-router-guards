import { AUTH_ONLY } from 'router/types';
import { getIsLoggedIn } from 'utils';

const requireLogin = (to, from, next) => {
  if (to.meta[AUTH_ONLY] && !getIsLoggedIn()) {
    next.redirect('/login');
  }
  next();
};

export default requireLogin;
