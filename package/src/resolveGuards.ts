import { RouteComponentProps } from 'react-router';
import {
  GuardFunction,
  Next,
  NextAction,
  NextPropsPayload,
  NextRedirectPayload,
  GuardToRoute,
} from './types';

export type ResolvedGuardStatus =
  | { type: 'error'; error: unknown }
  | { type: 'redirect'; redirect: NextRedirectPayload }
  | { type: 'render'; props: NextPropsPayload };

export type GuardStatus = { type: 'resolving' } | ResolvedGuardStatus;

export interface ValidateRouteConfig {
  guards: GuardFunction[];
  toRoute: GuardToRoute;
  fromRoute: RouteComponentProps<Record<string, string>> | null;
  signal: AbortSignal;
}

const NextFunctionFactory = {
  /**
   * Builds a new next function using the given `resolve` callback.
   */
  build: (resolve: (action: NextAction) => void): Next => {
    function next() {
      resolve({ type: 'continue' });
    }

    return Object.assign(next, {
      props(payload: NextPropsPayload) {
        resolve({ type: 'props', payload });
      },
      redirect(payload: NextRedirectPayload) {
        resolve({ type: 'redirect', payload });
      },
    });
  },
};

/**
 * Runs through a single guard, passing it the current route's props,
 * the previous route's props, and the next callback function. If an
 * error occurs, it will be thrown by the Promise.
 *
 * @param guard the guard function
 * @returns a Promise returning the guard payload
 */
function runGuard(guard: GuardFunction, config: ValidateRouteConfig) {
  return new Promise<NextAction>(async (resolve, reject) => {
    try {
      await guard(
        config.toRoute,
        config.fromRoute,
        NextFunctionFactory.build(resolve),
        config.signal,
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Loops through all guards in context. If the guard adds new props
 * to the page or causes a redirect, these are tracked in the state
 * constants defined above.
 */
export async function resolveGuards(config: ValidateRouteConfig): Promise<ResolvedGuardStatus> {
  try {
    let props: NextPropsPayload = {};
    for (const guard of config.guards) {
      const action = await runGuard(guard, config);
      if (action.type === 'redirect') {
        return { type: 'redirect', redirect: action.payload };
      } else if (action.type === 'props') {
        props = Object.assign(props, action.payload);
      }
    }
    return { type: 'render', props };
  } catch (error) {
    // If the guard fails because the signal is aborted, throw up the error
    if (error && error.name === 'AbortError') {
      throw error;
    }
    // Otherwise, return the error status with the guard-thrown error
    return { type: 'error', error };
  }
}
