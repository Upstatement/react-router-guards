import { createContext } from 'react';
import { RouteChildrenProps } from 'react-router';
import { PageComponent, GuardFunction } from './types';

export const ErrorPageContext: React.Context<PageComponent> = createContext(null);

export const FromRouteContext: React.Context<RouteChildrenProps | null> = createContext(null);

export const GuardContext: React.Context<GuardFunction[] | null> = createContext(null);

export const LoadingPageContext: React.Context<PageComponent> = createContext(null);
