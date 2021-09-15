import React, { useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { useGlobalGuards, usePrevious } from './hooks';
import { GuardProviderProps } from './types';

const GuardProvider: React.FunctionComponent<
  GuardProviderProps & RouteComponentProps<Record<string, any>>
> = ({ children, guards, ignoreGlobal, loading, error, history, location, match }) => {
  const routeProps: RouteComponentProps = { history, location, match };
  const fromRouteProps = usePrevious(routeProps);

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
};

export default withRouter(GuardProvider);
