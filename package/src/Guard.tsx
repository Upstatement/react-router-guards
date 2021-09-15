import React, { useContext, useRef, useState } from 'react';
import { __RouterContext as RouterContext, RouteComponentProps, withRouter } from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import { ErrorPageContext, GuardContext, LoadingPageContext, FromRouteContext } from './contexts';
import renderPage from './renderPage';
import { GuardProps } from './types';
import { GuardStatus, resolveGuards } from './resolveGuards';
import { useRouteChangeEffect } from './hooks/useRouteChangeEffect';

const Guard: React.FunctionComponent<GuardProps & RouteComponentProps<Record<string, any>>> = ({
  children,
  component,
  meta,
  render,
  history,
  location,
  match,
}) => {
  const LoadingPage = useContext(LoadingPageContext);
  const ErrorPage = useContext(ErrorPageContext);

  const guards = useContext(GuardContext);
  const hasGuards = !!guards && guards.length > 0;

  function getInitialStatus(): GuardStatus {
    if (hasGuards) {
      return { type: 'resolving' };
    } else {
      return { type: 'render', props: {} };
    }
  }

  // Create an immutable status state that React will track
  const [immutableStatus, setStatus] = useState<GuardStatus>(getInitialStatus);
  // Create a mutable status variable that we can change for the *current* render
  let status = immutableStatus;

  const routeProps = { history, location, match };
  const fromRouteProps = useContext(FromRouteContext);

  const abortControllerRef = useRef<AbortController | null>(null);
  useRouteChangeEffect(routeProps, async () => {
    // Abort the previous validation when the route changes
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Determine the initial guard status for the new route
    const nextStatus = getInitialStatus();
    // Update status for the *next* render
    setStatus(nextStatus); // TODO: prevent setState on unmount
    // Update status for the *current* render (based on the intention for the *next* render)
    status = nextStatus;

    // Then start route's guard validation anew!
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    try {
      // Resolve the guards to get the render status
      const status = await resolveGuards({
        guards: guards || [],
        toRoute: { ...routeProps, meta: meta || {} },
        fromRoute: fromRouteProps,
        signal: abortController.signal,
      });
      // If the signal hasn't been aborted, set the new status!
      if (!abortController.signal.aborted) {
        setStatus(status); // TODO: prevent setState on unmount
      }
    } catch (error) {
      // Route has changed, wait until next function call..
    }
  });

  switch (status.type) {
    case 'redirect': {
      return <Redirect to={status.redirect} />;
    }
    case 'render': {
      return (
        <RouterContext.Provider value={{ ...routeProps, ...status.props }}>
          <GuardContext.Provider value={[]}>
            <Route component={component} render={render}>
              {children}
            </Route>
          </GuardContext.Provider>
        </RouterContext.Provider>
      );
    }
    case 'error': {
      return renderPage(ErrorPage, { ...routeProps, error: status.error });
    }
    case 'resolving':
    default: {
      return renderPage(LoadingPage, routeProps);
    }
  }
};

export default withRouter(Guard);
