import { useRef } from 'react';
import { RouteComponentProps } from 'react-router';

export function getHasRouteChanged(
  from: RouteComponentProps<Record<string, any>>,
  to: RouteComponentProps<Record<string, any>>,
) {
  // Perform shallow string comparison to check that path hasn't changed
  const doPathsMatch = to.match.path === from.match.path;
  if (!doPathsMatch) {
    return true;
  }

  // Perform deep object comparison to check that params haven't changed
  const doParamsMatch = Object.keys(to.match.params).every(
    key => to.match.params[key] === from.match.params[key],
  );
  if (!doParamsMatch) {
    return true;
  }

  // If neither path nor params have changed, then route has stayed the same!
  return false;
}

export function useRouteChangeEffect(
  value: RouteComponentProps<Record<string, any>>,
  onChange: () => void,
): RouteComponentProps<Record<string, any>> | null {
  // Store whether effect has init before in ref
  const hasInitRef = useRef(false);

  // Store the current and previous values of variable in ref
  const valuesRef = useRef<{
    target: RouteComponentProps<Record<string, any>>;
    previous: RouteComponentProps<Record<string, any>> | null;
  }>({ target: value, previous: null });

  if (getHasRouteChanged(valuesRef.current.target, value)) {
    // When the route changes, update previous + target values
    valuesRef.current.previous = valuesRef.current.target;
    valuesRef.current.target = value;
    onChange();
  } else if (!hasInitRef.current) {
    // Otherwise if the effect hasn't run before, run it now!
    onChange();
  }

  // Always set hasInit to true (to prevent duplicate runs)
  hasInitRef.current = true;

  // Then return the previous route (if any)
  return valuesRef.current.previous;
}
