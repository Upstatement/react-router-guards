import React from 'react';
import { Link } from 'components';
import styles from './footer.module.scss';

const Footer = () => (
  <footer className={styles.container}>
    <p className={styles.copyright}>
      &copy; 2019{' '}
      <Link to="https://upstatement.com" newTab>
        Upstatement
      </Link>
    </p>
    <p>
      Built using the{' '}
      <Link to="https://pokeapi.co" newTab>
        PokéAPI
      </Link>{' '}
      and <Link to="https://github.com/Upstatement/react-router-guards">React Router Guards</Link>
    </p>
  </footer>
);

export default Footer;
