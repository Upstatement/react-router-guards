import React, { useContext, useRef, useState, useEffect, Fragment, createElement } from 'react';
import {
  __RouterContext as RouterContext,
  RouteComponentProps,
  withRouter,
  RouteProps,
} from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import { ErrorPageContext, GuardContext, LoadingPageContext, FromRouteContext } from './contexts';
import { GuardStatus, resolveGuards } from './resolveGuards';
import { useRouteChangeEffect } from './useRouteChangeEffect';
import { Meta, Page, PageComponentType } from './types';

/**
 * Type checks whether the given page is a React component type.
 *
 * @param page the page to type check
 */
function isPageComponentType<P>(page: Page<P>): page is PageComponentType<P> {
  return (
    !!page && typeof page !== 'string' && typeof page !== 'boolean' && typeof page !== 'number'
  );
}

export interface GuardProps extends RouteProps {
  meta?: Meta;
}

export const Guard = withRouter<GuardProps & RouteComponentProps>(function GuardWithRouter({
  children,
  component,
  meta,
  render,
  history,
  location,
  match,
}) {
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

  const loadingPage = useContext(LoadingPageContext);
  const errorPage = useContext(ErrorPageContext);

  switch (status.type) {
    case 'redirect': {
      return <Redirect to={status.redirect} />;
    }

    case 'render': {
      return (
        <RouterContext.Provider
          value={{
            ...routeProps,
            // Add resolved guard props to context in order to pass to route child component
            // https://github.com/remix-run/react-router/blob/main/packages/react-router/modules/Route.js#L54-L74
            ...status.props,
          }}>
          <GuardContext.Provider value={[]}>
            <Route component={component} render={render}>
              {children}
            </Route>
          </GuardContext.Provider>
        </RouterContext.Provider>
      );
    }

    case 'error': {
      if (isPageComponentType(errorPage)) {
        return createElement(errorPage, { ...routeProps, error: status.error });
      }
      return <Fragment>{errorPage}</Fragment>;
    }

    case 'resolving':
    default: {
      if (isPageComponentType(loadingPage)) {
        return createElement(loadingPage, routeProps);
      }
      return <Fragment>{loadingPage}</Fragment>;
    }
  }
});
