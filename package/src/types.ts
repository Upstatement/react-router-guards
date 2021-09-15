import { ComponentType } from 'react';
import { LocationDescriptor } from 'history';
import { RouteComponentProps, RouteProps } from 'react-router-dom';

/**
 * General
 */
export type Meta = Record<string, any>;
export type RouteMatchParams = Record<string, string>;
export interface NextContinueAction {
  type: 'continue';
  payload?: any;
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
export type GuardType = NextAction['type'];

export interface Next {
  (): void;
  props(props: NextPropsPayload): void;
  redirect(to: LocationDescriptor): void;
}

export type GuardFunctionRouteProps = RouteComponentProps<RouteMatchParams>;
export type GuardToRoute = GuardFunctionRouteProps & {
  meta: Meta;
};
export type GuardFunction = (
  to: GuardToRoute,
  from: GuardFunctionRouteProps | null,
  next: Next,
  signal: AbortSignal,
) => void;

/**
 * Page Component Types
 */
export type PageComponent = ComponentType | null | undefined | string | boolean | number;

/**
 * Props
 */
export interface BaseGuardProps {
  guards?: GuardFunction[];
  ignoreGlobal?: boolean;
  loading?: PageComponent;
  error?: PageComponent;
}

export type PropsWithMeta<T> = T & {
  meta?: Meta;
};

export type GuardProviderProps = BaseGuardProps;
export type GuardedRouteProps = PropsWithMeta<BaseGuardProps & RouteProps>;
export type GuardProps = PropsWithMeta<RouteProps> & {
  name?: string | string[];
};
