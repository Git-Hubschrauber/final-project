import BackBtn from "./hooks/backBtn";
import { useDispatch, useSelector } from "react-redux";
import { saveProfile } from "./actions";
import { useState } from "react";

export default function (props) {
    const dispatch = useDispatch();

    const data = useSelector((state) => state.profile_data);
    console.log("props in edit: ", props);
    console.log("data in edit: ", data);

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

    return (
        <div className="editProfile">
            <h1>Edit your profile</h1>
            <label>
                Firstname:
                <input
                    required
                    type="text"
                    name="first"
                    onChange={(e) => {
                        setInputFirst(e.target.value);
                    }}
                ></input>
            </label>
            <label>
                Lastname:
                <input
                    required
                    type="text"
                    name="last"
                    onChange={(e) => {
                        setInputLast(e.target.value);
                    }}
                ></input>
            </label>
            <label>
                Age:
                <input
                    type="number"
                    name="age"
                    min="0"
                    max="100"
                    onChange={(e) => {
                        setAge(e.target.value);
                    }}
                ></input>
            </label>

            <label>
                Sex:
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
            </label>

            <label>
                Username:
                <input
                    type="text"
                    name="username"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                ></input>
            </label>
            <label>
                Hobbies:
                <input
                    type="text"
                    name="hobbies"
                    onChange={(e) => {
                        setHobbies(e.target.value);
                    }}
                ></input>
            </label>

            <label>
                About yourself:
                <textarea
                    name="aboutYourself"
                    onChange={(e) => {
                        setAbout(e.target.value);
                    }}
                ></textarea>
            </label>
            <button
                onClick={() => {
                    dispatch(
                        saveProfile({
                            first,
                            last,
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
            <BackBtn />
        </div>
    );
}
