
const defaultState = { accueilliList: null, accueilliSelected: null }

const accueilli = (state = defaultState, action) => {
    switch (action.type) {
        case "select_accueilli":
            return { ...state, accueilliSelected: action.accueilliSelected };
        case "list_accueilli":
            return { ...state, accueilliList: action.accueilliList };
        default:
            return state;
    }
};


export default accueilli;