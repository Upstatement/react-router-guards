import React, {
  createElement,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import { matchPath, Route, Redirect } from 'react-router-dom';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { usePrevious, useStateWhenMounted } from './hooks';
import {
  GuardFunction,
  GuardProps,
  GuardType,
  GuardTypes,
  Next,
  NextAction,
  NextPropsPayload,
  NextRedirectPayload,
  PageComponent,
} from './types';

type RouteError = string | Record<string, any> | null;
type RouteRedirect = NextRedirectPayload | null;

const Guard: React.FunctionComponent<GuardProps> = ({ children, component, meta, render }) => {
  const routeProps = useContext(RouterContext);
  const routePrevProps = usePrevious(routeProps);
  const hasPathChanged = useMemo(() => routeProps.match.path === routePrevProps.match.path, [
    routePrevProps,
    routeProps,
  ]);
  const hasMatchParams = useMemo(() => routeProps.match.path.includes(':'), [routeProps]);
  const haveMatchParamsChanged = useMemo(
    () => JSON.stringify(routePrevProps.match.params) !== JSON.stringify(routeProps.match.params),
    [routeProps, routePrevProps],
  );
  const fromRouteProps = useContext(FromRouteContext);

  const guards = useContext(GuardContext);
  const LoadingPage = useContext(LoadingPageContext);
  const ErrorPage = useContext(ErrorPageContext);

  const hasNoGuards = useMemo(() => !!(guards && guards.length === 0), [guards]);
  const validationsRequested = useRef(0);
  const [routeValidated, setRouteValidated] = useStateWhenMounted<boolean>(hasNoGuards);
  const [routeError, setRouteError] = useStateWhenMounted<RouteError>(null);
  const [routeRedirect, setRouteRedirect] = useStateWhenMounted<RouteRedirect>(null);
  const [pageProps, setPageProps] = useStateWhenMounted<NextPropsPayload>({});

  /**
   * Memoized callback to get the current number of validations requested.
   * This is used in order to see if new validations were requested in the
   * middle of a validation execution.
   */
  const getCurrentValidationsRequested = useCallback(() => validationsRequested.current, [
    validationsRequested,
  ]);

  /**
   * Memoized callback to get the next callback function used in guards.
   * Assigns the `props` and `redirect` functions to callback.
   */
  const getNextFn = useCallback((resolve: Function): Next => {
    const getResolveFn = (type: GuardType) => (payload: NextPropsPayload | NextRedirectPayload) =>
      resolve({ type, payload });

    return Object.assign(() => resolve({ type: GuardTypes.CONTINUE }), {
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
    new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const to = {
            ...routeProps,
            meta: meta || {},
          };
          await guard(to, fromRouteProps, getNextFn(resolve));
        } catch (error) {
          reject(error);
        }
      },
    );

  /**
   * Loops through all guards in context. If the guard adds new props
   * to the page or causes a redirect, these are tracked in the state
   * constants defined above.
   */
  const resolveAllGuards = async (): Promise<Record<string, any>> => {
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

    let pageProps: Record<string, any> = {};
    let routeError: RouteError = null;
    let routeRedirect: RouteRedirect = null;

    try {
      const { props, redirect } = await resolveAllGuards();
      pageProps = props;
      routeRedirect = redirect;
    } catch (error) {
      let { message } = error;
      try {
        message = JSON.parse(message);
      } catch {
        // message not JSON parsable, continue
      }
      routeError = message || 'Not found.';
    }

    if (currentRequests === getCurrentValidationsRequested()) {
      setPageProps(pageProps);
      setRouteError(routeError);
      setRouteRedirect(routeRedirect);
      setRouteValidated(true);
    }
  };

  /**
   * Renders a page with the given props.
   *
   * @param page the page component to render
   * @param props the props to pass to the page
   * @returns the page component
   */
  const renderPage = (
    page: PageComponent,
    props: Record<string, any>,
  ): React.ReactElement | null => {
    if (!page) {
      return null;
    } else if (typeof page !== 'string' && typeof page !== 'boolean' && typeof page !== 'number') {
      return createElement(page, props);
    }
    return <Fragment>{page}</Fragment>;
  };

  useEffect(() => {
    validateRoute();
  }, []);

  useEffect(() => {
    if (hasPathChanged || haveMatchParamsChanged) {
      validationsRequested.current += 1;
      setRouteError(null);
      setRouteRedirect(null);
      setRouteValidated(hasNoGuards);
      if (!hasNoGuards) {
        validateRoute();
      }
    }
  }, [hasPathChanged, haveMatchParamsChanged]);

  if (!routeValidated) {
    return renderPage(LoadingPage, routeProps);
  } else if (routeError) {
    return renderPage(ErrorPage, { ...routeProps, error: routeError });
  } else if (routeRedirect) {
    const pathToMatch = typeof routeRedirect === 'string' ? routeRedirect : routeRedirect.pathname;
    const { path, isExact: exact } = routeProps.match;
    if (pathToMatch && !matchPath(pathToMatch, { path, exact })) {
      return <Redirect to={routeRedirect} />;
    }
  } else if (!hasPathChanged && hasMatchParams && haveMatchParamsChanged) {
    return null;
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
