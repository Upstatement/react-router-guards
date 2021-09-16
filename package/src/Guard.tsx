import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  __RouterContext as RouterContext,
  RouteComponentProps,
  withRouter,
  RouteProps,
} from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import { ErrorPageContext, GuardContext, LoadingPageContext, FromRouteContext } from './contexts';
import { renderPage } from './renderPage';
import { GuardStatus, resolveGuards } from './resolveGuards';
import { useRouteChangeEffect } from './hooks/useRouteChangeEffect';
import { Meta } from './types';

export interface GuardProps extends RouteProps {
  meta?: Meta;
  name?: RouteProps['path'];
}

export const Guard = withRouter<GuardProps & RouteComponentProps<Record<string, any>>>(
  function GuardWithRouter({ children, component, meta, render, history, location, match }) {
    // Track whether the component is mounted to prevent setting state after unmount
    const isMountedRef = useRef(true);
    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    const guards = useContext(GuardContext);
    function getInitialStatus(): GuardStatus {
      // If there are no guards in context, the route should immediately render
      if (!guards || guards.length === 0) {
        return { type: 'render', props: {} };
      }
      // Otherwise, the component should start resolving
      return { type: 'resolving' };
    }
    // Create an immutable status state that React will track
    const [immutableStatus, setStatus] = useState<GuardStatus>(getInitialStatus);
    // Create a mutable status variable that we can change for the *current* render
    let status = immutableStatus;

    const routeProps = { history, location, match };
    const fromRouteProps = useContext(FromRouteContext);
    const routeChangeAbortControllerRef = useRef<AbortController | null>(null);
    useRouteChangeEffect(routeProps, async () => {
      // Abort the guard resolution from the previous route
      if (routeChangeAbortControllerRef.current) {
        routeChangeAbortControllerRef.current.abort();
        routeChangeAbortControllerRef.current = null;
      }

      // Determine the initial guard status for the new route
      const nextStatus = getInitialStatus();
      // Update status for the *next* render
      if (isMountedRef.current) {
        setStatus(nextStatus);
      }
      // Update status for the *current* render (based on the intention for the *next* render)
      status = nextStatus;

      // If the next status is to resolve guards, do so!
      if (status.type === 'resolving') {
        const abortController = new AbortController();
        routeChangeAbortControllerRef.current = abortController;
        try {
          // Resolve the guards to get the render status
          const status = await resolveGuards(guards || [], {
            to: { ...routeProps, meta: meta || {} },
            from: fromRouteProps,
            signal: abortController.signal,
          });
          // If the signal hasn't been aborted, set the new status!
          if (isMountedRef.current && !abortController.signal.aborted) {
            setStatus(status);
          }
        } catch (error) {
          // Route has changed, wait until the effect runs again...
        }
      }
    });

    const LoadingPage = useContext(LoadingPageContext);
    const ErrorPage = useContext(ErrorPageContext);

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
  },
);
