import axios from "./axios";
// import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeProfilePic } from "./actions";

export default function (props) {
    const selectedDay = props.selectedDay;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.profile_data);
    const [showUploader1, setUploader1] = useState(false);

    let file;

    const fileSelectHandler1 = (e) => {
        file = e.target.files[0];
    };

    const submitProfilePic = async () => {
        console.log("upload clicked: ", file);
        const formData = new FormData();
        formData.append("file", file);

        let response = await axios.post("/api/uploadProfilePic/", formData);
        console.log("axios resp. profilepic: ", response);
        dispatch(changeProfilePic(response.data));
        setUploader1(false);
    };

    // const delete = async () => {
    //     console.log("delete clicked");
    //     const a = "default.png";
    //     let response = await axios.post("/deleteProfilePicture", a);
    //     console.log("resp in delete: ", response);
    //     await this.props.setProfilePictureUrl("default.png");
    // };

    let uploadModal1;
    if (showUploader1) {
        uploadModal1 = (
            <div>
                <div className="uploaderOverlay"></div>
                <div className="uploader">
                    <img
                        className="profPicInUploader"
                        src={data.profilepic || "/default.png"}
                    />
                    <button
                        className="closeUploader"
                        onClick={() => setUploader1(false)}
                    >
                        X
                    </button>

                    <input
                        className="chooseFileBtn"
                        onChange={(e) => fileSelectHandler1(e)}
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                    <button
                        className="cancelBtn"
                        onClick={() => setUploader1(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="submitImageBtn"
                        onClick={() => submitProfilePic()}
                    >
                        Submit
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <button className="uploadBtn" onClick={() => setUploader1(true)}>
                Upload a photo
            </button>
            <div>{uploadModal1}</div>
        </div>
    );
}
