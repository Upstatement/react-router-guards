# react-router-guards

> Guard middleware for React Router navigation

React Router Guards provides a middleware API for [React Router](https://reacttraining.com/react-router/), allowing you to perform complex logic between the call for navigation and the final render of a route.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Concepts](#concepts)
- [Demos](#demos)
  - [Basic](#basic)
  - [Intermediate](#intermediate)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [About Upstatement](#about-upstatement)

## Requirements

This package has the following [peer dependencies](https://docs.npmjs.com/files/package.json#peerdependencies):

- [React](https://www.npmjs.com/package/react) v16.8.0+ (for hooks ⚓️)

- [React Router DOM](https://www.npmjs.com/package/react-router-dom) v5.0.0+

## Installation

With [npm](https://www.npmjs.com):

```shell
$ npm install react-router-guards
```

With [yarn](https://yarnpkg.com/):

```shell
$ yarn add react-router-guards
```

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using ES6 modules
import { GuardProvider, GuardedRoute } from 'react-router-guards';

// using CommonJS modules
const GuardProvider = require('react-router-guards').GuardProvider;
const GuardedRoute = require('react-router-guards').GuardedRoute;
```

## Basic usage

Here is a very basic example of how to use React Router Guards.

```jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { About, Home, Loading, Login, NotFound } from 'pages';
import { getIsLoggedIn } from 'utils';

const requireLogin = (to, from, next) => {
  if (to.meta.auth) {
    if (getIsLoggedIn()) {
      next();
    }
    next.redirect('/login');
  } else {
    next();
  }
};

const App = () => (
  <BrowserRouter>
    <GuardProvider guards={[requireLogin]} loading={Loading} error={NotFound}>
      <Switch>
        <GuardedRoute path="/login" exact component={Login} />
        <GuardedRoute path="/" exact component={Home} meta={{ auth: true }} />
        <GuardedRoute path="/about" exact component={About} meta={{ auth: true }} />
        <GuardedRoute path="*" component={NotFound} />
      </Switch>
    </GuardProvider>
  </BrowserRouter>
);
```

Check out our [demos](#demos) for more examples!

## Concepts

### [Navigation lifecycle](/docs/navigation-lifecycle.md)

> With the addition of guard middleware, the navigation lifecycle has changed.

### [Guard functions](/docs/guard-functions.md)

> Guard functions are the middleware between navigation and rendering.

### [Page components](/docs/page-components.md)

> Page components are used for setting loading and error pages.

### [Guard Provider](/docs/guard-provider.md)

> The `GuardProvider` component is a high-level wrapper for your entire routing solution.

### [Guarded Route](/docs/guarded-route.md)

> The `GuardedRoute` component acts as a replacement for the default [`Route`](https://reacttraining.com/react-router/core/api/Route) component provided by React Router, allowing for routes to use guard middleware.

## Demos

We've included some demos below to help provide more context on how to use this package!

### Basic

[Demo + Source](https://codesandbox.io/s/react-router-guards-basic-demo-0m48v)

The basic demo showcases some basic functionality of route guard API with an auth example.

### Intermediate

[Demo](https://react-router-guards-demo.netlify.com) | [Source](demos/intermediate)

The intermediate demo uses the [PokéAPI](https://pokeapi.co/) to showcase how to use route guards for fetching data from an API.

## Contributing

We welcome all contributions to our projects! Filing bugs, feature requests, code changes, docs changes, or anything else you'd like to contribute are all more than welcome! More information about contributing can be found in the [contributing guidelines](.github/CONTRIBUTING.md).

## Code of Conduct

Upstatement strives to provide a welcoming, inclusive environment for all users. To hold ourselves accountable to that mission, we have a strictly-enforced [code of conduct](CODE_OF_CONDUCT.md).

## About Upstatement

[Upstatement](https://www.upstatement.com/) is a digital transformation studio headquartered in Boston, MA that imagines and builds exceptional digital experiences. Make sure to check out our [services](https://www.upstatement.com/services/), [work](https://www.upstatement.com/work/), and [open positions](https://www.upstatement.com/jobs/)!
