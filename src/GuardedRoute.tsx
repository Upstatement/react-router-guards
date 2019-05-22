import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import invariant from 'tiny-invariant';
import ContextWrapper from './ContextWrapper';
import Guard from './Guard';
import { ErrorPageContext, GuardContext, LoadingPageContext } from './contexts';
import { useGlobalGuards } from './hooks';
import { GuardedRouteProps, PageComponent } from './types';

const GuardedRoute: React.FunctionComponent<GuardedRouteProps> = ({
  children,
  component,
  error,
  guards,
  ignoreGlobal,
  loading,
  render,
  ...routeProps
}) => {
  const globalGuards = useContext(GuardContext);
  invariant(!!globalGuards, 'You should not use <GuardedRoute> outside a <GuardProvider>');

  const routeGuards = useGlobalGuards(guards, ignoreGlobal);

  return (
    <Route
      {...routeProps}
      render={() => (
        <GuardContext.Provider value={routeGuards}>
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

GuardedRoute.defaultProps = {
  guards: [],
  ignoreGlobal: false,
};

export default GuardedRoute;
