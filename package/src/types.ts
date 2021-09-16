import { ComponentType } from 'react';
import { LocationDescriptor } from 'history';
import { RouteComponentProps } from 'react-router-dom';

///////////////////////////////
// General
///////////////////////////////
export type Meta = Record<string, any>;

///////////////////////////////
// Next Functions
///////////////////////////////
export interface NextContinueAction {
  type: 'continue';
}

export type NextPropsPayload = Record<string, any>;
export interface NextPropsAction {
  type: 'props';
  payload: NextPropsPayload;
}

export type NextRedirectPayload = LocationDescriptor;
export interface NextRedirectAction {
  type: 'redirect';
  payload: NextRedirectPayload;
}

export type NextAction = NextContinueAction | NextPropsAction | NextRedirectAction;

export interface NextFunction<Props extends {}> {
  /** Resolve the guard and continue to the next, if any. */
  (): void;
  /** Pass the props to the resolved route and continue to the next, if any. */
  props(props: Props): void;
  /** Redirect to the given route. */
  redirect(to: LocationDescriptor): void;
}

///////////////////////////////
// Guards
///////////////////////////////
export interface GuardFunctionContext {
  /** Metadata attached on the `to` route. */
  meta: Meta;
  /**
   * A signal that determines if the current guard resolution has been aborted.
   * Attach to fetch calls to cancel outdated requests before they're resolved.
   */
  signal: AbortSignal;
}

export type GuardFunction<Props extends {} = {}> = (
  /** The route being navigated to. */
  to: RouteComponentProps<Record<string, any>>,
  /** The route being navigated from, if any */
  from: RouteComponentProps<Record<string, any>> | null,
  /** The guard's next function */
  next: NextFunction<Props>,
  /** Context for this guard's execution */
  context: GuardFunctionContext,
) => void;

///////////////////////////////
// Page Types
///////////////////////////////
export type PageComponentType<P = {}> = ComponentType<RouteComponentProps & P>;
export type Page<P = {}> = PageComponentType<P> | null | string | boolean | number;

export type LoadingPage = Page;
export type ErrorPage = Page<{ error: unknown }>;

export type LoadingPageComponentType = PageComponentType;
export type ErrorPageComponentType = PageComponentType<{ error: unknown }>;

///////////////////////////////
// Props
///////////////////////////////
export interface BaseGuardProps {
  /** Guards to attach as middleware. */
  guards?: GuardFunction[];
  /** Whether to ignore guards attached to parent providers. */
  ignoreGlobal?: boolean;
  /** A custom loading page component. */
  loading?: LoadingPage;
  /** A custom error page component. */
  error?: ErrorPage;
}
