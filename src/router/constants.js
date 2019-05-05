import { createContext } from 'react';

export const GuardContext = createContext([]);
export const LoadingPageContext = createContext(() => null);
export const ErrorPageContext = createContext(() => null);

export const GUARD_TYPES = {
  CONTINUE: 'CONTINUE',
  ADD_PROPS: 'ADD_PROPS',
};
