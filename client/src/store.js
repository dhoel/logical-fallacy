import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import * as reducers from './reducers/reducers-index';

export default createStore(reducers.qReducer, applyMiddleware(thunk));
