import React from 'react';
import { Link } from 'react-router-dom';
import { Pokeball } from 'svgs';
import styles from './nav.module.scss';

const Nav = () => (
  <nav className={styles.container}>
    <Link className={styles.link} to="/">
      <Pokeball />
    </Link>
  </nav>
);

export default Nav;
