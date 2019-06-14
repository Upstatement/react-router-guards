import React from 'react';
import { Link } from 'components';
import { Pokeball } from 'svgs';
import styles from './nav.module.scss';

const Nav = () => (
  <nav className={styles.container}>
    <Link className={styles.link} to="/">
      <div className={styles.icon}>
        <Pokeball />
      </div>
    </Link>
  </nav>
);

export default Nav;
