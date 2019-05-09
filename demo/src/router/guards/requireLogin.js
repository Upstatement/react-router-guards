const requireLogin = (to, from, next) => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    return next();
  }
  next.redirect('/login');
};

export default requireLogin;
