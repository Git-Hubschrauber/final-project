export function reducer(state = {}, action) {
    if (action.type === "PERSONAL_DATA") {
        console.log("reducer personal_data: ", action.profile_data);
        state = {
            ...state,
            profile_data: action.profile_data,
        };
    }

    if (action.type === "DAYINFO") {
        console.log("reducer dayinfo: ", action.inputFields);
        state = {
            ...state,
            inputFields: action.inputFields,
        };
    }

    if (action.type === "ENTRYDAYS") {
        console.log("reducer ENTRYDAYS: ", action.entryDays);
        state = {
            ...state,
            entryDays: action.entryDays,
        };
    }

    if (action.type === "INPUTFIELDS") {
        console.log("reducer inputFields: ", action.inputFields);
        state = {
            ...state,
            inputFields: action.inputFields,
        };
    }
    if (action.type === "IMAGES_OF_DAY") {
        console.log("reducer inputFields: ", action.picsOfDay);
        state = {
            ...state,
            picsOfDay: action.picsOfDay,
        };
    }

    return state;
}
