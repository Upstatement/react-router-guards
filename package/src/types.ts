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

export interface Next<Props extends {}> {
  (): void;
  props(props: Props): void;
  redirect(to: LocationDescriptor): void;
}

///////////////////////////////
// Guards
///////////////////////////////
export type GuardFunctionRouteProps = RouteComponentProps<Record<string, any>>;
export type GuardToRoute = GuardFunctionRouteProps & {
  meta: Meta;
};
export type GuardFunction<Props extends {} = {}> = (
  to: GuardToRoute,
  from: GuardFunctionRouteProps | null,
  next: Next<Props>,
  signal: AbortSignal,
) => void;

///////////////////////////////
// Page Types
///////////////////////////////
export type PageComponentType<P = {}> = ComponentType<RouteComponentProps & P>;
export type Page<P = {}> = PageComponentType<P> | null | undefined | string | boolean | number;

export type LoadingPage = Page;
export type ErrorPage = Page<{ error: unknown }>;

export type LoadingPageComponentType = PageComponentType;
export type ErrorPageComponentType = PageComponentType<{ error: unknown }>;

///////////////////////////////
// Props
///////////////////////////////
export interface BaseGuardProps {
  guards?: GuardFunction[];
  ignoreGlobal?: boolean;
  loading?: LoadingPage;
  error?: ErrorPage;
}
