# Guarded Route

The `GuardedRoute` component acts as a replacement for the default [`Route`](https://reacttraining.com/react-router/core/api/Route) component provided by React Router, allowing for routes to use guard middleware.

- [API](#api)
- [App set-up](#app-set-up)
- [Metadata](#metadata)

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

The following table explains the guard-specific props for this component.

| Prop           | Optional | Description                                                 | Notes                                                                                                                                                                           |
| -------------- | :------: | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `guards`       |    ✅    | the guards to set for this route                            | It's important to note that guards set by the `GuardedRoute` will be added to the _end_ of the middleware queue set by its parent [`GuardedProvider`](/docs/guard-provider.md). |
| `ignoreGlobal` |    ✅    | whether to ignore guards set by parent `GuardedProvider`s   |                                                                                                                                                                                 |
| `loading`      |    ✅    | the [loading page](/docs/page-components.md) for this route | Overrides the global loading page, if value provided.                                                                                                                           |
| `error`        |    ✅    | the [error page](/docs/page-components.md) for this route   | Overrides the global error page, if value provided.                                                                                                                             |
| `meta`         |    ✅    | an object of data about this route                          | See [metadata](#metadata).                                                                                                                                                      |

_For more information about the props of a regular Route component, see [this guide](https://reacttraining.com/react-router/core/api/Route/route-props)._

## App set-up

All `GuardedRoute`s must be wrapped by a [`GuardedProvider`](/docs/guard-provider.md) component.

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

The `meta` object can include anything! In our [basic demo](/demos/basic/src/router/routes.js), we used the `meta` object to determine which pages required auth.

You can access a route's metadata using `to.meta` in a guard function.
