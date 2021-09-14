import { createContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { GuardFunction, ErrorPageComponent, LoadingPageComponent } from './types';

export const ErrorPageContext = createContext<ErrorPageComponent>(null);

export const FromRouteContext = createContext<RouteComponentProps | null>(null);

export const GuardContext = createContext<GuardFunction[] | null>(null);

export const LoadingPageContext = createContext<LoadingPageComponent>(null);
