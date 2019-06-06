# Page components

Page components are used for setting loading and error pages.

## API

```ts
type PageComponent = React.Component | string | boolean | number | null | undefined;
```

## Loading page

Loading pages are React components that are displayed while guard middleware is resolving.

They can be set either:

- _globally_ as the `loading` prop of a [`GuardProvider`](/docs/guard-provider)

- _individually_ as the `loading` prop of a [`GuardedRoute`](/docs/guarded-route)

## Error page

Error pages are React components that are displayed when guard logic fails.

They can be set either:

- _globally_ as the `error` prop of a [`GuardProvider`](/docs/guard-provider)

- _individually_ as the `error` prop of a [`GuardedRoute`](/docs/guarded-route)

Typically, error pages will be the same component as a Not Found or 404 page.

_**Note:** If using a React component for your error page, it can receive the error message thrown by a guard function via an `error` prop._
