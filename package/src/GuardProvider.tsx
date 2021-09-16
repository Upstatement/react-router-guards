import React, { useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { useGlobalGuards } from './hooks/useGlobalGuards';
import { BaseGuardProps } from './types';
import { useRouteChangeEffect } from './hooks/useRouteChangeEffect';

export type GuardProviderProps = BaseGuardProps;

export const GuardProvider = withRouter<
  GuardProviderProps & RouteComponentProps<Record<string, any>>
>(function GuardProviderWithRouter({
  children,
  guards,
  ignoreGlobal,
  loading,
  error,
  history,
  location,
  match,
}) {
  const routeProps = { history, location, match };
  const fromRouteProps = useRouteChangeEffect(routeProps, () => {});

  const providerGuards = useGlobalGuards(guards, ignoreGlobal);

  const loadingPage = useContext(LoadingPageContext);
  const errorPage = useContext(ErrorPageContext);

  return (
    <GuardContext.Provider value={providerGuards}>
      <LoadingPageContext.Provider value={loading || loadingPage}>
        <ErrorPageContext.Provider value={error || errorPage}>
          <FromRouteContext.Provider value={fromRouteProps}>{children}</FromRouteContext.Provider>
        </ErrorPageContext.Provider>
      </LoadingPageContext.Provider>
    </GuardContext.Provider>
  );
});
