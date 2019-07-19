import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Router as BrowserRouter, Route, Switch } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from '@upstatement/react-router-guards/dist';
import { NotFound } from 'containers';
import { requireLogin, waitOneSecond } from './guards';
import history from './history';
import getRoutes from './routes';

const GLOBAL_GUARDS = [requireLogin, waitOneSecond];

const Router = ({ children }) => {
  const routes = useMemo(() => getRoutes(), []);
  return (
    <BrowserRouter history={history}>
      <GuardProvider guards={GLOBAL_GUARDS} loading="Loading..." error={NotFound}>
        <Route
          render={routeProps =>
            children(
              <Switch>
                {routes.map(({ component, error, exact, ignoreGlobal, loading, meta, path }, i) => (
                  <GuardedRoute
                    key={i}
                    component={component}
                    exact={exact}
                    error={error}
                    ignoreGlobal={ignoreGlobal}
                    loading={loading}
                    meta={meta}
                    path={path}
                  />
                ))}
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
