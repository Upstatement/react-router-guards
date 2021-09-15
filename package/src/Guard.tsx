import React, { useContext, useRef, useState, useEffect } from 'react';
import { __RouterContext as RouterContext, RouteComponentProps, withRouter } from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import { ErrorPageContext, GuardContext, LoadingPageContext, FromRouteContext } from './contexts';
import renderPage from './renderPage';
import { GuardProps } from './types';
import { GuardStatus, resolveGuards } from './resolveGuards';

function usePreviousV2<T>(value: T, hasChanged: (from: T, to: T) => boolean) {
  const ref = useRef<{ target: T; previous: T | null }>({ target: value, previous: null });

  if (hasChanged(ref.current.target, value)) {
    // The value changed.
    ref.current.previous = ref.current.target;
    ref.current.target = value;
  }

  return ref.current.previous;
}

function hasRouteChanged(
  from: RouteComponentProps<Record<string, any>> | null,
  to: RouteComponentProps<Record<string, any>>,
) {
  return (
    !from ||
    to.match.path !== from.match.path ||
    Object.keys(to.match.params).some(key => to.match.params[key] !== from.match.params[key])
  );
}

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
  const routePrevProps = usePreviousV2(routeProps, (from, to) => {
    const hasChanged = hasRouteChanged(from, to);
    if (hasChanged) {
      // Determine the next guard status
      const nextStatus = getInitialStatus();
      // Update status for the *next* render
      setStatus(nextStatus);
      // Update status for the *current* render (based on the intention for the *next* render)
      status = nextStatus;
    }
    return hasChanged;
  });

  const fromRouteProps = useContext(FromRouteContext);
  async function onRouteChangeAsync(signal: AbortSignal): Promise<void> {
    try {
      // Resolve the guards to get the render status
      const status = await resolveGuards({
        guards: guards || [],
        toRoute: { ...routeProps, meta: meta || {} },
        fromRoute: fromRouteProps,
        signal,
      });
      // If the signal hasn't been aborted, set the new status!
      if (!signal.aborted) {
        setStatus(status);
      }
    } catch (error) {
      // Route has changed, wait until next function call..
    }
  }

  const abortControllerRef = useRef<AbortController | null>(null);
  useEffect(() => {
    if (hasRouteChanged(routePrevProps, routeProps)) {
      // Abort the previous validation when the route changes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Then start route's guard validation anew!
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      onRouteChangeAsync(abortController.signal);
    }
  }, [routeProps.match.path, routeProps.match.params]);

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
