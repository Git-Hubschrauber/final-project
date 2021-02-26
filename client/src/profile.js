import BackBtn from "./hooks/backBtn";
import { useDispatch, useSelector } from "react-redux";
import { saveProfile } from "./actions";
import { useState, useEffect } from "react";

export default function () {
    const profile_data = useSelector((state) => state.profile_data);
    console.log("profile_data in /profile: ", profile_data);
    const { first, last, age, username, sex, hobbies, about } = profile_data;

    return (
        <div className="profile">
            <h1>your profile</h1>
            <h3>Firstname: {first}</h3>
            <h3>Lastname: {last}</h3>
            <h3>Age: {age}</h3>

            <h3>Sex: {sex}</h3>

            <h3>Username: {username}</h3>
            <h3>Hobbies: {hobbies}</h3>

            <p>About yourself: {about}</p>
            <BackBtn />
        </div>
    );
}
