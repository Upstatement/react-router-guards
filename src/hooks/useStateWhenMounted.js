import { useState } from 'react';
import { useMounted } from 'hooks';

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
const useStateWhenMounted = initialState => {
  const mounted = useMounted();
  const [state, setState] = useState(initialState);

  const setStateWhenMounted = newState => {
    if (mounted.current) {
      setState(newState);
    }
  };

  return [state, setStateWhenMounted];
};

export default useStateWhenMounted;
