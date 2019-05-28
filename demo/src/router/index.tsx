import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Route, Router as BrowserRouter, Switch, RouteComponentProps } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { NotFound } from 'containers';
import history from './history';
import getRoutes from './routes';
import { requireLogin, waitOneSecond } from './guards';

interface Props {
  children(content: React.ReactElement, routeProps: RouteComponentProps): React.ReactElement;
}

const Router: React.FunctionComponent<Props> = ({ children }) => {
  const globalGuards = useMemo(() => [requireLogin, waitOneSecond], []);
  const routes = useMemo(() => getRoutes(), []);
  return (
    <BrowserRouter history={history}>
      <GuardProvider guards={globalGuards} loading={() => <h3>Loading...</h3>} error={NotFound}>
        <Route
          render={routeProps =>
            children(
              <Switch>
                {routes.map(({ component, error, exact, ignoreGlobal, loading, meta, path }, i) => (
                  <GuardedRoute
                    key={i}
                    component={component}
                    error={error}
                    exact={exact}
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
