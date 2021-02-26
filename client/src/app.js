import axios from "./axios";
// import React from "react";
// import ProfilePicture from "./profile-picture";
// import Uploader from "./uploader";
import Profile from "./profile";
import Logout from "./logout";
import DatePicker from "./date_picker";
import TimePicker from "./time_picker";
import EditProfile from "./edit_profile";
import SingleDay from "./singleDay";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveProfile } from "./actions";

import { Link } from "react-router-dom";

import { BrowserRouter, Route } from "react-router-dom";
// import BioEditor from "./bio-editor";

export default function () {
    const dispatch = useDispatch();
    useEffect(async () => {
        console.log("app - useeffect here");
        const { data } = await axios.get("api/allUserInfo");
        console.log("app - allUserInfo id: ", data);
        dispatch(saveProfile(data));
    }, []);

    const data = useSelector((state) => state.profile_data);

    if (!data) {
        return null;
    }

    return (
        <BrowserRouter>
            <div>
                <h4>{data.first + " " + data.last}</h4>
                <h2>
                    <Link to="/editProfile">Edit your profile</Link>
                </h2>

                <h2>
                    <Link to="/profile">Your profile</Link>
                </h2>

                <Route
                    exact
                    path="/"
                    render={(props) => (
                        <div>
                            <div>HELLOOOOO!!!</div>
                            <Logout />
                            <DatePicker
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                            <TimePicker />
                        </div>
                    )}
                />
                <Route
                    path="/editprofile"
                    render={(props) => (
                        <EditProfile
                            key={props.match.url}
                            match={props.match}
                            history={props.history}
                        />
                    )}
                />
                <Route path="/profile" render={() => <Profile />} />
                <Route
                    path="/day/:date"
                    render={(props) => (
                        <SingleDay
                            key={props.match.url}
                            match={props.match}
                            history={props.history}
                        />
                    )}
                />
            </div>
        </BrowserRouter>
    );
}
