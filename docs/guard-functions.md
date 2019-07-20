# Guard functions

Guard functions are the middleware between navigation and rendering.
They can contain complex, asynchronous logic in order to fetch data for a route.

- [API](#api)
- [`next` functions](#next-functions)
- [Error handling](#error-handling)
- [Example](#example)

## API

```ts
type GuardFunction = (to: ToRouteProps, from: FromRouteProps | null, next: Next) => void;

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-router/index.d.ts#L69
type ToRouteProps = RouteComponentProps & {
  meta?: Object;
};

type FromRouteProps = RouteComponentProps;

type Next = {
  (): void;
  props(payload: Object): void;
  redirect(payload: string | Object): void;
};
```

## `next` functions

All guard functions take three arguments: `to`, `from`, and `next`.

While we use `to` and `from` to get context of our navigation history, we use `next` as a way to advance to further guards in the middleware queue.

`next` has a few different functionalities. They are as follows:

- `next()`

  **Action:** advances to the next guard function

- `next.props(object)`

  **Action:** passes the given props to the route's component on final render, and advances to the next guard function

  As with any React component, the passed props _must_ be an object.

- `next.redirect(location)`

  **Action:** cancels current and future guard functions, and redirects to the given location

  The location can be anything that would be used as the `to` prop of React Router's [`Redirect` component](https://reacttraining.com/react-router/core/api/Redirect).

  _**Note:** Redirecting to a different location will still run the guards of the new location before rendering it._

You can call any of the `next` functions at any time in your guard function.
This will immediately stop execution of the current guard and move onto the next one.

## Error handling

When dealing with asynchronous logic in your guard function, you might come across cases in which you want to show the user an error page instead of rendering the route component.

This can be accomplished by throwing an `Error`.

Much like the `next` function, you can throw an `Error` at any time in your guard function, and it will immediately stop execution of the current guard.

However, instead of moving to the next guard, it will cancel all guards in the queue.
Then, the [error page](docs/page-components.md) (as set by a [`GuardProvider`](/docs/guard-provider.md) or [`GuardedRoute`](/docs/guarded-route.md)) will display.

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

Guard functions don't advance until the `next` function is called.
This allows the logic inside of them to be asynchronous, hence the `async` keyword.

---

```js
const { name } = to.match.params;
```

In this line, we are destructuring the `to` route's match params to get the name of the pokemon.

The `to` and `from` arguments allow us to use the same props that the `Router` passes to the page component.
These include the following:

- [`history`](https://reacttraining.com/react-router/core/api/history)

- [`location`](https://reacttraining.com/react-router/core/api/location)

- [`match`](https://reacttraining.com/react-router/core/api/match)

---

```js
  try {
    const pokemon = await api.pokemon.get(name);
    next.props({ pokemon });
```

In these lines, we are calling an API function in order to get a pokemon with the route's name.
Then, we are using one of `next`'s three functionalities to pass the pokemon as a prop to the route.

For more information on the next function, check out the [`next` functions section](#next-functions).

---

```js
  } catch {
    throw new Error(`Pokemon "${name}" does not exist.`);
  }
```

In these final lines, we are catching any errors that come from the API call and throwing our own error.

For more information on error handling, check out the [error handling section](#error-handling).
