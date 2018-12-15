export function reducerWithInitialState(iniState) {
    return function reducer(state = iniState, action) {
        if (action.type === "updateState") {
            state = {
                ...state,
                ...action.payload
            }
        }
        return state
    }
}