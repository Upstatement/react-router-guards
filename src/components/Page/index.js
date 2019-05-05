import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'components';
import styles from './page.module.scss';

const Page = ({ children }) => (
  <div className={styles.page}>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/hello/1">First page</Link>
      <Link to="/hello/2">Second page</Link>
      <Link to="/asdf">404</Link>
    </nav>
    <main className={styles.main}>{children}</main>
    <footer>&copy; 2019 Josh Pensky :~)</footer>
  </div>
);

Page.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object.isRequired,
};

export default Page;
