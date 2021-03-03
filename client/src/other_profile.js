import axios from "./axios";
import React from "react";
import FriendButton from "./hooks/friendButton";
// import OthersFriends from "./hooks/othersFriends.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserInfo } from "./actions";

export default function OtherProfile(props) {
    const dispatch = useDispatch();
    const ownId = useSelector((state) => state.profile_data.id);

    useEffect(() => {
        console.log("props.match.params.id: ", props.match.params.id, ownId);
        if (props.match.params.id == ownId) {
            props.history.push("/");
        }
    }, []);

    useEffect(() => {
        dispatch(getUserInfo(props.match.params.id));
    }, []);

    const userData = useSelector((state) => state.userInfo);
    console.log("userData in otherprofile: ", userData);
    let displayElement;

    if (!userData) {
        displayElement = (
            <h1 className="otherProfileHeader">No profile available</h1>
        );
    } else {
        displayElement = (
            <div>
                <h1 className="otherProfileHeader">
                    {userData.first + " " + userData.last}
                </h1>
                {/* <OthersFriends id={this.props.match.params.id} /> */}
                <div className="otherProfilePic">
                    <img
                        className="otherProfileImg"
                        src={userData.profilepic || "/default.png"}
                        alt={userData.first + userData.last}
                    />
                </div>
                <div className="otherProfileBio">
                    {/* <h2>About {this.state.firstName}:</h2> */}
                    {/* <p>{this.state.bio}</p> */}
                </div>
            </div>
        );
    }

    return (
        <div className="otherProfile">
            <h1 className="otherProfileHeader">Hello</h1>
            <div>{displayElement}</div>
            <div className="friendButton">
                <FriendButton id={props.match.params.id} />
            </div>
            <Link to={"/users"}>
                <button className="backBtn">BACK</button>
            </Link>
        </div>
    );
}
