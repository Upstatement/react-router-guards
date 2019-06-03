import React from 'react';
import { Pokeball } from 'svgs';
import styles from './loading.module.scss';

const Loading = () => (
  <div className={styles.container}>
    <div className={styles.icon}>
      <Pokeball isAnimated />
    </div>
  </div>
);

export default Loading;
