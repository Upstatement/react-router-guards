import { createContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PageComponent, GuardFunction, RouteError } from './types';

export const ErrorPageContext = createContext<PageComponent<{ error: RouteError }>>(null);

export const FromRouteContext = createContext<RouteComponentProps | null>(null);

export const GuardContext = createContext<GuardFunction[] | null>(null);

export const LoadingPageContext = createContext<PageComponent>(null);
