import * as React from 'react';
import { Fragment } from 'react';

interface Props<T> {
  context: React.Context<T>;
  value: T;
}

function ContextWrapper<T>({ children, context, value }: React.PropsWithChildren<Props<T>>) {
  if (!!value) {
    const { Provider } = context;
    return <Provider value={value}>{children}</Provider>;
  }
  return <Fragment>{children}</Fragment>;
}

export default ContextWrapper;
