import { Fragment, useMemo } from 'react';

const useContextWrapper = (value, context) => {
  const wrapper = useMemo(() => (value ? context.Provider : Fragment), [value]);
  const props = useMemo(() => (value ? { value } : {}), [value]);
  return [wrapper, props];
};

export default useContextWrapper;