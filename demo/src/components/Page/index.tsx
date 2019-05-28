import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './page.module.scss';

const Page: React.FunctionComponent<RouteComponentProps> = ({ children, history }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    history.push('/login');
  };

  return (
    <div className={styles.page}>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/hello/1">First page</Link>
        <Link to="/hello/2">Second page</Link>
        <Link to="/goodbye">Non-auth page</Link>
        <Link to="/asdf">404</Link>
        {isLoggedIn && <button onClick={logout}>Log out</button>}
      </nav>
      <main className={styles.main}>{children}</main>
      <footer>&copy; 2019 Josh Pensky :~)</footer>
    </div>
  );
};

export default Page;
