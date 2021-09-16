import {
  GuardFunction,
  NextFunction,
  NextDataPayload,
  NextRedirectPayload,
  GuardFunctionContext,
  NextContinueAction,
  NextDataAction,
  NextRedirectAction,
} from './types';

export type ResolvedGuardStatus =
  | { type: 'error'; error: unknown }
  | { type: 'redirect'; redirect: NextRedirectPayload }
  | { type: 'render'; data: NextDataPayload };

export const NextFunctionFactory = {
  /**
   * Builds a new next function using the given `resolve` callback.
   */
  build(): NextFunction<{}> {
    function next(): NextContinueAction {
      return { type: 'continue' };
    }

    return Object.assign(next, {
      data(payload: NextDataPayload): NextDataAction {
        return { type: 'data', payload };
      },
      redirect(payload: NextRedirectPayload): NextRedirectAction {
        return { type: 'redirect', payload };
      },
    });
  },
};

/**
 * Resolves a list of guards in the given context. Resolution follows as such:
 * - If any guard resolves to a redirect, return that redirect
 * - If any guard throws an error, return that error
 * - Otherwise, return all merged data
 *
 * If the abort signal in context is aborted, bubble up that error.
 *
 * @param guards the list of guards to resolve
 * @param context the context of these guards
 * @returns a Promise returning the resolved guards' status
 */
export async function resolveGuards(
  guards: GuardFunction[],
  context: GuardFunctionContext,
): Promise<ResolvedGuardStatus> {
  try {
    let data: NextDataPayload = {};
    for (const guard of guards) {
      // If guard resolution has been canceled *before* running guard, bubble up an AbortError
      if (context.signal.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }

      // Run the guard and get the resolved action
      const action = await guard(context, NextFunctionFactory.build());
      switch (action.type) {
        case 'redirect': {
          // If the guard calls for a redirect, do so immediately!
          return { type: 'redirect', redirect: action.payload };
        }
        case 'data': {
          // Otherwise, continue to merge data
          data = Object.assign(data, action.payload);
          break;
        }
      }
    }
    // Then return the props after all guards have resolved
    return { type: 'render', data };
  } catch (error) {
    return { type: 'error', error };
  }
}
