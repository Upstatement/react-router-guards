import { Fragment, useMemo } from 'react';

/**
 * React hook for creating an optional context provider wrapper.
 * This will only create the wrapper if the given value exists.
 * 
 * @param {any} value the value to pass to the context
 * @param {object} context the context type
 * @returns {array} the wrapper element and props to pass
 */
const useContextWrapper = (value, context) => {
  const wrapper = useMemo(() => (value ? context.Provider : Fragment), [context.Provider, value]);
  const props = useMemo(() => (value ? { value } : {}), [value]);
  return [wrapper, props];
};

export default useContextWrapper;