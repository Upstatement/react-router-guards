import { useRef } from 'react';
import useStateWhenMounted from './useStateWhenMounted';

type NotFunc<T> = Exclude<T, Function>;

type SetStateFuncAction<T> = (prevState: NotFunc<T>) => NotFunc<T>;
type SetStateAction<T> = NotFunc<T> | SetStateFuncAction<T>;
type SetState<T> = (newState: SetStateAction<T>) => void;

/**
 * React hook that provides a similar API to the `useState`
 * hook, but performs updates using refs instead of asynchronous
 * actions.
 *
 * @param initialState the initial state of the state variable
 * @returns an array containing a ref of the state variable and a setter
 * function for the state
 */
function useStateRef<T>(
  initialState: NotFunc<T>,
): [React.MutableRefObject<NotFunc<T>>, SetState<T>] {
  const state = useRef(initialState);
  const [, setTick] = useStateWhenMounted(0);

  const setState: SetState<T> = newState => {
    if (typeof newState === 'function') {
      state.current = (newState as SetStateFuncAction<T>)(state.current);
    } else {
      state.current = newState;
    }
    setTick(tick => tick + 1);
  };

  return [state, setState];
}

export default useStateRef;
