import React from 'react';
import { Pokeball } from 'svgs';
import styles from './notFound.module.scss';

const NotFound = () => (
  <div className={styles.container}>
    <div className={styles.icon}>
      <Pokeball />
    </div>
    <h1>Page not found</h1>
    <p>Look for something else</p>
  </div>
);

export default NotFound;
