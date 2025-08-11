const sectionsNames = {
    1: "personalHistory",
    2: "educationalBackground",
    3: "recap",
};

export default function applicationFormReducer(state, action) {
    switch (action.type) {
        case "SET_NEXT_SECTION":
            return {
                ...state,
                section: {
                    index: state.section.index + 1,
                    name: sectionsNames[state.section.index + 1],
                },
            };

        case "SET_PREVIOUS_SECTION":
            return {
                ...state,
                section: {
                    index: state.section.index - 1,
                    name: sectionsNames[state.section.index - 1],
                },
            };
        case "SET_SECTION":
            return {
                ...state,
                section: {
                    index: action.index,
                    name: sectionsNames[action.index],
                },
            };
    }
}
