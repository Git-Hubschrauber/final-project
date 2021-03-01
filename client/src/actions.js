import axios from "./axios";
// import { Redirect } from "react-router";
// import React from "react";
// import { BrowserRouter, Route } from "react-router-dom";
// import Profile from "./profile";

export async function saveProfile(profile_data) {
    console.log("Save Profile clicked: ", profile_data);

    try {
        await axios.post("/api/editProfile", profile_data);
        console.log("Profile_data after axios action: ", profile_data);
        // history.goback();
        // location.pathname = "/profile";

        return {
            type: "PERSONAL_DATA",
            profile_data,
        };
    } catch (err) {
        console.log("error in Save Profile ", err);
    }
}
export async function importProfile(profile_data) {
    try {
        console.log("Import Profile_data in actions: ", profile_data);
        return {
            type: "PERSONAL_DATA",
            profile_data,
        };
    } catch (err) {
        console.log("error in import Profile", err);
    }
}

export async function changeProfilePic(profilepic) {
    try {
        console.log("Import Profile_data in actions: ", profilepic);
        return {
            type: "CHANGE_PROFILE_PIC",
            profilepic,
        };
    } catch (err) {
        console.log("error in import Profile", err);
    }
}

export async function getDayInfo(props) {
    console.log("getDayInfo props in action.js: ", props);

    try {
        const results = await axios.get("/api/day/" + props);
        const dayInfo = results.data;
        console.log("dayInfo after axios action: ", dayInfo.inputfields);
        const inputFields = dayInfo.inputfields;
        console.log("inputfields after axios action: ", inputFields);

        return {
            type: "DAYINFO",
            inputFields,
        };
    } catch (err) {
        console.log("error in getDayInfo actions", err);
    }
}

export async function getEntryDays() {
    console.log("getEntryDays in action.js: ");

    try {
        const results = await axios.get("/api/getEntryDays");

        console.log(
            "getEntryDays after axios action: ",
            results.data.diary_date
        );
        const entryDays = results.data;
        return {
            type: "ENTRYDAYS",
            entryDays,
        };
    } catch (err) {
        console.log("error in getEntryDays", err);
    }
}

export async function saveInputFields(inputFields) {
    console.log("saveInputFields in action.js: ", inputFields);

    try {
        // await axios.post("/api/editDiary/" + selectedDay, inputFields);
        // // console.log("Profile_data after axios action: ", profile_data);

        return {
            type: "INPUTFIELDS",
            inputFields,
        };
    } catch (err) {
        console.log("error in saveInputFields", err);
    }
}
export async function getImagesOfDay(selectedDay) {
    console.log("getImagesOfDay in action.js: ", selectedDay);

    try {
        const results = await axios.get("/api/images/" + selectedDay);
        console.log("getImagesOfDay results in action.js: ", results.data);
        const picsOfDay = results.data;
        return {
            type: "IMAGES_OF_DAY",
            picsOfDay,
        };
    } catch (err) {
        console.log("error in getImagesOfDay", err);
    }
}

export async function addNewPictures(picsOfDay) {
    console.log("addNewPictures: ", picsOfDay);

    return {
        type: "NEW_IMAGES_ADDED",
        picsOfDay,
    };
}
