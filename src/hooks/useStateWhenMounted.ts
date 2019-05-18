import { useEffect, useRef, useState } from 'react';

type SetState<T> = (newState: React.SetStateAction<T>) => void;

/**
 * React hook for only updating a component's state when the component is still mounted.
 * This is useful for state variables that depend on asynchronous operations to update.
 *
 * The interface in which this hook is used is identical to that of `useState`.
 *
 * @param {any} initialState the initial value of the state variable
 * @returns {Array} an array containing the state variable and the function to update
 * the state
 */
function useStateWhenMounted<T>(initialState: T): [T, SetState<T>] {
  const mounted = useRef(true);

  const [state, setState] = useState(initialState);

  const setStateWhenMounted: SetState<T> = newState => {
    if (mounted.current) {
      setState(newState);
    }
  };

  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  return [state, setStateWhenMounted];
}

export default useStateWhenMounted;
