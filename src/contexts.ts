import { createContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PageComponent, GuardFunction } from './types';

export const ErrorPageContext: React.Context<PageComponent> = createContext(null);

export const FromRouteContext: React.Context<RouteComponentProps | null> = createContext(null);

export const GuardContext: React.Context<GuardFunction[] | null> = createContext(null);

export const LoadingPageContext: React.Context<PageComponent> = createContext(null);
