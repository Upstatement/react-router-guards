import React from 'react';
import PropTypes from 'prop-types';
import { Router as BrowserRouter, Route, Switch } from 'react-router-dom';
import history from './history';
import routes from './routes';
import { NotFound } from 'containers';
import GuardProvider from './GuardProvider';
import GuardedRoute from './GuardedRoute';

const guard = async (to, from, next) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  next({
    hello: 'world',
  });
};

const Router = ({ children }) => (
  <BrowserRouter history={history}>
    <GuardProvider guards={[guard]} loading={() => <p>Loading...</p>} error={NotFound}>
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
    </GuardProvider>
  </BrowserRouter>
);

Router.propTypes = {
  children: PropTypes.func.isRequired,
};

export default Router;
