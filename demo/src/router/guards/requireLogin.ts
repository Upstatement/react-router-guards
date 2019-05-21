import { GuardFunction } from 'react-router-guards';

const requireLogin: GuardFunction = (to, from, next) => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    return next();
  }
  next.redirect('/login');
};

export default requireLogin;
