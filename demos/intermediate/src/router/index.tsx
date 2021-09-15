import React from 'react';
import { Router as BrowserRouter, Switch } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { Detail, List, Loading, NotFound } from 'containers';
import { beforeRouteEnter as detailBeforeEnter } from 'containers/Detail';
import history from './history';
import { waitOneSecond } from './guards';

interface Props {
  children(content: React.ReactElement): React.ReactElement;
}

const Router: React.FunctionComponent<Props> = ({ children }) => (
  <BrowserRouter history={history}>
    <GuardProvider loading={Loading} error={NotFound}>
      {children(
        <Switch>
          <GuardedRoute path="/" exact component={List} />
          <GuardedRoute
            path="/:name"
            component={Detail}
            guards={[detailBeforeEnter, waitOneSecond]}
          />
          <GuardedRoute path="*" component={NotFound} />
        </Switch>,
      )}
    </GuardProvider>
  </BrowserRouter>
);

export default Router;
