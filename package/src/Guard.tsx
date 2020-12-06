import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import { matchPath, Redirect, Route } from 'react-router-dom';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { usePrevious, useStateRef, useStateWhenMounted } from './hooks';
import renderPage from './renderPage';
import validateGuardsForRoute from './validateGuardsForRoute';
import { GuardProps, GuardToRoute, PageProps, RouteError, RouteRedirect } from './types';

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
  const [routeError, setRouteError] = useStateWhenMounted<RouteError>(null);
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
   * Validates the route using the guards. If an error occurs, it
   * will toggle the route error state.
   */
  const validateRoute = async (): Promise<void> => {
    const currentRequests = validationsRequested.current;

    const to: GuardToRoute = {
      ...routeProps,
      meta: meta || {},
    };
    const { error, props, redirect } = await validateGuardsForRoute(guards, to, fromRouteProps);

    if (currentRequests === getValidationsRequested()) {
      setPageProps(props);
      setRouteError(error);
      setRouteRedirect(redirect);
      setRouteValidated(true);
    }
  };

  useEffect(() => {
    validateRoute();
  }, []);

  useEffect(() => {
    if (hasPathChanged) {
      setValidationsRequested(requests => requests + 1);
      setRouteError(null);
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
