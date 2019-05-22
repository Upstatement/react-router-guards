import { GuardFunction } from 'react-router-guards';

const requireLogin: GuardFunction = (to, from, next) => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    next();
  }
  next.redirect('/login');
};

export default requireLogin;
