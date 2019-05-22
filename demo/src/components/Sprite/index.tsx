import React from 'react';
import styles from './sprite.module.scss';

interface Props {
  color: string;
  label: string;
  src: string;
}

const Sprite: React.FunctionComponent<Props> = ({ color, label, src }) => (
  <figure className={styles.container} style={{ backgroundColor: color }}>
    <div className={styles.sprite} style={{ backgroundImage: `url(${src})` }} />
    <figcaption className={styles.caption}>{label}</figcaption>
  </figure>
);

export default Sprite;
