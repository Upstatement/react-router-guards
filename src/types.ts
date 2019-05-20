import { ComponentType } from 'react';
import { RouteChildrenProps } from 'react-router';
import { RedirectProps } from 'react-router-dom';

export const GuardTypes = Object.freeze({
  CONTINUE: 'CONTINUE',
  PROPS: 'PROPS',
  REDIRECT: 'REDIRECT',
});

export type GUARD_TYPES_CONTINUE = typeof GuardTypes.CONTINUE;
export type GUARD_TYPES_PROPS = typeof GuardTypes.PROPS;
export type GUARD_TYPES_REDIRECT = typeof GuardTypes.REDIRECT;

export interface NextProps {
  [key: string]: any;
}

export interface NextContinueAction {
  type: GUARD_TYPES_CONTINUE;
  payload?: any;
}

export interface NextPropsAction {
  type: GUARD_TYPES_PROPS;
  payload: NextProps;
}

export interface NextRedirectAction {
  type: GUARD_TYPES_REDIRECT;
  payload: RedirectProps;
}

export type NextAction = NextContinueAction | NextPropsAction | NextRedirectAction;

export interface Next {
  (): void;
  props(props: NextProps): void;
  redirect(to: RedirectProps): void;
}

export type GuardFunction = (
  to: RouteChildrenProps,
  from: RouteChildrenProps | null,
  next: Next,
) => void;

export type PageComponent = ComponentType | null | undefined | string | boolean | number;
