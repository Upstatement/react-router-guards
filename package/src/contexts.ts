import { createContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { GuardFunction, ErrorPage, LoadingPage } from './types';

export const ErrorPageContext = createContext<ErrorPage>(null);

export const FromRouteContext = createContext<RouteComponentProps | null>(null);

export const GuardContext = createContext<GuardFunction[] | null>(null);

export const GuardDataContext = createContext({});

export const LoadingPageContext = createContext<LoadingPage>(null);
