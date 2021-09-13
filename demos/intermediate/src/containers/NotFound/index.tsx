import React from 'react';
import { RouteError } from 'react-router-guards';
import { Link } from 'components';
import styles from './notFound.module.scss';

interface NotFoundProps {
  error: RouteError;
}

const NotFound = ({ error }: NotFoundProps) => (
  <div className={styles.container}>
    <img className={styles.image} src={`/img/missingno.png`} alt="Not found" />
    <h1 className={styles.title}>Uh-oh!</h1>
    <p className={styles.body}>We couldn't catch that Pokémon.</p>
    {error && <small className={styles.error}>{error}</small>}

    <Link to="/">View 'em all</Link>
  </div>
);

export default NotFound;
