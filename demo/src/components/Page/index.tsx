import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Footer, Nav } from 'components';
import styles from './page.module.scss';

const Page: React.FunctionComponent<RouteComponentProps> = ({ children }) => (
  <div className={styles.page}>
    <Nav />
    <main className={styles.main}>{children}</main>
    <Footer />
  </div>
);

export default Page;
