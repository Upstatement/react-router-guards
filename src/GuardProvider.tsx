import React, { useContext } from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import invariant from 'tiny-invariant';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { useGlobalGuards, usePrevious } from './hooks';
import { GuardProps } from './types';

const GuardProvider: React.FunctionComponent<GuardProps> = ({
  children,
  guards,
  ignoreGlobal,
  loading,
  error,
}) => {
  const routerContext = useContext(RouterContext);
  invariant(!!routerContext, 'You should not use <GuardProvider> outside a <Router>');

  const from = usePrevious(routerContext);
  const providerGuards = useGlobalGuards(guards, ignoreGlobal);

  const loadingPage = useContext(LoadingPageContext);
  const errorPage = useContext(ErrorPageContext);

  return (
    <GuardContext.Provider value={providerGuards}>
      <LoadingPageContext.Provider value={loading || loadingPage}>
        <ErrorPageContext.Provider value={error || errorPage}>
          <FromRouteContext.Provider value={from}>{children}</FromRouteContext.Provider>
        </ErrorPageContext.Provider>
      </LoadingPageContext.Provider>
    </GuardContext.Provider>
  );
};

GuardProvider.defaultProps = {
  guards: [],
  ignoreGlobal: false,
};

export default GuardProvider;
