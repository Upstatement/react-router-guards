import React from 'react';
import { RouteComponentProps } from 'react-router';
import Router from 'router';
import { Page } from 'components';
import 'style/index.scss';

const App = () => (
  <Router>
    {(content, routeProps: RouteComponentProps) => <Page {...routeProps}>{content}</Page>}
  </Router>
);

export default App;
