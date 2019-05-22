import React from 'react';
import styles from './footer.module.scss';

const Footer = () => (
  <footer className={styles.container}>
    <p className={styles.copyright}>
      &copy; 2019 <a href="https://upstatement.com">Upstatement</a>
    </p>
    <p>
      Built using the <a href="https://pokeapi.co">PokéAPI</a> and{' '}
      <a href="https://github.com/Upstatement/react-router-guards">React Router Guards</a>
    </p>
  </footer>
);

export default Footer;
