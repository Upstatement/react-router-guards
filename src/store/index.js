import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducers from 'reducers';

const initialState = {};

const middleware = [thunk];
const enhancers = composeWithDevTools(applyMiddleware(...middleware));

const store = createStore(reducers, initialState, enhancers);

export default store;
