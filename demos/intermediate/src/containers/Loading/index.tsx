import React from 'react';
import { Pokeball } from 'svgs';
import styles from './loading.module.scss';
import { LoadingPageComponentType } from 'react-router-guards';

const Loading: LoadingPageComponentType = () => (
  <div className={styles.container}>
    <div className={styles.icon}>
      <Pokeball isAnimated />
    </div>
  </div>
);

export default Loading;
