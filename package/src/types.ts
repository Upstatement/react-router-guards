import { ComponentType } from 'react';
import { LocationDescriptor } from 'history';
import { RouteComponentProps, RouteProps } from 'react-router-dom';

/**
 * General
 */
export type Meta = Record<string, any>;
export type RouteMatchParams = Record<string, string>;

/**
 * Guard Function Types
 */
export const GuardTypes = Object.freeze({
  CONTINUE: 'CONTINUE',
  PROPS: 'PROPS',
  REDIRECT: 'REDIRECT',
});

export type GUARD_TYPES_CONTINUE = typeof GuardTypes.CONTINUE;
export type GUARD_TYPES_PROPS = typeof GuardTypes.PROPS;
export type GUARD_TYPES_REDIRECT = typeof GuardTypes.REDIRECT;
export type GuardType = GUARD_TYPES_CONTINUE | GUARD_TYPES_PROPS | GUARD_TYPES_REDIRECT;

export interface NextContinueAction {
  type: GUARD_TYPES_CONTINUE;
  payload?: any;
}

export type NextPropsPayload = Record<string, any>;
export interface NextPropsAction {
  type: GUARD_TYPES_PROPS;
  payload: NextPropsPayload;
}

export type NextRedirectPayload = LocationDescriptor;
export interface NextRedirectAction {
  type: GUARD_TYPES_REDIRECT;
  payload: NextRedirectPayload;
}

export type NextAction = NextContinueAction | NextPropsAction | NextRedirectAction;

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
) => void;

export type RouteError = string | null;

/**
 * Page Component Types
 */
export type PageComponentType<P = {}> = ComponentType<RouteComponentProps & P>;
export type PageComponent<P = {}> =
  | PageComponentType<P>
  | null
  | undefined
  | string
  | boolean
  | number;

export type LoadingPageComponent = PageComponent;
export type ErrorPageComponent = PageComponent<{ error: RouteError }>;

export type LoadingPageComponentType = PageComponentType;
export type ErrorPageComponentType = PageComponentType<{ error: RouteError }>;

/**
 * Props
 */
export interface BaseGuardProps {
  guards?: GuardFunction[];
  ignoreGlobal?: boolean;
  loading?: LoadingPageComponent;
  error?: ErrorPageComponent;
}

export type PropsWithMeta<T> = T & {
  meta?: Meta;
};

export type GuardProviderProps = BaseGuardProps;
export type GuardedRouteProps = PropsWithMeta<BaseGuardProps & RouteProps>;
export type GuardProps = PropsWithMeta<RouteProps> & {
  name?: string | string[];
};
