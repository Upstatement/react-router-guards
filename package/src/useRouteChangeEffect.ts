import { useRef } from 'react';
import { RouteComponentProps } from 'react-router';

/**
 * Compares the matched route's path and params to check whether the
 * route has changed.
 *
 * @param routeA a route to compare
 * @param routeB a route to compare
 * @returns whether the route has changed
 */
export function getHasRouteChanged(
  routeA: RouteComponentProps<Record<string, any>>,
  routeB: RouteComponentProps<Record<string, any>>,
) {
  // Perform shallow string comparison to check that path hasn't changed
  const doPathsMatch = routeA.match.path === routeB.match.path;
  if (!doPathsMatch) {
    return true;
  }

  // Perform deep object comparison to check that params haven't changed
  // NOTE: the param keys won't change so long as path doesn't change (which is already checked above)
  const doParamsMatch = Object.keys(routeA.match.params).every(
    key => routeA.match.params[key] === routeB.match.params[key],
  );
  if (!doParamsMatch) {
    return true;
  }

  // If neither path nor params have changed, then route has stayed the same!
  return false;
}

/**
 * Custom effect hook that runs on init and whenever the route changes.
 *
 * This hook runs inline with React's render function to ensure state is updated
 * immediately for the upcoming render. This is preferable to `useEffect` or
 * `useLayoutEffect` which only updates state _after_ a component has already rendered.
 *
 * @param route the current route
 * @param onInitOrChange a callback for when the route changes (and on init)
 * @returns the previous route (if any)
 */
export function useRouteChangeEffect(
  route: RouteComponentProps,
  onInitOrChange: () => void,
): RouteComponentProps | null {
  // Store whether effect has run before in ref
  const hasEffectRunRef = useRef(false);

  // Store the current and previous values of route in ref
  // https://dev.to/chrismilson/problems-with-useprevious-me
  const routeStoreRef = useRef<{
    target: RouteComponentProps;
    previous: RouteComponentProps | null;
  }>({
    target: route,
    previous: null,
  });

  if (getHasRouteChanged(routeStoreRef.current.target, route)) {
    // When the route changes, update previous + target values and run the effect
    routeStoreRef.current.previous = routeStoreRef.current.target;
    routeStoreRef.current.target = route;
    onInitOrChange();
  } else if (!hasEffectRunRef.current) {
    // Otherwise if the effect hasn't run before, run it now!
    onInitOrChange();
  }

  // Always set hasEffectRun to true (to prevent duplicate runs)
  hasEffectRunRef.current = true;

  // Then return the previous route (if any)
  return routeStoreRef.current.previous;
}
