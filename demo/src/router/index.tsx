import React from 'react';
import PropTypes from 'prop-types';
import { Route, Router as BrowserRouter, Switch, RouteComponentProps } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import history from './history';
import { NotFound, List, Detail } from 'containers';
import { beforeRouteEnter as detailBeforeEnter } from 'containers/Detail';

interface Props {
  children(content: React.ReactElement, routeProps: RouteComponentProps): React.ReactElement;
}

const Router: React.FunctionComponent<Props> = ({ children }) => (
  <BrowserRouter history={history}>
    <GuardProvider loading={() => <h3>Loading...</h3>} error={NotFound}>
      <Route
        render={routeProps =>
          children(
            <Switch>
              <GuardedRoute path="/" exact component={List} />
              <GuardedRoute path="/:name" exact component={Detail} guards={[detailBeforeEnter]} />
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
