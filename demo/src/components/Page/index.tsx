import React from 'react';
import { Footer, Nav } from 'components';
import styles from './page.module.scss';

const Page: React.FunctionComponent<{}> = ({ children }) => (
  <div className={styles.page}>
    <Nav />
    <main className={styles.main}>{children}</main>
    <Footer />
  </div>
);

export default Page;
