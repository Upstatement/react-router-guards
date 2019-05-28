import React from 'react';
import PropTypes from 'prop-types';
import { Route, Router as BrowserRouter, Switch, RouteComponentProps } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { Detail, List, Loading, NotFound } from 'containers';
import { beforeRouteEnter as detailBeforeEnter } from 'containers/Detail';
import { waitOneSecond } from './guards';
import history from './history';

interface Props {
  children(content: React.ReactElement, routeProps: RouteComponentProps): React.ReactElement;
}

const Router: React.FunctionComponent<Props> = ({ children }) => (
  <BrowserRouter history={history}>
    <GuardProvider loading={Loading} error={NotFound}>
      <Route
        render={routeProps =>
          children(
            <Switch>
              <GuardedRoute path="/" exact component={List} />
              <GuardedRoute
                path="/:name"
                exact
                component={Detail}
                guards={[waitOneSecond, detailBeforeEnter]}
              />
              <GuardedRoute path="*" component={NotFound} />
            </Switch>,
            routeProps,
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
