import {
  GuardFunction,
  GuardTypes,
  Next,
  NextAction,
  NextPropsPayload,
  NextRedirectPayload,
  GuardToRoute,
  GuardFunctionRouteProps,
  PageProps,
  RouteError,
  RouteRedirect,
} from './types';

interface GuardsResolve {
  props: PageProps;
  redirect: RouteRedirect;
}

interface Validation {
  error: RouteError;
  props: PageProps;
  redirect: RouteRedirect;
}

/**
 * Memoized callback to get the next callback function used in guards.
 * Assigns the `props` and `redirect` functions to callback.
 */
export const getNextFn = (resolve: Function): Next => {
  const next = () => resolve({ type: GuardTypes.CONTINUE });
  return Object.assign(next, {
    props: (payload: NextPropsPayload) => resolve({ type: GuardTypes.PROPS, payload }),
    redirect: (payload: NextRedirectPayload) => resolve({ type: GuardTypes.REDIRECT, payload }),
  });
};

/**
 * Runs through a single guard, passing it the current route's props,
 * the previous route's props, and the next callback function. If an
 * error occurs, it will be thrown by the Promise.
 *
 * @param guard the guard function
 * @returns a Promise returning the guard payload
 */
export const runGuard = (
  guard: GuardFunction,
  to: GuardToRoute,
  from: GuardFunctionRouteProps | null,
): Promise<NextAction> =>
  new Promise(async (resolve, reject) => {
    try {
      await guard(to, from, getNextFn(resolve));
    } catch (error) {
      reject(error);
    }
  });

/**
 * Loops through all guards in context. If the guard adds new props
 * to the page or causes a redirect, these are tracked in the state
 * constants defined above.
 */
export const resolveAllGuards = async (
  guards: GuardFunction[] | null,
  to: GuardToRoute,
  from: GuardFunctionRouteProps | null,
): Promise<GuardsResolve> => {
  let index = 0;
  let props = {};
  let redirect = null;
  if (guards) {
    while (!redirect && index < guards.length) {
      const { type, payload } = await runGuard(guards[index], to, from);
      if (payload) {
        if (type === GuardTypes.REDIRECT) {
          redirect = payload;
        } else if (type === GuardTypes.PROPS) {
          props = Object.assign(props, payload);
        }
      }
      index += 1;
    }
  }
  return {
    props,
    redirect,
  };
};

/**
 * Validates the route using the guards. If an error occurs, it
 * will toggle the route error state.
 */
const validateGuardsForRoute = async (
  guards: GuardFunction[] | null,
  to: GuardToRoute,
  from: GuardFunctionRouteProps | null,
): Promise<Validation> => {
  let pageProps: PageProps = {};
  let routeError: RouteError = null;
  let routeRedirect: RouteRedirect = null;

  try {
    const { props, redirect } = await resolveAllGuards(guards, to, from);
    pageProps = props;
    routeRedirect = redirect;
  } catch (error) {
    routeError = error.message || 'Not found.';
  }

  return {
    error: routeError,
    props: pageProps,
    redirect: routeRedirect,
  };
};

export default validateGuardsForRoute;
