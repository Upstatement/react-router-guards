import * as React from 'react';
import { FC, useContext } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import invariant from 'tiny-invariant';
import ContextWrapper from './ContextWrapper';
import Guard from './Guard';
import { ErrorPageContext, GuardContext, LoadingPageContext } from './contexts';
import { PageComponent, GuardFunction } from './types';

interface Props extends RouteProps {
  beforeEnter?: GuardFunction;
  error?: PageComponent;
  loading?: PageComponent;
}

const GuardedRoute: FC<Props> = ({
  beforeEnter,
  children,
  component,
  error,
  loading,
  render,
  ...routeProps
}) => {
  const globalGuards = useContext(GuardContext);
  invariant(!!globalGuards, 'You should not use <GuardedRoute> outside a <GuardProvider>');

  const guards = [...(globalGuards || [])];
  if (beforeEnter) {
    guards.push(beforeEnter);
  }

  return (
    <Route
      {...routeProps}
      render={() => (
        <GuardContext.Provider value={guards}>
          <ContextWrapper<PageComponent> context={LoadingPageContext} value={loading}>
            <ContextWrapper<PageComponent> context={ErrorPageContext} value={error}>
              <Guard component={component} render={render}>
                {children}
              </Guard>
            </ContextWrapper>
          </ContextWrapper>
        </GuardContext.Provider>
      )}
    />
  );
};

export default GuardedRoute;
