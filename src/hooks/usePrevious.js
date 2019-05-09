import { useEffect, useRef } from 'react';

/**
 * React hook for storing the previous value of the
 * given value.
 * 
 * @param {any} value the value to store
 * @returns the previous value
 */
const usePrevious = value => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export default usePrevious;
