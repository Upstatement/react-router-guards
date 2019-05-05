import React from 'react';
import PropTypes from 'prop-types';
import { Router as BrowserRouter, Route, Switch } from 'react-router-dom';
import history from './history';
import routes from './routes';
import { NotFound } from 'containers';
import GuardProvider from './GuardProvider';
import GuardedRoute from './GuardedRoute';
import { GUARD_TYPES } from './constants';

const guard = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    type: GUARD_TYPES.ADD_PROPS,
    payload: { hello: 'world' },
  };
};

const Router = ({ children }) => (
  <GuardProvider guards={[guard]} loading={() => <p>Loading...</p>} error={NotFound}>
    <BrowserRouter history={history}>
      <Route
        render={({ location }) =>
          children(
            <Switch>
              {routes().map(
                ({ beforeEnter, component, error, exact, loading, path, render }, i) => (
                  <GuardedRoute
                    key={i}
                    beforeEnter={beforeEnter}
                    component={component}
                    error={error}
                    exact={exact}
                    path={path}
                    loading={loading}
                    render={render}
                  />
                ),
              )}
            </Switch>,
            location,
          )
        }
      />
    </BrowserRouter>
  </GuardProvider>
);

Router.propTypes = {
  children: PropTypes.func.isRequired,
};

export default Router;
