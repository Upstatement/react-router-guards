# Page components

Page components are used for setting loading and error pages.

- [API](#api)
- [Loading page](#loading-page)
- [Error page](#error-page)
- [Examples](#examples)

## API

```ts
type PageComponent = React.Component | string | boolean | number | null | undefined;
```

## Loading page

Loading pages are React components that are displayed while guard middleware is resolving.

The default loading page is `null`.

They can be set either:

- _globally_ as the `loading` prop of a [`GuardProvider`](/docs/guard-provider.md)

- _individually_ as the `loading` prop of a [`GuardedRoute`](/docs/guarded-route.md)

## Error page

Error pages are React components that are displayed when guard logic fails.

The default error page is `null`.

They can be set either:

- _globally_ as the `error` prop of a [`GuardProvider`](/docs/guard-provider.md)

- _individually_ as the `error` prop of a [`GuardedRoute`](/docs/guarded-route.md)

Typically, error pages will be the same component as a Not Found or 404 page.

_**Note:** If using a React component for your error page, it can receive the error message thrown by a guard function via an `error` prop._

## Raw errors

By default, only the `message` property of the error thrown by a guard is sent to the Error page (or if no `message` property is available, the string `"Not found."`).

If you want the exact value thrown by your guards available on the `error` prop for your Error page you can set the `rawError` prop to `true`.

It can be set either:

- _globally_ as the `rawError` prop of a [`GuardProvider`](/docs/guard-provider.md)

- _individually_ as the `rawError` prop of a [`GuardedRoute`](/docs/guarded-route.md)

## Examples

With strings:

```jsx
<GuardProvider loading="Loading..." error="Not found." />
```

With React components:

```jsx
const NotFound = ({ error }) => (
  <div>
    <h1>Not found.</h1>
    <p>{error}</p>
  </div>
);

const Loading = () => (
  <div>
    <div id="loader" />
  </div>
);

<GuardProvider loading={Loading} error={NotFound} />;
```
