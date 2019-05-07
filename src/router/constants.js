import { createContext } from 'react';

export const ErrorPageContext = createContext(() => null);

export const FromRouteContext = createContext(null);

export const GuardContext = createContext();

export const LoadingPageContext = createContext(() => null);
