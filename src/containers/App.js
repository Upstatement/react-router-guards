import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import Router from 'router';
import { Page } from 'components';
import 'style/index.scss';

const App = () => (
  <Provider store={store}>
    <Router>{(content, location) => <Page location={location}>{content}</Page>}</Router>
  </Provider>
);

export default App;
