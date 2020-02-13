import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import accueilli from './reducers/accueilli';
import topic from './reducers/topic';

const combination = combineReducers({ accueilli, topic });

const logger = createLogger({
    // predicate: (getState, action) => action.type !== '',
    collapsed: (getState, action) => action.type !== '',
});

const store = createStore(combination, applyMiddleware(logger));

export default store