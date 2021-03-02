export function reducer(state = {}, action) {
    if (action.type === "PERSONAL_DATA") {
        console.log("reducer personal_data: ", action.profile_data);
        state = {
            ...state,
            profile_data: action.profile_data,
        };
    }

    if (action.type === "CHANGE_PROFILE_PIC") {
        const profile_data = {
            ...state.profile_data,
            profilepic: action.profilepic,
        };
        return { ...state, profile_data };
        // }
        // console.log("reducer personal_data: ", action.profile_data.profilepic);
        // state = {
        //     ...state,
        //     ...profile_data: action.profile_data.profilepic,
        // };
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

    if (action.type === "INPUTFIELDS1") {
        console.log("reducer inputFields1: ", action.inputFields1);
        state = {
            ...state,
            inputFields1: action.inputFields1,
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
        console.log("reducer IMAGES_OF_DAY: ", action.picsOfDay);
        state = {
            ...state,
            picsOfDay: action.picsOfDay,
        };
    }
    if (action.type === "NEW_IMAGES_ADDED") {
        console.log("reducer NEW_IMAGES_ADDED: ", action.picsOfDay);
        let newObj = {};
        newObj.pictures = action.picsOfDay;
        state = {
            ...state,
            picsOfDay: [...state.picsOfDay, newObj],
        };
    }

    if (action.type === "ALL_IMAGES") {
        console.log("reducer ALL_IMAGES: ", action.allImages);
        state = {
            ...state,
            allImages: action.allImages,
        };
    }

    if (action.type === "ALL_ENTRIES") {
        console.log("reducer ALL_ENTRIES: ", action.allEntries);
        state = {
            ...state,
            allEntries: action.allEntries,
        };
    }

    return state;
}
