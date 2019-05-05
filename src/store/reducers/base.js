import { INCREASE_COUNT } from 'actions/types';

const initialState = {
  count: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INCREASE_COUNT: {
      const { count } = action.payload;
      return {
        ...state,
        count,
      };
    }
    default:
      return state;
  }
};
