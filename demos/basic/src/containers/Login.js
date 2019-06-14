import React from 'react';
import { Redirect } from 'react-router-dom';
import { getIsLoggedIn } from 'utils';
import { STORAGE_KEYS } from 'utils/constants';

const Login = ({ history }) => {
  const login = () => {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    history.push('/');
  };

  if (getIsLoggedIn()) {
    return <Redirect to="/" />;
  }
  return <button onClick={login}>Log in</button>;
};

export default Login;
