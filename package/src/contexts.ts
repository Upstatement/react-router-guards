import { createContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PageComponent, GuardFunction } from './types';

export const ErrorPageContext = createContext<PageComponent>(null);

export const FromRouteContext = createContext<RouteComponentProps | null>(null);

export const GuardContext = createContext<GuardFunction[] | null>(null);

export const LoadingPageContext = createContext<PageComponent>(null);

export const RawErrorContext = createContext<boolean | null | undefined>(false);
