# react-router-guards

> Guard middleware for React Router navigation

## Install

```shell
npm install --save react-router-guards
```

## Basic usage

```jsx
import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { About, Home, Loading, Login, NotFound } from 'pages';
import { getIsLoggedIn } from 'utils';

const history = createBrowserHistory();

const requireLogin = (to, from, next) => {
  if (getIsLoggedIn()) {
    next();
  }
  next.redirect('/login');
};

const App = () => (
  <Router history={history}>
    <GuardProvider loading={Loading} error={NotFound}>
      <GuardedRoute path="/login" exact component={Login} />
      <GuardProvider guards={[requireLogin]}>
        <GuardedRoute path="/" exact component={Home} />
        <GuardedRoute path="/about" exact component={About} />
      </GuardProvider>
      <GuardedRoute path="*" component={NotFound} />
    </GuardProvider>
  </Router>
);
```
