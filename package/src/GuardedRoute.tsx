import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import invariant from 'tiny-invariant';
import ContextWrapper from './ContextWrapper';
import Guard from './Guard';
import { ErrorPageContext, GuardContext, LoadingPageContext } from './contexts';
import { useGlobalGuards } from './hooks';
import { GuardedRouteProps, LoadingPageComponent, ErrorPageComponent } from './types';

const GuardedRoute: React.FunctionComponent<GuardedRouteProps> = ({
  children,
  component,
  error,
  guards,
  ignoreGlobal,
  loading,
  meta,
  render,
  path,
  ...routeProps
}) => {
  const globalGuards = useContext(GuardContext);
  invariant(!!globalGuards, 'You should not use <GuardedRoute> outside a <GuardProvider>');

  const routeGuards = useGlobalGuards(guards, ignoreGlobal);

  return (
    <Route
      path={path}
      {...routeProps}
      render={() => (
        <GuardContext.Provider value={routeGuards}>
          <ContextWrapper<LoadingPageComponent> context={LoadingPageContext} value={loading}>
            <ContextWrapper<ErrorPageComponent> context={ErrorPageContext} value={error}>
              <Guard name={path} component={component} meta={meta} render={render}>
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
