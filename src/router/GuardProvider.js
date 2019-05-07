import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { __RouterContext as RouterContext } from 'react-router-dom';
import invariant from 'tiny-invariant';
import { usePrevious } from 'hooks';
import {
  ErrorPageContext,
  FromRouteContext,
  GuardContext,
  LoadingPageContext,
} from './constants';

const GuardProvider = ({ children, guards, loading, error }) => {
  const routerContext = useContext(RouterContext);
  invariant(routerContext, 'You should not use <GuardProvider> outside a <Router>');
  const from = usePrevious(routerContext);

  const globalGuards = useContext(GuardContext);
  const loadingPage = useContext(LoadingPageContext);
  const errorPage = useContext(ErrorPageContext);

  return (
    <GuardContext.Provider value={[...(globalGuards || []), ...guards]}>
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

GuardProvider.propTypes = {
  children: PropTypes.node,
  guards: PropTypes.arrayOf(PropTypes.func),
  loading: PropTypes.func,
  error: PropTypes.func,
};

export default GuardProvider;
