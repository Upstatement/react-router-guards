import { useContext } from 'react';
import { GuardContext } from '../contexts';
import { GuardFunction } from '../types';

/**
 * React hook for creating the guards array for a Guarded
 * component.
 *
 * @param guards the component-level guards
 * @param ignoreGlobal whether to ignore the global guards or not
 * @returns the guards to use on the component
 */
export const useGlobalGuards = (guards: GuardFunction[] = [], ignoreGlobal: boolean = false) => {
  const globalGuards = useContext(GuardContext);

  if (ignoreGlobal) {
    return [...guards];
  } else {
    return [...(globalGuards || []), ...guards];
  }
};
