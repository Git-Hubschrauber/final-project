import axios from "./axios";
// import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPictures, addEntryDate } from "./actions";
import BackBtn from "./hooks/backBtn";
import { useHistory, Link } from "react-router-dom";

export default function (props) {
    const selectedDay = props.selectedDay;
    const dispatch = useDispatch();

    const [showUploader1, setUploader1] = useState(false);
    const [showUploader2, setUploader2] = useState(false);
    let file;
    let files;
    const fileSelectHandler1 = (e) => {
        file = e.target.files[0];
    };

    const submit1 = async () => {
        console.log("upload clicked");
        const formData = new FormData();
        formData.append("file", file);
        console.log("singleFormData: ", file);
        let response = await axios.post("/api/upload/" + selectedDay, formData);
        console.log("response in uploader 1: ", response.data);
        dispatch(addNewPictures(response.data));
        dispatch(addEntryDate(selectedDay));
        setUploader1(false);
    };

    const fileSelectHandler2 = (e) => {
        files = e.target.files;
    };

    const submit2 = async () => {
        console.log("uploads clicked");
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        let response = await axios.post(
            "/api/uploads/" + selectedDay,
            formData
        );
        console.log("response in uploader 2: ", response.data);
        response.data.map((e) => dispatch(addNewPictures(e)));
        dispatch(addEntryDate(selectedDay));

        setUploader2(false);
    };

    let uploadModal1;
    if (showUploader1) {
        uploadModal1 = (
            <div>
                <div className="uploaderOverlay"></div>
                <div className="uploader">
                    <button
                        className="closeUploader"
                        onClick={() => setUploader1(false)}
                    >
                        X
                    </button>
                    {/* <ProfilePicture
                        ProfilePictureUrl={this.props.ProfilePictureUrl}
                        firstName={this.props.firstName}
                        lastName={this.props.lastName}
                        toggleUploader={this.props.toggleUploader}
                    /> */}
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
                        onClick={() => submit1()}
                    >
                        Submit
                    </button>
                </div>
            </div>
        );
    }

    let uploadModal2;
    if (showUploader2) {
        uploadModal2 = (
            <div>
                <div className="uploaderOverlay"></div>
                <div className="uploader">
                    <button
                        className="closeUploader"
                        onClick={() => setUploader2(false)}
                    >
                        X
                    </button>
                    {/* <ProfilePicture
                        ProfilePictureUrl={this.props.ProfilePictureUrl}
                        firstName={this.props.firstName}
                        lastName={this.props.lastName}
                        toggleUploader={this.props.toggleUploader}
                    /> */}
                    <input
                        className="chooseFileBtn"
                        onChange={(e) => fileSelectHandler2(e)}
                        type="file"
                        name="file2"
                        accept="image/*"
                        required
                        multiple
                    />
                    <button
                        className="cancelBtn"
                        onClick={() => setUploader2(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="submitImageBtn"
                        onClick={() => submit2()}
                    >
                        Submit photos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="uploadBtns">
            <button className="uploadBtn1" onClick={() => setUploader1(true)}>
                Upload a photo
            </button>
            <div>{uploadModal1}</div>
            <button className="uploadBtn2 " onClick={() => setUploader2(true)}>
                Upload photos
            </button>
            <div>{uploadModal2}</div>
            <Link to="/">
                <button className="backBtn2">back</button>
            </Link>
        </div>
    );
}
