import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { matchPath, Redirect, Route, __RouterContext as RouterContext } from 'react-router-dom';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { usePrevious, useStateWhenMounted } from './hooks';

const GuardTypes = {
  CONTINUE: 'CONTINUE',
  PROPS: 'PROPS',
  REDIRECT: 'REDIRECT',
};

const Guard = ({ children, component, render }) => {
  const routeProps = useContext(RouterContext);
  const routePrevProps = usePrevious(routeProps);
  const hasRouteUpdated = useMemo(
    () => JSON.stringify(routePrevProps.match.params) !== JSON.stringify(routeProps.match.params),
    [routeProps, routePrevProps],
  );
  const fromRouteProps = useContext(FromRouteContext);

  const guards = useContext(GuardContext);
  const loadingPage = useContext(LoadingPageContext);
  const errorPage = useContext(ErrorPageContext);

  const initialRouteValidated = useMemo(() => guards.length === 0, [guards]);
  const [routeValidated, setRouteValidated] = useStateWhenMounted(initialRouteValidated);
  const [routeError, setRouteError] = useStateWhenMounted(null);
  const [routeRedirect, setRouteRedirect] = useStateWhenMounted(null);
  const [pageProps, setPageProps] = useStateWhenMounted({});

  /**
   * Memoized callback to get the next callback function used in guards.
   * Assigns the `props` and `redirect` functions to callback.
   */
  const getNextFn = useCallback(resolve => {
    const next = () =>
      resolve({
        type: GuardTypes.CONTINUE,
      });

    const extend = (name, type) => {
      next[name] = payload => resolve({ type, payload });
    };

    extend('props', GuardTypes.PROPS);
    extend('redirect', GuardTypes.REDIRECT);

    return next;
  }, []);

  /**
   * Runs through a single guard, passing it the current route's props,
   * the previous route's props, and the next callback function. If an
   * error occurs, it will be thrown by the Promise.
   *
   * @param {function} guard the guard function
   * @returns {Promise<object>} a Promise returning the guard payload
   */
  const runGuard = guard =>
    new Promise(async (resolve, reject) => {
      try {
        await guard(routeProps, fromRouteProps, getNextFn(resolve));
      } catch (error) {
        reject(error);
      }
    });

  /**
   * Loops through all guards in context. If the guard adds new props
   * to the page or causes a redirect, these are tracked in the state
   * constants defined above.
   */
  const resolveAllGuards = async () => {
    let index = 0;
    let props = {};
    while (!routeRedirect && index < guards.length) {
      const { type, payload } = await runGuard(guards[index]);
      if (type === GuardTypes.REDIRECT) {
        setRouteRedirect(payload);
      } else if (type === GuardTypes.PROPS) {
        props = Object.assign(props, payload || {});
      }
      index += 1;
    }
    setPageProps(props);
  };

  /**
   * Validates the route using the guards. If an error occurs, it
   * will toggle the route error state.
   */
  const validateRoute = async () => {
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

  useEffect(() => {
    validateRoute();
  }, []);

  useEffect(() => {
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
    return loadingPage(routeProps);
  } else if (routeError) {
    return errorPage({ ...routeProps, error: routeError });
  } else if (routeRedirect) {
    const pathToMatch = typeof routeRedirect === 'string' ? routeRedirect : routeRedirect.path;
    const { path, isExact: exact } = routeProps.match;
    if (!matchPath(pathToMatch, { path, exact })) {
      return <Redirect to={routeRedirect} />;
    }
  } else if (hasRouteUpdated) {
    return null;
  }
  return (
    <RouterContext.Provider value={{ ...routeProps, ...pageProps }}>
      {/* eslint-disable-next-line react/no-children-prop */}
      <Route children={children} component={component} render={render} />
    </RouterContext.Provider>
  );
};

Guard.propTypes = {
  children: Route.propTypes.children,
  component: Route.propTypes.component,
  render: Route.propTypes.render,
};

export default Guard;
