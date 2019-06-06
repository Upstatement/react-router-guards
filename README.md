# react-router-guards

> Guard middleware for React Router navigation

React Router Guards provides an API for performing complicated logic between the call for navigation and the final render of a route.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Concepts](#concepts)
  - [Guard functions](#guard-functions)
  - [Page components](#page-components)
    - [Loading page](#loading-page)
    - [Error page](#error-page)
  - [Guard Provider](#guard-provider)
  - [Guarded Route](#guarded-route)
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

Check out our [demos](#demos) for more examples!

## Concepts

### Guard functions

Guard functions are the middleware between navigation and rendering. They can contain complex, asynchronous logic in order to fetch data for a route.

A guard function may look like the following (taken from the [intermediate demo](/demos/intermediate/src/containers/Detail/index.tsx)):

```js
const getPokemon = async (to, from, next) => {
  const { name } = to.match.params;
  try {
    const pokemon = await api.pokemon.get(name);
    next.props({ pokemon });
  } catch {
    throw new Error(`Pokemon "${name}" does not exist.`);
  }
};
```

Let's break it down line-by-line:

---

```js
const getPokemon = async (to, from, next) => {
```

All guard functions accept the same three arguments:

- `to`: the context of the Route being directed to

- `from`: the context of the Route being directed from

- `next`: a multi-use function for advancing to the next guard function

Guard functions don't advance until the `next` function is called. This allows the logic inside of them to be asynchronous, hence the `async` keyword.

```js
const { name } = to.match.params;
```

In this line, we are destructuring the `to` route's match params to get the name of the pokemon.

The `to` and `from` arguments allow us to use the same props that the `Router` passes to the page component. These include the following:

- [`history`](https://reacttraining.com/react-router/core/api/history)

- [`location`](https://reacttraining.com/react-router/core/api/location)

- [`match`](https://reacttraining.com/react-router/core/api/match)

```js
  try {
    const pokemon = await api.pokemon.get(name);
    next.props({ pokemon });
```

In these lines, we are calling an API function in order to get a pokemon with the route's name. Then, we are using one of `next`'s three functionalities to pass the pokemon as a prop to the route.

As seen, `next` has a few different functionalities. They are as follows:

- `next()`

  **Action:** advances to the next guard function

- `next.props(object)`

  **Action:** passes the given props to the route's component on final render, and advances to the next guard function

  As with any React component, the passed props _must_ be an object.

- `next.redirect(location)`

  **Action:** cancels current and future guard functions, and redirects to the given location

  The location can be anything that would be used as the `to` prop of React Router's [`Redirect` component](https://reacttraining.com/react-router/core/api/Redirect).

  _**Note:** Redirecting to a different location will still run the guards of the new location before rendering it._

```js
  } catch {
    throw new Error(`Pokemon "${name}" does not exist.`);
  }
```

In these final lines, we are catching any errors that come from the API call and throwing our own error.

We can throw errors at any point within our guard function. When an error is thrown, the current guard function will stop executing and all future ones will be cancelled. Then, the [error page](#error-page) (as set by a `GuardProvider` or `GuardedRoute`) will display.

### Page components

Page components are used for setting loading and error pages.

```ts
type PageComponent = React.Component | string | boolean | number | null | undefined;
```

#### Loading page

Loading pages are React components that are displayed while guard middleware is resolving.

They can be set either:

- _globally_ as the `loading` prop of a `GuardProvider`

- _individually_ as the `loading` prop of a `GuardedRoute`

#### Error page

Error pages are React components that are displayed when guard logic fails.

They can be set either:

- _globally_ as the `error` prop of a `GuardProvider`

- _individually_ as the `error` prop of a `GuardedRoute`

Typically, error pages will be the same component as a Not Found or 404 page.

_**Note:** If using a React component for your error page, it can receive the error message thrown by a guard function via an `error` prop._

### Guard Provider

The `GuardProvider` component is a high-level wrapper for your entire routing solution.

#### Purpose

The `GuardProvider` provides an API for declaring global guards and loading and error pages that can be used by any `GuardedRoute`s within the component:

```ts
interface GuardProviderProps {
  guards?: GuardFunction[];
  ignoreGlobal?: boolean;
  loading?: PageComponent;
  error?: PageComponent;
}
```

#### Set-up

All `GuardProvider`s _must_:

- be wrapped by a `Router` component

- wrap all `GuardedRoute` components

```jsx
const App = () => (
  <Router>
    <GuardProvider guards={guards} loading={Loading} error={NotFound}>
      <GuardedRoute path="/" exact component={Home} />
    </GuardProvider>
  </Router>
);
```

#### Nesting guard providers

Nesting guard providers is useful in case where you may only want a certain subset of routes to have the same guards, loading page, and/or error page.

By nesting guard providers, you can either chain functionality or override that of its parent(s):

| Prop      | Result                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `guards`  | Overridden if `ignoreGlobal` is `true`; otherwise, guards are appended to the _end_ of the middleware chain. |
| `loading` | Overridden, if value provided.                                                                               |
| `error`   | Overridden, if value provided.                                                                               |

### Guarded Route

The `GuardedRoute` component acts as a replacement for the default [`Route`](https://reacttraining.com/react-router/core/api/Route) component provided by React Router.

#### Purpose

The `GuardedRoute`, on top of accepting the same props as a regular [`Route`](https://reacttraining.com/react-router/core/api/Route/route-props), provides an API for declaring guards and loading and error pages on an individual route basis:

```ts
interface GuardedRouteProps extends RouteProps {
  guards?: GuardFunction[];
  ignoreGlobal?: boolean;
  loading?: PageComponent;
  error?: PageComponent;
  meta?: Record<string, any>;
}
```

It's important to note that guards set by the `GuardedRoute` will be added to the _end_ of the middleware chain set by its parent `GuardedProvider`.

#### Set-up

All `GuardedRoute`s must be wrapped by a `GuardedProvider` component.

```jsx
const App = () => (
  <Router>
    <GuardProvider guards={guards} loading={Loading} error={NotFound}>
      <GuardedRoute path="/" exact component={Home} />
      <GuardedRoute path="/pokemon/:id" exact component={Pokemon} guards={[fetchPokemon]} />
      <GuardedRoute path="*" component={NotFound} />
    </GuardProvider>
  </Router>
);
```

#### Metadata

In order to provide more information about a route, we've added a `meta` prop to the `GuardedRoute`.

The `meta` object can include anything! In our [basic demo](#basic), we used the `meta` object to determine which pages required auth.

You can access a route's metadata using `to.meta` in a guard function.

## Demos

We've included some demos below to help provide more context on how to use this package!

### Basic

[Demo](#basic) | [Source](demos/basic)

The basic demo showcases some basic functionality of route guard API with an auth example.

### Intermediate

[Demo](#intermediate) | [Source](demos/intermediate)

The intermediate demo uses the [PokéAPI](https://pokeapi.co/) to showcase how to use route guards for fetching data from an API.

## Contributing

We welcome all contributions to our projects! Filing bugs, feature requests, code changes, docs changes, or anything else you'd like to contribute are all more than welcome! More information about contributing can be found in the [contributing guidelines](.github/CONTRIBUTING.md).

## Code of Conduct

Upstatement strives to provide a welcoming, inclusive environment for all users. To hold ourselves accountable to that mission, we have a strictly-enforced [code of conduct](CODE_OF_CONDUCT.md).

## About Upstatement

[Upstatement](https://www.upstatement.com/) is a digital transformation studio headquartered in Boston, MA that imagines and builds exceptional digital experiences. Make sure to check out our [services](https://www.upstatement.com/services/), [work](https://www.upstatement.com/work/), and [open positions](https://www.upstatement.com/jobs/)!
