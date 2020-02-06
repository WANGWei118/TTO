
const defaultState = { accueilliList: null, selectedAccueilli: null }

const accueilli = (state = defaultState, action) => {
    switch (action.type) {
        case "select_accueilli":
            return { ...state, selected: action.accueilli };
        case "list_accueilli":
            return { ...state, accueilliList: action.accueilliList };
        default:
            return state;
    }
};


export default accueilli;