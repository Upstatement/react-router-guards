import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import { matchPath, Redirect, Route } from 'react-router-dom';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { usePrevious, useStateRef, useStateWhenMounted } from './hooks';
import renderPage from './renderPage';
import {
  GuardFunction,
  GuardProps,
  GuardType,
  GuardTypes,
  Next,
  NextAction,
  NextPropsPayload,
  NextRedirectPayload,
} from './types';

type PageProps = NextPropsPayload;
type RouteRedirect = NextRedirectPayload | null;

interface GuardsResolve {
  props: PageProps;
  redirect: RouteRedirect;
}

const Guard: React.FunctionComponent<GuardProps> = ({ children, component, meta, render }) => {
  const routeProps = useContext(RouterContext);
  const routePrevProps = usePrevious(routeProps);
  const hasPathChanged = useMemo(
    () => routeProps.location.pathname !== routePrevProps.location.pathname,
    [routePrevProps, routeProps],
  );
  const fromRouteProps = useContext(FromRouteContext);

  const guards = useContext(GuardContext);
  const LoadingPage = useContext(LoadingPageContext);
  const ErrorPage = useContext(ErrorPageContext);

  const hasGuards = useMemo(() => !!(guards && guards.length > 0), [guards]);
  const [validationsRequested, setValidationsRequested] = useStateRef<number>(0);
  const [routeValidated, setRouteValidated] = useStateRef<boolean>(!hasGuards);
  const [routeError, setRouteError] = useStateWhenMounted<unknown>(undefined);
  const [routeRedirect, setRouteRedirect] = useStateWhenMounted<RouteRedirect>(null);
  const [pageProps, setPageProps] = useStateWhenMounted<PageProps>({});

  /**
   * Memoized callback to get the current number of validations requested.
   * This is used in order to see if new validations were requested in the
   * middle of a validation execution.
   */
  const getValidationsRequested = useCallback(() => validationsRequested.current, [
    validationsRequested,
  ]);

  /**
   * Memoized callback to get the next callback function used in guards.
   * Assigns the `props` and `redirect` functions to callback.
   */
  const getNextFn = useCallback((resolve: Function): Next => {
    const getResolveFn = (type: GuardType) => (payload: NextPropsPayload | NextRedirectPayload) =>
      resolve({ type, payload });

    const next = () => resolve({ type: GuardTypes.CONTINUE });

    return Object.assign(next, {
      props: getResolveFn(GuardTypes.PROPS),
      redirect: getResolveFn(GuardTypes.REDIRECT),
    });
  }, []);

  /**
   * Runs through a single guard, passing it the current route's props,
   * the previous route's props, and the next callback function. If an
   * error occurs, it will be thrown by the Promise.
   *
   * @param guard the guard function
   * @returns a Promise returning the guard payload
   */
  const runGuard = (guard: GuardFunction): Promise<NextAction> =>
    new Promise(async (resolve, reject) => {
      try {
        const to = {
          ...routeProps,
          meta: meta || {},
        };
        await guard(to, fromRouteProps, getNextFn(resolve));
      } catch (error) {
        reject(error);
      }
    });

  /**
   * Loops through all guards in context. If the guard adds new props
   * to the page or causes a redirect, these are tracked in the state
   * constants defined above.
   */
  const resolveAllGuards = async (): Promise<GuardsResolve> => {
    let index = 0;
    let props = {};
    let redirect = null;
    if (guards) {
      while (!redirect && index < guards.length) {
        const { type, payload } = await runGuard(guards[index]);
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
  const validateRoute = async (): Promise<void> => {
    const currentRequests = validationsRequested.current;

    let pageProps: PageProps = {};
    let routeError: unknown = undefined;
    let routeRedirect: RouteRedirect = null;

    try {
      const { props, redirect } = await resolveAllGuards();
      pageProps = props;
      routeRedirect = redirect;
    } catch (error) {
      routeError = error || new Error('Not found.');
    }

    if (currentRequests === getValidationsRequested()) {
      setPageProps(pageProps);
      setRouteError(routeError);
      setRouteRedirect(routeRedirect);
      setRouteValidated(true);
    }
  };

  useEffect(() => {
    validateRoute();
  }, []);

  useEffect(() => {
    if (hasPathChanged) {
      setValidationsRequested(requests => requests + 1);
      setRouteError(undefined);
      setRouteRedirect(null);
      setRouteValidated(!hasGuards);
      if (hasGuards) {
        validateRoute();
      }
    }
  }, [hasPathChanged]);

  if (hasPathChanged) {
    if (hasGuards) {
      return renderPage(LoadingPage, routeProps);
    }
    return null;
  } else if (!routeValidated.current) {
    return renderPage(LoadingPage, routeProps);
  } else if (routeError) {
    return renderPage(ErrorPage, { ...routeProps, error: routeError });
  } else if (routeRedirect) {
    const pathToMatch = typeof routeRedirect === 'string' ? routeRedirect : routeRedirect.pathname;
    const { path, isExact: exact } = routeProps.match;
    if (pathToMatch && !matchPath(pathToMatch, { path, exact })) {
      return <Redirect to={routeRedirect} />;
    }
  }
  return (
    <RouterContext.Provider value={{ ...routeProps, ...pageProps }}>
      <Route component={component} render={render}>
        {children}
      </Route>
    </RouterContext.Provider>
  );
};

export default Guard;
