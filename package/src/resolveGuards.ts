import { RouteComponentProps } from 'react-router';
import {
  GuardFunction,
  NextFunction,
  NextAction,
  NextPropsPayload,
  NextRedirectPayload,
  GuardFunctionContext,
} from './types';

export type ResolvedGuardStatus =
  | { type: 'error'; error: unknown }
  | { type: 'redirect'; redirect: NextRedirectPayload }
  | { type: 'render'; props: NextPropsPayload };

export interface ResolveGuardsContext {
  to: RouteComponentProps<Record<string, string>>;
  from: RouteComponentProps<Record<string, string>> | null;
  context: GuardFunctionContext;
}

export const NextFunctionFactory = {
  /**
   * Builds a new next function using the given `resolve` callback.
   */
  build: (resolve: (action: NextAction) => void): NextFunction<{}> => {
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
 * Handles running a single guard function in the given context.
 * Bubbles up any errors thrown in the guard.
 *
 * @param guard the guard function
 * @param context the context of this guard's resolution
 * @returns a Promise returning the resolved guard action
 */
export function runGuard(guard: GuardFunction, context: ResolveGuardsContext): Promise<NextAction> {
  return new Promise<NextAction>(async (resolve, reject) => {
    try {
      await guard(context.to, context.from, NextFunctionFactory.build(resolve), context.context);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Resolves a list of guards in the given context. Resolution follows as such:
 * - If any guard resolves to a redirect, return that redirect
 * - If any guard throws an error, return that error
 * - Otherwise, return all merged props
 *
 * If the abort signal in context is aborted, bubble up that error.
 *
 * @param guards the list of guards to resolve
 * @param context the context of these guards' resolution
 * @returns a Promise returning the resolved guards' status
 */
export async function resolveGuards(
  guards: GuardFunction[],
  context: ResolveGuardsContext,
): Promise<ResolvedGuardStatus> {
  try {
    let props: NextPropsPayload = {};
    for (const guard of guards) {
      const action = await runGuard(guard, context);
      if (action.type === 'redirect') {
        // If the guard calls for a redirect, do so immediately!
        return { type: 'redirect', redirect: action.payload };
      } else if (action.type === 'props') {
        // Otherwise, continue to merge props
        props = Object.assign(props, action.payload);
      }
    }
    // Then return the props after all guards have resolved
    return { type: 'render', props };
  } catch (error) {
    // If the guard fails because the signal is aborted, bubbles up the error
    if (error && error.name === 'AbortError') {
      throw error;
    }
    // Otherwise, return the error status with the guard-thrown error
    return { type: 'error', error };
  }
}
