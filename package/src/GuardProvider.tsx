import React, { useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { useGlobalGuards } from './useGlobalGuards';
import { BaseGuardProps } from './types';
import { useRouteChangeEffect } from './useRouteChangeEffect';

export type GuardProviderProps = BaseGuardProps;

export const GuardProvider = withRouter<GuardProviderProps & RouteComponentProps>(
  function GuardProviderWithRouter({
    // Guard provider props
    children,
    guards,
    ignoreGlobal,
    loading: loadingPageOverride,
    error: errorPageOverride,
    // Route component props
    history,
    location,
    match,
    staticContext,
  }) {
    const routeProps = { history, location, match, staticContext };
    const fromRouteProps = useRouteChangeEffect(routeProps, () => {});
    const parentFromRouteProps = useContext(FromRouteContext);

    const providerGuards = useGlobalGuards(guards, ignoreGlobal);

    const loadingPage = useContext(LoadingPageContext);
    const errorPage = useContext(ErrorPageContext);

    return (
      <GuardContext.Provider value={providerGuards}>
        <LoadingPageContext.Provider
          value={typeof loadingPageOverride !== 'undefined' ? loadingPageOverride : loadingPage}>
          <ErrorPageContext.Provider
            value={typeof errorPageOverride !== 'undefined' ? errorPageOverride : errorPage}>
            {/**
             * Prioritize the parent FromRoute props over the child (which uses the closest Route's match)
             * https://reactrouter.com/web/api/withRouter
             */}
            <FromRouteContext.Provider value={parentFromRouteProps || fromRouteProps}>
              {children}
            </FromRouteContext.Provider>
          </ErrorPageContext.Provider>
        </LoadingPageContext.Provider>
      </GuardContext.Provider>
    );
  },
);
