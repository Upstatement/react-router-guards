import React, { useContext } from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import invariant from 'tiny-invariant';
import {
  ErrorPageContext,
  FromRouteContext,
  GuardContext,
  LoadingPageContext,
  RawErrorContext,
} from './contexts';
import { useGlobalGuards, usePrevious } from './hooks';
import { GuardProviderProps } from './types';

const GuardProvider: React.FunctionComponent<GuardProviderProps> = ({
  children,
  guards,
  ignoreGlobal,
  loading,
  error,
  rawError,
}) => {
  const routerContext = useContext(RouterContext);
  invariant(!!routerContext, 'You should not use <GuardProvider> outside a <Router>');

  const from = usePrevious(routerContext);
  const providerGuards = useGlobalGuards(guards, ignoreGlobal);

  const loadingPage = useContext(LoadingPageContext);
  const errorPage = useContext(ErrorPageContext);
  const useRawErrors = useContext(RawErrorContext);

  return (
    <GuardContext.Provider value={providerGuards}>
      <LoadingPageContext.Provider value={loading || loadingPage}>
        <ErrorPageContext.Provider value={error || errorPage}>
          <RawErrorContext.Provider value={rawError || useRawErrors}>
            <FromRouteContext.Provider value={from}>{children}</FromRouteContext.Provider>
          </RawErrorContext.Provider>
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
