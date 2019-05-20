import * as React from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import invariant from 'tiny-invariant';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { usePrevious } from './hooks';
import { GuardFunction, PageComponent } from './types';

interface Props {
  guards: GuardFunction[];
  loading: PageComponent;
  error: PageComponent;
}

const GuardProvider: React.FunctionComponent<Props> = ({
  children,
  guards,
  loading,
  error,
}): React.ReactElement => {
  const routerContext = React.useContext(RouterContext);
  invariant(!!routerContext, 'You should not use <GuardProvider> outside a <Router>');
  const from = usePrevious(routerContext);

  const globalGuards = React.useContext(GuardContext);
  const providerGuards: GuardFunction[] = [...(globalGuards || []), ...guards];

  const loadingPage = React.useContext(LoadingPageContext);
  const errorPage = React.useContext(ErrorPageContext);

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
