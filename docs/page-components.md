# Page components

Page components are used for setting loading and error pages.

- [API](#api)
- [Loading page](#loading-page)
- [Error page](#error-page)
- [Examples](#examples)

## API

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

## Examples

With strings:

```tsx
import { GuardProvider } from 'react-router-guards';

<GuardProvider loading="Loading..." error="Not found." />;
```

With React components:

```tsx
import {
  ErrorPageComponentType,
  GuardProvider,
  LoadingPageComponentType,
} from 'react-router-guards';

const NotFound: ErrorPageComponentType = ({ error }) => (
  <div>
    <h1>Not found.</h1>
    {error && <p>{error}</p>}
  </div>
);

const Loading: LoadingPageComponentType = () => (
  <div>
    <div id="loader" />
  </div>
);

// ...

<GuardProvider loading={Loading} error={NotFound} />;
```
