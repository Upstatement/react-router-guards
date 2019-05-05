import React from 'react';
import PropTypes from 'prop-types';
import { GuardContext, LoadingPageContext, ErrorPageContext } from './constants';

const GuardProvider = ({ children, guards, loading, error }) => (
  <GuardContext.Provider value={guards}>
    <LoadingPageContext.Provider value={loading}>
      <ErrorPageContext.Provider value={error}>{children}</ErrorPageContext.Provider>
    </LoadingPageContext.Provider>
  </GuardContext.Provider>
);

GuardProvider.defaultProps = {
  guards: [],
  loading: () => null,
  error: () => null,
};

GuardProvider.propTypes = {
  children: PropTypes.node,
  guards: PropTypes.arrayOf(PropTypes.func),
  loading: PropTypes.func,
  error: PropTypes.func,
};

export default GuardProvider;
