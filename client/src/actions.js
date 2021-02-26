import axios from "./axios";
import { Redirect } from "react-router";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Profile from "./profile";

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
        console.log("error in Save Profile", err);
    }
}
