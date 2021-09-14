import React from 'react';
import { LoadingPageComponentType } from 'react-router-guards';
import { Pokeball } from 'svgs';
import styles from './loading.module.scss';

const Loading: LoadingPageComponentType = () => (
  <div className={styles.container}>
    <div className={styles.icon}>
      <Pokeball isAnimated />
    </div>
  </div>
);

export default Loading;
