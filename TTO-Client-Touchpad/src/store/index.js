import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import accueilli from './reducers/accueilli';


const logger = createLogger({
    // predicate: (getState, action) => action.type !== '',
    collapsed: (getState, action) => action.type !== '',
});

const store = createStore(accueilli, applyMiddleware(logger));

export default store