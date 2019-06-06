# Guarded Route

The `GuardedRoute` component acts as a replacement for the default [`Route`](https://reacttraining.com/react-router/core/api/Route) component provided by React Router, allowing for routes to use guard middleware.

## API

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

It's important to note that guards set by the `GuardedRoute` will be added to the _end_ of the middleware chain set by its parent [`GuardedProvider`](/docs/guard-provider).

## App set-up

All `GuardedRoute`s must be wrapped by a [`GuardedProvider`](/docs/guard-provider) component.

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

## Metadata

In order to provide more information about a route, we've added a `meta` prop to the `GuardedRoute`.

The `meta` object can include anything! In our [basic demo](/README.md#basic), we used the `meta` object to determine which pages required auth.

You can access a route's metadata using `to.meta` in a guard function.
