
const defaultState = { topicList: null, topicSelected: null }

const topic = (state = defaultState, action) => {
    switch (action.type) {
        case "select_topic":
            return { ...state, topicSelected: action.topicSelected };
        case "topic_list":
            return { ...state, topicList: action.topicList };
        default:
            return state;
    }
};


export default topic;