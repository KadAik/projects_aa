export default function applicationFormReducer(state, action) {
    switch (action.type) {
        case "SET_NEXT_SECTION":
            return {
                ...state,
                section: state.section + 1,
            };

        case "SET_PREVIOUS_SECTION":
            return {
                ...state,
                section: state.section - 1,
            };
    }
}
