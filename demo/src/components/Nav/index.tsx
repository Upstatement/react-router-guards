import React from 'react';
import { Link } from 'react-router-dom';
import styles from './nav.module.scss';

const Nav = () => (
  <nav className={styles.container}>
    <Link to="/">Home</Link>
  </nav>
);

export default Nav;
