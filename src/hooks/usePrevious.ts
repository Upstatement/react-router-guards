import { useEffect, useRef } from 'react';

/**
 * React hook for storing the previous value of the
 * given value.
 *
 * @param value the value to store
 * @returns the previous value
 */
function usePrevious<T>(value: T): T {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export default usePrevious;
