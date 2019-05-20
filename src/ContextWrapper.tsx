import * as React from 'react';

interface Props<T> {
  context: React.Context<T>;
  value: T;
}

function ContextWrapper<T>({
  children,
  context,
  value,
}: React.PropsWithChildren<Props<T>>): React.ReactElement {
  if (value) {
    const { Provider } = context;
    return <Provider value={value}>{children}</Provider>;
  }
  return <React.Fragment>{children}</React.Fragment>;
}

export default ContextWrapper;
