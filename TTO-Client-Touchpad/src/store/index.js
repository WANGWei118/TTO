import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import accueilli from './reducers/accueilli';
import topic from './reducers/topic';

const combination = combineReducers({ accueilli, topic });

const logger = createLogger({
    // predicate: (getState, action) => action.type !== '',
    collapsed: (getState, action) => action.type !== '',
});

let persistedState = localStorage.getItem('topic') ? {
    topic: JSON.parse(localStorage.getItem('topic'))
} :
    {};

persistedState = localStorage.getItem('accueilli') ? {
    ...persistedState,
    accueilli: JSON.parse(localStorage.getItem('accueilli'))
} : { ...persistedState };

const store = createStore(combination, persistedState, applyMiddleware(logger));

let currentValueTopic;
let currentValueAccueilli;
store.subscribe(() => {
    const previousValueTopic = currentValueTopic;
    const previousValueAccueilli = currentValueAccueilli;

    currentValueTopic = store.getState().topic;
    currentValueAccueilli = store.getState().accueilli;

    if (currentValueTopic !== previousValueTopic) {
        localStorage.setItem('topic', JSON.stringify(currentValueTopic));
    }

    if (currentValueAccueilli !== previousValueAccueilli) {
        localStorage.setItem('accueilli', JSON.stringify(currentValueAccueilli));
    }
})

export default store