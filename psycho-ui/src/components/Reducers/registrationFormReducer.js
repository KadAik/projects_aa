export default function registrationFormReducer(state, action){
    switch(action.type){
        case "SET_NEXT":
            return {
                ...state,
                stage: state.stage + 1
            };
        
        case "SET_PREVIOUS":
            return {
                ...state,
                stage: state.stage - 1
            };
    }
}