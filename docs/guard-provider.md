# Guard Provider

The `GuardProvider` component is a high-level wrapper for your entire routing solution.

## API

The `GuardProvider` provides an API for declaring global guards and loading and error pages that can be used by any [`GuardedRoute`](/docs/guarded-route.md) within its scope:

```ts
interface GuardProviderProps {
  guards?: GuardFunction[];
  ignoreGlobal?: boolean;
  loading?: PageComponent;
  error?: PageComponent;
}
```

## App set-up

All `GuardProvider`s _must_ be wrapped by a [`Router` component](https://reacttraining.com/react-router/core/api/Router).

```jsx
const App = () => (
  <Router>
    <GuardProvider guards={guards} loading={Loading} error={NotFound}>
      <GuardedRoute path="/" exact component={Home} />
    </GuardProvider>
  </Router>
);
```

## Nesting guard providers

Nesting guard providers is useful in case where you may only want a certain subset of routes to have the same guards, loading page, and/or error page.

By nesting guard providers, you can either chain functionality or override that of its parent(s):

| Prop      | Result                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `guards`  | Overridden if `ignoreGlobal` is `true`; otherwise, guards are appended to the _end_ of the middleware chain. |
| `loading` | Overridden, if value provided.                                                                               |
| `error`   | Overridden, if value provided.                                                                               |
