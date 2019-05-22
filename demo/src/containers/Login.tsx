import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

const Login: React.FunctionComponent<RouteComponentProps> = ({ history }) => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    return <Redirect to="/" />;
  }
  const login = () => {
    localStorage.setItem('isLoggedIn', 'true');
    history.push('/');
  };
  return <button onClick={login}>Log in</button>;
};

export default Login;
