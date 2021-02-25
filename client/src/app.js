import axios from "./axios";
import React from "react";
import ProfilePicture from "./profile-picture";
import Uploader from "./uploader";
import Profile from "./profile";
import Logout from "./logout";
import Logo from "./logo";

import { Link } from "react-router-dom";

import { BrowserRouter, Route } from "react-router-dom";
// import BioEditor from "./bio-editor";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            ProfilePictureUrl: "/default.png",
            uploaderVisible: false,
            error: false,
            editingMode: false,
            noBioInfo: false,
            bio: "",
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setProfilePictureUrl = this.setProfilePictureUrl.bind(this);
        // this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.componentDidUpdate2 = this.componentDidUpdate2.bind(this);
    }

    render() {
        return <div>HELLOOOOO!!!</div>;
    }
}
