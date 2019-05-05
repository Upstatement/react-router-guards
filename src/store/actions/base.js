import { INCREASE_COUNT } from './types';

export const increaseCount = () => (dispatch, getState) => {
  const { count } = getState().base;
  dispatch({
    type: INCREASE_COUNT,
    payload: {
      count: count + 1,
    },
  });
};
