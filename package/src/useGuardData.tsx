import { useContext } from 'react';
import { GuardDataContext } from './contexts';

export function useGuardData<P extends {} = {}>() {
  return useContext(GuardDataContext) as P;
}
