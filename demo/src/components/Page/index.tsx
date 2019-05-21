import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './page.module.scss';

const Page: React.FC<RouteComponentProps> = ({ children }) => (
  <div className={styles.page}>
    <nav>
      <Link to="/">View all</Link>
    </nav>
    <main className={styles.main}>{children}</main>
  </div>
);

export default Page;
