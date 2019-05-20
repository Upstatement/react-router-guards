import { ComponentType } from 'react';
import { LocationDescriptor } from 'history';
import { RouteChildrenProps } from 'react-router';

export const GuardTypes = Object.freeze({
  CONTINUE: 'CONTINUE',
  PROPS: 'PROPS',
  REDIRECT: 'REDIRECT',
});

export type GuardType = GUARD_TYPES_CONTINUE | GUARD_TYPES_PROPS | GUARD_TYPES_REDIRECT;

export type GUARD_TYPES_CONTINUE = typeof GuardTypes.CONTINUE;
export interface NextContinueAction {
  type: GUARD_TYPES_CONTINUE;
  payload?: any;
}

export type GUARD_TYPES_PROPS = typeof GuardTypes.PROPS;
export interface NextPropsPayload {
  [key: string]: any;
}
export interface NextPropsAction {
  type: GUARD_TYPES_PROPS;
  payload: NextPropsPayload;
}

export type GUARD_TYPES_REDIRECT = typeof GuardTypes.REDIRECT;
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

export type GuardFunction = (
  to: RouteChildrenProps,
  from: RouteChildrenProps | null,
  next: Next,
) => void;

export type PageComponent = ComponentType | null | undefined | string | boolean | number;
