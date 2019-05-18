import * as React from 'react';
import { FC, useContext } from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import invariant from 'tiny-invariant';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { usePrevious } from './hooks';
import { PageComponent, GuardFunction } from './types';

interface Props {
  guards: GuardFunction[];
  loading: PageComponent;
  error: PageComponent;
}

const GuardProvider: FC<Props> = ({ children, guards, loading, error }) => {
  const routerContext = useContext(RouterContext);
  invariant(!!routerContext, 'You should not use <GuardProvider> outside a <Router>');
  const from = usePrevious(routerContext);

  const globalGuards = useContext(GuardContext);
  const providerGuards: GuardFunction[] = [...(globalGuards || []), ...guards];

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
};

export default GuardProvider;
