import { useDispatch, useSelector } from "react-redux";
import { saveProfile } from "./actions";
import { useState } from "react";
import ProfilePic from "./profile_picture";

import { Link } from "react-router-dom";

export default function (props) {
    const dispatch = useDispatch();

    const data = useSelector((state) => state.profile_data);
    console.log("props in edit: ", props);
    console.log("data in edit: ", data);

    const [showUploader, setUploader] = useState(false);

    const [first, setInputFirst] = useState("");
    const [last, setInputLast] = useState("");
    const [age, setAge] = useState("");
    const [username, setUsername] = useState("");
    const [sex, setSex] = useState("");
    const [hobbies, setHobbies] = useState("");
    const [about, setAbout] = useState("");

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;

    if (!data) {
        return null;
    }
    console.log("data in edit: ", data.first);
    const profilepic = data.profilepic;

    return (
        <div className="profile">
            <div className="flexbox1">
                <div className="profPicInProfileContainer">
                    <img
                        className="profPicInProfile"
                        src={data.profilepic || "/default.png"}
                    />
                    <ProfilePic />{" "}
                </div>
            </div>
            <div>
                <h1>Profile</h1>

                <table className="flexbox1">
                    <tbody>
                        <tr>
                            <td>
                                <h3>Firstname: </h3>
                            </td>
                            <td>
                                <input
                                    required
                                    type="text"
                                    name="first"
                                    onChange={(e) => {
                                        setInputFirst(e.target.value);
                                    }}
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Lastname: </h3>
                            </td>
                            <td>
                                <input
                                    required
                                    type="text"
                                    name="last"
                                    onChange={(e) => {
                                        setInputLast(e.target.value);
                                    }}
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Age:</h3>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="age"
                                    min="0"
                                    max="100"
                                    onChange={(e) => {
                                        setAge(e.target.value);
                                    }}
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Sex:</h3>
                            </td>
                            <td className="inputX">
                                <label>
                                    <input
                                        type="radio"
                                        name="sex"
                                        value="female"
                                        onChange={(e) => {
                                            setSex(e.target.value);
                                        }}
                                    ></input>
                                    Female
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="sex"
                                        value="male"
                                        onChange={(e) => {
                                            setSex(e.target.value);
                                        }}
                                    ></input>
                                    Male
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="sex"
                                        value="other"
                                        onChange={(e) => {
                                            setSex(e.target.value);
                                        }}
                                    ></input>
                                    Other
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Username:</h3>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="username"
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Hobbies: </h3>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="hobbies"
                                    onChange={(e) => {
                                        setHobbies(e.target.value);
                                    }}
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>About yourself:</h3>
                            </td>
                            <td>
                                <textarea
                                    className="aboutYourself"
                                    name="aboutYourself"
                                    onChange={(e) => {
                                        setAbout(e.target.value);
                                    }}
                                ></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button
                    className="saveBtnEditProfile"
                    onClick={() => {
                        dispatch(
                            saveProfile({
                                first,
                                last,
                                profilepic,
                                age,
                                username,
                                sex,
                                hobbies,
                                about,
                            })
                        );
                        setTimeout(() => props.history.push("/profile"), 1000);
                    }}
                >
                    Save
                </button>
            </div>

            <Link to="/Profile">
                <button className="backBtn">Back</button>
            </Link>
        </div>
    );

    //     <div className="editProfile">
    //         <h1>Edit your profile</h1>
    //         <ProfilePic />

    //         <label>
    //             Firstname:
    //             <input
    //                 required
    //                 type="text"
    //                 name="first"
    //                 onChange={(e) => {
    //                     setInputFirst(e.target.value);
    //                 }}
    //             ></input>
    //         </label>
    //         <label>
    //             Lastname:
    //             <input
    //                 required
    //                 type="text"
    //                 name="last"
    //                 onChange={(e) => {
    //                     setInputLast(e.target.value);
    //                 }}
    //             ></input>
    //         </label>
    //         <label>
    //             Age:
    //             <input
    //                 type="number"
    //                 name="age"
    //                 min="0"
    //                 max="100"
    //                 onChange={(e) => {
    //                     setAge(e.target.value);
    //                 }}
    //             ></input>
    //         </label>

    //         <label>
    //             Sex:
    //             <label>
    //                 <input
    //                     type="radio"
    //                     name="sex"
    //                     value="female"
    //                     onChange={(e) => {
    //                         setSex(e.target.value);
    //                     }}
    //                 ></input>
    //                 Female
    //             </label>
    //             <label>
    //                 <input
    //                     type="radio"
    //                     name="sex"
    //                     value="male"
    //                     onChange={(e) => {
    //                         setSex(e.target.value);
    //                     }}
    //                 ></input>
    //                 Male
    //             </label>
    //             <label>
    //                 <input
    //                     type="radio"
    //                     name="sex"
    //                     value="other"
    //                     onChange={(e) => {
    //                         setSex(e.target.value);
    //                     }}
    //                 ></input>
    //                 Other
    //             </label>
    //         </label>

    //         <label>
    //             Username:
    // <input
    //     type="text"
    //     name="username"
    //     onChange={(e) => {
    //         setUsername(e.target.value);
    //     }}
    // ></input>
    //         </label>
    //         <label>
    //             Hobbies:
    //             <input
    //                 type="text"
    //                 name="hobbies"
    //                 onChange={(e) => {
    //                     setHobbies(e.target.value);
    //                 }}
    //             ></input>
    //         </label>

    //         <label>
    //             About yourself:
    //             <textarea
    //                 name="aboutYourself"
    //                 onChange={(e) => {
    //                     setAbout(e.target.value);
    //                 }}
    //             ></textarea>
    //         </label>
    //         <button
    //             onClick={() => {
    //                 dispatch(
    //                     saveProfile({
    //                         first,
    //                         last,
    //                         age,
    //                         username,
    //                         sex,
    //                         hobbies,
    //                         about,
    //                     })
    //                 );
    //                 setTimeout(() => props.history.push("/profile"), 1000);
    //             }}
    //         >
    //             Save
    //         </button>
    //         <Link to="/profile">
    //             <button>Back</button>
    //         </Link>
    //     </div>
    // );
}
