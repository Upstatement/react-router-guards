import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Route, Router as BrowserRouter, Switch } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import history from './history';
import getRoutes from './routes';
import { waitOneSecond } from './guards';
import { NotFound } from 'containers';

const Router = ({ children }) => {
  const globalGuards = useMemo(() => [waitOneSecond], []);
  const routes = useMemo(() => getRoutes(), []);
  return (
    <BrowserRouter history={history}>
      <GuardProvider guards={globalGuards} loading={() => <p>Loading...</p>} error={NotFound}>
        <Route
          render={routeProps =>
            children(
              <Switch>
                {routes.map(
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
              routeProps,
            )
          }
        />
      </GuardProvider>
    </BrowserRouter>
  );
};

Router.propTypes = {
  children: PropTypes.func.isRequired,
};

export default Router;
