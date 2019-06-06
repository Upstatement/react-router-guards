# Guard functions

Guard functions are the middleware between navigation and rendering. They can contain complex, asynchronous logic in order to fetch data for a route.

## API

```ts
type GuardFunction = (to: ToRouteProps, from: FromRouteProps | null, next: Next) => void;
```

## Example

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

---

Let's break it down line-by-line:

```js
const getPokemon = async (to, from, next) => {
```

All guard functions accept the same three arguments:

- `to`: the context of the Route being directed to

- `from`: the context of the Route being directed from

- `next`: a multi-use function for advancing to the next guard function

Guard functions don't advance until the `next` function is called. This allows the logic inside of them to be asynchronous, hence the `async` keyword.

---

```js
const { name } = to.match.params;
```

In this line, we are destructuring the `to` route's match params to get the name of the pokemon.

The `to` and `from` arguments allow us to use the same props that the `Router` passes to the page component. These include the following:

- [`history`](https://reacttraining.com/react-router/core/api/history)

- [`location`](https://reacttraining.com/react-router/core/api/location)

- [`match`](https://reacttraining.com/react-router/core/api/match)

---

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

---

```js
  } catch {
    throw new Error(`Pokemon "${name}" does not exist.`);
  }
```

In these final lines, we are catching any errors that come from the API call and throwing our own error.

We can throw errors at any point within our guard function. When an error is thrown, the current guard function will stop executing and all future ones will be cancelled. Then, the [error page](docs/page-components) (as set by a [`GuardProvider`](/docs/guard-provider) or [`GuardedRoute`](/docs/guarded-route)) will display.
