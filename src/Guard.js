import React, { useContext, useEffect, useMemo } from 'react';
import { Route, __RouterContext as RouterContext } from 'react-router-dom';
import { ErrorPageContext, FromRouteContext, GuardContext, LoadingPageContext } from './contexts';
import { usePrevious, useStateWhenMounted } from './hooks';

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
  const [pageProps, setPageProps] = useStateWhenMounted({});

  /**
   * Loops through all guards in context. If an error is thrown in any guards,
   * the loop will break and the not found page will be shown.
   */
  const guardRoute = async () => {
    try {
      let index = 0;
      let props = {};
      while (index < guards.length) {
        const payload = await new Promise(async (resolve, reject) => {
          try {
            await guards[index](routeProps, fromRouteProps, resolve);
          } catch (error) {
            reject(error);
          }
        });
        props = Object.assign(props, payload || {});
        index += 1;
      }
      setPageProps(props);
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
    guardRoute();
  }, [guardRoute]);

  useEffect(() => {
    if (hasRouteUpdated) {
      setRouteValidated(initialRouteValidated);
      if (!initialRouteValidated) {
        setRouteError(null);
        guardRoute();
      }
    }
  }, [guardRoute, hasRouteUpdated, initialRouteValidated, setRouteError, setRouteValidated]);

  if (!routeValidated) {
    return loadingPage(routeProps);
  } else if (routeError) {
    return errorPage({ ...routeProps, error: routeError });
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
