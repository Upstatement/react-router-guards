import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { GuardContext, LoadingPageContext, ErrorPageContext } from './constants';

const GuardProvider = ({ children, guards, loading, error }) => {
  const globalGuards = useContext(GuardContext);
  const loadingPage = useContext(LoadingPageContext);
  const errorPage = useContext(ErrorPageContext);

  return (
    <GuardContext.Provider value={[...globalGuards, ...guards]}>
      <LoadingPageContext.Provider value={loading || loadingPage}>
        <ErrorPageContext.Provider value={error || errorPage}>{children}</ErrorPageContext.Provider>
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
