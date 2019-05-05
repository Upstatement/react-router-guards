import { useEffect, useRef } from 'react';

/**
 * React hook for checking whether a component is still mounted or not.
 *
 * @returns {Object} a reference to whether the component is mounted or not, accessible
 * via the `current` property
 */
const useMounted = () => {
  const mounted = useRef(true);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  return mounted;
};

export default useMounted;
