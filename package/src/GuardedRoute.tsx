import React, { useContext } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import invariant from 'tiny-invariant';
import { Guard } from './Guard';
import { ErrorPageContext, GuardContext, LoadingPageContext } from './contexts';
import { useGlobalGuards } from './useGlobalGuards';
import { BaseGuardProps, Meta } from './types';

export interface GuardedRouteProps extends BaseGuardProps, RouteProps {
  meta?: Meta;
}

export const GuardedRoute: React.FunctionComponent<GuardedRouteProps> = ({
  children,
  component,
  error: errorPageOverride,
  guards,
  ignoreGlobal,
  loading: loadingPageOverride,
  meta,
  render,
  path,
  ...routeProps
}) => {
  const globalGuards = useContext(GuardContext);
  invariant(!!globalGuards, 'You should not use <GuardedRoute> outside a <GuardProvider>');

  const routeGuards = useGlobalGuards(guards, ignoreGlobal);

  const loadingPage = useContext(LoadingPageContext);
  const errorPage = useContext(ErrorPageContext);

  return (
    <Route path={path} {...routeProps}>
      <GuardContext.Provider value={routeGuards}>
        <LoadingPageContext.Provider
          value={typeof loadingPageOverride !== 'undefined' ? loadingPageOverride : loadingPage}>
          <ErrorPageContext.Provider
            value={typeof errorPageOverride !== 'undefined' ? errorPageOverride : errorPage}>
            <Guard path={path} meta={meta} component={component} render={render}>
              {children}
            </Guard>
          </ErrorPageContext.Provider>
        </LoadingPageContext.Provider>
      </GuardContext.Provider>
    </Route>
  );
};
