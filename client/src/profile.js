import BackBtn from "./hooks/backBtn";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

export default function () {
    const profile_data = useSelector((state) => state.profile_data);
    console.log("profile_data in /profile: ", profile_data);
    const {
        first,
        last,
        age,
        username,
        sex,
        hobbies,
        about,
        profilePic,
    } = profile_data;

    return (
        <div className="profile">
            <div className="flexbox1">
                <img
                    className="profPicInProfile"
                    src={profilePic || "/default.png"}
                />
            </div>
            <div>
                <h1>Profile</h1>

                <table className="flexbox1">
                    <tbody>
                        <tr>
                            <td>
                                <h3>Firstname: </h3>
                            </td>
                            <td>{first}</td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Lastname: </h3>
                            </td>
                            <td>{last}</td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Age:</h3>
                            </td>
                            <td>{age}</td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Sex:</h3>
                            </td>
                            <td>{sex}</td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Username:</h3>
                            </td>
                            <td>{username}</td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Hobbies: </h3>
                            </td>
                            <td>{hobbies}</td>
                        </tr>
                        <tr>
                            <td>
                                <h3>About yourself:</h3>
                            </td>
                            <td>{about}</td>
                        </tr>
                    </tbody>
                </table>
                <Link to="/editprofile">
                    <button className="editprofileBtn">Edit Profile</button>
                </Link>
            </div>

            <BackBtn />
        </div>
    );
}
