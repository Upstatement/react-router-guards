import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import invariant from 'tiny-invariant';
import ContextWrapper from './ContextWrapper';
import Guard from './Guard';
import { ErrorPageContext, GuardContext, LoadingPageContext, RawErrorContext } from './contexts';
import { useGlobalGuards } from './hooks';
import { GuardedRouteProps, PageComponent } from './types';

const GuardedRoute: React.FunctionComponent<GuardedRouteProps> = ({
  children,
  component,
  error,
  rawError,
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
          <ContextWrapper<PageComponent> context={LoadingPageContext} value={loading}>
            <ContextWrapper<PageComponent> context={ErrorPageContext} value={error}>
              <ContextWrapper<boolean | null | undefined>
                context={RawErrorContext}
                value={rawError}>
                <Guard name={path} component={component} meta={meta} render={render}>
                  {children}
                </Guard>
              </ContextWrapper>
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
