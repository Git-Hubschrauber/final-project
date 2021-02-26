export function reducer(state = {}, action) {
    // if (action.type === "MESSAGES") {
    //     state = {
    //         ...state,
    //         messages: action.messages,
    //     };
    // }

    // if (action.type === "NEW_MESSAGE") {
    //     state = {
    //         ...state,
    //         messages: [...state.messages, action.newMessage],
    //     };
    // }

    if (action.type === "PERSONAL_DATA") {
        console.log("reducer personal_data: ", action.profile_data);
        state = {
            ...state,
            profile_data: action.profile_data,
        };
    }

    return state;
}
