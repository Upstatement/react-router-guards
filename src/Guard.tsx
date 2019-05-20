import * as React from 'react';
import { __RouterContext as RouterContext, RouteProps } from 'react-router';
import { matchPath, Redirect, Route } from 'react-router-dom';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { usePrevious, useStateWhenMounted } from './hooks';
import {
  GuardFunction,
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

const Guard: React.FunctionComponent<RouteProps> = ({
  children,
  component,
  render,
}): React.ReactElement | null => {
  const routeProps = React.useContext(RouterContext);
  const routePrevProps = usePrevious(routeProps);
  const hasRouteUpdated = React.useMemo(
    (): boolean =>
      JSON.stringify(routePrevProps.match.params) !== JSON.stringify(routeProps.match.params),
    [routeProps, routePrevProps],
  );
  const fromRouteProps = React.useContext(FromRouteContext);

  const guards = React.useContext(GuardContext);
  const LoadingPage = React.useContext(LoadingPageContext);
  const ErrorPage = React.useContext(ErrorPageContext);

  const initialRouteValidated = React.useMemo(
    (): boolean => !!(guards && guards.length && guards.length === 0),
    [guards],
  );
  const [routeValidated, setRouteValidated] = useStateWhenMounted<boolean>(initialRouteValidated);
  const [routeError, setRouteError] = useStateWhenMounted<RouteError>(null);
  const [routeRedirect, setRouteRedirect] = useStateWhenMounted<RouteRedirect>(null);
  const [pageProps, setPageProps] = useStateWhenMounted<NextPropsPayload>({});

  /**
   * Memoized callback to get the next callback function used in guards.
   * Assigns the `props` and `redirect` functions to callback.
   */
  const getNextFn = React.useCallback((resolve: Function): Next => {
    const getResolveFn = (type: GuardType): ((payload?: any) => void) => (
      payload: NextPropsPayload | NextRedirectPayload,
    ): void => resolve({ type, payload });

    return Object.assign((): Function => getResolveFn(GuardTypes.CONTINUE), {
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
          await guard(routeProps, fromRouteProps, getNextFn(resolve));
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
  const resolveAllGuards = async (): Promise<void> => {
    let index = 0;
    let props = {};
    if (guards && guards.length) {
      while (!routeRedirect && index < guards.length) {
        const { type, payload } = await runGuard(guards[index]);
        if (payload) {
          if (type === GuardTypes.REDIRECT) {
            setRouteRedirect(payload);
          } else if (type === GuardTypes.PROPS) {
            props = Object.assign(props, payload);
          }
        }
        index += 1;
      }
      setPageProps(props);
    }
  };

  /**
   * Validates the route using the guards. If an error occurs, it
   * will toggle the route error state.
   */
  const validateRoute = async (): Promise<void> => {
    try {
      await resolveAllGuards();
    } catch (error) {
      let { message } = error;
      try {
        message = JSON.parse(message);
      } catch {
        // message not JSON parsable, continue
      }
      setRouteError(message || 'Not found.');
    }
    setRouteValidated(true);
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
      return React.createElement(page, props);
    }
    return <React.Fragment>node</React.Fragment>;
  };

  React.useEffect((): void => {
    validateRoute();
  }, []);

  React.useEffect((): void => {
    if (hasRouteUpdated) {
      setRouteValidated(initialRouteValidated);
      if (!initialRouteValidated) {
        setRouteError(null);
        setRouteRedirect(null);
        validateRoute();
      }
    }
  }, [hasRouteUpdated]);

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
  } else if (hasRouteUpdated) {
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
